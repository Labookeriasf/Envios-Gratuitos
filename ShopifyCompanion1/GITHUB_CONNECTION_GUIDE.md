# Guía: Conectar Replit con GitHub

## Método 1: Conectar Replit con GitHub (Lo más directo)

### Paso 1: Conectar tu cuenta
1. En Replit, ve a tu perfil (esquina superior derecha)
2. Clic en "Account" 
3. Ve a la sección "Connected accounts"
4. Conecta tu cuenta de GitHub si no lo has hecho

### Paso 2: Importar/Exportar repositorio
1. En Replit, ve a "Create" → "Import from GitHub"
2. O usa "Export to GitHub" desde tu proyecto actual
3. Esto creará automáticamente el repositorio en GitHub

## Método 2: Subida Manual (100% funcional)

### Paso 1: Descargar tu proyecto
1. En Replit, haz clic en el menú kebab (⋮) junto al nombre del proyecto
2. Selecciona "Download as zip"
3. Descomprime el archivo en tu computadora

### Paso 2: Crear repositorio en GitHub
1. Ve a [github.com](https://github.com)
2. Clic en el botón verde "New" o "+"
3. Nombre del repositorio: `shopify-free-shipping-system`
4. Descripción: `Sistema de envío gratuito para librerías con Shopify`
5. Marca "Public" (es gratis)
6. NO marques "Add a README file"
7. Clic "Create repository"

### Paso 3: Subir archivos
1. En la página del repositorio recién creado
2. Clic en "uploading an existing file"
3. Arrastra TODOS los archivos de tu proyecto descomprimido
4. En el cuadro de commit escribe: "Sistema completo de envío gratuito"
5. Clic "Commit changes"

## Método 3: Usando Git desde Replit Shell

Si prefieres usar comandos:

```bash
# Configurar git (solo la primera vez)
git config --global user.email "tu-email@ejemplo.com"
git config --global user.name "Tu Nombre"

# Crear conexión con GitHub
git remote add origin https://github.com/TU-USUARIO/shopify-free-shipping-system.git
git branch -M main
git add .
git commit -m "Sistema de envío gratuito completo"
git push -u origin main
```

## Una vez que tienes el repositorio en GitHub:

### Conectar con Railway
1. Ve a [railway.app](https://railway.app)
2. Clic "Start a New Project"
3. Selecciona "Deploy from GitHub repo"
4. ¡Ahora sí aparecerá tu repositorio!
5. Selecciónalo y Railway comenzará el deploy

### Variables de entorno en Railway
```
SHOPIFY_API_URL=https://tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=tu_token_aqui
NODE_ENV=production
```

## Verificación
Una vez desplegado, verifica que funciona visitando:
- `https://tu-app.railway.app` (dashboard principal)
- `https://tu-app.railway.app/discount-validator` (validador)

¡El Método 2 (subida manual) es el más confiable y fácil!