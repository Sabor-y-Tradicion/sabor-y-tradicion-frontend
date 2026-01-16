-- =============================================================================
-- Script para actualizar dominios de tenants existentes a james.pe
-- Ejecutar en pgAdmin en la base de datos 'saborytradicion'
-- =============================================================================

-- 1. Ver los tenants actuales
SELECT id, name, slug, domain FROM tenants;

-- 2. Actualizar dominios de tenants existentes a .james.pe
-- NOTA: Ajusta los IDs y slugs según tus tenants reales

-- Actualizar Sabor y Tradición
UPDATE tenants
SET domain = 'saborytradicion.james.pe',
    slug = 'saborytradicion',
    updated_at = NOW()
WHERE slug LIKE '%sabor%' OR domain LIKE '%sabor%';

-- Actualizar El Mesón del Arco
UPDATE tenants
SET domain = 'elmesondelarco.james.pe',
    slug = 'elmesondelarco',
    updated_at = NOW()
WHERE slug LIKE '%meson%' OR domain LIKE '%meson%';

-- 3. Verificar los cambios
SELECT id, name, slug, domain, updated_at FROM tenants;

-- =============================================================================
-- ALTERNATIVA: Si conoces los IDs exactos, usa esto:
-- =============================================================================
-- UPDATE tenants SET domain = 'saborytradicion.james.pe', slug = 'saborytradicion' WHERE id = 1;
-- UPDATE tenants SET domain = 'elmesondelarco.james.pe', slug = 'elmesondelarco' WHERE id = 2;

-- =============================================================================
-- PARA NUEVOS TENANTS: El sistema ahora creará automáticamente
-- con el formato: {slug}.james.pe
-- =============================================================================

