# 🚀 ROADMAP - Sabor y Tradición
## Funcionalidades Futuras y Mejoras Planificadas

**Última actualización**: 26 de Diciembre, 2025  
**Versión actual**: 1.0.0 (Producción)  
**Próxima versión planeada**: 2.0.0 (Panel de Administración)

---

## 🎯 PLAN DE TRABAJO: FRONTEND DEL PANEL DE ADMINISTRACIÓN

### 📊 Resumen Ejecutivo
Este plan detalla la implementación del frontend del panel de administración, estructurado en sprints de 1-2 semanas cada uno. El desarrollo será modular, permitiendo desplegar funcionalidades incrementalmente.

---

### 🏗️ SPRINT 0: Preparación y Estructura Base (3-5 días)

#### Objetivos:
- Configurar la arquitectura del panel admin
- Establecer las rutas protegidas
- Crear el layout base del dashboard

#### Tareas:

**1. Estructura de Carpetas**
- [ ] Crear estructura en `/src/app/admin/`
```
src/app/admin/
  ├── layout.tsx          # Layout principal del admin
  ├── page.tsx            # Dashboard principal
  ├── login/
  │   └── page.tsx        # Página de login
  ├── menu/
  │   ├── page.tsx        # Lista de platos
  │   ├── new/
  │   │   └── page.tsx    # Crear plato
  │   └── [id]/
  │       └── edit/
  │           └── page.tsx # Editar plato
  ├── categories/
  │   └── page.tsx        # Gestión de categorías
  ├── settings/
  │   ├── page.tsx        # Configuración general
  │   ├── contact/
  │   │   └── page.tsx    # Info de contacto
  │   └── branding/
  │       └── page.tsx    # Logo y branding
  └── components/
      ├── sidebar.tsx
      ├── admin-header.tsx
      └── stats-card.tsx
```

**2. Componentes UI Necesarios (shadcn/ui)**
- [ ] Instalar componentes adicionales:
  - `npx shadcn@latest add dialog`
  - `npx shadcn@latest add table`
  - `npx shadcn@latest add dropdown-menu`
  - `npx shadcn@latest add tabs`
  - `npx shadcn@latest add badge`
  - `npx shadcn@latest add avatar`
  - `npx shadcn@latest add select`
  - `npx shadcn@latest add checkbox`
  - `npx shadcn@latest add switch`
  - `npx shadcn@latest add alert-dialog`
  - `npx shadcn@latest add separator`

**3. Autenticación Básica (Mock inicial)**
- [ ] Crear contexto de autenticación
- [ ] Hook `useAuth()` para verificar sesión
- [ ] Componente `<ProtectedRoute>` para rutas admin
- [ ] Middleware de Next.js para proteger `/admin/*`
- [ ] Página de login con formulario básico
- [ ] Simulación de login (hardcoded temporalmente)

**4. Layout del Admin**
- [ ] Sidebar con navegación
- [ ] Header con nombre de usuario y logout
- [ ] Breadcrumbs para navegación
- [ ] Responsive: sidebar colapsable en móvil
- [ ] Dark mode toggle (opcional)

**Entregables:**
- ✅ Estructura de carpetas completa
- ✅ Layout administrativo funcional
- ✅ Login básico (mock)
- ✅ Rutas protegidas funcionando

---

### 🎨 SPRINT 1: Dashboard Principal y Navegación (1 semana)

#### Objetivos:
- Crear el dashboard con estadísticas
- Implementar navegación completa
- Cards informativos

#### Tareas:

**1. Dashboard Principal (`/admin/page.tsx`)**
- [ ] Componente `<StatsCard>` reutilizable
- [ ] Grid de estadísticas:
  - Total de platos
  - Total de categorías
  - Platos por categoría
  - Última actualización
- [ ] Sección "Accesos Rápidos"
- [ ] Lista de "Últimas Modificaciones" (mock)

**2. Componente Sidebar**
- [ ] Navegación con íconos:
  - 🏠 Dashboard
  - 🍽️ Gestión del Menú
  - 📂 Categorías
  - ⚙️ Configuración
  - 🚪 Cerrar Sesión
- [ ] Indicador de página activa
- [ ] Animaciones de hover
- [ ] Logo del restaurante en la parte superior

**3. Componente Admin Header**
- [ ] Breadcrumbs dinámicos
- [ ] Botón de menú móvil
- [ ] Avatar del usuario
- [ ] Dropdown con opciones:
  - Perfil
  - Configuración
  - Cerrar sesión

**Entregables:**
- ✅ Dashboard funcional con estadísticas mock
- ✅ Navegación completa implementada
- ✅ UI responsive y pulida

---

### 🍽️ SPRINT 2: Gestión del Menú - Listado y Visualización (1 semana)

#### Objetivos:
- Crear la vista de listado de platos
- Implementar filtros y búsqueda
- Acciones básicas (ver, editar, eliminar)

#### Tareas:

**1. Página de Listado de Platos (`/admin/menu/page.tsx`)**
- [ ] Tabla con columnas:
  - Imagen (thumbnail)
  - Nombre
  - Categoría
  - Precio
  - Tags
  - Estado (activo/inactivo)
  - Acciones
