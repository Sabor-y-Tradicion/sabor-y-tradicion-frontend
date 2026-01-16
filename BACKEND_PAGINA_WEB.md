# Backend - Gestión de Página Web (Inicio y Sobre Nosotros)

## 📋 Resumen

Este documento detalla los cambios necesarios en el backend para soportar la gestión completa de la página web (secciones Inicio y Sobre Nosotros) desde el panel de administración.

---

## 🗄️ 1. Modelo de Base de Datos (Prisma)

### Actualizar modelo `Tenant`

```prisma
model Tenant {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  domain          String    @unique
  customDomain    String?   @unique
  email           String
  plan            String    @default("free")
  status          String    @default("active")
  
  // Settings existentes (Restaurante, Redes Sociales, etc.)
  settings        Json      @default("{}")
  
  // NUEVO: Contenido de la página web
  webContent      Json      @default("{}")
  
  // NUEVO: Galería de imágenes
  mediaGallery    Media[]
  
  // ... resto de relaciones existentes
  users           User[]
  categories      Category[]
  dishes          Dish[]
  orders          Order[]
  subtags         Subtag[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// NUEVO: Modelo para gestionar multimedia
model Media {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  type        String   // "image" | "video"
  url         String
  filename    String
  alt         String?
  caption     String?
  
  // Metadata
  size        Int      // tamaño en bytes
  mimeType    String
  width       Int?
  height      Int?
  
  // Organización
  section     String?  // "hero" | "features" | "about" | "gallery"
  order       Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([tenantId])
  @@index([section])
}
```

### Ejecutar migración

```bash
npx prisma migrate dev --name add_web_content_and_media
npx prisma generate
```

---

## 📊 2. Estructura del campo `webContent` (JSON)

El campo `webContent` contendrá toda la información editable de la página web:

```typescript
interface WebContent {
  // SECCIÓN: INICIO
  home: {
    // Hero Section
    hero: {
      title: string;           // "Bienvenidos a Sabor y Tradición"
      subtitle: string;        // "Descubre los mejores sabores de nuestra cocina"
      ctaText: string;         // "Ver Menú"
      ctaLink: string;         // "/menu"
      backgroundImage: string; // URL de la imagen
    };
    
    // Features/Beneficios (carrusel)
    features: Array<{
      id: string;              // uuid
      image: string;           // URL de la imagen
      title: string;           // "Ingredientes Frescos"
      description: string;     // "Usamos productos locales de calidad"
      order: number;           // orden en el carrusel
    }>;
    
    // CTA Section
    ctaSection: {
      title: string;           // "¿Listo para ordenar?"
      description: string;     // "Explora nuestro menú..."
      buttonText: string;      // "Ver Menú Completo"
      buttonLink: string;      // "/menu"
    };
  };
  
  // SECCIÓN: SOBRE NOSOTROS
  about: {
    // Sección principal
    main: {
      title: string;           // "Nuestra Historia"
      description: string;     // Texto largo con RichText
      image: string;           // URL de imagen principal
      imageAlt: string;        // Alt text de la imagen
    };
    
    // Sección de valores/misión
    values: {
      title: string;           // "Nuestros Valores"
      items: Array<{
        id: string;
        icon: string;          // nombre del icono
        title: string;         // "Calidad"
        description: string;   // "Comprometidos con..."
        order: number;
      }>;
    };
    
    // Galería de imágenes
    gallery: {
      enabled: boolean;
      title: string;           // "Nuestras Instalaciones"
      images: Array<{
        id: string;
        url: string;
        alt: string;
        caption: string;
        order: number;
      }>;
    };
  };
}
```

---

## 🛣️ 3. Endpoints Necesarios

### **A. Gestión de Contenido Web**

#### 1. Obtener contenido web actual

**GET** `/api/tenants/:tenantId/web-content`

**Headers:**
```
Authorization: Bearer <token>
X-Tenant-Domain: saborytradicion.james.pe
```

