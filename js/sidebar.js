/**
 * IIT RRHH — Sidebar unificado v3.0
 * Cubre 38 páginas · 55 tablas · 12 secciones
 * Se inyecta en todas las páginas con: Sidebar.render(paginaActual)
 */

var Sidebar = (function () {

  // Estructura completa del menú por rol
  var MENU = [
    {
      seccion: 'Principal',
      roles: ['empresa','administrador','usuario','empleado'],
      items: [
        { label: 'Dashboard', icon: '📊', href: '/pages/dashboard.html', roles: ['empresa','administrador','usuario','empleado'] },
      ]
    },
    {
      seccion: 'Empleados',
      roles: ['empresa','administrador','usuario'],
      items: [
        { label: 'Empleados',      icon: '👥', href: '/pages/empleados.html',      roles: ['empresa','administrador','usuario'] },
        { label: 'Nuevo empleado', icon: '➕', href: '/pages/nuevo-empleado.html', roles: ['empresa','administrador'] },
        { label: 'Sábana general', icon: '📋', href: '/pages/sabana.html',         roles: ['empresa','administrador'] },
      ]
    },
    {
      seccion: 'Mi información',
      roles: ['empleado','usuario','administrador','empresa'],
      items: [
        { label: 'Mi perfil',      icon: '👤', href: '/pages/mi-perfil.html',       roles: ['empleado','usuario','administrador','empresa'] },
        { label: 'Mis documentos', icon: '📁', href: '/pages/mis-documentos.html',  roles: ['empleado','usuario','administrador','empresa'] },
      ]
    },
    {
      seccion: 'Tiempo',
      roles: ['empresa','administrador','usuario','empleado'],
      items: [
        { label: 'Vacaciones',           icon: '🏖',  href: '/pages/vacaciones.html',           roles: ['empresa','administrador','usuario','empleado'] },
        { label: 'Permisos',             icon: '⏸',  href: '/pages/permisos.html',             roles: ['empresa','administrador','usuario','empleado'] },
        { label: 'Permisos remunerados', icon: '⏸',  href: '/pages/permisos-remunerados.html', roles: ['empresa','administrador','usuario','empleado'] },
        { label: 'Ausencias',            icon: '🚫', href: '/pages/ausencias.html',             roles: ['empresa','administrador','usuario','empleado'] },
        { label: 'Incapacidades',        icon: '🏥', href: '/pages/incapacidades.html',         roles: ['empresa','administrador','usuario','empleado'] },
        { label: 'Licencias',            icon: '📋', href: '/pages/licencias.html',             roles: ['empresa','administrador','usuario','empleado'] },
        { label: 'Asistencia',           icon: '🕐', href: '/pages/asistencia.html',            roles: ['empresa','administrador','usuario','empleado'] },
      ]
    },
    {
      seccion: 'Nómina',
      roles: ['empresa','administrador'],
      items: [
        { label: 'Nómina',         icon: '💰', href: '/pages/nomina.html',           roles: ['empresa','administrador'] },
        { label: 'Horas extras',   icon: '⏰', href: '/pages/horas-extras.html',     roles: ['empresa','administrador','usuario','empleado'] },
        { label: 'Liquidación',    icon: '💼', href: '/pages/liquidacion.html',      roles: ['empresa','administrador'] },
        { label: 'Seg. social',    icon: '❤️', href: '/pages/seguridad-social.html', roles: ['empresa','administrador'] },
        { label: 'Préstamos',      icon: '🏦', href: '/pages/prestamos.html',        roles: ['empresa','administrador','empleado'] },
      ]
    },
    {
      seccion: 'SST',
      roles: ['empresa','administrador','usuario'],
      items: [
        { label: 'ARL · Accidentes',  icon: '🦺', href: '/pages/arl.html',             roles: ['empresa','administrador','usuario'] },
        { label: 'Exámenes médicos',  icon: '🩺', href: '/pages/examenes-medicos.html', roles: ['empresa','administrador'] },
      ]
    },
    {
      seccion: 'Bienestar',
      roles: ['empresa','administrador','usuario','empleado'],
      items: [
        { label: 'Incentivos',    icon: '🎁', href: '/pages/incentivos.html',    roles: ['empresa','administrador'] },
        { label: 'Convivencia',   icon: '⚖️', href: '/pages/convivencia.html',   roles: ['empresa','administrador','empleado'] },
        { label: 'Disciplinario', icon: '📜', href: '/pages/disciplinario.html', roles: ['empresa','administrador'] },
      ]
    },
    {
      seccion: 'IA · Selección',
      roles: ['empresa','administrador'],
      items: [
        { label: 'Asistente IA',       icon: '🤖', href: '/pages/asistente-ia.html', roles: ['empresa','administrador'] },
        { label: 'Aspirantes',         icon: '👔', href: '/pages/aspirantes.html',   roles: ['empresa','administrador'] },
        { label: 'Plantillas contrato',icon: '📄', href: '/pages/contratos.html',    roles: ['empresa','administrador'] },
      ]
    },
    {
      seccion: 'Formación',
      roles: ['empresa','administrador','usuario','empleado'],
      items: [
        { label: 'Capacitaciones', icon: '🎓', href: '/pages/capacitaciones.html', roles: ['empresa','administrador','usuario','empleado'] },
        { label: 'Socialización',  icon: '📢', href: '/pages/socializacion.html',  roles: ['empresa','administrador'] },
      ]
    },
    {
      seccion: 'Operaciones',
      roles: ['empresa','administrador','usuario','empleado'],
      items: [
        { label: 'Proyectos',       icon: '🏗️', href: '/pages/proyectos.html',        roles: ['empresa','administrador','usuario'] },
        { label: 'Cláusulas',       icon: '📋', href: '/pages/clausulas.html',         roles: ['empresa','administrador'] },
        { label: 'Sugerencias jefe',icon: '💬', href: '/pages/sugerencias-jefe.html',  roles: ['empresa','administrador','empleado'] },
      ]
    },
    {
      seccion: 'Seguridad',
      roles: ['empresa','administrador'],
      items: [
        { label: 'Est. seguridad', icon: '🔒', href: '/pages/seguridad.html',           roles: ['empresa'] },
        { label: 'Validación ID',  icon: '🔐', href: '/pages/validacion-identidad.html', roles: ['empresa','administrador'] },
      ]
    },
    {
      seccion: 'Sistema',
      roles: ['empresa','administrador'],
      items: [
        { label: 'Informes',      icon: '📈', href: '/pages/informes.html',     roles: ['empresa','administrador'] },
        { label: 'Usuarios',      icon: '🔑', href: '/pages/usuarios.html',     roles: ['empresa','administrador'] },
        { label: 'Configuración', icon: '⚙️', href: '/pages/config-empresa.html', roles: ['empresa','administrador'] },
        { label: 'Backup',        icon: '💾', href: '/pages/backup.html',       roles: ['empresa','administrador'] },
        { label: 'Auditoría',     icon: '📜', href: '/pages/auditoria.html',    roles: ['empresa'] },
      ]
    },
  ];

  function render(paginaActual, rol) {
    rol = rol || 'empleado';
    var html = '';

    MENU.forEach(function (grupo) {
      // Filtrar items por rol
      var itemsVisibles = grupo.items.filter(function (item) {
        return item.roles.indexOf(rol) !== -1;
      });
      if (itemsVisibles.length === 0) return;

      html += '<div class="nav-section">' + grupo.seccion + '</div>';
      itemsVisibles.forEach(function (item) {
        var esActivo = paginaActual && item.href.indexOf(paginaActual) !== -1 ? ' active' : '';
        html += '<a class="nav-item' + esActivo + '" href="' + item.href + '">' +
          '<span class="nav-icon">' + item.icon + '</span> ' + item.label +
          '</a>';
      });
    });

    // Cerrar sesión siempre al final
    html += '<div class="nav-section">Sesión</div>' +
      '<a class="nav-item" onclick="Auth.logout()" style="cursor:pointer">' +
      '<span class="nav-icon">🚪</span> Cerrar sesión</a>';

    return html;
  }

  function inject(paginaActual) {
    var nav = document.querySelector('nav.sidebar');
    if (!nav) return;
    var session = Auth.getSession ? Auth.getSession() : null;
    var rol = session ? session.rol : 'empleado';
    nav.innerHTML = render(paginaActual, rol);
  }

  return { render: render, inject: inject, MENU: MENU };
})();