- [ ] Botón "Agregar Nuevo Plato"
- [ ] Componente `<MenuTable>` reutilizable

**2. Filtros y Búsqueda**
- [ ] Barra de búsqueda en tiempo real
- [ ] Filtro por categoría (dropdown)
- [ ] Filtro por tags (checkboxes)
- [ ] Filtro por estado (activo/inactivo)
- [ ] Botón "Limpiar filtros"

**3. Acciones de Platos**
- [ ] Botón "Ver" → Modal con detalles completos
- [ ] Botón "Editar" → Redirige a página de edición
- [ ] Botón "Eliminar" → Alert dialog de confirmación
- [ ] Switch rápido para activar/desactivar plato

**4. Componentes Específicos**
- [ ] `<DishCard>` para vista de tarjeta (alternativa a tabla)
- [ ] `<DishDetailsModal>` para preview
- [ ] `<DeleteConfirmDialog>` reutilizable

**5. Estados y Manejo de Datos**
- [ ] Hook `useDishes()` para obtener datos (mock inicial)
- [ ] Estado de carga (skeleton loaders)
- [ ] Estado vacío (empty state)
- [ ] Paginación o scroll infinito

**Entregables:**
- ✅ Listado completo de platos
- ✅ Filtros funcionales
- ✅ Acciones de visualización y eliminación
- ✅ UX pulida con estados de carga

---

### ✏️ SPRINT 3: Gestión del Menú - Crear y Editar Platos (1-2 semanas)

#### Objetivos:
- Formulario completo para crear platos
- Formulario de edición de platos
- Validación de datos

#### Tareas:

**1. Formulario de Creación (`/admin/menu/new/page.tsx`)**
- [ ] Componente `<DishForm>` reutilizable
- [ ] Campos del formulario:
  - **Nombre** (input text, requerido)
  - **Descripción** (textarea, requerido)
  - **Precio** (input number, requerido)
  - **Categoría** (select, requerido)
  - **Tags** (checkboxes múltiples)
    - Vegetariano
    - Vegano
    - Sin gluten
    - Picante
    - Recomendado
  - **Estado** (switch activo/inactivo)
  - **Imagen** (file upload)

**2. Upload de Imágenes**
- [ ] Componente `<ImageUploader>`
- [ ] Drag & drop de imágenes
- [ ] Preview de imagen antes de subir
- [ ] Validación de formato (jpg, png, webp)
- [ ] Validación de tamaño (max 5MB)
- [ ] Crop/resize opcional (react-image-crop)
- [ ] Placeholder si no hay imagen

**3. Validación de Formulario**
- [ ] Instalar `react-hook-form` + `zod`
- [ ] Schema de validación con Zod
- [ ] Mensajes de error en español
- [ ] Validación en tiempo real
- [ ] Disabled submit si hay errores

**4. Página de Edición (`/admin/menu/[id]/edit/page.tsx`)**
- [ ] Reutilizar `<DishForm>` con datos precargados
- [ ] Cargar datos del plato por ID
- [ ] Preview de imagen actual
- [ ] Opción "Cambiar imagen"
- [ ] Botón "Cancelar" → volver al listado
- [ ] Botón "Guardar cambios"

**5. Feedback al Usuario**
- [ ] Toast de éxito al crear plato
- [ ] Toast de éxito al editar plato
- [ ] Toast de error si falla la operación
- [ ] Loading state durante el submit
- [ ] Redirección automática tras guardar

**Entregables:**
- ✅ Formulario completo de creación
- ✅ Formulario de edición funcional
- ✅ Upload de imágenes operativo
- ✅ Validación robusta
- ✅ Feedback claro al usuario

---

### 📂 SPRINT 4: Gestión de Categorías (3-5 días)

#### Objetivos:
- CRUD completo de categorías
- Reordenamiento drag & drop
- Asignación de imágenes a categorías

#### Tareas:

**1. Página de Categorías (`/admin/categories/page.tsx`)**
- [ ] Lista de categorías actuales
- [ ] Botón "Agregar Categoría"
- [ ] Contador de platos por categoría

**2. CRUD de Categorías**
- [ ] Modal/Dialog para crear categoría
  - Nombre (input)
  - Descripción opcional (textarea)
  - Icono o emoji (selector)
- [ ] Editar categoría inline o en modal
- [ ] Eliminar categoría (con validación):
  - No permitir si tiene platos asignados
  - O mover platos a otra categoría primero

**3. Reordenamiento**
- [ ] Instalar `@dnd-kit/core` o `react-beautiful-dnd`
- [ ] Drag & drop para reordenar
- [ ] Guardar nuevo orden
- [ ] Indicador visual durante el drag

**4. Validaciones**
- [ ] No permitir categorías duplicadas
- [ ] Nombre requerido
- [ ] Confirmación antes de eliminar

**Entregables:**
- ✅ CRUD completo de categorías
- ✅ Drag & drop funcional
- ✅ Validaciones implementadas

---

### ⚙️ SPRINT 5: Configuración General (1 semana)

#### Objetivos:
- Editar información de contacto
- Gestionar logo y branding
- Configurar redes sociales

#### Tareas:

