import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  University, 
  GraduationCap, 
  Edit, 
  RefreshCw, 
  Trash2 
} from "lucide-react";
import { useState } from "react";
import { type Institution } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AddInstitutionModal from "@/components/modals/add-institution-modal";

export default function Institutions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: institutions, isLoading } = useQuery<Institution[]>({
    queryKey: ["/api/institutions"],
  });

  const toggleInstitutionMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/institutions/${id}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/institutions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Éxito",
        description: "Estado de institución actualizado",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el estado",
        variant: "destructive",
      });
    },
  });

  const regenerateCodeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/institutions/${id}/regenerate-code`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/institutions"] });
      toast({
        title: "Éxito",
        description: "Código regenerado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo regenerar el código",
        variant: "destructive",
      });
    },
  });

  const deleteInstitutionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/institutions/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/institutions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Éxito",
        description: "Institución eliminada correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la institución",
        variant: "destructive",
      });
    },
  });

  const filteredInstitutions = institutions?.filter(institution =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInstitutionIcon = (index: number) => {
    return index % 2 === 0 ? University : GraduationCap;
  };

  if (isLoading) {
    return (
      <main className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <>
      <main className="p-6">
        <Card>
          {/* Table Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Gestión de Instituciones</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar instituciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                </div>
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Institución
                </Button>
              </div>
            </div>
          </div>
          
          {/* Table Content */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Institución
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Código
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Estado
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Envíos
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Última Actualización
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstitutions.map((institution, index) => {
                  const IconComponent = getInstitutionIcon(index);
                  return (
                    <TableRow key={institution.id} className="hover:bg-slate-50">
                      <TableCell className="py-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              index % 2 === 0 ? 'text-primary' : 'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {institution.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {institution.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono text-slate-900 bg-slate-100 px-2 py-1 rounded">
                          {institution.code}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={institution.isActive}
                            onCheckedChange={(checked) => 
                              toggleInstitutionMutation.mutate({
                                id: institution.id,
                                isActive: checked
                              })
                            }
                            disabled={toggleInstitutionMutation.isPending}
                          />
                          <span className={`text-sm ${
                            institution.isActive ? 'text-green-600' : 'text-slate-500'
                          }`}>
                            {institution.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-900">0</div>
                        <div className="text-sm text-slate-500">envíos gratuitos</div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {formatDate(institution.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-blue-700"
                            onClick={() => {
                              // TODO: Implement edit functionality
                              toast({
                                title: "Función no implementada",
                                description: "La función de edición estará disponible próximamente",
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:text-amber-700"
                            onClick={() => regenerateCodeMutation.mutate(institution.id)}
                            disabled={regenerateCodeMutation.isPending}
                          >
                            <RefreshCw className={`h-4 w-4 ${
                              regenerateCodeMutation.isPending ? 'animate-spin' : ''
                            }`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => {
                              if (confirm('¿Estás seguro de que deseas eliminar esta institución?')) {
                                deleteInstitutionMutation.mutate(institution.id);
                              }
                            }}
                            disabled={deleteInstitutionMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredInstitutions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500">
                  {searchTerm ? 'No se encontraron instituciones que coincidan con la búsqueda' : 'No hay instituciones registradas'}
                </p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredInstitutions.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700">
                  Mostrando <span className="font-medium">1</span> a{' '}
                  <span className="font-medium">{filteredInstitutions.length}</span> de{' '}
                  <span className="font-medium">{filteredInstitutions.length}</span> resultados
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" disabled>
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-white">
                    1
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </main>

      <AddInstitutionModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </>
  );
}
