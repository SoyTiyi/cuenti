"use client";

import { Category } from "@/lib/types/category/types";
import LogoUploader from "./LogoUploader";
import BusinessNameField from "./BusinessNameField";
import CategorySelect from "./CategorySelect";
import AddressField from "./AddressField";
import DescriptionField from "./DescriptionField";
import SubmitButton from "./SubmitButton";

interface FieldErrors {
  logo?: string;
  businessName?: string;
  categoryId?: string;
  address?: string;
  description?: string;
}

interface OnboardingFormProps {
  businessName: string;
  setBusinessName: (value: string) => void;
  selectedCategory: Category | undefined;
  handleCategorySelect: (id: number) => void;
  address: string;
  setAddress: (value: string) => void;
  description: string;
  handleDescriptionChange: (value: string) => void;
  descriptionLength: number;
  maxDescriptionLength: number;
  logo: File | null;
  handleLogoChange: (file: File | null) => void;
  showCategories: boolean;
  setShowCategories: (show: boolean) => void;
  categories: Category[];
  isLoadingCategories: boolean;
  categoriesError: string | null;
  handleSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  fieldErrors: FieldErrors;
  isFormValid: boolean;
}

const OnboardingForm = ({
  businessName,
  setBusinessName,
  selectedCategory,
  handleCategorySelect,
  address,
  setAddress,
  description,
  handleDescriptionChange,
  descriptionLength,
  maxDescriptionLength,
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
  isFormValid,
}: OnboardingFormProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">
        Cuéntanos sobre tu negocio
      </h2>
      <p className="text-neutral-500 text-sm mb-8">
        Completa los datos básicos para configurar tu perfil y empezar a
        gestionar tus finanzas.
      </p>

      <LogoUploader
        logo={logo}
        onLogoChange={handleLogoChange}
        fieldError={fieldErrors.logo}
      />

      <div className="flex flex-col gap-5">
        <BusinessNameField
          value={businessName}
          onChange={setBusinessName}
          fieldError={fieldErrors.businessName}
        />

        <CategorySelect
          selectedCategory={selectedCategory}
          categories={categories}
          isLoading={isLoadingCategories}
          showCategories={showCategories}
          setShowCategories={setShowCategories}
          onSelect={handleCategorySelect}
          error={categoriesError ?? undefined}
          fieldError={fieldErrors.categoryId}
        />

        <AddressField
          value={address}
          onChange={setAddress}
          fieldError={fieldErrors.address}
        />

        <DescriptionField
          value={description}
          onChange={handleDescriptionChange}
          length={descriptionLength}
          maxLength={maxDescriptionLength}
          fieldError={fieldErrors.description}
        />
      </div>

      {submitError && (
        <div className="mt-4 p-3 rounded-xl bg-danger-50 border border-danger-200">
          <p className="text-xs text-danger-600">{submitError}</p>
        </div>
      )}

      <SubmitButton
        onClick={handleSubmit}
        isSubmitting={isSubmitting}
        isDisabled={!isFormValid}
      />
    </div>
  );
};

export default OnboardingForm;
