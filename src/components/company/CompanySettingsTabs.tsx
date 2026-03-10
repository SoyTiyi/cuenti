"use client";

import { useState } from "react";
import { Building2, Phone, FileText, Settings, Save, Loader2 } from "lucide-react";
import { GeneralInfoForm } from "./GeneralInfoForm";
import { ContactInfoForm } from "./ContactInfoForm";
import { TaxInfoForm } from "./TaxInfoForm";
import { SettingsForm } from "./SettingsForm";
import { Company, UpdateCompanyDTO } from "@/lib/types/company/types";

type TabId = "general" | "contact" | "tax" | "settings";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: "general", label: "General", icon: Building2 },
  { id: "contact", label: "Contacto", icon: Phone },
  { id: "tax", label: "Fiscal", icon: FileText },
  { id: "settings", label: "Configuración", icon: Settings },
];

interface CompanySettingsTabsProps {
  company: Company | null;
  formData: Partial<UpdateCompanyDTO>;
  onFieldChange: (field: keyof UpdateCompanyDTO, value: string) => void;
  onLogoUpload: (file: File) => Promise<void>;
  onSave: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  isUploading: boolean;
}

export function CompanySettingsTabs({
  company,
  formData,
  onFieldChange,
  onLogoUpload,
  onSave,
  isLoading,
  isSaving,
  isUploading,
}: CompanySettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("general");

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <GeneralInfoForm
            data={formData}
            onChange={onFieldChange}
            onLogoUpload={onLogoUpload}
            isUploading={isUploading}
            company={company}
          />
        );
      case "contact":
        return <ContactInfoForm data={formData} onChange={onFieldChange} />;
      case "tax":
        return <TaxInfoForm data={formData} onChange={onFieldChange} />;
      case "settings":
        return <SettingsForm data={formData} onChange={onFieldChange} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={32} className="animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {renderTabContent()}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