**Response:**
```json
{
  "success": true,
  "data": {
    "home": {
      "hero": {
        "title": "Bienvenidos a Sabor y Tradición",
        "subtitle": "Descubre los mejores sabores",
        "ctaText": "Ver Menú",
        "ctaLink": "/menu",
        "backgroundImage": "https://..."
      },
      "features": [
        {
          "id": "uuid-1",
          "image": "https://...",
          "title": "Ingredientes Frescos",
          "description": "Productos locales",
          "order": 1
        }
      ],
      "ctaSection": {
        "title": "¿Listo para ordenar?",
        "description": "...",
        "buttonText": "Ver Menú",
        "buttonLink": "/menu"
      }
    },
    "about": {
      "main": {
        "title": "Nuestra Historia",
        "description": "<p>Rich text HTML</p>",
        "image": "https://...",
        "imageAlt": "Restaurante"
      },
      "values": {
        "title": "Nuestros Valores",
        "items": [...]
      },
      "gallery": {
        "enabled": true,
        "title": "Galería",
        "images": [...]
      }
    }
  }
}
```

#### 2. Actualizar contenido de INICIO

**PATCH** `/api/tenants/:tenantId/web-content/home`

**Request Body:**
```json
{
  "section": "hero",
  "data": {
    "title": "Nuevo título",
    "subtitle": "Nuevo subtítulo",
    "ctaText": "Botón",
    "ctaLink": "/menu",
    "backgroundImage": "https://..."
  }
}
```

O para features:
```json
{
  "section": "features",
  "action": "add|update|delete|reorder",
  "data": {
    "id": "uuid",
    "image": "https://...",
    "title": "...",
    "description": "...",
    "order": 1
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "home": {
      // contenido actualizado completo
    }
  }
}
```

#### 3. Actualizar contenido de SOBRE NOSOTROS

**PATCH** `/api/tenants/:tenantId/web-content/about`

**Request Body:**
```json
{
  "section": "main",
  "data": {
    "title": "Nuestra Historia",
    "description": "<p>HTML content</p>",
    "image": "https://...",
    "imageAlt": "Alt text"
  }
}
```

**Response:** Similar al anterior

#### 4. Actualizar TODO el contenido web (bulk update)

**PUT** `/api/tenants/:tenantId/web-content`

**Request Body:**
```json
{
  "home": { /* todo el contenido de home */ },
  "about": { /* todo el contenido de about */ }
}
```

---

### **B. Gestión de Multimedia (Galería)**

#### 1. Listar imágenes del tenant

**GET** `/api/tenants/:tenantId/media`

**Query Parameters:**
- `section` (opcional): filtrar por sección (hero, features, about, gallery)
- `type` (opcional): image | video
- `limit`: número de resultados (default: 50)
- `page`: página actual (default: 1)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "media-id-1",
      "type": "image",
      "url": "https://storage.../image.jpg",
      "filename": "image.jpg",
      "alt": "Descripción",
      "caption": "Pie de foto",
      "size": 245678,
      "mimeType": "image/jpeg",
      "width": 1920,
      "height": 1080,
      "section": "hero",
      "order": 1,
      "createdAt": "2026-01-10T...",
      "updatedAt": "2026-01-10T..."
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  }
}
```

#### 2. Subir nueva imagen

**POST** `/api/tenants/:tenantId/media`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: archivo de imagen (required)
- `alt`: texto alternativo (optional)
- `caption`: pie de foto (optional)
- `section`: hero | features | about | gallery (optional)
- `order`: número de orden (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "media-id-123",
    "type": "image",
    "url": "https://storage.../uploaded-image.jpg",
    "filename": "uploaded-image.jpg",
    "alt": "Texto alt",
    "caption": "Pie de foto",
    "size": 123456,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080,
    "section": "hero",
    "order": 1,
    "createdAt": "2026-01-10T...",
    "updatedAt": "2026-01-10T..."
  }
}
```

#### 3. Actualizar metadata de imagen

**PATCH** `/api/tenants/:tenantId/media/:mediaId`

**Request Body:**
```json
{
  "alt": "Nuevo texto alt",
  "caption": "Nuevo pie de foto",
  "section": "gallery",
  "order": 5
}
```

#### 4. Eliminar imagen

**DELETE** `/api/tenants/:tenantId/media/:mediaId`

**Response:**
```json
{
  "success": true,
  "message": "Imagen eliminada correctamente"
}
```

#### 5. Reordenar imágenes

**PATCH** `/api/tenants/:tenantId/media/reorder`

**Request Body:**
```json
{
  "section": "features",
  "items": [
    { "id": "media-1", "order": 1 },
    { "id": "media-2", "order": 2 },
    { "id": "media-3", "order": 3 }
  ]
}
```

---

## 💾 4. Almacenamiento de Archivos

