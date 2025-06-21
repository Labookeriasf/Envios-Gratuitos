# Cómo Conectar tu Proyecto a Railway - Paso a Paso

## Método 1: Desde Replit (Más Fácil)

### Paso 1: Preparar el código
En Replit Shell, ejecuta estos comandos:

```bash
git init
git add .
git commit -m "Sistema de envío gratuito para Shopify"
```

### Paso 2: Crear repositorio en GitHub
1. Ve a [github.com](https://github.com) y haz login
2. Clic en "New repository" (botón verde)
3. Nombre: `shopify-free-shipping`
4. Selecciona "Public" (gratis)
5. NO marques "Initialize with README"
6. Clic "Create repository"

### Paso 3: Subir código a GitHub
Copia los comandos que GitHub te muestra y ejecútalos en Replit Shell:

```bash
git remote add origin https://github.com/TU-USUARIO/shopify-free-shipping.git
git branch -M main
git push -u origin main
```

### Paso 4: Conectar con Railway
1. Ve a [railway.app](https://railway.app)
2. Clic en "Start a New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway a acceder a GitHub
5. Selecciona tu repositorio `shopify-free-shipping`
6. Railway comenzará el deploy automáticamente

### Paso 5: Configurar Variables de Entorno
Una vez que aparezca tu proyecto en Railway:
1. Clic en tu proyecto
2. Ve a la pestaña "Variables"
3. Agrega estas variables:
   - `SHOPIFY_API_URL` = `https://tu-tienda.myshopify.com`
   - `SHOPIFY_ACCESS_TOKEN` = `tu_token_de_shopify`
4. Railway redesplegará automáticamente

### Paso 6: Obtener tu URL
1. En Railway, ve a la pestaña "Settings"
2. Copia la URL que aparece (algo como `https://shopify-free-shipping-production.up.railway.app`)
3. ¡Tu sistema ya está funcionando!

## Método 2: Descarga Directa (Alternativo)

Si el Método 1 no funciona:

### Paso 1: Descargar código de Replit
1. En Replit, clic en los tres puntos (...) del archivo principal
2. Selecciona "Download as zip"
3. Descomprime el archivo en tu computadora

### Paso 2: Subir a GitHub
1. En GitHub, crea nuevo repositorio
2. Arrastra todos los archivos descomprimidos
3. Haz commit: "Código inicial del sistema"

### Paso 3: Continúa desde el Paso 4 del Método 1

## Configuración Post-Deploy

### 1. Verificar que funciona
Ve a tu URL de Railway y deberías ver tu sistema funcionando.

### 2. Configurar Webhook en Shopify
1. En tu tienda Shopify, ve a Settings → Notifications
2. En "Webhooks" agrega:
   - Event: `Order payment`
   - Format: `JSON`
   - URL: `https://tu-url-railway.app/api/webhook/shopify/order`

### 3. Actualizar enlaces en tu tienda
Reemplaza cualquier referencia a localhost con tu nueva URL de Railway.

## Solución de Problemas

### Error: "Build failed"
- Verifica que todos los archivos se subieron correctamente
- Revisa los logs de build en Railway

### Error: "Database connection"
- Railway crea la base de datos automáticamente
- Verifica que `DATABASE_URL` esté en las variables de entorno

### Error: "Shopify API"
- Verifica que tu `SHOPIFY_ACCESS_TOKEN` sea correcto
- Asegúrate de que la URL no tenga espacios extra

## URLs Importantes
- Tu panel de administración: `https://tu-url-railway.app`
- Validador de códigos: `https://tu-url-railway.app/discount-validator`
- API para webhooks: `https://tu-url-railway.app/api/webhook/shopify/order`

¡Con estos pasos tendrás tu sistema funcionando gratis en Railway!