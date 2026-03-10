"use client";

import { useState, useEffect } from "react";
import { Settings, Building2 } from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { CompanySettingsTabs } from "@/components/company";
import { UpdateCompanyDTO, Company, DEFAULT_BUSINESS_HOURS } from "@/lib/types/company/types";

export default function ConfiguracionPage() {
  const { companyId } = useCompany();
  const { company, isLoading, updateCompany } = useCompanyProfile(companyId);
  
  const [formData, setFormData] = useState<Partial<UpdateCompanyDTO>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form data when company loads
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        address: company.address,
        description: company.description,
        companyImage: company.companyImage,
        phone: company.phone || "",
        email: company.email || "",
        website: company.website || "",
        taxId: company.taxId || "",
        taxName: company.taxName || "",
        currency: company.currency,
        timezone: company.timezone,
        businessHours: company.businessHours || DEFAULT_BUSINESS_HOURS,
        paymentMethods: company.paymentMethods || [],
      });
    }
  }, [company]);

  const handleFieldChange = (field: keyof UpdateCompanyDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (file: File) => {
    if (!companyId) return;
    
    setIsUploading(true);
    try {
      // Upload to MinIO/S3
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch(`/api/company/${companyId}/logo`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Error uploading logo");
      
      const { url } = await res.json();
      setFormData((prev) => ({ ...prev, companyImage: url }));
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address) return;
    
    setIsSaving(true);
    try {
      const updateData: UpdateCompanyDTO = {
        name: formData.name,
        address: formData.address,
        description: formData.description || "",
        companyImage: formData.companyImage,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        taxId: formData.taxId,
        taxName: formData.taxName,
        currency: formData.currency || "CLP",
        timezone: formData.timezone || "America/Santiago",
        businessHours: formData.businessHours,
        paymentMethods: formData.paymentMethods || [],
      };
      
      await updateCompany(updateData);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <Settings size={28} className="text-primary-500" />
            Configuración
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Personaliza los datos de tu negocio
          </p>
        </div>
      </div>

      {/* Company Card */}
      {company && (
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center overflow-hidden">
            {company.companyImage ? (
              <img
                src={company.companyImage}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 size={28} className="text-primary-500" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900">{company.name}</h2>
            <p className="text-sm text-neutral-500">{company.address}</p>
          </div>
        </div>
      )}

      {/* Settings Tabs */}
      <CompanySettingsTabs
        company={company}
        formData={formData}
        onFieldChange={handleFieldChange}
        onLogoUpload={handleLogoUpload}
        onSave={handleSave}
        isLoading={isLoading}
        isSaving={isSaving}
        isUploading={isUploading}
      />
    </div>
  );
}
