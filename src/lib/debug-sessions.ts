/**
 * Utilidades para debugging del sistema de sesiones múltiples
 * Solo para desarrollo - NO usar en producción
 */

export const debugSessions = {
  /**
   * Listar todas las claves de autenticación en localStorage
   */
  listAllAuthKeys: () => {
    if (typeof window === 'undefined') {
      console.log('❌ No disponible en servidor');
      return;
    }

    console.log('🔍 === CLAVES DE AUTENTICACIÓN ===');
    const authKeys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('auth_token_') || key.startsWith('auth_user_'))) {
        authKeys.push(key);
      }
    }

    if (authKeys.length === 0) {
      console.log('📭 No hay sesiones activas');
      return;
    }

    authKeys.sort().forEach(key => {
      const value = localStorage.getItem(key);
      if (key.includes('_domain')) {
        console.log(`🌐 ${key}: ${value}`);
      } else if (key.startsWith('auth_token_')) {
        console.log(`🔑 ${key}: ${value?.substring(0, 20)}...`);
      } else if (key.startsWith('auth_user_')) {
        try {
          const user = JSON.parse(value || '{}');
          console.log(`👤 ${key}:`, {
            email: user.email,
            role: user.role,
            tenantId: user.tenantId
          });
        } catch {
          console.log(`👤 ${key}: [Error al parsear]`);
        }
      }
    });
    console.log('=================================\n');
  },

  /**
   * Obtener resumen de sesiones activas
   */
  getSummary: () => {
    if (typeof window === 'undefined') {
      console.log('❌ No disponible en servidor');
      return;
    }

    const sessions: { [key: string]: { token: boolean; user: boolean; domain: string | null } } = {};

    // Buscar todos los tokens
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('auth_token_')) {
        const sessionId = key.replace('auth_token_', '');
        if (!sessions[sessionId]) {
          sessions[sessionId] = { token: false, user: false, domain: null };
        }
        sessions[sessionId].token = true;
      }
    }

    // Buscar todos los usuarios
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('auth_user_') && !key.endsWith('_domain')) {
        const sessionId = key.replace('auth_user_', '');
        if (!sessions[sessionId]) {
          sessions[sessionId] = { token: false, user: false, domain: null };
        }
        sessions[sessionId].user = true;

        // Buscar el dominio asociado
        const domainKey = `${key}_domain`;
        const domain = localStorage.getItem(domainKey);
        if (domain) {
          sessions[sessionId].domain = domain;
        }
      }
    }

    console.log('📊 === RESUMEN DE SESIONES ===');
    console.log(`Total de sesiones: ${Object.keys(sessions).length}\n`);

    Object.entries(sessions).forEach(([sessionId, data]) => {
      const isComplete = data.token && data.user;
      const status = isComplete ? '✅' : '⚠️';

      console.log(`${status} Session ID: ${sessionId}`);
      console.log(`   Token: ${data.token ? '✓' : '✗'}`);
      console.log(`   User: ${data.user ? '✓' : '✗'}`);
      console.log(`   Domain: ${data.domain || 'N/A'}`);
      console.log('');
    });
    console.log('=============================\n');
  },

  /**
   * Limpiar TODAS las sesiones (útil para testing)
   */
  clearAllSessions: () => {
    if (typeof window === 'undefined') {
      console.log('❌ No disponible en servidor');
      return;
    }

    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('auth_token_') || key.startsWith('auth_user_') || key === 'auth_migrated' || key === 'auth_migrated_v2')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    console.log(`🗑️ ${keysToRemove.length} claves de sesión eliminadas`);
    console.log('✅ Todas las sesiones han sido limpiadas');
  },

  /**
   * Limpiar una sesión específica
   */
  clearSession: (sessionId: string) => {
    if (typeof window === 'undefined') {
      console.log('❌ No disponible en servidor');
      return;
    }

    const tokenKey = `auth_token_${sessionId}`;
    const userKey = `auth_user_${sessionId}`;
    const domainKey = `${userKey}_domain`;

    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    localStorage.removeItem(domainKey);

    console.log(`🗑️ Sesión eliminada: ${sessionId}`);
  },

  /**
   * Verificar el estado actual del sistema
   */
  checkCurrentState: () => {
    if (typeof window === 'undefined') {
      console.log('❌ No disponible en servidor');
      return;
    }

    console.log('🔍 === ESTADO ACTUAL ===');
    console.log(`Hostname: ${window.location.hostname}`);
    console.log(`Pathname: ${window.location.pathname}`);
    console.log(`Migration v2: ${localStorage.getItem('auth_migrated_v2') || 'No'}`);
    console.log('=======================\n');

    debugSessions.getSummary();
  },

  /**
   * Simular sesión de prueba (solo desarrollo)
   */
  createTestSession: (context: 'admin' | 'superadmin' | 'orders', email: string, tenantDomain?: string) => {
    if (typeof window === 'undefined') {
      console.log('❌ No disponible en servidor');
      return;
    }

    const roleMap = {
      admin: 'ADMIN',
      superadmin: 'SUPERADMIN',
      orders: 'ORDERS_MANAGER'
    };

    const sessionId = context === 'superadmin' || !tenantDomain
      ? context
      : `${context}_${tenantDomain.replace(/[^a-zA-Z0-9-]/g, '_')}`;

    const testUser = {
      id: `test-${Date.now()}`,
      email,
      name: `Test ${context}`,
      role: roleMap[context],
      createdAt: new Date().toISOString(),
      tenantId: context === 'superadmin' ? null : 'test-tenant-123'
    };

    const testToken = `test-token-${Date.now()}`;

    localStorage.setItem(`auth_token_${sessionId}`, testToken);
    localStorage.setItem(`auth_user_${sessionId}`, JSON.stringify(testUser));

    if (context !== 'superadmin' && tenantDomain) {
      localStorage.setItem(`auth_user_${sessionId}_domain`, tenantDomain);
    }

    console.log(`✅ Sesión de prueba creada: ${sessionId}`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${roleMap[context]}`);
    if (tenantDomain) {
      console.log(`   Domain: ${tenantDomain}`);
    }
  },

  /**
   * Ver qué sesión se está usando en el dominio actual
   */
  checkCurrentSession: () => {
    if (typeof window === 'undefined') {
      console.log('❌ No disponible en servidor');
      return;
    }

    const currentDomain = window.location.hostname;
    const normalizedDomain = currentDomain.replace(/:\d+$/, '').replace(/[^a-zA-Z0-9-]/g, '_');
    const pathname = window.location.pathname;

    console.log('🔍 === SESIÓN ACTUAL ===');
    console.log(`Hostname: ${currentDomain}`);
    console.log(`Pathname: ${pathname}`);
    console.log(`Normalized Domain: ${normalizedDomain}`);
    console.log('');

    // Determinar contexto según la ruta
    let context = 'admin';
    if (pathname.startsWith('/superadmin')) {
      context = 'superadmin';
    } else if (pathname.startsWith('/orders')) {
      context = 'orders';
    }

    console.log(`Contexto detectado: ${context}`);
    console.log('');

    // Buscar sesión para este contexto + dominio
    const sessionId = context === 'superadmin' ? 'superadmin' : `${context}_${normalizedDomain}`;
    const tokenKey = `auth_token_${sessionId}`;
    const userKey = `auth_user_${sessionId}`;
    const domainKey = `${userKey}_domain`;

    const token = localStorage.getItem(tokenKey);
    const user = localStorage.getItem(userKey);
    const domain = localStorage.getItem(domainKey);

    console.log(`Session ID esperado: ${sessionId}`);
    console.log(`Token (${tokenKey}): ${token ? '✓ ' + token.substring(0, 20) + '...' : '✗ No encontrado'}`);

    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log(`User (${userKey}): ✓`);
        console.log(`   Email: ${userData.email}`);
        console.log(`   Role: ${userData.role}`);
        console.log(`   Tenant ID: ${userData.tenantId || 'N/A'}`);
      } catch {
        console.log(`User (${userKey}): ✗ Error al parsear`);
      }
    } else {
      console.log(`User (${userKey}): ✗ No encontrado`);
    }

    if (domain) {
      console.log(`Domain (${domainKey}): ${domain}`);
    }

    console.log('========================\n');

    // Mostrar todas las sesiones disponibles
    console.log('📋 Otras sesiones disponibles:');
    debugSessions.getSummary();
  }
};

// Exponer en window para debugging en consola del navegador
if (typeof window !== 'undefined') {
  (window as any).debugSessions = debugSessions;

  // Mostrar mensaje de bienvenida en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('%c🔧 Herramientas de Debug Disponibles', 'color: #10b981; font-size: 16px; font-weight: bold;');
    console.log('%cSistema Multi-Sesión Multi-Tenant', 'color: #6366f1; font-size: 14px;');
    console.log('\n%cComandos disponibles:', 'color: #f59e0b; font-weight: bold;');
    console.log('%c  debugSessions.checkCurrentSession()  %c→ Ver sesión actual (RECOMENDADO)', 'color: #06b6d4; font-weight: bold;', 'color: #94a3b8;');
    console.log('%c  debugSessions.checkCurrentState()    %c→ Ver estado general', 'color: #06b6d4;', 'color: #94a3b8;');
    console.log('%c  debugSessions.getSummary()           %c→ Resumen de sesiones', 'color: #06b6d4;', 'color: #94a3b8;');
    console.log('%c  debugSessions.listAllAuthKeys()      %c→ Listar todas las claves', 'color: #06b6d4;', 'color: #94a3b8;');
    console.log('%c  debugSessions.clearAllSessions()     %c→ Limpiar todas las sesiones', 'color: #06b6d4;', 'color: #94a3b8;');
    console.log('%c  debugSessions.createTestSession()    %c→ Crear sesión de prueba', 'color: #06b6d4;', 'color: #94a3b8;');
    console.log('\n%c📚 Más info: DEBUG_SESSIONS.md', 'color: #8b5cf6;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #475569;');
  }
}

export default debugSessions;

