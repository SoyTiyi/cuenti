"use client";

import { Loader2 } from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import { useSales } from "@/hooks/useSales";
import {
  DashboardGreeting,
  DashboardStats,
  DashboardCharts,
  UpcomingDueDates,
  RecentSales,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { companyId, isLoading: isCompanyLoading, userName } = useCompany();
  const { sales, isLoading: isSalesLoading, stats, last7Days, topServices } = useSales(companyId);

  const isLoading = isCompanyLoading || isSalesLoading;

  return (
    <div className="flex flex-col gap-6">
      <DashboardGreeting userName={userName} />

      <DashboardStats stats={stats} isLoading={isLoading} />

      <DashboardCharts last7Days={last7Days} topServices={topServices} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingDueDates sales={sales} isLoading={isLoading} />
          <RecentSales sales={sales} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
