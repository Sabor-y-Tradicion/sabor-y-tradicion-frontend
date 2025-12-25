# 🍽️ Sabor y Tradición - Restaurant Website

Sitio web moderno para el restaurante **Sabor y Tradición** en Chachapoyas, Amazonas, Perú. Especializado en cocina tradicional chachapoyana con un diseño atractivo y animaciones profesionales.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

---

## 🌟 Características

### 📱 Páginas Principales
- **🏠 Home** - Hero animado con efecto Ken Burns, características del restaurante e historia
- **📖 Sobre Nosotros** - Historia del restaurante, filosofía y equipo de Chachapoyas
- **🍽️ Menú** - Carta completa con categorías: Menú del Día, Platos Tradicionales, A la Carta, Bebidas y Postres
- **📞 Contacto** - Formulario, información de contacto y mapa de ubicación

### 🎯 Optimizaciones
- ⚡ **Next.js 14** con App Router para máximo rendimiento
- 🖼️ **Optimización de imágenes** automática (AVIF, WebP)
- 🔍 **SEO optimizado** con metadata y Open Graph
- 🔒 **Headers de seguridad** configurados
- 📊 **Core Web Vitals** optimizados

---

## 🚀 Tecnologías

### Core
- **[Next.js 14.2](https://nextjs.org/)** - Framework React con App Router
- **[TypeScript 5.3](https://www.typescriptlang.org/)** - Tipado estático
- **[React 18](https://react.dev/)** - Librería UI

### Estilos y UI
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Shadcn UI](https://ui.shadcn.com/)** - Componentes accesibles
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[Class Variance Authority](https://cva.style/)** - Gestión de variantes

### Herramientas
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formateo de código
- **[Autoprefixer](https://autoprefixer.github.io/)** - Prefijos CSS automáticos

---

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/sabor-y-tradicion-frontend.git

# Entrar al directorio
cd sabor-y-tradicion-frontend

# Instalar dependencias
npm install

# (Opcional) Configurar variables de entorno
cp .env.example .env.local
```

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo - Inicia servidor en http://localhost:3000
npm run dev

# Producción - Compila aplicación optimizada
npm run build

# Iniciar servidor de producción
npm start

# Verificar código con ESLint
npm run lint

# Formatear código con Prettier
npm run format
```

---

## 📁 Estructura del Proyecto

```
sabor-y-tradicion-frontend/
├── src/
│   ├── app/                    # Rutas Next.js (App Router)
│   │   ├── about/             # Página Sobre Nosotros
│   │   ├── contact/           # Página de Contacto
│   │   │   └── components/    # Formulario de contacto
│   │   ├── menu/              # Página del Menú
│   │   │   ├── menu-data.ts   # Datos de platos
│   │   │   └── components/    # Componentes del menú
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Estilos globales + animaciones
│   ├── components/
│   │   ├── layout/            # Header y Footer
│   │   ├── ui/                # Componentes UI (Shadcn)
│   │   └── icons.tsx          # Componente de logo
│   ├── hooks/                 # Custom React Hooks
│   │   ├── use-mobile.tsx     # Hook para detección móvil
│   │   └── use-toast.ts       # Hook para notificaciones
│   └── lib/
│       ├── utils.ts           # Utilidades generales
│       └── placeholder-images.ts  # Configuración de imágenes
├── public/
│   └── images/
│       └── logo/
│           └── logo.png       # Logo del restaurante
├── next.config.mjs            # Configuración Next.js
├── tailwind.config.ts         # Configuración Tailwind
├── tsconfig.json              # Configuración TypeScript
└── package.json               # Dependencias
```

---

## 🎨 Paleta de Colores

```css
/* Primary - Color principal del restaurante */
--primary: 12 70% 62%;           /* #E87B47 - Naranja cálido */

/* Secondary - Color secundario */
--secondary: 60 10% 85%;         /* #DDD9D0 - Beige suave */

/* Background - Fondo principal */
--background: 60 56% 91%;        /* #F5F2E8 - Crema claro */

/* Foreground - Texto principal */
--foreground: 20 14% 4%;         /* #0F0B09 - Casi negro */
```


## 📱 Información de Contacto

**Restaurante Sabor y Tradición**
- 📍 Jr Bolivia 715, Chachapoyas, Amazonas, Perú
- 📞 (+51) 961 977 798
- 📧 contacto@saborytradicion.com
- 📷 Instagram: [@saborytradicion](https://instagram.com)
- 👍 Facebook: [/saborytradicion](https://facebook.com)

---

## 📄 Licencia

Copyright © 2025 Sabor y Tradición. Todos los derechos reservados.

---

## 📈 Estado del Proyecto

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-passing-blue?style=flat-square)
![ESLint](https://img.shields.io/badge/ESLint-passing-4B32C3?style=flat-square)

**Última actualización**: Diciembre 24, 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Production Ready

---

**Desarrollado con ❤️ para Sabor y Tradición - Chachapoyas, Amazonas, Perú** 🇵🇪

