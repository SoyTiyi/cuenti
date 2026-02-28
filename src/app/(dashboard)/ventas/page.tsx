"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { useCompany } from "@/hooks/useCompany";
import { useClients } from "@/hooks/useClients";
import { useServices } from "@/hooks/useServices";
import { useSales } from "@/hooks/useSales";

import { SaleCard, SaleStats, NewSaleModal } from "@/components/sales";

const PAGE_SIZE = 8;

export default function SalesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { companyId, isLoading: isCompanyLoading } = useCompany();
  const { clients, isLoading: isClientsLoading, createClient } = useClients(companyId);
  const { services, isLoading: isServicesLoading, createService } = useServices(companyId);
  const { sales, isLoading: isSalesLoading, stats, createSale, markAsPaid } = useSales(companyId);

  const isPageLoading = isCompanyLoading || isSalesLoading;
  const visibleSales = sales.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Ventas</h1>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors cursor-pointer"
        >
          + Nueva Venta
        </button>
        <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          Ventas del mes: {isPageLoading ? "..." : stats.monthSalesCount}
        </span>
        <span className="px-4 py-2 bg-warning-100 text-warning-700 rounded-full text-sm font-medium">
          Pendientes: {isPageLoading ? "..." : stats.pendingSalesCount}
        </span>
      </div>

      <SaleStats stats={stats} isLoading={isPageLoading} />

      {/* Sales list */}
      {isPageLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : sales.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-neutral-400 text-sm">No hay ventas registradas aún.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors text-sm cursor-pointer"
          >
            Registrar primera venta
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {visibleSales.map((sale) => (
              <SaleCard key={sale.id} sale={sale} onMarkAsPaid={markAsPaid} />
            ))}
          </div>
          {visibleCount < sales.length && (
            <button
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="mx-auto text-neutral-500 hover:text-neutral-700 text-sm font-medium flex items-center gap-1 cursor-pointer"
            >
              Ver más ventas <span className="text-xs">▼</span>
            </button>
          )}
        </>
      )}

      <NewSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clients={clients}
        services={services}
        isClientsLoading={isCompanyLoading || isClientsLoading}
        isServicesLoading={isCompanyLoading || isServicesLoading}
        createSale={createSale}
        createClient={createClient}
        createService={createService}
      />
    </div>
  );
}
