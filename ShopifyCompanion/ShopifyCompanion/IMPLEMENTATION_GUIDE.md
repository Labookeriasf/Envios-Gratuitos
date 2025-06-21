# Guía de Implementación - Sistema de Envíos Gratuitos por Institución

## Resumen del Sistema

He modificado completamente el sistema para que se integre con tus páginas específicas de instituciones existentes en Shopify. Ahora puedes:

### 🎯 Funcionalidades Principales

1. **Restricción por Productos/Colecciones**: Cada institución puede tener envío gratuito limitado a productos específicos o colecciones completas
2. **Integración con Páginas Existentes**: Conecta cada institución con su página específica de Shopify
3. **Selector Visual**: Interface para seleccionar productos y colecciones directamente desde tu catálogo de Shopify
4. **Códigos Seguros**: Los códigos solo funcionan si el carrito contiene productos permitidos para esa institución

## Nuevas Características Implementadas

### 1. Base de Datos Actualizada
- `shopifyPageUrl`: URL de la página específica de cada institución
- `allowedProducts[]`: Array de IDs de productos permitidos
- `allowedCollections[]`: Array de IDs de colecciones permitidas  
- `restrictToProducts`: Boolean para activar/desactivar restricciones

### 2. Integración Mejorada con Shopify
- **Price Rules**: Utiliza el sistema avanzado de Shopify para crear reglas de descuento
- **Restricciones por Producto**: Los códigos solo funcionan con productos específicos
- **Validación en Tiempo Real**: Verifica que el carrito contenga productos válidos

### 3. Interface de Administración Mejorada
- **Selector de Productos**: Modal interactivo para elegir productos desde Shopify
- **Búsqueda Visual**: Encuentra productos y colecciones fácilmente
- **Configuración por Institución**: Cada institución tiene su propia configuración

## Cómo Funciona la Integración

### Para una Librería con Secciones por Institución:

1. **Crear Institución**:
   - Nombre: "Universidad Nacional"
   - URL de página: `https://tu-libreria.com/pages/universidad-nacional`
   - Activar "Restringir a productos específicos"
   - Seleccionar productos/colecciones específicas para esa universidad

2. **El Sistema Crea**:
   - Código único: `INST-2024-001`
   - Price Rule en Shopify que SOLO funciona con los productos seleccionados
   - Descuento de envío 100% para esos productos específicos

3. **El Cliente**:
   - Visita la página específica de su institución
   - Ve los productos permitidos para su institución
   - Usa el código en checkout
   - El descuento SOLO aplica si tiene productos válidos en el carrito

## Configuración Paso a Paso

### 1. Configurar una Nueva Institución

```
1. Ve al panel de administración → "Instituciones"
2. Clic en "Nueva Institución"
3. Llena los datos básicos:
   - Nombre de la institución
   - Email de contacto
   - URL de la página específica (opcional)
4. Activa "Restringir a productos específicos"
5. Clic en "Seleccionar desde Shopify"
6. Elige productos y/o colecciones específicas
7. Guarda la institución
```

### 2. Verificar en Shopify

El sistema automáticamente:
- Crea un Price Rule en Shopify
- Configura las restricciones de productos
- Genera el código de descuento
- Vincula todo al sistema

### 3. Integrar en tu Frontend

```javascript
// Código para validar en tu página de institución
async function validateInstitutionCode(code) {
    const response = await fetch(`https://tu-servidor.com/api/public/validate-institution/${code}`);
    const result = await response.json();
    
    if (result.valid) {
        // Mostrar mensaje de éxito
        // Redirigir a productos específicos
        window.location.href = '/collections/productos-' + result.institution.code.toLowerCase();
    } else {
        // Mostrar error
        alert(result.message);
    }
}
```

## Ejemplo de Flujo Completo

### Escenario: Librería con 3 Universidades

1. **Universidad A**: Solo puede comprar libros de Medicina (Colección ID: 123)
2. **Universidad B**: Solo puede comprar libros específicos (Productos ID: 456, 789, 101)
3. **Universidad C**: Puede comprar de cualquier categoría (sin restricciones)

### Configuración:

```
Universidad A:
- Código: INST-2024-001
- Página: /pages/universidad-a
- Colecciones permitidas: [123]
- Restricciones: Activadas

Universidad B:
- Código: INST-2024-002  
- Página: /pages/universidad-b
- Productos permitidos: [456, 789, 101]
- Restricciones: Activadas

Universidad C:
- Código: INST-2024-003
- Página: /pages/universidad-c
- Restricciones: Desactivadas (envío gratuito general)
```

## APIs Disponibles

### Para tu Frontend de Shopify:

```javascript
// Validar código específico
GET /api/public/validate-institution/INST-2024-001

// Respuesta:
{
  "valid": true,
  "institution": {
    "name": "Universidad Nacional",
    "code": "INST-2024-001"
  },
  "discount": {
    "type": "free_shipping",
    "description": "Envío gratuito para Universidad Nacional"
  }
}
```

### Para Administración:

```javascript
// Obtener productos de Shopify
GET /api/shopify/products

// Obtener colecciones de Shopify  
GET /api/shopify/collections

// Webhook para procesar pedidos
POST /api/webhook/shopify/order
```

## Ventajas del Nuevo Sistema

1. **Seguridad**: Los códigos solo funcionan con productos específicos
2. **Flexibilidad**: Cada institución puede tener diferentes productos
3. **Integración**: Se conecta directamente con tus páginas existentes
4. **Escalabilidad**: Fácil agregar nuevas instituciones y productos
5. **Control Total**: Puedes activar/desactivar instituciones individualmente

## Próximos Pasos

1. **Configurar tus primeras instituciones** usando el nuevo formulario
2. **Conectar con tus páginas existentes** agregando las URLs específicas
3. **Seleccionar productos permitidos** usando el selector visual
4. **Probar los códigos** en tu tienda para verificar que funcionan correctamente
5. **Agregar el código JavaScript** a tus páginas de instituciones para validación en tiempo real

El sistema ahora está completamente integrado con tu estructura existente de Shopify y te permite un control granular sobre qué productos pueden acceder al envío gratuito por institución.