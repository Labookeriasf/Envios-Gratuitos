# Integración con Shopify - Sistema de Envíos Gratuitos

Este documento explica cómo integrar el sistema de envíos gratuitos con tu tienda Shopify.

## 1. Configuración en Shopify

### Paso 1: Crear una Aplicación Privada
1. Ve a tu panel de administración de Shopify
2. Navega a **Aplicaciones > Desarrollo de aplicaciones**
3. Haz clic en **Crear una aplicación**
4. Configura los siguientes permisos:
   - `write_discounts` - Para crear códigos de descuento
   - `read_discounts` - Para validar códigos
   - `read_orders` - Para procesar pedidos (opcional)

### Paso 2: Configurar Webhooks
1. En tu aplicación, ve a **Webhooks**
2. Agrega un webhook para **Pedidos creados**:
   - URL: `https://tu-servidor.com/api/webhook/shopify/order`
   - Formato: JSON

## 2. Código JavaScript para tu Theme

Agrega este código a tu tema de Shopify para validar códigos en tiempo real:

```javascript
// Validador de códigos de institución
class InstitutionValidator {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async validateCode(code) {
        try {
            const response = await fetch(`${this.apiUrl}/api/public/validate-institution/${code}`);
            return await response.json();
        } catch (error) {
            console.error('Error validating code:', error);
            return { valid: false, message: 'Error de conexión' };
        }
    }

    // Crear elemento de validación en el checkout
    createValidator(discountInputId) {
        const discountInput = document.getElementById(discountInputId);
        if (!discountInput) return;

        const validator = document.createElement('div');
        validator.id = 'institution-validator';
        validator.innerHTML = `
            <div style="margin-top: 10px; padding: 10px; border-radius: 4px; display: none;" id="validation-result">
                <span id="validation-message"></span>
            </div>
        `;
        
        discountInput.parentNode.insertBefore(validator, discountInput.nextSibling);

        discountInput.addEventListener('blur', async (e) => {
            const code = e.target.value.trim().toUpperCase();
            if (code.startsWith('INST-')) {
                const result = await this.validateCode(code);
                this.showResult(result);
            }
        });
    }

    showResult(result) {
        const resultDiv = document.getElementById('validation-result');
        const messageSpan = document.getElementById('validation-message');
        
        if (!resultDiv || !messageSpan) return;

        resultDiv.style.display = 'block';
        
        if (result.valid) {
            resultDiv.style.backgroundColor = '#d4edda';
            resultDiv.style.borderColor = '#c3e6cb';
            resultDiv.style.color = '#155724';
            messageSpan.textContent = `✓ Código válido para ${result.institution.name}`;
        } else {
            resultDiv.style.backgroundColor = '#f8d7da';
            resultDiv.style.borderColor = '#f5c6cb';
            resultDiv.style.color = '#721c24';
            messageSpan.textContent = `✗ ${result.message}`;
        }
    }
}

// Inicializar validador
document.addEventListener('DOMContentLoaded', function() {
    const validator = new InstitutionValidator('https://tu-servidor.com');
    validator.createValidator('discount_code'); // ID del input de descuento
});
```

## 3. Liquid Template para Página de Validación

Crea una nueva página en Shopify con este código Liquid:

```liquid
<!-- sections/institution-validator.liquid -->
<div class="institution-validator">
    <h2>Validador de Envío Gratuito</h2>
    <p>Verifica si tu institución tiene envío gratuito disponible</p>
    
    <form id="validator-form">
        <div class="form-group">
            <label for="institution-code">Código de Institución:</label>
            <input type="text" id="institution-code" placeholder="Ej: INST-2024-001" style="text-transform: uppercase;">
            <button type="submit">Validar</button>
        </div>
    </form>
    
    <div id="validation-result" style="display: none;">
        <div id="result-content"></div>
    </div>
</div>

<style>
.institution-validator {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-group button {
    background-color: #007cba;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.form-group button:hover {
    background-color: #005c87;
}

#validation-result {
    margin-top: 20px;
    padding: 15px;
    border-radius: 4px;
}

.success {
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
}

.error {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
}
</style>

<script>
document.getElementById('validator-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const code = document.getElementById('institution-code').value.trim().toUpperCase();
    const resultDiv = document.getElementById('validation-result');
    const contentDiv = document.getElementById('result-content');
    
    if (!code) return;
    
    try {
        const response = await fetch(`https://tu-servidor.com/api/public/validate-institution/${code}`);
        const result = await response.json();
        
        resultDiv.style.display = 'block';
        
        if (result.valid) {
            resultDiv.className = 'success';
            contentDiv.innerHTML = `
                <h3>¡Código Válido!</h3>
                <p><strong>Institución:</strong> ${result.institution.name}</p>
                <p><strong>Código:</strong> ${result.institution.code}</p>
                <p>Usa este código en el checkout para obtener envío gratuito.</p>
            `;
        } else {
            resultDiv.className = 'error';
            contentDiv.innerHTML = `
                <h3>Código Inválido</h3>
                <p>${result.message}</p>
            `;
        }
    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.className = 'error';
        contentDiv.innerHTML = '<p>Error de conexión. Inténtalo de nuevo.</p>';
    }
});
</script>
```

## 4. Configuración de URLs

Asegúrate de reemplazar `https://tu-servidor.com` con la URL real de tu servidor donde está desplegado el sistema.

### URLs Disponibles:
- `GET /api/public/validate-institution/:code` - Validación pública de códigos
- `POST /api/webhook/shopify/order` - Webhook para procesar pedidos
- `GET /api/validate-code/:code` - Validación completa (admin)

## 5. Flujo de Trabajo

1. **Crear Institución**: Usar el panel de administración
2. **Generar Código**: Se crea automáticamente (formato: INST-YYYY-XXX)
3. **Sincronizar con Shopify**: Se crea el código de descuento automáticamente
4. **Validación en Tiempo Real**: Los clientes pueden validar sus códigos
5. **Aplicar Descuento**: En el checkout de Shopify
6. **Registro de Uso**: Vía webhook cuando se completa el pedido

## 6. Solución de Problemas

### Error: "Shopify API not configured"
- Verificar que `SHOPIFY_API_URL` y `SHOPIFY_ACCESS_TOKEN` estén configurados
- Confirmar que la URL tiene el formato: `https://tu-tienda.myshopify.com`

### Error: "Código no válido en Shopify"
- El código puede no estar sincronizado con Shopify
- Usar el botón "Regenerar código" en el panel de administración

### Webhook no funciona
- Verificar que la URL del webhook sea accesible públicamente
- Confirmar que el formato está configurado como JSON en Shopify

## 7. Personalización

El sistema es totalmente personalizable:
- Cambiar formato de códigos en `server/storage.ts`
- Modificar validaciones en `server/routes.ts`
- Personalizar interfaz en los archivos de React
- Adaptar estilos CSS según tu marca