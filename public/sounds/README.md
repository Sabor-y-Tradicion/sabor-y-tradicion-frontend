# Archivos de Sonido

## notification.mp3

Este archivo debe ser un sonido de notificación corto (1-3 segundos) que se reproducirá cuando llegue un nuevo pedido.

### Opciones:

1. **Descargar un sonido libre de derechos** desde:
   - https://freesound.org/
   - https://mixkit.co/free-sound-effects/
   - https://www.zapsplat.com/

2. **Crear tu propio sonido** usando herramientas como:
   - Audacity (gratis)
   - GarageBand (macOS)

3. **Usar un sonido de sistema** existente

### Requisitos:
- Formato: MP3
- Duración: 1-3 segundos
- Volumen: Moderado (no muy alto)
- Tamaño: < 100KB

### Instalación:
1. Coloca el archivo `notification.mp3` en esta carpeta: `public/sounds/`
2. El sistema lo cargará automáticamente

### Alternativa temporal:
Si no tienes un archivo de sonido, el sistema funcionará igual pero sin reproducir audio. El hook de notificaciones maneja el error silenciosamente.

