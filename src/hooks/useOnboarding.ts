import { Category } from "@/lib/types/category/types";
import { CompleteOnboardingData } from "@/lib/types/onboarding/types";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
    MAX_DESCRIPTION_LENGTH,
    MAX_FILE_SIZE,
    ACCEPTED_IMAGE_TYPES
} from "@/lib/constants";
import { s3Service } from "@/service/aws/S3Service";

const onboardingSchema = z.object({
  businessName: z
    .string()
    .min(1, "El nombre del negocio es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  categoryId: z
    .number({ message: "Debes seleccionar una categoría" })
    .positive("Debes seleccionar una categoría válida"),
  address: z.string().max(200, "La dirección no puede exceder 200 caracteres").optional(),
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, `La descripción no puede exceder ${MAX_DESCRIPTION_LENGTH} caracteres`)
    .optional(),
  logo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "El archivo debe ser menor a 2MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Solo se permiten imágenes JPG o PNG"
    )
    .optional()
    .nullable(),
});

export function useOnboarding() {
  const [businessName, setBusinessName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<{
    businessName?: string;
    categoryId?: string;
    address?: string;
    description?: string;
    logo?: string;
  }>({});

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);
        const response = await fetch("/api/category");

        if (!response.ok) {
          throw new Error("Error al cargar las categorías");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setCategoriesError(
          error instanceof Error ? error.message : "Error desconocido"
        );
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  const handleDescriptionChange = (value: string) => {
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value);
      setFieldErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  const handleCategorySelect = (id: number) => {
    setCategoryId(id);
    setShowCategories(false);
    setFieldErrors((prev) => ({ ...prev, categoryId: undefined }));
  };

  const handleBusinessNameChange = (value: string) => {
    setBusinessName(value);
    setFieldErrors((prev) => ({ ...prev, businessName: undefined }));
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setFieldErrors((prev) => ({ ...prev, address: undefined }));
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) {
      setLogo(null);
      setFieldErrors((prev) => ({ ...prev, logo: undefined }));
      return;
    }

    const logoValidation = z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "El archivo debe ser menor a 2MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Solo se permiten imágenes JPG o PNG"
      )
      .safeParse(file);

    if (!logoValidation.success) {
      const error = logoValidation.error.issues[0]?.message;
      setFieldErrors((prev) => ({ ...prev, logo: error }));
      return;
    }

    setLogo(file);
    setFieldErrors((prev) => ({ ...prev, logo: undefined }));
  };

  const validateForm = (): boolean => {
    const result = onboardingSchema.safeParse({
      businessName,
      categoryId,
      address: address || undefined,
      description: description || undefined,
      logo,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const checkFormValidity = (): boolean => {
    const result = onboardingSchema.safeParse({
      businessName,
      categoryId,
      address: address || undefined,
      description: description || undefined,
      logo,
    });

    return result.success;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) {
      setSubmitError("Por favor corrige los errores en el formulario");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const data: CompleteOnboardingData = {
        businessName,
        categoryId: categoryId?.toString() ?? '',
        address,
        description
      }

      if (logo) {
        const logoUrl = await s3Service.uploadFile(logo, `logos/${Date.now()}_${logo.name}`, process.env.PROFILE_BUCKET!);
        data.logoUrl = logoUrl;
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al completar el onboarding");
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find((cat) => cat.id === categoryId);

  return {
    businessName,
    setBusinessName: handleBusinessNameChange,
    selectedCategory,
    handleCategorySelect,
    address,
    setAddress: handleAddressChange,
    description,
    handleDescriptionChange,
    descriptionLength: description.length,
    maxDescriptionLength: MAX_DESCRIPTION_LENGTH,
    logo,
    handleLogoChange,
    showCategories,
    setShowCategories,
    categories,
    isLoadingCategories,
    categoriesError,
    handleSubmit,
    isSubmitting,
    submitError,
    fieldErrors,
    isFormValid: checkFormValidity(),
  };
}
