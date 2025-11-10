# 🌳 Sistema de Criadero de Árboles - Documentación Completa

## 📋 Resumen de Cambios Implementados

Se ha modificado la estructura del proyecto para trabajar con **DOS TABLAS RELACIONADAS**:

### ✅ Cambios Principales:

1. **Modelo de Datos Dividido**
   - ✅ Tabla `arboles`: Catálogo de tipos de árboles con precios y descuentos
   - ✅ Tabla `pedidos`: Pedidos realizados por clientes
   - ✅ Relación: Un árbol puede tener muchos pedidos (1:N)

2. **Archivos Creados/Modificados**
   ```
   ORM-Examen/
   ├── models/
   │   ├── arbolModels.js         ✨ NUEVO - Modelo de Árboles
   │   ├── pedidoModels.js        ✨ NUEVO - Modelo de Pedidos
   │   └── criaderoModels.js      ⚠️  OBSOLETO (ya no se usa)
   ├── controllers/
   │   └── criaderoControllers.js ✏️  MODIFICADO - Ahora tiene 2 grupos de controladores
   ├── routes/
   │   └── criaderoRoutes.js      ✏️  MODIFICADO - Rutas para árboles y pedidos
   ├── config/
   │   ├── database.js            ✏️  CORREGIDO - Typo en "Sequelize"
   │   └── inicializarDatos.js    ✨ NUEVO - Inicializa catálogo de árboles
   ├── app.js                     ✏️  MODIFICADO - Importa inicialización
   └── README_API.md              ✨ NUEVO - Documentación completa
   ```

---

## 🗄️ Estructura de Base de Datos

### Diagrama ER

```
┌─────────────────────────┐
│       ARBOLES           │
├─────────────────────────┤
│ 🔑 id (PK)             │
│ 📝 tipoArbol (UNIQUE)   │
│ 💰 precioUnitario       │
│ 📊 descuento100_300     │
│ 📊 descuentoMas300      │
│ 📅 createdAt            │
│ 📅 updatedAt            │
└──────────┬──────────────┘
           │
           │ 1:N
           │
┌──────────▼──────────────┐
│       PEDIDOS           │
├─────────────────────────┤
│ 🔑 id (PK)             │
│ 🔗 arbolId (FK)         │──► Referencia a arboles.id
│ 🔢 cantidad             │
│ 👤 clienteNombre        │
│ 📅 createdAt            │
│ 📅 updatedAt            │
└─────────────────────────┘
```

---

## 🎯 Endpoints Disponibles

### 📦 ÁRBOLES (`/api/criadero/arboles`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/arboles` | Crear nuevo tipo de árbol |
| GET | `/arboles` | Listar todos los árboles |
| GET | `/arboles/:id` | Obtener árbol por ID |
| PUT | `/arboles/:id` | Actualizar árbol |
| DELETE | `/arboles/:id` | Eliminar árbol |

### 📋 PEDIDOS (`/api/criadero/pedidos`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/pedidos` | Crear nuevo pedido |
| GET | `/pedidos` | Listar todos los pedidos |
| GET | `/pedidos/:id` | Obtener pedido por ID |
| PUT | `/pedidos/:id` | Actualizar pedido |
| DELETE | `/pedidos/:id` | Eliminar pedido |
| GET | `/pedidos/:id/calcular` | **Calcular total del pedido** |

---

## 💻 Flujo de Trabajo

### 1️⃣ Inicialización del Sistema

```javascript
// Al iniciar el servidor por primera vez:
1. Se conecta a la base de datos
2. Se crean las tablas (arboles y pedidos)
3. Se inicializan automáticamente los 3 tipos de árboles:
   - Paltos: $1,200 (10% / 18%)
   - Limones: $1,000 (12.5% / 20%)
   - Chirimoyos: $980 (14.5% / 19%)
```

### 2️⃣ Crear un Pedido

```bash
# 1. Primero obtener la lista de árboles disponibles
GET /api/criadero/arboles

# 2. Crear pedido usando el arbolId
POST /api/criadero/pedidos
{
  "arbolId": 1,        # ID del tipo de árbol
  "cantidad": 250,      # Cantidad de árboles
  "clienteNombre": "María López"  # Opcional
}

# 3. Calcular el total del pedido
GET /api/criadero/pedidos/1/calcular
```

### 3️⃣ Respuesta del Cálculo

```json
{
  "id": 1,
  "tipoArbol": "Paltos",
  "cantidad": 250,
  "precioUnitario": "$1200",
  "subtotal": "$300000.00",
  "porcentajeDescuento": "10%",
  "descuento": "$30000.00",
  "descuentoAdicional": "$0.00",
  "subtotalConDescuento": "$270000.00",
  "iva": "$40500.00",
  "total": "$310500.00"
}
```

---

## 🧮 Lógica de Negocio

### Tabla de Precios y Descuentos

| Tipo de Árbol | Precio Unitario | Descuento 101-300 | Descuento >300 |
|---------------|-----------------|-------------------|----------------|
| **Paltos** | $1,200 | 10% | 18% |
| **Limones** | $1,000 | 12.5% | 20% |
| **Chirimoyos** | $980 | 14.5% | 19% |

### Reglas de Descuento

```
Si cantidad <= 100:
  ➜ Sin descuento

Si 101 <= cantidad <= 300:
  ➜ Aplicar descuento según tabla (10%, 12.5%, 14.5%)

Si cantidad > 300:
  ➜ Aplicar descuento según tabla (18%, 20%, 19%)

Si cantidad > 1000:
  ➜ Aplicar descuento adicional del 15%
```

