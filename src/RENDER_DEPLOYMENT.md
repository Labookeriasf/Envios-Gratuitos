# Deploy Gratuito en Render.com - Paso a Paso

## Por qué Render.com
- **Completamente gratuito** (no como Railway)
- Base de datos PostgreSQL incluida gratis
- 750 horas por mes (más que suficiente)
- SSL automático
- No requiere tarjeta de crédito

## Pasos para Deploy

### 1. Subir a GitHub
Crea repositorio con estos archivos desde `github-files.txt`:
- `package.json`
- `server.js` 
- `public/index.html`
- `render.yaml`

### 2. Deploy en Render
1. Ve a [render.com](https://render.com)
2. "New" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configuración automática:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18

### 3. Variables de Entorno
En Render, agrega:
```
NODE_ENV=production
SHOPIFY_API_URL=https://tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=tu_token_shopify
```

### 4. Base de Datos (Opcional)
- Render creará PostgreSQL gratis automáticamente
- La URL se agregará como `DATABASE_URL`

## Tu Sistema Estará Listo En:
- Dashboard: `https://tu-app.onrender.com`
- Validador: `https://tu-app.onrender.com/discount-validator`
- API: `https://tu-app.onrender.com/api`

## Alternativa: Versión Sin Base de Datos
Si prefieres más simple, usa el código en `github-files.txt` que guarda datos en memoria - funciona perfecto para una librería.

¿Procedo a crear el repositorio optimizado para Render?