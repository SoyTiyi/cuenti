"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Eye, Check, MessageCircle } from "lucide-react";

const ventasDelMes = 24;
const ventasPendientes = 8;

const resumenVentas = {
  totalVentas: 42500.0,
  recaudado: 28150.0,
  porCobrar: 14350.0,
};

const ventasUltimos7Dias = [
  { dia: "Lun", ventas: 5 },
  { dia: "Mar", ventas: 8 },
  { dia: "Mié", ventas: 3 },
  { dia: "Jue", ventas: 12 },
  { dia: "Vie", ventas: 7 },
  { dia: "Sáb", ventas: 4 },
  { dia: "Dom", ventas: 2 },
];

const serviciosMasVendidos = [
  { nombre: "Diseño Web", cantidad: 12, color: "#6366F1" },
  { nombre: "Hosting", cantidad: 8, color: "#8B5CF6" },
  { nombre: "Mantenimiento", cantidad: 6, color: "#10B981" },
  { nombre: "Consultoría", cantidad: 4, color: "#F59E0B" },
];

const ventas = [
  {
    id: 1,
    cliente: "Maria Gonzalez",
    avatar: "/avatars/maria.jpg",
    tiempo: "Hace 2 horas",
    servicio: "Diseño Web Corporativo",
    icono: "palette",
    monto: 1250.0,
    estado: "pendiente",
  },
  {
    id: 2,
    cliente: "Carlos Ruiz",
    avatar: "/avatars/carlos.jpg",
    tiempo: "Ayer",
    servicio: "Lote de Repuestos #442",
    icono: "box",
    monto: 450.0,
    estado: "pagada",
  },
  {
    id: 3,
    cliente: "Luis Hernandez",
    avatar: "/avatars/luis.jpg",
    tiempo: "31 Oct, 2023",
    servicio: "Reparación Local A",
    icono: "wrench",
    monto: 320.0,
    estado: "pagada",
  },
  {
    id: 4,
    cliente: "Sofia Martí",
    avatar: "/avatars/sofia.jpg",
    tiempo: "28 Oct, 2023",
    servicio: "Envío Internacional",
    icono: "truck",
    monto: 1100.0,
    estado: "pendiente",
  },
];

function getEstadoBadge(estado: string) {
  if (estado === "pagada") {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700">
        Pagada
      </span>
    );
  }
  return (
    <span className="px-3 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
      Pendiente
    </span>
  );
}

function getAccionBoton(estado: string) {
  if (estado === "pagada") {
    return (
      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-success-600 hover:bg-success-50 rounded-lg transition-colors cursor-pointer">
        <MessageCircle size={16} />
        Recibo
      </button>
    );
  }
  return (
    <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-warning-600 hover:bg-warning-50 rounded-lg transition-colors cursor-pointer">
      <MessageCircle size={16} />
      Recordar
    </button>
  );
}

export default function VentasPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Ventas</h1>

      <div className="flex flex-wrap items-center gap-3">
        <button className="px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer font-medium transition-colors">
          + Nueva Venta
        </button>
        <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          Ventas del mes {ventasDelMes}
        </span>
        <span className="px-4 py-2 bg-warning-100 text-warning-700 rounded-full text-sm font-medium">
          Pendientes {ventasPendientes}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">
            Total Ventas
          </p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            ${resumenVentas.totalVentas.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-success-600 uppercase tracking-wide font-medium">
            Recaudado
          </p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            ${resumenVentas.recaudado.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-warning-600 uppercase tracking-wide font-medium">
            Por Cobrar
          </p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            ${resumenVentas.porCobrar.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Ventas últimos 7 días
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventasUltimos7Dias}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="dia" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="ventas" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Servicios más vendidos
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviciosMasVendidos}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="cantidad"
                  nameKey="nombre"
                >
                  {serviciosMasVendidos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-neutral-700 text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {ventas.map((venta) => (
          <div
            key={venta.id}
            className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium">
                  {venta.cliente.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{venta.cliente}</p>
                  <p className="text-xs text-neutral-500">{venta.tiempo}</p>
                </div>
              </div>
              {getEstadoBadge(venta.estado)}
            </div>

            <div className="flex items-center gap-2 text-neutral-600">
              <span className="text-sm">{venta.servicio}</span>
            </div>

            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">
                Monto Total
              </p>
              <p className="text-2xl font-bold text-neutral-900">
                ${venta.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
                  <Eye size={18} />
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    venta.estado === "pagada"
                      ? "text-success-500 hover:bg-success-50"
                      : "text-neutral-400 hover:bg-neutral-100"
                  }`}
                >
                  <Check size={18} />
                </button>
              </div>
              {getAccionBoton(venta.estado)}
            </div>
          </div>
        ))}
      </div>

      <button className="mx-auto text-neutral-500 hover:text-neutral-700 text-sm font-medium flex items-center gap-1 cursor-pointer">
        Ver más ventas
        <span className="text-xs">▼</span>
      </button>
    </div>
  );
}
