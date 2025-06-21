# Crear Repositorio GitHub - Manual

## Paso 1: Crear Repositorio en GitHub
1. Ve a [github.com](https://github.com) y haz login
2. Clic en "New repository" (botón verde)
3. Nombre: `shopify-free-shipping`
4. Descripción: `Sistema de envío gratuito para librerías Shopify`
5. Público (gratis)
6. NO marques "Initialize with README"
7. Clic "Create repository"

## Paso 2: Copiar Archivos Manualmente
GitHub te mostrará una página para subir archivos. Necesitas crear estos archivos uno por uno:

### Archivo: package.json
```json
{
  "name": "shopify-free-shipping",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.4",
    "drizzle-orm": "^0.36.0",
    "drizzle-kit": "^0.30.0",
    "express": "^4.21.1",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3",
    "vite": "^6.0.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "wouter": "^3.3.5",
    "@tanstack/react-query": "^5.59.20",
    "zod": "^3.23.8"
  }
}
```

### Archivo: railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  }
}
```

### Archivo: render.yaml
```yaml
services:
  - type: web
    name: shopify-free-shipping
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SHOPIFY_API_URL
        sync: false
      - key: SHOPIFY_ACCESS_TOKEN
        sync: false

databases:
  - name: shopify-db
    plan: free
```

## Paso 3: Crear Estructura de Carpetas
En GitHub, necesitas crear:
- `server/` (carpeta)
- `client/` (carpeta)
- `shared/` (carpeta)

## Paso 4: Archivos Principales del Servidor
### server/index.ts
```typescript
import express from 'express';
import { registerRoutes } from './routes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

registerRoutes(app);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

## Paso 5: Deploy
Una vez que tengas el repositorio:
1. Ve a Railway/Render
2. Conecta tu repositorio `shopify-free-shipping`
3. Agrega variables de entorno
4. Deploy automático

## Variables de Entorno
```
NODE_ENV=production
SHOPIFY_API_URL=https://tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=tu_token_shopify
```