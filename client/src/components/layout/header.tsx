import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import { useState } from "react";
import AddInstitutionModal from "@/components/modals/add-institution-modal";

const pageConfig = {
  "/": {
    title: "Dashboard",
    description: "Resumen general del sistema de envíos gratuitos",
  },
  "/institutions": {
    title: "Gestión de Instituciones",
    description: "Administra las instituciones y sus códigos de descuento",
  },
  "/discount-codes": {
    title: "Códigos de Descuento",
    description: "Gestiona los códigos de descuento de Shopify",
  },
  "/reports": {
    title: "Reportes",
    description: "Análisis y estadísticas del sistema",
  },
  "/settings": {
    title: "Configuración",
    description: "Configuración del sistema",
  },
};

export default function Header() {
  const [location] = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);

  const config = pageConfig[location as keyof typeof pageConfig] || {
    title: "Panel de Administración",
    description: "Sistema de envíos gratuitos",
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">{config.title}</h2>
            <p className="text-sm text-slate-600 mt-1">{config.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Institución
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" className="w-8 h-8 bg-slate-100 rounded-full hover:bg-slate-200">
                <User className="h-4 w-4 text-slate-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AddInstitutionModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </>
  );
}
