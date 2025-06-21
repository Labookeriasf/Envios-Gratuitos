import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  University, 
  Tags, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Wand2, 
  Download, 
  ToggleLeft,
  ChevronRight 
} from "lucide-react";
import { useState } from "react";
import AddInstitutionModal from "@/components/modals/add-institution-modal";

interface DashboardStats {
  activeInstitutions: number;
  totalDiscountCodes: number;
  totalFreeShipments: number;
  totalSavings: number;
}

interface RecentActivity {
  type: string;
  description: string;
  createdAt: string;
  status: boolean;
}

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: activity, isLoading: activityLoading } = useQuery<RecentActivity[]>({
    queryKey: ["/api/dashboard/activity"],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Hace menos de 1 hora";
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} horas`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} días`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'institution':
        return <Plus className="text-primary text-sm" />;
      case 'usage':
        return <Truck className="text-green-600 text-sm" />;
      default:
        return <Tags className="text-amber-600 text-sm" />;
    }
  };

  const getActivityDescription = (type: string, description: string) => {
    switch (type) {
      case 'institution':
        return `Nueva institución: ${description}`;
      case 'usage':
        return `Envío gratuito aplicado: Pedido #${description}`;
      default:
        return description;
    }
  };

  const getStatusBadge = (type: string, status: boolean) => {
    if (type === 'institution') {
      return status ? (
        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Activo</span>
      ) : (
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Inactivo</span>
      );
    } else {
      return <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Completado</span>;
    }
  };

  if (statsLoading || activityLoading) {
    return (
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Instituciones Activas</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-2">
                    {stats?.activeInstitutions || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <University className="text-green-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12%
                </span>
                <span className="text-slate-500 ml-2">vs. mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Códigos Generados</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-2">
                    {stats?.totalDiscountCodes || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Tags className="text-primary text-xl" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +8%
                </span>
                <span className="text-slate-500 ml-2">vs. mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Envíos Gratuitos</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-2">
                    {stats?.totalFreeShipments?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Truck className="text-amber-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +23%
                </span>
                <span className="text-slate-500 ml-2">vs. mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Ahorro Total</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-2">
                    ${stats?.totalSavings?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +15%
                </span>
                <span className="text-slate-500 ml-2">vs. mes anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Actividad Reciente</h3>
            </div>
            <CardContent className="p-6">
              {activity && activity.length > 0 ? (
                <div className="space-y-4">
                  {activity.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {getActivityIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {getActivityDescription(item.type, item.description)}
                        </p>
                        <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                      </div>
                      {getStatusBadge(item.type, item.status)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No hay actividad reciente</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Acciones Rápidas</h3>
            </div>
            <CardContent className="p-6 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between p-4 h-auto"
                onClick={() => setShowAddModal(true)}
              >
                <div className="flex items-center space-x-3">
                  <Plus className="text-primary h-4 w-4" />
                  <span className="text-sm font-medium text-slate-700">Agregar Institución</span>
                </div>
                <ChevronRight className="text-slate-400 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-between p-4 h-auto"
                onClick={() => {
                  // TODO: Implement bulk code generation
                }}
              >
                <div className="flex items-center space-x-3">
                  <Wand2 className="text-primary h-4 w-4" />
                  <span className="text-sm font-medium text-slate-700">Generar Códigos</span>
                </div>
                <ChevronRight className="text-slate-400 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-between p-4 h-auto"
                onClick={() => {
                  // TODO: Implement report export
                }}
              >
                <div className="flex items-center space-x-3">
                  <Download className="text-primary h-4 w-4" />
                  <span className="text-sm font-medium text-slate-700">Exportar Reporte</span>
                </div>
                <ChevronRight className="text-slate-400 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-between p-4 h-auto"
                onClick={() => {
                  // TODO: Implement bulk toggle
                }}
              >
                <div className="flex items-center space-x-3">
                  <ToggleLeft className="text-primary h-4 w-4" />
                  <span className="text-sm font-medium text-slate-700">Activar/Desactivar</span>
                </div>
                <ChevronRight className="text-slate-400 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <AddInstitutionModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </>
  );
}
