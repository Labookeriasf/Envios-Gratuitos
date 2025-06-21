# Deploy Completo en Render.com - Listo para Usar

## Archivos Preparados para GitHub

He creado estos archivos optimizados para Render:

1. **render-package.json** → renombrar a `package.json`
2. **render-server.js** → renombrar a `server.js`  
3. **public/index.html** → crear carpeta `public` y colocar dentro
4. **render.yaml** → ya existe para configuración automática

## Pasos para Deploy Inmediato

### 1. Crear Repositorio en GitHub
- Ve a github.com → "New repository"
- Nombre: `shopify-free-shipping`
- Público
- Copia los 4 archivos mencionados

### 2. Deploy en Render
- Ve a [render.com](https://render.com)
- "New" → "Web Service"
- Conecta tu repositorio
- Render detectará automáticamente:
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Port: 10000

### 3. Variables de Entorno (Opcional)
```
SHOPIFY_API_URL=https://tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=tu_token_shopify
```

## Características del Sistema

✅ **Dashboard completo** con estadísticas visuales
✅ **Gestión de instituciones** (agregar, eliminar, listar)
✅ **Validador de códigos** con interfaz amigable
✅ **Base de datos PostgreSQL** automática en Render
✅ **API REST** completa para integración
✅ **Interfaz responsive** con iconos y diseño profesional
✅ **Sistema híbrido** - funciona con o sin base de datos

## URLs Finales
- Dashboard: `https://tu-app.onrender.com`
- API: `https://tu-app.onrender.com/api`
- Validador: `https://tu-app.onrender.com` (pestaña Validador)

## Costo: $0
- Render.com es completamente gratuito
- 750 horas por mes incluidas
- Base de datos PostgreSQL gratuita
- SSL automático incluido

Tu sistema estará funcionando en producción en menos de 10 minutos.