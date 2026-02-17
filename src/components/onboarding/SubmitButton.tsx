"use client";

interface SubmitButtonProps {
  onClick: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

const SubmitButton = ({ onClick, isSubmitting, isDisabled }: SubmitButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSubmitting || isDisabled}
      className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-400 text-white font-semibold text-sm hover:from-primary-600 hover:to-secondary-500 transition cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Guardando..." : "Completar Onboarding →"}
    </button>
  );
};

export default SubmitButton;