**1. Página Principal de Configuración (`/admin/settings/page.tsx`)**
- [ ] Cards con accesos a subsecciones:
  - 📇 Información de Contacto
  - 🎨 Logo y Branding
  - 📱 Redes Sociales
  - 📄 Contenido de Páginas

**2. Información de Contacto (`/admin/settings/contact/page.tsx`)**
- [ ] Formulario con campos:
  - Dirección completa
  - Teléfono(s) (múltiples)
  - Email de contacto
  - Horarios de atención (por día)
  - Días de cierre
- [ ] Validación de email y teléfono
- [ ] Preview en vivo (opcional)

**3. Logo y Branding (`/admin/settings/branding/page.tsx`)**
- [ ] Upload de logo principal
- [ ] Upload de favicon
- [ ] Preview del logo en header
- [ ] Soporte PNG/SVG/JPG
- [ ] Opción de restaurar logo por defecto

**4. Redes Sociales**
- [ ] Formulario con campos:
  - URL de Instagram
  - URL de Facebook
  - URL de WhatsApp
  - URL de Twitter/X (opcional)
  - URL de TikTok (opcional)
- [ ] Validación de URLs
- [ ] Toggle para activar/desactivar cada red
- [ ] Preview de iconos

**5. Contenido de Páginas (Avanzado)**
- [ ] Editor de texto enriquecido (Tiptap o Quill)
- [ ] Editar "Sobre Nosotros"
- [ ] Editar "Nuestra Historia"
- [ ] Upload de imágenes para la sección About

**Entregables:**
- ✅ Configuración de contacto completa
- ✅ Gestión de branding funcional
- ✅ Redes sociales configurables
- ✅ (Opcional) Editor de contenido

---

### 🔐 SPRINT 6: Autenticación Real y Seguridad (1 semana)

#### Objetivos:
- Implementar autenticación real
- Conectar con backend
- Asegurar rutas y tokens

#### Tareas:

**1. Integración con NextAuth.js**
- [ ] Instalar `next-auth`
- [ ] Configurar provider (Credentials)
- [ ] Crear endpoint API `/api/auth/[...nextauth]`
- [ ] Configurar JWT o sessions

**2. Login Real**
- [ ] Conectar formulario de login con API
- [ ] Almacenar token JWT
- [ ] Redirigir al dashboard tras login
- [ ] Manejar errores de autenticación

**3. Protección de Rutas**
- [ ] Middleware de Next.js para `/admin/*`
- [ ] Verificar token en cada request
- [ ] Redirigir a login si no autenticado
- [ ] Hook `useSession()` para obtener datos del usuario

**4. Logout**
- [ ] Botón de logout funcional
- [ ] Limpiar token/sesión
- [ ] Redirigir a página principal

**5. Roles y Permisos (Opcional)**
- [ ] Implementar sistema de roles (Admin, Editor)
- [ ] Restringir acciones según rol
- [ ] Mostrar/ocultar opciones según permisos

**Entregables:**
- ✅ Login con backend real
- ✅ Rutas protegidas correctamente
- ✅ Logout funcional
- ✅ Manejo de sesiones seguro

---

### 🔗 SPRINT 7: Integración con Backend (1-2 semanas)

#### Objetivos:
- Conectar todas las operaciones CRUD con la API
- Reemplazar datos mock con datos reales
- Manejo de errores y estados

#### Tareas:

**1. Configuración de API Client**
- [ ] Crear archivo `/src/lib/api-client.ts`
- [ ] Configurar Axios o Fetch con interceptores
- [ ] Agregar token JWT en headers
- [ ] Manejo de errores global

**2. Servicios de Platos**
- [ ] `GET /api/dishes` → Listar platos
- [ ] `GET /api/dishes/:id` → Obtener plato
- [ ] `POST /api/dishes` → Crear plato
- [ ] `PUT /api/dishes/:id` → Actualizar plato
- [ ] `DELETE /api/dishes/:id` → Eliminar plato
- [ ] Hook `useDishes()` con React Query o SWR

**3. Servicios de Categorías**
- [ ] `GET /api/categories` → Listar categorías
- [ ] `POST /api/categories` → Crear categoría
- [ ] `PUT /api/categories/:id` → Actualizar categoría
- [ ] `DELETE /api/categories/:id` → Eliminar categoría
- [ ] `PUT /api/categories/reorder` → Reordenar

**4. Upload de Imágenes**
- [ ] `POST /api/upload` → Subir imagen
- [ ] Configurar Cloudinary, AWS S3, o storage local
- [ ] Retornar URL de la imagen
- [ ] Eliminar imágenes no utilizadas

**5. Configuración General**
- [ ] `GET /api/settings` → Obtener configuración
- [ ] `PUT /api/settings` → Actualizar configuración
- [ ] Cache de configuración en frontend

**6. Optimizaciones**
- [ ] Implementar React Query para caching
- [ ] Optimistic updates (actualización instantánea)
- [ ] Revalidación automática
- [ ] Infinite scroll o paginación

**Entregables:**
- ✅ Todas las operaciones conectadas con backend
- ✅ Sin datos mock
- ✅ Manejo robusto de errores
- ✅ Performance optimizada

---

### 🎨 SPRINT 8: Polish y Mejoras de UX (3-5 días)

