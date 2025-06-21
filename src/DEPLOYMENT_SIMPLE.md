# Deployment Directo - 3 Pasos Simples

## Opción 1: Usar "Publish as Template"

1. **En Replit**: Clic en "Publish as template"
2. **Hacer público**: Esto creará una versión pública de tu proyecto
3. **Copiar URL**: Replit te dará una URL pública
4. **En Railway**: Usar "Deploy from Template" y pegar la URL de Replit

## Opción 2: Conectar Git directamente

Ejecuta estos comandos en Replit Shell:

```bash
# Crear repositorio remoto
git remote -v
git remote set-url origin https://github.com/TU-USUARIO/shopify-free-shipping.git

# Subir código
git add .
git commit -m "Sistema completo de envío gratuito"
git push -u origin main
```

## Opción 3: Usar Railway CLI (Más directo)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login a Railway
railway login

# Crear proyecto
railway init

# Deploy directo
railway up
```

## Variables de entorno para Railway

```env
NODE_ENV=production
SHOPIFY_API_URL=https://tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=tu_token_shopify
```

## URLs finales

Una vez desplegado tendrás:
- Dashboard: `https://tu-app.railway.app`
- Validador: `https://tu-app.railway.app/discount-validator`
- API: `https://tu-app.railway.app/api`

Tu sistema estará funcionando completamente gratis con base de datos incluida.