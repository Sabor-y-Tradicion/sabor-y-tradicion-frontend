# ✅ Implementación: Tiempo de Preparación y Porciones

## 📋 Campos Agregados

### 1. **preparationTime** (Tiempo de Preparación)
- **Tipo:** `Int?` (número entero, opcional)
- **Unidad:** Minutos
- **Rango:** 1-180 minutos (3 horas máximo)
- **Ejemplo:** `30` (30 minutos)

### 2. **servings** (Porciones)
- **Tipo:** `Int?` (número entero, opcional)
- **Rango:** 1-20 porciones
- **Ejemplo:** `4` (4 porciones)

---

## 🗄️ Schema de Prisma

```prisma
model Dish {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  description     String
  price           Decimal  @db.Decimal(10, 2)
  categoryId      String
  image           String?
  isActive        Boolean  @default(true)
  isFeatured      Boolean  @default(false)
  allergens       String[] @default([])
  tags            String[] @default([])
  preparationTime Int?     // ✅ NUEVO
  servings        Int?     // ✅ NUEVO
  order           Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  category        Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([slug])
  @@index([categoryId])
  @@index([isActive])
  @@map("dishes")
}
```

---

## ✅ Validaciones Implementadas

### CreateDishSchema y UpdateDishSchema

```typescript
preparationTime: z
  .number()
  .int('Debe ser un número entero')
  .min(1, 'El tiempo debe ser al menos 1 minuto')
  .max(180, 'El tiempo no puede exceder 180 minutos')
  .optional(),

servings: z
  .number()
  .int('Debe ser un número entero')
  .min(1, 'Debe servir al menos 1 porción')
  .max(20, 'No puede exceder 20 porciones')
  .optional(),
```

### Mensajes de Error

| Campo | Error | Mensaje |
|-------|-------|---------|
| preparationTime | No es entero | "Debe ser un número entero" |
| preparationTime | < 1 | "El tiempo debe ser al menos 1 minuto" |
| preparationTime | > 180 | "El tiempo no puede exceder 180 minutos" |
| servings | No es entero | "Debe ser un número entero" |
| servings | < 1 | "Debe servir al menos 1 porción" |
| servings | > 20 | "No puede exceder 20 porciones" |

---

## 🧪 Ejemplos de Uso

### ✅ Crear Plato CON tiempo y porciones

```bash
POST /api/dishes
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Ceviche de Pescado",
  "description": "Delicioso ceviche fresco con pescado del día",
  "price": 35.00,
  "categoryId": "cmjpb6j3m0000qlf6njvjifmu",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "preparationTime": 30,  // ✅ 30 minutos
  "servings": 4,           // ✅ 4 porciones
  "tags": ["Picante", "Recomendado"]
}
```

**Respuesta 201:**
```json
{
  "success": true,
  "message": "Dish created successfully",
  "data": {
    "id": "cmjt...",
    "name": "Ceviche de Pescado",
    "preparationTime": 30,
    "servings": 4,
    ...
  }
}
```

---

### ✅ Crear Plato SIN tiempo y porciones

```bash
POST /api/dishes
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Plato Especial",
  "description": "Descripción del plato especial",
  "price": 25.00,
  "categoryId": "cmjpb6j3m0000qlf6njvjifmu"
  // ⚠️ preparationTime y servings no especificados (quedarán como NULL)
}
```

**Respuesta 201:**
```json
{
  "success": true,
  "data": {
    "id": "cmjt...",
    "name": "Plato Especial",
    "preparationTime": null,  // ✅ NULL es válido
    "servings": null,          // ✅ NULL es válido
    ...
  }
}
```

---

### ✅ Actualizar solo tiempo de preparación