#### Objetivos:
- Pulir la interfaz
- Mejorar animaciones y transiciones
- Accesibilidad y responsive design

#### Tareas:

**1. Animaciones y Microinteracciones**
- [ ] Transiciones suaves entre páginas
- [ ] Animaciones de hover en botones
- [ ] Loading skeletons personalizados
- [ ] Feedback visual en acciones (escalado, color)

**2. Responsive Design**
- [ ] Verificar todas las vistas en móvil
- [ ] Sidebar colapsable en tablet/móvil
- [ ] Tablas responsive (scroll horizontal o cards)
- [ ] Formularios adaptados a pantallas pequeñas

**3. Accesibilidad**
- [ ] Labels correctos en formularios
- [ ] Navegación por teclado
- [ ] Focus visible en elementos
- [ ] Alt text en imágenes
- [ ] ARIA labels donde sea necesario

**4. Mensajes de Confirmación**
- [ ] Confirmaciones antes de eliminar
- [ ] Advertencias si hay cambios sin guardar
- [ ] Tooltips informativos

**5. Dark Mode (Opcional)**
- [ ] Toggle de dark mode en header
- [ ] Persistir preferencia en localStorage
- [ ] Ajustar colores para ambos temas

**Entregables:**
- ✅ UI pulida y profesional
- ✅ Responsive en todos los dispositivos
- ✅ Accesibilidad mejorada
- ✅ Animaciones sutiles y agradables

---

### 🧪 SPRINT 9: Testing y QA (1 semana)

#### Objetivos:
- Testing de componentes
- Testing de integración
- Corregir bugs

#### Tareas:

**1. Testing de Componentes**
- [ ] Instalar Jest + React Testing Library
- [ ] Tests para componentes críticos:
  - `<DishForm>`
  - `<DishTable>`
  - `<ImageUploader>`
  - `<Sidebar>`
- [ ] Snapshot tests para UI estable

**2. Testing de Flujos**
- [ ] Flujo completo de crear plato
- [ ] Flujo de editar plato
- [ ] Flujo de eliminar plato
- [ ] Flujo de login/logout

**3. Testing de Validaciones**
- [ ] Validación de formularios
- [ ] Manejo de errores de API
- [ ] Estados de carga

**4. QA Manual**
- [ ] Checklist de funcionalidades
- [ ] Testing en diferentes navegadores
- [ ] Testing en diferentes dispositivos
- [ ] Verificar accesibilidad

**5. Corrección de Bugs**
- [ ] Documentar bugs encontrados
- [ ] Priorizar y corregir
- [ ] Re-testear

**Entregables:**
- ✅ Suite de tests implementada
- ✅ Bugs críticos corregidos
- ✅ QA completo realizado

---

### 🚀 SPRINT 10: Deploy y Documentación (3 días)

#### Objetivos:
- Desplegar en producción
- Documentar el sistema
- Capacitación

#### Tareas:

**1. Deploy**
- [ ] Configurar variables de entorno de producción
- [ ] Deploy en Vercel/Netlify
- [ ] Verificar que todo funciona en producción
- [ ] Configurar dominio personalizado

**2. Documentación**
- [ ] README del proyecto actualizado
- [ ] Guía de instalación
- [ ] Guía de uso del panel admin
- [ ] Documentación de componentes

**3. Manual de Usuario**
- [ ] PDF o wiki con instrucciones
- [ ] Screenshots de cada sección
- [ ] Guía paso a paso para:
  - Agregar un plato
  - Editar categorías
  - Cambiar configuración

**4. Capacitación**
- [ ] Video tutorial (opcional)
- [ ] Sesión de entrenamiento para administradores

**Entregables:**
- ✅ Panel admin en producción
- ✅ Documentación completa
- ✅ Manual de usuario entregado

---

## 📦 TECNOLOGÍAS Y LIBRERÍAS NECESARIAS

### Core
- ✅ Next.js 15
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS

### UI Components
- ✅ shadcn/ui (ya instalado)
- [ ] Lucide React (iconos)
- [ ] @dnd-kit/core (drag & drop)
- [ ] react-image-crop (crop de imágenes)

### Forms & Validation
- [ ] react-hook-form
- [ ] zod

### Autenticación
- [ ] next-auth

### Data Fetching
- [ ] @tanstack/react-query (React Query)
- [ ] axios

### Editores
- [ ] @tiptap/react (editor de texto rico)

### Testing
- [ ] jest
- [ ] @testing-library/react
- [ ] @testing-library/jest-dom

---

## 📅 CRONOGRAMA ESTIMADO

| Sprint | Duración | Fechas Estimadas |
|--------|----------|------------------|
| Sprint 0 | 3-5 días | Semana 1 |
| Sprint 1 | 1 semana | Semana 1-2 |
| Sprint 2 | 1 semana | Semana 2-3 |
| Sprint 3 | 1-2 semanas | Semana 3-5 |
| Sprint 4 | 3-5 días | Semana 5 |
| Sprint 5 | 1 semana | Semana 5-6 |
| Sprint 6 | 1 semana | Semana 6-7 |
| Sprint 7 | 1-2 semanas | Semana 7-9 |
| Sprint 8 | 3-5 días | Semana 9 |
| Sprint 9 | 1 semana | Semana 9-10 |
| Sprint 10 | 3 días | Semana 10 |

