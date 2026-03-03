"use client";

import { Loader2 } from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import { useSales } from "@/hooks/useSales";
import { useBalance } from "@/hooks/useBalance";
import {
  DashboardGreeting,
  DashboardStats,
  DashboardCharts,
  UpcomingDueDates,
  RecentSales,
  BalanceChart,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { companyId, isLoading: isCompanyLoading, userName, companyName, companyImage, companyAddress } = useCompany();
  const { sales, isLoading: isSalesLoading, stats, last7Days, topServices } = useSales(companyId);
  const { balance, summary, isLoading: isBalanceLoading } = useBalance(companyId, 6);

  const isLoading = isCompanyLoading || isSalesLoading;

  return (
    <div className="flex flex-col gap-6">
      <DashboardGreeting
        userName={userName}
        companyName={companyName}
        companyImage={companyImage}
        companyAddress={companyAddress}
      />

      <BalanceChart balance={balance} summary={summary} isLoading={isBalanceLoading} />

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