```bash
PUT /api/dishes/cmjt...
Authorization: Bearer {token}
Content-Type: application/json

{
  "preparationTime": 45
}
```

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Dish updated successfully",
  "data": {
    "id": "cmjt...",
    "preparationTime": 45,
    "servings": 4,  // Mantiene el valor anterior
    ...
  }
}
```

---

### ❌ Error: Tiempo de preparación inválido

```bash
POST /api/dishes
{
  "name": "Plato",
  "description": "Descripción del plato",
  "price": 25,
  "categoryId": "cmjpb6j3m0000qlf6njvjifmu",
  "preparationTime": 200  // ❌ Excede el máximo (180)
}
```

**Respuesta 400:**
```json
{
  "success": false,
  "error": "Error de validación",
  "errors": [
    {
      "field": "preparationTime",
      "message": "El tiempo no puede exceder 180 minutos"
    }
  ]
}
```

---

### ❌ Error: Porciones inválidas

```bash
POST /api/dishes
{
  "name": "Plato",
  "description": "Descripción del plato",
  "price": 25,
  "categoryId": "cmjpb6j3m0000qlf6njvjifmu",
  "servings": 0  // ❌ Menor al mínimo (1)
}
```

**Respuesta 400:**
```json
{
  "success": false,
  "error": "Error de validación",
  "errors": [
    {
      "field": "servings",
      "message": "Debe servir al menos 1 porción"
    }
  ]
}
```

---

## 🎨 Visualización en el Frontend

### Mostrar tiempo de preparación

```typescript
const PreparationTime = ({ minutes }: { minutes?: number | null }) => {
  if (!minutes) return null;
  
  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4" />
      <span>{minutes} min</span>
    </div>
  );
};
```

### Mostrar porciones

```typescript
const Servings = ({ servings }: { servings?: number | null }) => {
  if (!servings) return null;
  
  return (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4" />
      <span>{servings} {servings === 1 ? 'porción' : 'porciones'}</span>
    </div>
  );
};
```

### Componente de Card completo

```typescript
const DishCard = ({ dish }: { dish: Dish }) => {
  return (
    <Card>
      <img src={dish.image || '/images/Predeterminado.jpg'} alt={dish.name} />
      <CardHeader>
        <CardTitle>{dish.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{dish.description}</p>
        <div className="flex gap-4 mt-4">
          {dish.preparationTime && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {dish.preparationTime} min
            </div>
          )}
          {dish.servings && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {dish.servings} {dish.servings === 1 ? 'porción' : 'porciones'}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <span className="font-bold">S/ {dish.price}</span>
      </CardFooter>
    </Card>
  );
};
```

---

## 📊 Estados Posibles

| Campo | Valor en BD | Significado | Frontend muestra |
|-------|-------------|-------------|------------------|
| preparationTime | `30` | Tarda 30 minutos | "⏱️ 30 min" |
| preparationTime | `NULL` | No especificado | Ocultar icono |
| servings | `4` | Sirve 4 porciones | "👥 4 porciones" |
| servings | `1` | Sirve 1 porción | "👥 1 porción" |
| servings | `NULL` | No especificado | Ocultar icono |

---

## 🔄 Migración Aplicada

```sql
-- AddColumn
ALTER TABLE "dishes" ADD COLUMN "preparationTime" INTEGER;
ALTER TABLE "dishes" ADD COLUMN "servings" INTEGER;
```

**Migración:** `20251231010602_add_preparation_time_and_servings`

---

## ✅ Checklist de Implementación

- [x] Schema de Prisma actualizado con `preparationTime` y `servings`
- [x] Validadores Zod agregados con rangos apropiados
- [x] Servicio `create` actualizado para aceptar los campos
- [x] Servicio `update` actualizado (usa spread, automático)
- [x] Migración creada y aplicada a la base de datos
- [x] Cliente de Prisma regenerado
- [x] Sin errores de TypeScript

---

## 🚀 Próximos Pasos (Frontend)

1. **Actualizar el tipo `Dish`** en TypeScript:
```typescript
interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string | null;
  preparationTime: number | null;  // ✅ Agregar
  servings: number | null;          // ✅ Agregar
  // ...resto de campos
}
```

2. **Actualizar formularios** para incluir inputs de `preparationTime` y `servings`

3. **Actualizar cards/listados** para mostrar estos datos

---

✅ **TODO LISTO! El backend ahora soporta tiempo de preparación y porciones.**