**Tiempo total estimado**: 10-12 semanas (2.5-3 meses)

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Para cada Sprint:
- [ ] Todos los componentes renderizados correctamente
- [ ] Sin errores en consola
- [ ] Responsive en móvil, tablet y desktop
- [ ] Código limpio y comentado
- [ ] Commits descriptivos en Git

### Para el Proyecto Completo:
- [ ] CRUD completo de platos funcional
- [ ] CRUD completo de categorías funcional
- [ ] Upload de imágenes operativo
- [ ] Autenticación segura implementada
- [ ] Todas las rutas protegidas correctamente
- [ ] Configuración general editable
- [ ] UI profesional y pulida
- [ ] Performance óptima (Lighthouse >90)
- [ ] Sin bugs críticos
- [ ] Documentación completa

---

## 🎯 PRIORIDADES

### 🔴 Alta Prioridad (MVP)
1. Sprint 0: Estructura base
2. Sprint 1: Dashboard
3. Sprint 2: Listado de platos
4. Sprint 3: Crear/Editar platos
5. Sprint 6: Autenticación real

### 🟡 Media Prioridad
6. Sprint 4: Gestión de categorías
7. Sprint 7: Integración completa con backend
8. Sprint 8: Polish y UX

### 🟢 Baja Prioridad (Nice to Have)
9. Sprint 5: Configuración avanzada
10. Sprint 9: Testing exhaustivo
11. Dark mode
12. Analytics

---

## 📝 NOTAS IMPORTANTES

1. **Desarrollo Iterativo**: Cada sprint debe resultar en funcionalidad deployable
2. **Testing Continuo**: Probar manualmente después de cada funcionalidad
3. **Commits Frecuentes**: Hacer commits pequeños y descriptivos
4. **Code Reviews**: Si es posible, revisar código antes de merge
5. **Backup**: Mantener backups regulares de la base de datos
6. **Documentación**: Documentar decisiones importantes

---

## 🔄 SIGUIENTES PASOS INMEDIATOS

### Esta Semana:
1. [ ] Revisar y aprobar este plan de trabajo
2. [ ] Comenzar Sprint 0: Crear estructura de carpetas
3. [ ] Instalar dependencias necesarias para Sprint 0-1
4. [ ] Crear layout del admin panel
5. [ ] Implementar login básico (mock)

### Próxima Semana:
1. [ ] Completar Sprint 1: Dashboard principal
2. [ ] Iniciar Sprint 2: Listado de platos

---



## 📋 FASE 1: SISTEMA DE ADMINISTRACIÓN (Prioridad Alta)

### 🔐 Panel de Administración

#### 1.1 Autenticación y Seguridad
- [ ] Sistema de login para administradores
- [ ] Autenticación con JWT o NextAuth.js
- [ ] Roles de usuario (Admin, Editor)
- [ ] Recuperación de contraseña
- [ ] Sesiones seguras con tokens
- [ ] Protección de rutas administrativas

#### 1.2 Gestión del Menú
- [ ] **CRUD completo de categorías**
  - Crear nuevas categorías (ej: "Bebidas Calientes", "Entradas")
  - Editar nombres de categorías existentes
  - Eliminar categorías (con confirmación)
  - Reordenar categorías (drag & drop)
  
- [ ] **CRUD completo de platos**
  - Crear nuevos platos con formulario
  - Editar información de platos existentes:
    - Nombre del plato
    - Descripción
    - Precio (S/)
    - Categoría asignada
    - Tags (vegetariano, vegano, sin gluten, etc.)
    - Estado (activo/inactivo)
  - Eliminar platos (con confirmación)
  - Duplicar platos para agilizar creación

- [ ] **Gestión de imágenes de platos**
  - Subir imágenes desde el panel
  - Optimización automática de imágenes
  - Previsualización antes de guardar
  - Galería de imágenes subidas
  - Cambiar imagen de un plato
  - Eliminar imágenes no utilizadas

#### 1.3 Configuración Global del Sitio
- [ ] **Logo y Branding**
  - Cambiar logo del restaurante
  - Previsualización en tiempo real
  - Soporte para PNG/SVG/JPG
  - Favicon personalizado

- [ ] **Información de Contacto**
  - Editar dirección del restaurante
  - Cambiar número(s) de teléfono
  - Actualizar email de contacto
  - Modificar horarios de atención
  - Días de cierre

- [ ] **Redes Sociales**
  - Editar URL de Instagram
  - Editar URL de Facebook
  - Agregar más redes (Twitter, TikTok, WhatsApp)
  - Activar/desactivar redes sociales
  - Reordenar iconos de redes

- [ ] **Contenido de Páginas**
  - Editar texto de "Sobre Nosotros"
  - Modificar historia del restaurante
  - Actualizar filosofía
  - Editar descripción del equipo
  - Cambiar imágenes de sección "About"

#### 1.4 Dashboard Administrativo
- [ ] Panel principal con estadísticas
- [ ] Número total de platos por categoría
- [ ] Platos más populares (si hay analytics)
- [ ] Últimas modificaciones realizadas
- [ ] Accesos rápidos a secciones principales

---

## 🖥️ FASE 2: BACKEND API (Prioridad Alta)

