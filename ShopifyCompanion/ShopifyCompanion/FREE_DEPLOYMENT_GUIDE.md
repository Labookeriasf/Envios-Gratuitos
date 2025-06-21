# Guía de Deployment Gratuito

## Opciones 100% Gratuitas para tu Sistema

### 1. Railway (Recomendado)

**Pasos:**
1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub
3. Conecta este repositorio de Replit
4. Railway detectará automáticamente los archivos de configuración
5. Agrega las variables de entorno:
   - `SHOPIFY_API_URL`
   - `SHOPIFY_ACCESS_TOKEN`
6. Deploy automático

**Beneficios:**
- $5 USD gratis por mes (más que suficiente)
- Base de datos PostgreSQL incluida
- SSL automático
- No requiere tarjeta de crédito

### 2. Render.com (Alternativa)

**Pasos:**
1. Ve a [render.com](https://render.com)
2. Conecta tu repositorio
3. Selecciona "Web Service"
4. Usa el archivo `render.yaml` incluido
5. Configura las variables de entorno

**Beneficios:**
- Plan gratuito permanente
- 750 horas gratis por mes
- Base de datos PostgreSQL gratuita

### 3. Vercel (Solo Frontend)

Si quieres solo el validador:
1. Ve a [vercel.com](https://vercel.com)
2. Deploy solo la carpeta `client`
3. Conecta con una base de datos externa gratuita

## Cómo Migrar desde Replit

### Opción A: Usar Git

```bash
# En Replit Shell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

### Opción B: Descarga Directa

1. En Replit: Three dots menu → "Download as zip"
2. Sube el código a GitHub
3. Conecta con Railway/Render

## Variables de Entorno Necesarias

```
NODE_ENV=production
DATABASE_URL=postgresql://... (se genera automáticamente)
SHOPIFY_API_URL=https://tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=tu_token_aqui
```

## Configuración Post-Deployment

1. **Obtén tu URL de deployment** (ej: `https://tu-app.railway.app`)
2. **Configura webhook en Shopify**:
   - Ve a tu app en Shopify
   - Agrega webhook: `https://tu-app.railway.app/api/webhook/shopify/order`
3. **Actualiza URLs en tu código JavaScript**:
   - Reemplaza `https://tu-servidor.com` con tu nueva URL

## Costos Estimados

- **Railway**: Gratis hasta $5/mes de uso
- **Render**: Gratis permanente (con limitaciones menores)
- **Base de datos**: Incluida gratis en ambos

Para una librería, estos servicios gratuitos son más que suficientes.

## Migración de Base de Datos

Si ya tienes datos en Replit:
1. Exporta datos: `npm run db:export` (comando personalizado)
2. Importa en nuevo servicio: `npm run db:import`

## Troubleshooting

- **Error de build**: Verificar que todas las dependencias estén en `package.json`
- **Error de DB**: Asegurar que `DATABASE_URL` esté configurada
- **Error de Shopify**: Verificar tokens de acceso

Tu sistema funcionará exactamente igual en cualquiera de estas plataformas gratuitas.