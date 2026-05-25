// =====================================================================
// IIT RRHH — Autenticación y gestión de sesión
// =====================================================================

var Auth = (function() {

  var SESSION_KEY = 'iit_rrhh_session';
  var API_BASE    = '';  // Cuando esté listo el backend

  // Usuarios demo para la versión inicial (sin backend)
  var DEMO_USERS = [
    { cedula: '0000000001', email: 'empresa@iit.com.co',   password: 'Iit2026*',  rol: 'empresa',       nombre: 'IIT Empresa',         iniciales: 'IE' },
    { cedula: '0000000002', email: 'admin@iit.com.co',     password: 'Admin2026*', rol: 'administrador', nombre: 'Administrador IIT',   iniciales: 'AI' },
    { cedula: '0000000003', email: 'usuario@iit.com.co',   password: 'User2026*',  rol: 'usuario',       nombre: 'Asistente RRHH',      iniciales: 'AR' },
    { cedula: '1234567890', email: 'c.rodriguez@iit.com.co',password: 'Emp2026*', rol: 'empleado',      nombre: 'Carlos Rodríguez',    iniciales: 'CR' }
  ];

  function login(userInput, password) {
    var btn = document.getElementById('login-btn');
    var err = document.getElementById('login-error');
    if (btn) { btn.disabled = true; btn.textContent = 'Verificando...'; }
    if (err) err.style.display = 'none';

    setTimeout(function() {
      var user = DEMO_USERS.find(function(u) {
        return (u.cedula === userInput.trim() || u.email === userInput.trim().toLowerCase())
               && u.password === password;
      });

      if (!user) {
        if (err) { err.textContent = 'Cédula/correo o contraseña incorrectos.'; err.style.display = 'block'; }
        if (btn) { btn.disabled = false; btn.textContent = 'Ingresar al sistema'; }
        return;
      }

      var session = {
        cedula:    user.cedula,
        email:     user.email,
        nombre:    user.nombre,
        iniciales: user.iniciales,
        rol:       user.rol,
        loginAt:   new Date().toISOString()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      window.location.href = 'pages/dashboard.html';
    }, 600);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '../index.html';
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e) { return null; }
  }

  function requireAuth() {
    var s = getSession();
    if (!s) { window.location.href = '../index.html'; return null; }
    return s;
  }

  function hasRole() {
    var roles = Array.from(arguments);
    var s = getSession();
    return s && roles.indexOf(s.rol) !== -1;
  }

  function isAdmin() { return hasRole('empresa', 'administrador'); }
  function isEmpresa(){ return hasRole('empresa'); }

  function renderUserBar(session) {
    var nameEl = document.getElementById('topbar-name');
    var avEl   = document.getElementById('topbar-avatar');
    var badgeEl= document.getElementById('topbar-badge');
    if (nameEl)  nameEl.textContent = session.nombre;
    if (avEl)    avEl.textContent   = session.iniciales;
    if (badgeEl) {
      var labels = { empresa:'Empresa', administrador:'Admin', usuario:'Usuario', empleado:'Empleado' };
      var classes= { empresa:'badge-empresa', administrador:'badge-admin', usuario:'badge-usuario', empleado:'badge-empleado' };
      badgeEl.textContent  = labels[session.rol] || session.rol;
      badgeEl.className    = 'topbar-badge ' + (classes[session.rol] || 'badge-muted');
    }
  }

  // Marcar item activo en sidebar
  function markNavActive(page) {
    document.querySelectorAll('.nav-item').forEach(function(el) {
      el.classList.toggle('active', el.dataset.page === page);
    });
  }

  // Ocultar elementos según rol
  function applyRoleVisibility(rol) {
    document.querySelectorAll('[data-roles]').forEach(function(el) {
      var roles = el.dataset.roles.split(',');
      if (roles.indexOf(rol) === -1) el.style.display = 'none';
    });
  }

  return { login, logout, getSession, requireAuth, hasRole, isAdmin, isEmpresa, renderUserBar, markNavActive, applyRoleVisibility };

})();