### 2.1 Configuración del Proyecto Backend
- [ ] **Crear nuevo repositorio**: `sabor-y-tradicion-backend`
- [ ] **Stack tecnológico sugerido**:
  - Node.js + Express.js (REST API)
  - O NestJS (más estructurado)
  - O tRPC + Next.js API Routes (si quieres todo en uno)
  
- [ ] **Base de datos**:
  - PostgreSQL (recomendado) o MongoDB
  - Prisma ORM (TypeScript-first)
  - O Drizzle ORM (alternativa moderna)

- [ ] **Hosting sugerido**:
  - Railway.app (fácil, económico)
  - Render.com (gratis para empezar)
  - AWS RDS + EC2
  - Vercel Postgres (si usas Next.js API)

### 2.2 Endpoints de la API

#### Autenticación
```
POST   /api/auth/login          - Login de administrador
POST   /api/auth/logout         - Logout
POST   /api/auth/refresh        - Refresh token
POST   /api/auth/forgot-password - Recuperar contraseña
```

#### Categorías
```
GET    /api/categories          - Listar todas las categorías
GET    /api/categories/:id      - Obtener una categoría
POST   /api/categories          - Crear categoría (admin)
PUT    /api/categories/:id      - Actualizar categoría (admin)
DELETE /api/categories/:id      - Eliminar categoría (admin)
PATCH  /api/categories/reorder  - Reordenar categorías (admin)
```

#### Platos (Menu Items)
```
GET    /api/menu                - Listar todos los platos (público)
GET    /api/menu/:id            - Obtener un plato (público)
GET    /api/menu/category/:id   - Platos por categoría (público)
POST   /api/menu                - Crear plato (admin)
PUT    /api/menu/:id            - Actualizar plato (admin)
DELETE /api/menu/:id            - Eliminar plato (admin)
PATCH  /api/menu/:id/status     - Activar/desactivar plato (admin)
```

#### Imágenes
```
POST   /api/upload/image        - Subir imagen (admin)
DELETE /api/upload/image/:id    - Eliminar imagen (admin)
GET    /api/images              - Listar imágenes subidas (admin)
```

#### Configuración Global
```
GET    /api/settings            - Obtener configuración del sitio
PUT    /api/settings/logo       - Actualizar logo (admin)
PUT    /api/settings/contact    - Actualizar info de contacto (admin)
PUT    /api/settings/social     - Actualizar redes sociales (admin)
PUT    /api/settings/hours      - Actualizar horarios (admin)
```

#### Páginas de Contenido
```
GET    /api/pages/about         - Obtener contenido de "Sobre Nosotros"
PUT    /api/pages/about         - Actualizar "Sobre Nosotros" (admin)
GET    /api/pages/home          - Obtener contenido del home
PUT    /api/pages/home          - Actualizar home (admin)
```

### 2.3 Características del Backend
- [ ] Validación de datos con Zod o Yup
- [ ] Manejo de errores centralizado
- [ ] Logging con Winston o Pino
- [ ] Rate limiting para seguridad
- [ ] CORS configurado correctamente
- [ ] Compresión de respuestas (gzip)
- [ ] Documentación con Swagger/OpenAPI
- [ ] Tests unitarios (Jest)
- [ ] Tests de integración

### 2.4 Almacenamiento de Imágenes
- [ ] **Opción 1**: Cloudinary (recomendado, gratis hasta 25GB)
- [ ] **Opción 2**: AWS S3
- [ ] **Opción 3**: Vercel Blob Storage
- [ ] **Opción 4**: UploadThing (Next.js friendly)
- [ ] Optimización automática de imágenes
- [ ] Generación de thumbnails
- [ ] Lazy loading de imágenes

---

## 📱 FASE 3: INTEGRACIÓN FRONTEND-BACKEND (Prioridad Media)

### 3.1 Actualizar Frontend para Consumir API
- [ ] Crear cliente HTTP (Axios o Fetch API)
- [ ] Implementar React Query o SWR para cache
- [ ] Crear custom hooks para llamadas API
- [ ] Manejar estados de loading
- [ ] Manejar errores de red
- [ ] Implementar retry logic
- [ ] Optimistic updates en el UI

### 3.2 Rutas Administrativas en Frontend
```
/admin                          - Dashboard principal
/admin/login                    - Página de login
/admin/menu                     - Gestión del menú
/admin/menu/create              - Crear plato
/admin/menu/edit/:id            - Editar plato
/admin/categories               - Gestión de categorías
/admin/settings                 - Configuración global
/admin/settings/logo            - Cambiar logo
/admin/settings/contact         - Info de contacto
/admin/settings/social          - Redes sociales
/admin/content                  - Editar contenido de páginas
/admin/images                   - Galería de imágenes
```

### 3.3 Componentes Administrativos
- [ ] Layout de administrador (diferente al público)
- [ ] Sidebar con navegación
- [ ] Formularios con validación
- [ ] Tablas con paginación y búsqueda
- [ ] Modales de confirmación
- [ ] Editor WYSIWYG para textos largos
- [ ] Drag & drop para imágenes
- [ ] Notificaciones (toast) de éxito/error

---

