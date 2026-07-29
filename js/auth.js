// =====================================================================
// IIT RRHH — Autenticación v2.0 · Supabase backend
// API pública idéntica a v1.0 — todas las páginas funcionan sin cambios
// =====================================================================

var Auth = (function () {

  var SESSION_KEY  = 'iit_rrhh_session';
  var SUPA_URL     = 'https://jntxowiyfwhthxhuoifb.supabase.co';
  var SUPA_KEY     = 'sb_publishable_tMC3EDKF1yXy8bz_yQGDOA_IfSBvuj7';
  var REST_BASE    = SUPA_URL + '/rest/v1';

  // ── Helpers Supabase REST ────────────────────────────────────────

  function supaHeaders() {
    return {
      'Content-Type':  'application/json',
      'apikey':        SUPA_KEY,
      'Authorization': 'Bearer ' + SUPA_KEY
    };
  }

  // SELECT genérico
  function supaGet(tabla, params) {
    var qs = Object.keys(params || {}).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    return fetch(REST_BASE + '/' + tabla + (qs ? '?' + qs : ''), {
      headers: supaHeaders()
    }).then(function(r) { return r.json(); });
  }

  // INSERT genérico
  function supaInsert(tabla, data) {
    return fetch(REST_BASE + '/' + tabla, {
      method: 'POST',
      headers: Object.assign({}, supaHeaders(), { 'Prefer': 'return=representation' }),
      body: JSON.stringify(data)
    }).then(function(r) { return r.json(); });
  }

  // UPDATE genérico por campo=valor
  function supaUpdate(tabla, filtro, data) {
    var qs = Object.keys(filtro).map(function(k) {
      return encodeURIComponent(k) + '=eq.' + encodeURIComponent(filtro[k]);
    }).join('&');
    return fetch(REST_BASE + '/' + tabla + '?' + qs, {
      method: 'PATCH',
      headers: Object.assign({}, supaHeaders(), { 'Prefer': 'return=representation' }),
      body: JSON.stringify(data)
    }).then(function(r) { return r.json(); });
  }

  // ── Hash simple para demo (NO usar en producción real con datos sensibles)
  // En producción real: bcrypt en un Edge Function de Supabase
  function hashDemo(password) {
    return '$demo$' + password;
  }

  // ── Iniciales desde nombre ───────────────────────────────────────
  function iniciales(nombres, apellidos) {
    var n = (nombres  || '').trim().charAt(0).toUpperCase();
    var a = (apellidos|| '').trim().charAt(0).toUpperCase();
    return n + a || '??';
  }

  // ── LOGIN ────────────────────────────────────────────────────────
  function login(userInput, password) {
    var btn = document.getElementById('login-btn');
    var err = document.getElementById('login-error');
    if (btn) { btn.disabled = true; btn.textContent = 'Verificando...'; }
    if (err) err.style.display = 'none';

    var input = userInput.trim().toLowerCase();

    // Buscar usuario por cédula o email
    var esCedula = /^\d+$/.test(userInput.trim());
    var filtro   = esCedula
      ? 'cedula=eq.' + userInput.trim()
      : 'email=eq.' + input;

    fetch(REST_BASE + '/usuarios_sistema?' + filtro + '&select=*', {
      headers: supaHeaders()
    })
    .then(function(r) { return r.json(); })
    .then(function(rows) {
      var usuario = rows && rows[0];

      if (!usuario || !usuario.activo) {
        return loginError(btn, err, 'Usuario no encontrado o inactivo.');
      }

      // Verificar contraseña (hash demo)
      if (usuario.password_hash !== hashDemo(password)) {
        return loginError(btn, err, 'Cédula/correo o contraseña incorrectos.');
      }

      // Obtener nombre desde tabla empleados (si existe vinculación)
      var promesaNombre;
      if (usuario.empleado_id) {
        promesaNombre = fetch(
          REST_BASE + '/empleados?id=eq.' + usuario.empleado_id + '&select=nombres,apellidos',
          { headers: supaHeaders() }
        ).then(function(r) { return r.json(); });
      } else {
        promesaNombre = Promise.resolve(null);
      }

      promesaNombre.then(function(empRows) {
        var emp      = empRows && empRows[0];
        var nombre   = emp
          ? (emp.nombres + ' ' + emp.apellidos).trim()
          : (usuario.email.split('@')[0]);
        var inics    = emp
          ? iniciales(emp.nombres, emp.apellidos)
          : nombre.substring(0, 2).toUpperCase();

        // Guardar sesión
        var session = {
          id:         usuario.id,
          cedula:     usuario.cedula,
          email:      usuario.email,
          nombre:     nombre,
          iniciales:  inics,
          rol:        usuario.rol,
          empleado_id:usuario.empleado_id || null,
          loginAt:    new Date().toISOString()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));

        // Registrar último acceso (sin bloquear navegación)
        supaUpdate('usuarios_sistema', { id: usuario.id }, {
          ultimo_acceso: new Date().toISOString()
        }).catch(function() {});

        // Log auditoría
        supaInsert('auditoria_log', {
          usuario_id: usuario.id,
          accion: 'login',
          descripcion: 'Inicio de sesión exitoso'
        }).catch(function() {});

        window.location.href = '/pages/dashboard.html';
      });
    })
    .catch(function(e) {
      console.error('Auth error:', e);
      loginError(btn, err, 'Error de conexión. Intenta nuevamente.');
    });
  }

  function loginError(btn, err, msg) {
    if (err) { err.textContent = msg; err.style.display = 'block'; }
    if (btn) { btn.disabled = false; btn.textContent = 'Ingresar al sistema'; }
  }

  // ── LOGOUT ───────────────────────────────────────────────────────
  function logout() {
    var s = getSession();
    if (s) {
      supaInsert('auditoria_log', {
        usuario_id: s.id,
        accion: 'logout',
        descripcion: 'Cierre de sesión'
      }).catch(function() {});
    }
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '/';
  }

  // ── SESIÓN ───────────────────────────────────────────────────────
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch(e) { return null; }
  }

  function requireAuth() {
    var s = getSession();
    if (!s) { window.location.href = '/'; return null; }
    return s;
  }

  // ── ROLES ────────────────────────────────────────────────────────
  function hasRole() {
    var roles = Array.from(arguments);
    var s = getSession();
    return s && roles.indexOf(s.rol) !== -1;
  }

  function isAdmin()   { return hasRole('empresa', 'administrador'); }
  function isEmpresa() { return hasRole('empresa'); }

  // ── UI ───────────────────────────────────────────────────────────
  function renderUserBar(session) {
    var nameEl  = document.getElementById('topbar-name');
    var avEl    = document.getElementById('topbar-avatar');
    var badgeEl = document.getElementById('topbar-badge');
    if (nameEl)  nameEl.textContent  = session.nombre;
    if (avEl)    avEl.textContent    = session.iniciales;
    if (badgeEl) {
      var labels  = { empresa:'Empresa', administrador:'Admin', usuario:'Usuario', empleado:'Empleado' };
      var classes = { empresa:'badge-empresa', administrador:'badge-admin', usuario:'badge-usuario', empleado:'badge-empleado' };
      badgeEl.textContent = labels[session.rol] || session.rol;
      badgeEl.className   = 'topbar-badge ' + (classes[session.rol] || 'badge-muted');
    }
  }

  function markNavActive(page) {
    document.querySelectorAll('.nav-item').forEach(function(el) {
      el.classList.toggle('active', el.dataset.page === page);
    });
  }

  function applyRoleVisibility(rol) {
    document.querySelectorAll('[data-roles]').forEach(function(el) {
      var roles = el.dataset.roles.split(',');
      if (roles.indexOf(rol) === -1) el.style.display = 'none';
    });
  }

  // ── API pública de datos (para usar en las páginas) ──────────────
  // Wrappers convenientes para que las páginas no importen nada extra

  function db_get(tabla, params) { return supaGet(tabla, params); }
  function db_insert(tabla, data){ return supaInsert(tabla, data); }
  function db_update(tabla, filtro, data){ return supaUpdate(tabla, filtro, data); }

  function db_delete(tabla, filtro) {
    var qs = Object.keys(filtro).map(function(k) {
      return encodeURIComponent(k) + '=eq.' + encodeURIComponent(filtro[k]);
    }).join('&');
    return fetch(REST_BASE + '/' + tabla + '?' + qs, {
      method: 'DELETE',
      headers: supaHeaders()
    });
  }

  function db_query(tabla, filtros, select, order, limit) {
    var params = {};
    if (select) params['select'] = select;
    if (order)  params['order']  = order;
    if (limit)  params['limit']  = limit;
    Object.assign(params, filtros || {});
    return supaGet(tabla, params);
  }

  return {
    // Auth
    login, logout, getSession, requireAuth,
    // Roles
    hasRole, isAdmin, isEmpresa,
    // UI
    renderUserBar, markNavActive, applyRoleVisibility,
    // DB (para páginas)
    db: { get: db_get, insert: db_insert, update: db_update, delete: db_delete, query: db_query }
  };

})();
