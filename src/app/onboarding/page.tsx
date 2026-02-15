"use client";

import { Camera, Building2, MapPin, ChevronDown } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";

const OnboardingPage = () => {
  const {
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
  } = useOnboarding();

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[520px]">
        <h1 className="text-3xl font-bold text-neutral-900 text-center mb-6">
          Onboarding
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Cuéntanos sobre tu negocio
          </h2>
          <p className="text-neutral-500 text-sm mb-8">
            Completa los datos básicos para configurar tu perfil y empezar a
            gestionar tus finanzas.
          </p>

          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Camera className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p className="font-semibold text-neutral-800 text-sm">
                Logotipo del negocio
              </p>
              <p className="text-neutral-400 text-xs mt-0.5">
                Sube tu logo para personalizar tus facturas y reportes
                (Opcional).
                <br />
                Formatos: JPG, PNG. Máx 2MB.
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="text-primary-500 font-semibold text-sm mt-1.5 hover:text-primary-600 cursor-pointer inline-block"
              >
                {logo ? logo.name : "Subir imagen"}
              </label>
              {fieldErrors.logo && (
                <p className="text-xs text-danger-500 mt-1">{fieldErrors.logo}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Nombre del negocio{" "}
                <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Ej. Cafetería Central"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    fieldErrors.businessName ? "border-danger-300" : "border-neutral-200"
                  } bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition`}
                />
              </div>
              {fieldErrors.businessName && (
                <p className="text-xs text-danger-500 mt-1">{fieldErrors.businessName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Categoría <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <button
                  type="button"
                  onClick={() => setShowCategories(!showCategories)}
                  disabled={isLoadingCategories}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${
                    fieldErrors.categoryId ? "border-danger-300" : "border-neutral-200"
                  } bg-neutral-50 text-sm text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={selectedCategory ? "text-neutral-800" : "text-neutral-400"}>
                    {isLoadingCategories
                      ? "Cargando categorías..."
                      : selectedCategory?.name || "Selecciona una categoría"}
                  </span>
                </button>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-transform ${showCategories ? "rotate-180" : ""}`} />

                {showCategories && !isLoadingCategories && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id)}
                        className="w-full px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 text-left cursor-pointer transition"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}

                {categoriesError && (
                  <p className="text-xs text-danger-500 mt-1">
                    {categoriesError}
                  </p>
                )}
              </div>
              {fieldErrors.categoryId && (
                <p className="text-xs text-danger-500 mt-1">{fieldErrors.categoryId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Dirección del local
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Calle Principal 123, Ciudad"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    fieldErrors.address ? "border-danger-300" : "border-neutral-200"
                  } bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition`}
                />
              </div>
              {fieldErrors.address && (
                <p className="text-xs text-danger-500 mt-1">{fieldErrors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Descripción breve
              </label>
              <textarea
                placeholder="¿Qué hace especial a tu negocio?"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                rows={3}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  fieldErrors.description ? "border-danger-300" : "border-neutral-200"
                } bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition resize-none`}
              />
              <p className="text-xs text-neutral-400 text-right mt-1">
                {descriptionLength}/{maxDescriptionLength} caracteres
              </p>
              {fieldErrors.description && (
                <p className="text-xs text-danger-500 mt-1">{fieldErrors.description}</p>
              )}
            </div>
          </div>

          {submitError && (
            <div className="mt-4 p-3 rounded-xl bg-danger-50 border border-danger-200">
              <p className="text-xs text-danger-600">{submitError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-400 text-white font-semibold text-sm hover:from-primary-600 hover:to-secondary-500 transition cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando..." : "Completar Onboarding →"}
          </button>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          Al continuar, aceptas nuestros{" "}
          <a href="#" className="text-primary-500 underline hover:text-primary-600">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a href="#" className="text-primary-500 underline hover:text-primary-600">
            Política de Privacidad
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;
