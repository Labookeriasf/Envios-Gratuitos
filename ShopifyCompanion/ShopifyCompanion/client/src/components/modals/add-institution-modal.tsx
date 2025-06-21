import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertInstitutionSchema, type InsertInstitution } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Info, ShoppingBag } from "lucide-react";
import ProductSelectorModal from "./product-selector-modal";

interface AddInstitutionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddInstitutionModal({ open, onOpenChange }: AddInstitutionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showProductSelector, setShowProductSelector] = useState(false);

  const form = useForm<InsertInstitution>({
    resolver: zodResolver(insertInstitutionSchema),
    defaultValues: {
      name: "",
      email: "",
      isActive: true,
      shopifyPageUrl: "",
      allowedCollections: [],
      allowedProducts: [],
      restrictToProducts: false,
    },
  });

  const createInstitutionMutation = useMutation({
    mutationFn: async (data: InsertInstitution) => {
      const response = await apiRequest("POST", "/api/institutions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/institutions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/activity"] });
      toast({
        title: "Éxito",
        description: "Institución creada correctamente",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la institución",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInstitution) => {
    createInstitutionMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Institución</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la Institución</Label>
            <Input
              id="name"
              placeholder="Ej: Universidad Nacional"
              {...form.register("name")}
              className="mt-2"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email de Contacto</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@universidad.edu"
              {...form.register("email")}
              className="mt-2"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="shopifyPageUrl">URL de la Página de Shopify (Opcional)</Label>
            <Input
              id="shopifyPageUrl"
              placeholder="https://tu-tienda.com/pages/institucion"
              {...form.register("shopifyPageUrl")}
              className="mt-2"
            />
            <p className="text-xs text-slate-500 mt-1">
              URL específica de la página de esta institución en tu tienda
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="restrictToProducts"
                checked={form.watch("restrictToProducts")}
                onCheckedChange={(checked) => form.setValue("restrictToProducts", checked as boolean)}
              />
              <Label htmlFor="restrictToProducts" className="text-sm">
                Restringir a productos específicos
              </Label>
              <Info className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Si activas esta opción, el envío gratuito solo aplicará a productos o colecciones específicas
            </p>
          </div>

          {form.watch("restrictToProducts") && (
            <div>
              <Label>Productos y Colecciones Permitidos</Label>
              <div className="mt-2 p-3 border border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowProductSelector(true)}
                    className="mb-2"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Seleccionar desde Shopify
                  </Button>
                  <div className="text-xs text-slate-500">
                    {(form.watch("allowedProducts")?.length || 0) + (form.watch("allowedCollections")?.length || 0) === 0 
                      ? "No hay productos o colecciones seleccionados"
                      : `${form.watch("allowedProducts")?.length || 0} productos y ${form.watch("allowedCollections")?.length || 0} colecciones seleccionados`
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="code">Código de Institución</Label>
            <Input
              id="code"
              placeholder="Se generará automáticamente"
              className="mt-2 bg-slate-100"
              readOnly
            />
            <p className="text-xs text-slate-500 mt-1">
              El código se generará automáticamente al crear la institución
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked as boolean)}
            />
            <Label htmlFor="isActive" className="text-sm">
              Activar envíos gratuitos inmediatamente
            </Label>
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={createInstitutionMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createInstitutionMutation.isPending}
              className="bg-primary hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              {createInstitutionMutation.isPending ? "Creando..." : "Crear Institución"}
            </Button>
          </div>
        </form>

        <ProductSelectorModal
          open={showProductSelector}
          onOpenChange={setShowProductSelector}
          selectedProducts={form.watch("allowedProducts") || []}
          selectedCollections={form.watch("allowedCollections") || []}
          onSelectionChange={(products, collections) => {
            form.setValue("allowedProducts", products);
            form.setValue("allowedCollections", collections);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