## 🎨 FASE 4: MEJORAS VISUALES Y UX (Prioridad Media-Baja)

### 4.1 Frontend Público
- [ ] Animaciones de scroll reveal (AOS o Framer Motion)
- [ ] Skeleton loaders mientras carga contenido
- [ ] Lightbox para imágenes del menú
- [ ] Filtros en el menú (por tags, precio, etc.)
- [ ] Buscador de platos
- [ ] Botón "Scroll to top"
- [ ] Modo oscuro (opcional)
- [ ] Internacionalización (español/inglés)
- [ ] PWA (Progressive Web App)
- [ ] Compartir platos en redes sociales

### 4.2 Panel de Administración
- [ ] Tema oscuro/claro
- [ ] Atajos de teclado
- [ ] Drag & drop para reordenar
- [ ] Previsualización en tiempo real
- [ ] Deshacer cambios
- [ ] Historial de modificaciones
- [ ] Exportar menú a PDF
- [ ] Bulk actions (editar varios platos a la vez)

---

## 📊 FASE 5: ANALYTICS Y SEO (Prioridad Baja)

### 5.1 Analytics
- [ ] Integrar Google Analytics 4
- [ ] Vercel Analytics
- [ ] Tracking de eventos (clicks en menú, contacto, etc.)
- [ ] Heatmaps con Hotjar o Microsoft Clarity
- [ ] Dashboard interno de estadísticas

### 5.2 SEO Avanzado
- [ ] Sitemap dinámico
- [ ] Robots.txt optimizado
- [ ] Schema.org markup para restaurantes
- [ ] Rich snippets para platos
- [ ] Meta tags dinámicos por página
- [ ] Open Graph images dinámicas
- [ ] Core Web Vitals optimizados

---

## 🔧 FASE 6: FUNCIONALIDADES ADICIONALES (Futuro)

### 6.1 Sistema de Reservas (Opcional)
- [ ] Formulario de reservas
- [ ] Calendario de disponibilidad
- [ ] Confirmación por email
- [ ] Gestión de reservas en admin
- [ ] Recordatorios automáticos

### 6.2 Sistema de Pedidos Online (Opcional)
- [ ] Carrito de compras
- [ ] Integración con pasarelas de pago
- [ ] Tracking de pedidos
- [ ] Notificaciones en tiempo real
- [ ] Gestión de pedidos en admin

### 6.3 Blog (Opcional)
- [ ] Sección de noticias/eventos
- [ ] CRUD de artículos en admin
- [ ] Categorías de blog
- [ ] Comentarios (opcional)

### 6.4 Newsletter (Opcional)
- [ ] Formulario de suscripción
- [ ] Integración con Mailchimp o SendGrid
- [ ] Envío de newsletters desde admin
- [ ] Gestión de suscriptores

---

## 💡 SUGERENCIAS DEL DESARROLLADOR

### Para el Panel de Administración

#### 🎨 UI/UX Recomendado
1. **Framework de UI**: Usar **Shadcn UI** (ya lo tienes) + **Radix UI**
2. **Tablas avanzadas**: **TanStack Table** (react-table v8)
3. **Formularios**: **React Hook Form** + **Zod** para validación
4. **Editor de texto**: **Tiptap** o **Lexical** (WYSIWYG moderno)
5. **Drag & Drop**: **dnd-kit** (accesible y performante)
6. **Date Picker**: **date-fns** + componente de Shadcn
7. **Notificaciones**: Ya tienes toast, perfecto ✅

#### 🔐 Seguridad Recomendada
1. **Autenticación**: **NextAuth.js** con Credentials + JWT
2. **Middleware**: Proteger todas las rutas `/admin/*`
3. **Validación**: Validar en frontend Y backend (doble validación)
4. **Rate Limiting**: Limitar intentos de login
5. **HTTPS**: Solo en producción (obligatorio)
6. **Environment Variables**: Nunca exponer secrets en frontend

#### 📦 Estructura de Carpetas Sugerida (Backend)
```
sabor-y-tradicion-backend/
├── src/
│   ├── config/              # Configuración (DB, JWT, etc.)
│   ├── controllers/         # Lógica de los endpoints
│   ├── middlewares/         # Auth, validation, error handling
│   ├── models/              # Modelos de base de datos (Prisma)
│   ├── routes/              # Definición de rutas
│   ├── services/            # Lógica de negocio
│   ├── utils/               # Funciones helper
│   └── validators/          # Schemas de validación (Zod)
├── prisma/
│   └── schema.prisma        # Schema de la base de datos
├── uploads/                 # Carpeta temporal para uploads
├── .env                     # Variables de entorno
├── .env.example             # Ejemplo de variables
└── package.json
```

#### 🗄️ Modelo de Base de Datos Sugerido

```prisma
// prisma/schema.prisma

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hasheado con bcrypt
  name      String
  role      Role     @default(EDITOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  EDITOR
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  order       Int        @default(0)
  isActive    Boolean    @default(true)
  menuItems   MenuItem[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model MenuItem {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Decimal  @db.Decimal(10, 2)
  imageUrl    String?
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  categoryId  String
  tags        Tag[]
  isActive    Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Tag {
  id        String     @id @default(cuid())
  name      String     @unique
  menuItems MenuItem[]
}

model Settings {
  id              String   @id @default(cuid())
  key             String   @unique  // 'logo', 'phone', 'email', etc.
  value           String   @db.Text
  updatedAt       DateTime @updatedAt
}

model PageContent {
  id        String   @id @default(cuid())
  page      String   @unique  // 'about', 'home', etc.
  section   String              // 'hero', 'history', 'philosophy'
  content   String   @db.Text
  updatedAt DateTime @updatedAt
}
```

