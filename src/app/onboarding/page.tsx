"use client";

import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingForm } from "@/components/onboarding";

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

        <OnboardingForm
          businessName={businessName}
          setBusinessName={setBusinessName}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
          address={address}
          setAddress={setAddress}
          description={description}
          handleDescriptionChange={handleDescriptionChange}
          descriptionLength={descriptionLength}
          maxDescriptionLength={maxDescriptionLength}
          logo={logo}
          handleLogoChange={handleLogoChange}
          showCategories={showCategories}
          setShowCategories={setShowCategories}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          categoriesError={categoriesError}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          fieldErrors={fieldErrors}
          isFormValid={isFormValid}
        />

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