### Opciones recomendadas:

**Opción 1: Local (Desarrollo)**
- Guardar en `public/uploads/:tenantId/`
- URL: `http://localhost:3000/uploads/:tenantId/filename.jpg`

**Opción 2: Cloudinary (Recomendado para Producción)**
- Configurar cuenta en Cloudinary
- Usar SDK oficial: `cloudinary`
- Organizar por carpetas: `sabor-y-tradicion/:tenantId/`

**Opción 3: AWS S3**
- Bucket privado con URLs firmadas
- Organizar por prefijo: `:tenantId/`

### Configuración recomendada (Cloudinary):

```javascript
// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

### Variables de entorno (.env):

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🔒 5. Validaciones y Seguridad

### Validación de archivos:

```javascript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error('Tipo de archivo no permitido');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Archivo muy grande (máximo 5MB)');
  }
  
  return true;
}
```

### Permisos:

- **Leer contenido web:** Público (cualquiera puede ver)
- **Editar contenido web:** ADMIN, SUPER_ADMIN
- **Subir/eliminar imágenes:** ADMIN, SUPER_ADMIN
- **Gestión multi-tenant:** Cada tenant solo puede ver/editar su contenido

---

## 🎯 6. Implementación sugerida (Node.js/Express)

### Controlador: `webContentController.js`

```javascript
const prisma = require('../lib/prisma');

// GET: Obtener contenido web
exports.getWebContent = async (req, res) => {
  try {
    const { tenantId } = req.params;
    
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { webContent: true }
    });
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant no encontrado'
      });
    }
    
    // Retornar con valores por defecto si está vacío
    const defaultContent = {
      home: {
        hero: {
          title: tenant.name,
          subtitle: 'Bienvenidos a nuestro restaurante',
          ctaText: 'Ver Menú',
          ctaLink: '/menu',
          backgroundImage: ''
        },
        features: [],
        ctaSection: {
          title: '¿Listo para ordenar?',
          description: '',
          buttonText: 'Ver Menú Completo',
          buttonLink: '/menu'
        }
      },
      about: {
        main: {
          title: 'Sobre Nosotros',
          description: '',
          image: '',
          imageAlt: ''
        },
        values: {
          title: 'Nuestros Valores',
          items: []
        },
        gallery: {
          enabled: false,
          title: 'Galería',
          images: []
        }
      }
    };
    
    const webContent = typeof tenant.webContent === 'object' && tenant.webContent !== null
      ? { ...defaultContent, ...tenant.webContent }
      : defaultContent;
    
    return res.json({
      success: true,
      data: webContent
    });
    
  } catch (error) {
    console.error('Error getting web content:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener contenido web'
    });
  }
};

// PATCH: Actualizar sección de HOME
exports.updateHomeSection = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { section, action, data } = req.body;
    
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant no encontrado'
      });
    }
    
    let webContent = tenant.webContent || {};
    
    // Actualizar la sección específica
    if (section === 'hero') {
      webContent.home = webContent.home || {};
      webContent.home.hero = { ...webContent.home.hero, ...data };
    }
    
    if (section === 'features') {
      webContent.home = webContent.home || {};
      webContent.home.features = webContent.home.features || [];
      
      if (action === 'add') {
        data.id = require('crypto').randomUUID();
        webContent.home.features.push(data);
      } else if (action === 'update') {
        const index = webContent.home.features.findIndex(f => f.id === data.id);
        if (index !== -1) {
          webContent.home.features[index] = { ...webContent.home.features[index], ...data };
        }
      } else if (action === 'delete') {
        webContent.home.features = webContent.home.features.filter(f => f.id !== data.id);
      } else if (action === 'reorder') {
        webContent.home.features = data.items; // array completo reordenado
      }
    }
    
    if (section === 'ctaSection') {
      webContent.home = webContent.home || {};
      webContent.home.ctaSection = { ...webContent.home.ctaSection, ...data };
    }
    
    // Guardar en BD
    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { webContent }
    });
    
    return res.json({
      success: true,
      data: updated.webContent
    });
    
  } catch (error) {
    console.error('Error updating home section:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar sección'
    });
  }
};

