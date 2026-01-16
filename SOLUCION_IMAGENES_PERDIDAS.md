# Solución: Imágenes que se pierden al actualizar la página

## Problema Identificado

Las imágenes de la página "Sobre Nosotros" se mostraban como URLs `blob:` que desaparecían al actualizar la página. Los errores en consola mostraban:

```
GET blob:http://saborytradicion.james.pe/[uuid] net::ERR_FILE_NOT_FOUND
```

## Causa del Problema

Las URLs blob son temporales y solo existen mientras la página está cargada. Cuando se recarga la página, estas URLs ya no existen y las imágenes no se pueden cargar.

## Solución Implementada

### 1. **Verificación del proceso de conversión a Base64**

El componente `ImageUploader` ya estaba convirtiendo correctamente las imágenes a base64, pero agregamos validaciones adicionales:

- **Console.logs** para verificar que la conversión a base64 funcione correctamente
- **Validación** para detectar y eliminar URLs blob antes de guardar

### 2. **Mejoras en la página About**

#### a. Agregado campo de imagen a la sección "Filosofía"

La sección de filosofía no tenía un campo para subir imágenes. Ahora todas las secciones tienen la misma estructura:

```typescript
<ImageUploader
  value={formData.philosophy?.image}
  onChange={(url) => updatePhilosophy({ image: url })}
  onRemove={() => updatePhilosophy({ image: "" })}
  aspectRatio="square"
  label="Imagen de la sección"
/>
```

#### b. Actualizado el preview de la sección "Filosofía"

Antes se mostraba de forma diferente. Ahora usa el mismo componente `SectionPreview` que las otras secciones:

```typescript
<SectionPreview section={formData.philosophy} title="Filosofía" imageFirst={false} />
```

### 3. **Validación al guardar**

Agregamos una función `validateImageUrl` en el método `handleSave` que:

- Detecta si una URL es blob (`url.startsWith('blob:')`)
- Elimina las URLs blob (ya que no se pueden persistir)
- Solo permite guardar URLs base64 válidas

```typescript
const validateImageUrl = (url: string | undefined) => {
  if (!url) return url;
  if (url.startsWith('blob:')) {
    console.error('URL blob detectada:', url);
    return ''; // Eliminar URLs blob que no se pueden guardar
  }
  return url;
};
```

### 4. **Logging mejorado**

Se agregaron console.logs para facilitar el debugging:

- En `ImageUploader`: Muestra cuando una imagen se convierte a base64
- En `handleSave`: Muestra los datos que se están guardando y detecta URLs blob

## Cómo funciona ahora

1. **Usuario sube una imagen**: El `ImageUploader` recibe el archivo
2. **Compresión**: La imagen se comprime a formato WebP con calidad 85%
3. **Conversión a Base64**: La imagen comprimida se convierte a una cadena base64
4. **Almacenamiento temporal**: El base64 se guarda en el estado del formulario
5. **Validación**: Al guardar, se verifica que no haya URLs blob
6. **Persistencia**: El base64 se envía al backend y se guarda en la base de datos
7. **Recarga**: Al recargar la página, las imágenes base64 se cargan correctamente

## Archivos modificados

1. `src/app/admin/website/about/page.tsx`
   - Agregado ImageUploader a la sección de Filosofía
   - Actualizado preview de Filosofía
   - Agregada validación de URLs blob en handleSave
   - Agregados console.logs para debugging

2. `src/app/admin/website/components/image-uploader.tsx`
   - Agregados console.logs para verificar conversión a base64
   - Mejorado manejo del estado isUploading

## Verificación

Para verificar que la solución funciona:

1. Abre la consola del navegador (F12)
2. Ve a Admin > Website > About
3. Sube una imagen
4. Verifica en consola: "Imagen convertida a base64, tamaño: [X] caracteres"
5. Haz clic en "Guardar cambios"
6. Verifica en consola los datos guardados
7. Recarga la página (F5)
8. Las imágenes deberían seguir visible

## Notas importantes

- Las imágenes base64 son más grandes que URLs, pero son persistentes
- La compresión a WebP reduce significativamente el tamaño
- Si las imágenes siguen desapareciendo, verificar que el backend esté guardando correctamente los datos
- Las URLs base64 empiezan con `data:image/webp;base64,` o similar

## Próximos pasos recomendados

Si el problema persiste después de estos cambios:

1. Verificar que el backend esté guardando correctamente las imágenes base64
2. Verificar que el endpoint PATCH `/tenants/:id/settings` no esté truncando los datos
3. Considerar usar un servicio de almacenamiento de imágenes (Cloudinary, AWS S3, etc.)
4. Verificar límites de tamaño en el servidor (nginx, apache)

