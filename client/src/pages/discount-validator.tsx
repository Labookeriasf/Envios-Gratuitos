import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ValidationResult {
  valid: boolean;
  institution?: {
    id: number;
    name: string;
    code: string;
  };
  message?: string;
}

export default function DiscountValidator() {
  const [code, setCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const validateCode = async () => {
    if (!code.trim()) return;
    
    setValidating(true);
    setResult(null);

    try {
      const response = await apiRequest("GET", `/api/validate-code/${code.trim()}`);
      
      if (response.ok) {
        const data = await response.json();
        setResult({
          valid: true,
          institution: data.institution,
        });
      } else {
        const error = await response.json();
        setResult({
          valid: false,
          message: error.message || "Código inválido",
        });
      }
    } catch (error) {
      setResult({
        valid: false,
        message: "Error al validar el código",
      });
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateCode();
  };

  const getStatusIcon = () => {
    if (validating) return <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />;
    if (result?.valid) return <CheckCircle className="h-8 w-8 text-green-500" />;
    if (result && !result.valid) return <XCircle className="h-8 w-8 text-red-500" />;
    return <AlertCircle className="h-8 w-8 text-gray-400" />;
  };

  const getStatusMessage = () => {
    if (validating) return "Validando código...";
    if (result?.valid && result.institution) {
      return `¡Código válido! Institución: ${result.institution.name}`;
    }
    if (result && !result.valid) {
      return result.message || "Código inválido";
    }
    return "Ingresa tu código de institución para validar envío gratuito";
  };

  const getStatusColor = () => {
    if (validating) return "text-blue-600";
    if (result?.valid) return "text-green-600";
    if (result && !result.valid) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Validador de Envío Gratuito
            </h1>
            <p className="text-gray-600 text-sm">
              Verifica si tu institución tiene envío gratuito disponible
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                Código de Institución
              </Label>
              <Input
                id="code"
                type="text"
                placeholder="Ej: INST-2024-001"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="mt-1 uppercase"
                disabled={validating}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!code.trim() || validating}
            >
              {validating ? "Validando..." : "Validar Código"}
            </Button>
          </form>

          {/* Status Display */}
          <div className="mt-6 text-center">
            <div className="flex justify-center mb-3">
              {getStatusIcon()}
            </div>
            <p className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusMessage()}
            </p>
            
            {result?.valid && result.institution && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">
                  <strong>Código:</strong> {result.institution.code}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Usa este código en el checkout para obtener envío gratuito
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              ¿Cómo usar tu código?
            </h3>
            <ol className="text-xs text-gray-600 space-y-1">
              <li>1. Agrega productos a tu carrito</li>
              <li>2. Ve al checkout</li>
              <li>3. Ingresa tu código en "Código de descuento"</li>
              <li>4. ¡Disfruta tu envío gratuito!</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}