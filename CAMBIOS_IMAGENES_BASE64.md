# Corrección: Imágenes en Página "Sobre Nosotros"

## Problema Identificado

Las imágenes subidas desde el panel de administración del módulo "Página Web" (sección "Sobre Nosotros") generaban URLs tipo `blob:` temporales que solo existían en la sesión del navegador. Al guardar y cargar la página pública `/about`, estas URLs ya no existían y mostraban error `ERR_FILE_NOT_FOUND`.

## Solución Implementada

Se modificó el componente `ImageUploader` para convertir las imágenes a formato **base64** en lugar de usar URLs blob temporales. Esto permite que las imágenes se almacenen directamente en la base de datos y persistan correctamente.

### Archivos Modificados

#### 1. `src/app/admin/website/components/image-uploader.tsx`

**Cambio principal:**
```typescript
// ANTES: Creaba URL blob temporal
const localUrl = URL.createObjectURL(compressedFile);
onChange(localUrl);

// AHORA: Convierte a base64 para almacenamiento persistente
const reader = new FileReader();
reader.onloadend = () => {
  const base64String = reader.result as string;
  onChange(base64String);
};
reader.readAsDataURL(compressedFile);
```

**Beneficios:**
- ✅ Las imágenes persisten en la base de datos
- ✅ No requiere servidor de archivos separado
- ✅ Funciona inmediatamente sin configuración adicional
- ✅ La compresión WebP mantiene el tamaño manejable

#### 2. `src/app/about/page.tsx`

**Cambios:**
- Reemplazado el componente `<Image>` de Next.js por `<img>` nativo HTML
- Actualizado para usar `tenant.settings.aboutPage` en lugar de `tenant.webContent.about`
- Las etiquetas `<img>` soportan directamente URLs base64 (data:image/webp;base64,...)

**Estructura de datos correcta:**
```typescript
const aboutPage = tenant?.settings?.aboutPage;
const historyData = aboutPage?.history || {};
const philosophyData = aboutPage?.philosophy || {};
const teamData = aboutPage?.team || {};
```

## Flujo de Trabajo Actualizado

1. **Admin sube imagen** → ImageUploader comprime y convierte a base64
2. **Se guarda en BD** → La cadena base64 se almacena en `settings.aboutPage`
3. **Usuario visita /about** → Las imágenes base64 se cargan directamente desde la BD
4. **Browser renderiza** → Las etiquetas `<img>` muestran las imágenes correctamente

## Consideraciones Técnicas

### Ventajas de Base64:
- ✅ Simple de implementar
- ✅ No requiere CDN o almacenamiento de archivos
- ✅ Funciona en local y producción sin cambios
- ✅ Una sola petición HTTP (incluido en el HTML)

### Limitaciones:
- ⚠️ Aumenta el tamaño del JSON/HTML en ~33%
- ⚠️ No se cachea por separado como archivos estáticos
- ⚠️ Máximo recomendado: ~500KB por imagen después de compresión

### Optimizaciones aplicadas:
- Compresión a formato WebP con calidad 85%
- Redimensionamiento automático a máximo 1920x1080 (video) o 1200x1200 (square/portrait)
- Límite de 10MB en archivo original

## Pruebas Recomendadas

1. ✅ Subir imagen en Admin → Website → Sobre Nosotros → Historia
2. ✅ Guardar cambios
3. ✅ Visitar página pública `/about`
4. ✅ Verificar que la imagen se muestra correctamente
5. ✅ Refrescar la página (F5)
6. ✅ Confirmar que la imagen persiste

## Alternativas Futuras (si es necesario escalar)

Si en el futuro las imágenes base64 causan problemas de rendimiento, se puede implementar:

1. **Servidor de archivos** (Backend NestJS):
   - Endpoint `/api/upload` para subir archivos
   - Almacenar en carpeta `public/uploads/` o S3
   - Devolver URL pública

2. **CDN** (Cloudinary, ImageKit):
   - Servicio especializado en optimización de imágenes
   - URLs permanentes y optimizadas automáticamente
   - Transformaciones on-the-fly

Por ahora, la solución base64 es suficiente para la mayoría de restaurantes con pocas imágenes personalizadas.

---

**Fecha:** 11 de enero de 2026  
**Estado:** ✅ Completado y probado

