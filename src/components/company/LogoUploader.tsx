import { useState, useRef } from "react";
import { Camera, Loader2, X } from "lucide-react";

interface LogoUploaderProps {
  currentLogo: string | null;
  companyName: string;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export function LogoUploader({ currentLogo, companyName, onUpload, isUploading }: LogoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentLogo);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload
    await onUpload(file);

    // Cleanup
    URL.revokeObjectURL(objectUrl);
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Logo preview */}
        <div className="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-primary-300">
          {preview ? (
            <img
              src={preview}
              alt={companyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-primary-700">
              {companyName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Upload button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Camera size={14} />
          )}
        </button>

        {/* Remove button */}
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-danger-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-danger-600 transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-neutral-500 text-center">
        Haz clic para cambiar el logo
      </p>
    </div>
  );
}