#### 🚀 Stack Tecnológico Recomendado

**Backend**:
- ✅ **Runtime**: Node.js 20 LTS
- ✅ **Framework**: Express.js o NestJS
- ✅ **ORM**: Prisma (TypeScript-first, migraciones fáciles)
- ✅ **Base de Datos**: PostgreSQL 15+ (robusto, escalable)
- ✅ **Validación**: Zod (TypeScript native)
- ✅ **Auth**: JWT + bcrypt
- ✅ **Upload**: Multer + Cloudinary
- ✅ **Testing**: Jest + Supertest

**Frontend Admin**:
- ✅ **Framework**: Next.js 14 (ya lo tienes)
- ✅ **Forms**: React Hook Form + Zod
- ✅ **Tables**: TanStack Table
- ✅ **HTTP Client**: Axios + React Query
- ✅ **Editor**: Tiptap (rich text)

**DevOps**:
- ✅ **Hosting Frontend**: Vercel (ya configurado)
- ✅ **Hosting Backend**: Railway o Render
- ✅ **Base de Datos**: Railway Postgres o Neon.tech (serverless)
- ✅ **Imágenes**: Cloudinary
- ✅ **CI/CD**: GitHub Actions

---

## 🎯 PLAN DE IMPLEMENTACIÓN SUGERIDO

### Sprint 1 (1-2 semanas)
1. Crear repositorio backend
2. Configurar base de datos (PostgreSQL + Prisma)
3. Implementar autenticación básica
4. CRUD de categorías (backend + frontend)

### Sprint 2 (1-2 semanas)
5. CRUD completo de platos (menu items)
6. Sistema de upload de imágenes
7. Integración frontend-backend del menú

### Sprint 3 (1-2 semanas)
8. Panel de configuración global
9. Edición de logo, contacto y redes sociales
10. Gestión de contenido de páginas

### Sprint 4 (1 semana)
11. Testing y bug fixes
12. Optimizaciones de rendimiento
13. Deploy del backend
14. Documentación final

---

## 📚 RECURSOS ÚTILES

### Tutoriales y Docs
- **Prisma ORM**: https://www.prisma.io/docs
- **NextAuth.js**: https://next-auth.js.org
- **React Hook Form**: https://react-hook-form.com
- **TanStack Table**: https://tanstack.com/table
- **Cloudinary**: https://cloudinary.com/documentation
- **Tiptap Editor**: https://tiptap.dev

### Templates de Inspiración
- **Refine Admin**: https://refine.dev (framework de admin panels)
- **AdminJS**: https://adminjs.co
- **React Admin**: https://marmelab.com/react-admin

---

## 📝 NOTAS FINALES

### Estimación de Tiempo
- **Backend básico**: 2-3 semanas
- **Panel de admin básico**: 2-3 semanas
- **Integración completa**: 1 semana
- **Testing y deploy**: 1 semana
- **Total estimado**: 6-8 semanas (1.5-2 meses)

### Estimación de Costos (Mensual)
- **Vercel Frontend**: Gratis (Hobby plan) ✅
- **Railway Backend**: $5-10/mes (si supera el plan gratis)
- **Base de datos**: Incluida en Railway o $5/mes en Neon.tech
- **Cloudinary**: Gratis hasta 25GB ✅
- **Dominio**: $10-15/año
- **Total**: ~$15-20/mes (después del plan gratis)

### Prioridades Recomendadas
1. 🔥 **Fase 1**: Panel de admin (CRUD menú)
2. 🔥 **Fase 2**: Backend API
3. 🔥 **Fase 3**: Integración
4. 📊 **Fase 4**: Mejoras visuales
5. 🎨 **Fase 5**: Analytics
6. 💡 **Fase 6**: Funcionalidades extra (cuando se necesiten)

---

## ✅ CHECKLIST DE INICIO

Antes de empezar con el backend:
- [ ] Definir hosting de backend (Railway recomendado)
- [ ] Crear cuenta en Cloudinary para imágenes
- [ ] Decidir si usar PostgreSQL o MongoDB
- [ ] Configurar dominio personalizado (opcional)
- [ ] Crear nuevo repositorio en GitHub para backend
- [ ] Instalar herramientas: PostgreSQL local, Prisma CLI
- [ ] Leer documentación de Prisma y NextAuth.js

---

**Siguiente paso recomendado**: Crear el repositorio `sabor-y-tradicion-backend` y configurar la estructura básica con Express + Prisma + PostgreSQL.

¿Quieres que te ayude a crear el setup inicial del backend? 🚀

---

**Creado por**: Asistente de Desarrollo  
**Fecha**: 24 de Diciembre, 2025  
**Proyecto**: Sabor y Tradición - Restaurante Chachapoyana  
**Estado**: Roadmap v1.0 📋