// PATCH: Actualizar sección de ABOUT
exports.updateAboutSection = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { section, action, data } = req.body;
    
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant no encontrado'
      });
    }
    
    let webContent = tenant.webContent || {};
    webContent.about = webContent.about || {};
    
    if (section === 'main') {
      webContent.about.main = { ...webContent.about.main, ...data };
    }
    
    if (section === 'values') {
      webContent.about.values = webContent.about.values || { title: '', items: [] };
      
      if (action === 'updateTitle') {
        webContent.about.values.title = data.title;
      } else if (action === 'add') {
        data.id = require('crypto').randomUUID();
        webContent.about.values.items.push(data);
      } else if (action === 'update') {
        const index = webContent.about.values.items.findIndex(v => v.id === data.id);
        if (index !== -1) {
          webContent.about.values.items[index] = { ...webContent.about.values.items[index], ...data };
        }
      } else if (action === 'delete') {
        webContent.about.values.items = webContent.about.values.items.filter(v => v.id !== data.id);
      }
    }
    
    if (section === 'gallery') {
      webContent.about.gallery = { ...webContent.about.gallery, ...data };
    }
    
    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { webContent }
    });
    
    return res.json({
      success: true,
      data: updated.webContent
    });
    
  } catch (error) {
    console.error('Error updating about section:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar sección'
    });
  }
};

// PUT: Reemplazar TODO el contenido
exports.replaceWebContent = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const webContent = req.body;
    
    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { webContent }
    });
    
    return res.json({
      success: true,
      data: updated.webContent
    });
    
  } catch (error) {
    console.error('Error replacing web content:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar contenido'
    });
  }
};
```

### Controlador: `mediaController.js`

```javascript
const prisma = require('../lib/prisma');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Configurar multer para memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

// GET: Listar media
exports.getMedia = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { section, type, page = 1, limit = 50 } = req.query;
    
    const where = { tenantId };
    if (section) where.section = section;
    if (type) where.type = type;
    
    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: parseInt(limit)
      }),
      prisma.media.count({ where })
    ]);
    
    return res.json({
      success: true,
      data: media,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error getting media:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener multimedia'
    });
  }
};

// POST: Subir imagen
exports.uploadMedia = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { alt, caption, section, order } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No se proporcionó archivo'
      });
    }
    
    // Subir a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `sabor-y-tradicion/${tenantId}`,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      stream.end(file.buffer);
    });
    
    // Guardar en BD
    const media = await prisma.media.create({
      data: {
        tenantId,
        type: 'image',
        url: result.secure_url,
        filename: file.originalname,
        alt: alt || '',
        caption: caption || '',
        size: file.size,
        mimeType: file.mimetype,
        width: result.width,
        height: result.height,
        section: section || null,
        order: order ? parseInt(order) : 0
      }
    });
    
    return res.status(201).json({
      success: true,
      data: media
    });
    
  } catch (error) {
    console.error('Error uploading media:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al subir archivo'
    });
  }
};

// PATCH: Actualizar metadata
exports.updateMedia = async (req, res) => {
  try {
    const { tenantId, mediaId } = req.params;
    const { alt, caption, section, order } = req.body;
    
    const media = await prisma.media.update({
      where: {
        id: mediaId,
        tenantId // seguridad: solo puede actualizar su propio media
      },
      data: {
        ...(alt !== undefined && { alt }),
        ...(caption !== undefined && { caption }),
        ...(section !== undefined && { section }),
        ...(order !== undefined && { order: parseInt(order) })
      }
    });
    
    return res.json({
      success: true,
      data: media
    });
    
  } catch (error) {
    console.error('Error updating media:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar multimedia'
    });
  }
};

// DELETE: Eliminar imagen
exports.deleteMedia = async (req, res) => {
  try {
    const { tenantId, mediaId } = req.params;
    
    const media = await prisma.media.findUnique({
      where: { id: mediaId, tenantId }
    });
    
    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Multimedia no encontrada'
      });
    }
    
    // Eliminar de Cloudinary
    const publicId = media.url.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(`sabor-y-tradicion/${tenantId}/${publicId}`);
    
    // Eliminar de BD
    await prisma.media.delete({
      where: { id: mediaId }
    });
    
    return res.json({
      success: true,
      message: 'Imagen eliminada correctamente'
    });
    
  } catch (error) {
    console.error('Error deleting media:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al eliminar multimedia'
    });
  }
};