### Fórmula de Cálculo

```javascript
1. Subtotal = precioUnitario × cantidad

2. Descuento = Subtotal × (porcentajeDescuento ÷ 100)

3. Subtotal con Descuento = Subtotal - Descuento

4. Si cantidad > 1000:
     Descuento Adicional = Subtotal con Descuento × 0.15
     Subtotal con Descuento -= Descuento Adicional

5. IVA = Subtotal con Descuento × 0.15

6. TOTAL = Subtotal con Descuento + IVA
```

---

## 🔗 Relaciones entre Modelos

```javascript
// En pedidoModels.js:

// Un Pedido pertenece a un Árbol
Pedido.belongsTo(Arbol, {
    foreignKey: 'arbolId',
    as: 'arbol'
});

// Un Árbol puede tener muchos Pedidos
Arbol.hasMany(Pedido, {
    foreignKey: 'arbolId',
    as: 'pedidos'
});
```

---

## 📊 Ejemplos de Uso Completos

### Ejemplo 1: Pedido Pequeño (Sin Descuento)

```json
// POST /api/criadero/pedidos
{
  "arbolId": 2,
  "cantidad": 50,
  "clienteNombre": "Pedro García"
}

// GET /api/criadero/pedidos/1/calcular
// Resultado:
{
  "tipoArbol": "Limones",
  "cantidad": 50,
  "precioUnitario": "$1000",
  "subtotal": "$50000.00",
  "porcentajeDescuento": "0%",
  "descuento": "$0.00",
  "descuentoAdicional": "$0.00",
  "subtotalConDescuento": "$50000.00",
  "iva": "$7500.00",
  "total": "$57500.00"
}
```

### Ejemplo 2: Pedido Mediano (Con Descuento)

```json
// POST /api/criadero/pedidos
{
  "arbolId": 1,
  "cantidad": 200,
  "clienteNombre": "Ana Martínez"
}

// Resultado:
{
  "tipoArbol": "Paltos",
  "cantidad": 200,
  "precioUnitario": "$1200",
  "subtotal": "$240000.00",
  "porcentajeDescuento": "10%",
  "descuento": "$24000.00",
  "descuentoAdicional": "$0.00",
  "subtotalConDescuento": "$216000.00",
  "iva": "$32400.00",
  "total": "$248400.00"
}
```

### Ejemplo 3: Pedido Grande (Con Doble Descuento)

```json
// POST /api/criadero/pedidos
{
  "arbolId": 3,
  "cantidad": 1500,
  "clienteNombre": "Empresa XYZ"
}

// Resultado:
{
  "tipoArbol": "Chirimoyos",
  "cantidad": 1500,
  "precioUnitario": "$980",
  "subtotal": "$1470000.00",
  "porcentajeDescuento": "19%",
  "descuento": "$279300.00",
  "descuentoAdicional": "$178605.00",
  "subtotalConDescuento": "$1012095.00",
  "iva": "$151814.25",
  "total": "$1163909.25"
}
```

---

## 🚀 Comandos de Inicio

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=criadero_db
DB_USER=root
DB_PASS=tu_password
PORT=3000

# 3. Iniciar servidor
npm start

# Verás estos mensajes:
# ✓ Conexión a la base de datos establecida correctamente
# ✓ Modelos sincronizados con la base de datos
# ✓ Catálogo de árboles inicializado correctamente
# ✓ Servidor ejecutándose en el puerto 3000
```

---

## ✨ Ventajas de la Nueva Estructura

### 🎯 Separación de Responsabilidades
- **Tabla arboles**: Maneja el catálogo (precios, descuentos)
- **Tabla pedidos**: Maneja las transacciones de clientes

### 🔄 Flexibilidad
- Actualizar precios sin afectar pedidos históricos
- Agregar nuevos tipos de árboles fácilmente
- Modificar porcentajes de descuento centralizadamente

### 📈 Escalabilidad
- Fácil agregar más campos (stock, imagen, descripción)
- Relación preparada para historial de cambios
- Posibilidad de agregar más tablas (clientes, facturas)

### 🔒 Integridad de Datos
- Validaciones en ambos modelos
- Claves foráneas garantizan consistencia
- Restricciones de unicidad en tipos de árbol

---

## 🎓 Comparación con Proyecto Financiera

| Aspecto | Financiera | Criadero (Nuevo) |
|---------|------------|------------------|
| Tablas | 1 (clientes) | 2 (arboles, pedidos) |
| Relaciones | Ninguna | 1:N (arbol → pedidos) |
| Cálculo | Interés simple | Descuentos múltiples + IVA |
| Inicialización | No tiene | Carga automática de árboles |
| Complejidad | Baja | Media-Alta |

---

## 📝 Notas Importantes

1. ✅ Los árboles se inicializan **automáticamente** al arrancar el servidor
2. ✅ La tabla `criaderoModels.js` ya NO se usa (se puede eliminar)
3. ✅ Todos los cálculos se realizan en el modelo `Pedido`
4. ✅ El IVA siempre es del 15%
5. ✅ Los descuentos son **acumulativos** para pedidos >1000 árboles

---

## 🎉 ¡Proyecto Completo y Funcional!

El sistema ahora tiene:
- ✅ Dos tablas relacionadas correctamente
- ✅ CRUD completo para ambas tablas
- ✅ Lógica de negocio implementada
- ✅ Validaciones exhaustivas
- ✅ Documentación completa
- ✅ Inicialización automática de datos
- ✅ Siguiendo 100% la estructura de Financiera
