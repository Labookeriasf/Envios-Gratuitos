import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Search, Package, FolderOpen } from "lucide-react";

interface Product {
  id: string;
  title: string;
  handle: string;
  status: string;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  products_count: number;
}

interface ProductSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProducts: string[];
  selectedCollections: string[];
  onSelectionChange: (products: string[], collections: string[]) => void;
}

export default function ProductSelectorModal({ 
  open, 
  onOpenChange, 
  selectedProducts, 
  selectedCollections, 
  onSelectionChange 
}: ProductSelectorModalProps) {
  const [productSearch, setProductSearch] = useState("");
  const [collectionSearch, setCollectionSearch] = useState("");
  const [tempProducts, setTempProducts] = useState<string[]>(selectedProducts);
  const [tempCollections, setTempCollections] = useState<string[]>(selectedCollections);

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/shopify/products"],
    enabled: open,
  });

  const { data: collections = [], isLoading: collectionsLoading } = useQuery<Collection[]>({
    queryKey: ["/api/shopify/collections"],
    enabled: open,
  });

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.handle.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(collectionSearch.toLowerCase()) ||
    collection.handle.toLowerCase().includes(collectionSearch.toLowerCase())
  );

  const handleProductToggle = (productId: string) => {
    setTempProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCollectionToggle = (collectionId: string) => {
    setTempCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleSave = () => {
    onSelectionChange(tempProducts, tempCollections);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempProducts(selectedProducts);
    setTempCollections(selectedCollections);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Seleccionar Productos y Colecciones</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="products" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">
              <Package className="mr-2 h-4 w-4" />
              Productos ({tempProducts.length})
            </TabsTrigger>
            <TabsTrigger value="collections">
              <FolderOpen className="mr-2 h-4 w-4" />
              Colecciones ({tempCollections.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="flex-1">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-[400px] border rounded-md p-4">
                {productsLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Cargando productos...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {productSearch ? 'No se encontraron productos' : 'No hay productos disponibles'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          checked={tempProducts.includes(product.id)}
                          onCheckedChange={() => handleProductToggle(product.id)}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{product.title}</div>
                          <div className="text-xs text-gray-500">ID: {product.id}</div>
                          <div className="text-xs text-gray-500">Handle: {product.handle}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="collections" className="flex-1">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar colecciones..."
                  value={collectionSearch}
                  onChange={(e) => setCollectionSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-[400px] border rounded-md p-4">
                {collectionsLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Cargando colecciones...
                  </div>
                ) : filteredCollections.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {collectionSearch ? 'No se encontraron colecciones' : 'No hay colecciones disponibles'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCollections.map((collection) => (
                      <div key={collection.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          checked={tempCollections.includes(collection.id)}
                          onCheckedChange={() => handleCollectionToggle(collection.id)}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{collection.title}</div>
                          <div className="text-xs text-gray-500">ID: {collection.id}</div>
                          <div className="text-xs text-gray-500">Handle: {collection.handle}</div>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {collection.products_count} productos
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {tempProducts.length} productos y {tempCollections.length} colecciones seleccionados
          </div>
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-blue-700">
              Guardar Selección
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}