// PATCH: Reordenar
exports.reorderMedia = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { section, items } = req.body; // items: [{ id, order }]
    
    // Actualizar en batch
    await Promise.all(
      items.map(item =>
        prisma.media.updateMany({
          where: {
            id: item.id,
            tenantId,
            ...(section && { section })
          },
          data: { order: item.order }
        })
      )
    );
    
    return res.json({
      success: true,
      message: 'Orden actualizado correctamente'
    });
    
  } catch (error) {
    console.error('Error reordering media:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al reordenar multimedia'
    });
  }
};

exports.upload = upload.single('file');
```

### Rutas: `routes/webContent.js`

```javascript
const express = require('express');
const router = express.Router({ mergeParams: true });
const { authenticate, isAdmin } = require('../middleware/auth');
const webContentController = require('../controllers/webContentController');
const mediaController = require('../controllers/mediaController');

// === WEB CONTENT ===
router.get('/', webContentController.getWebContent);
router.put('/', authenticate, isAdmin, webContentController.replaceWebContent);
router.patch('/home', authenticate, isAdmin, webContentController.updateHomeSection);
router.patch('/about', authenticate, isAdmin, webContentController.updateAboutSection);

// === MEDIA ===
router.get('/media', mediaController.getMedia);
router.post('/media', authenticate, isAdmin, mediaController.upload, mediaController.uploadMedia);
router.patch('/media/reorder', authenticate, isAdmin, mediaController.reorderMedia);
router.patch('/media/:mediaId', authenticate, isAdmin, mediaController.updateMedia);
router.delete('/media/:mediaId', authenticate, isAdmin, mediaController.deleteMedia);

module.exports = router;
```

### Registrar en `app.js`:

```javascript
app.use('/api/tenants/:tenantId/web-content', require('./routes/webContent'));
```

---

## ✅ 7. Checklist de Implementación

### Base de datos:
- [ ] Agregar campo `webContent` (JSON) al modelo `Tenant`
- [ ] Crear modelo `Media` con relación a `Tenant`
- [ ] Ejecutar migración de Prisma
- [ ] Generar cliente de Prisma actualizado

### Almacenamiento:
- [ ] Configurar Cloudinary (o alternativa)
- [ ] Instalar paquetes: `cloudinary`, `multer`
- [ ] Configurar variables de entorno
- [ ] Probar subida de archivos

### Endpoints:
- [ ] `GET /api/tenants/:id/web-content` - Obtener contenido
- [ ] `PUT /api/tenants/:id/web-content` - Actualizar todo
- [ ] `PATCH /api/tenants/:id/web-content/home` - Actualizar home
- [ ] `PATCH /api/tenants/:id/web-content/about` - Actualizar about
- [ ] `GET /api/tenants/:id/web-content/media` - Listar multimedia
- [ ] `POST /api/tenants/:id/web-content/media` - Subir imagen
- [ ] `PATCH /api/tenants/:id/web-content/media/:id` - Actualizar metadata
- [ ] `DELETE /api/tenants/:id/web-content/media/:id` - Eliminar imagen
- [ ] `PATCH /api/tenants/:id/web-content/media/reorder` - Reordenar

### Seguridad:
- [ ] Validar tipos de archivo permitidos
- [ ] Limitar tamaño máximo (5MB)
- [ ] Verificar que solo ADMIN puede editar
- [ ] Verificar aislamiento multi-tenant
- [ ] Sanitizar HTML del editor de texto

### Extras:
- [ ] Endpoint público para obtener contenido web (sin auth)
- [ ] Optimización de imágenes (Cloudinary transformations)
- [ ] Respaldo automático del contenido web

---

## 📝 8. Notas Adicionales

1. **Editor de Texto Rico**: El HTML generado por el editor frontend debe sanitizarse en el backend para evitar XSS.

2. **Valores por defecto**: Cuando un tenant nuevo se crea, inicializar `webContent` con valores básicos.

3. **Caché**: Considerar cachear el contenido web público para mejorar rendimiento.

4. **Migraciones**: Cuando actualices el modelo Prisma, asegúrate de migrar tenants existentes con valores por defecto.

5. **Testing**: Crear tests para:
   - Subida de archivos
   - Validación de tipos de archivo
   - Actualización de secciones
   - Aislamiento multi-tenant

---

## 🚀 Instalación de Dependencias

```bash
# En el backend
npm install cloudinary multer uuid

# Herramientas de desarrollo
npm install -D @types/multer
```

---

## 🔗 Referencias

- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Prisma JSON fields](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#json)

