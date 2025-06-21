import { Link, useLocation } from "wouter";
import { BarChart3, University, Tags, TrendingUp, Settings, Truck } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Instituciones", href: "/institutions", icon: University },
  { name: "Validar Código", href: "/validate", icon: Tags },
  { name: "Reportes", href: "/reports", icon: TrendingUp },
];

const settings = [
  { name: "Configuración", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Truck className="text-white text-sm" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Envíos Gratuitos</h1>
            <p className="text-xs text-slate-500">Panel de Administración</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "text-primary bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 px-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Configuración
          </p>
          {settings.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "text-primary bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
