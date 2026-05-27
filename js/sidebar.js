/**
 * IIT RRHH — Sidebar unificado v3.1
 * Con secciones desplegables
 */

var Sidebar = (function () {

  var MENU = [
    {
      seccion: 'Principal', icono: null, desplegable: false,
      roles: ['empresa','administrador','usuario','empleado'],
      items: [
        { label:'Dashboard', icon:'📊', href:'/pages/dashboard.html', roles:['empresa','administrador','usuario','empleado'] },
      ]
    },
    {
      seccion: 'Empleados', icono: null, desplegable: true,
      roles: ['empresa','administrador','usuario'],
      items: [
        { label:'Empleados',      icon:'👥', href:'/pages/empleados.html',      roles:['empresa','administrador','usuario'] },
        { label:'Nuevo empleado', icon:'➕', href:'/pages/nuevo-empleado.html', roles:['empresa','administrador'] },
        { label:'Sábana general', icon:'📋', href:'/pages/sabana.html',         roles:['empresa','administrador'] },
      ]
    },
    {
      seccion: 'Mi información', icono: null, desplegable: true,
      roles: ['empleado','usuario','administrador','empresa'],
      items: [
        { label:'Mi perfil',      icon:'👤', href:'/pages/mi-perfil.html',      roles:['empleado','usuario','administrador','empresa'] },
        { label:'Mis documentos', icon:'📁', href:'/pages/mis-documentos.html', roles:['empleado','usuario','administrador','empresa'] },
      ]
    },
    {
      seccion: 'Tiempo', icono: '🕐', desplegable: true,
      roles: ['empresa','administrador','usuario','empleado'],
      items: [
        { label:'Vacaciones',           icon:'🏖',  href:'/pages/vacaciones.html',           roles:['empresa','administrador','usuario','empleado'] },
        { label:'Permisos',             icon:'⏸',  href:'/pages/permisos.html',             roles:['empresa','administrador','usuario','empleado'] },
        { label:'Permisos remunerados', icon:'⏸',  href:'/pages/permisos-remunerados.html', roles:['empresa','administrador','usuario','empleado'] },
        { label:'Ausencias',            icon:'🚫', href:'/pages/ausencias.html',             roles:['empresa','administrador','usuario','empleado'] },
        { label:'Incapacidades',        icon:'🏥', href:'/pages/incapacidades.html',         roles:['empresa','administrador','usuario','empleado'] },
        { label:'Licencias',            icon:'📋', href:'/pages/licencias.html',             roles:['empresa','administrador','usuario','empleado'] },
        { label:'Asistencia',           icon:'🕐', href:'/pages/asistencia.html',            roles:['empresa','administrador','usuario','empleado'] },
      ]
    },
    {
      seccion: 'Nómina', icono: null, desplegable: true,
      roles: ['empresa','administrador'],
      items: [
        { label:'Nómina',       icon:'💰', href:'/pages/nomina.html',           roles:['empresa','administrador'] },
        { label:'Horas extras', icon:'⏰', href:'/pages/horas-extras.html',     roles:['empresa','administrador','usuario','empleado'] },
        { label:'Liquidación',  icon:'💼', href:'/pages/liquidacion.html',      roles:['empresa','administrador'] },
        { label:'Seg. social',  icon:'❤️', href:'/pages/seguridad-social.html', roles:['empresa','administrador'] },
        { label:'Préstamos',    icon:'🏦', href:'/pages/prestamos.html',        roles:['empresa','administrador','empleado'] },
      ]
    },
    {
      seccion: 'SST', icono: null, desplegable: true,
      roles: ['empresa','administrador','usuario'],
      items: [
        { label:'ARL · Accidentes', icon:'🦺', href:'/pages/arl.html',             roles:['empresa','administrador','usuario'] },
        { label:'Exámenes médicos', icon:'🩺', href:'/pages/examenes-medicos.html', roles:['empresa','administrador'] },
      ]
    },
    {
      seccion: 'Bienestar', icono: null, desplegable: true,
      roles: ['empresa','administrador','usuario','empleado'],
      items: [
        { label:'Incentivos',    icon:'🎁', href:'/pages/incentivos.html',    roles:['empresa','administrador'] },
        { label:'Convivencia',   icon:'⚖️', href:'/pages/convivencia.html',   roles:['empresa','administrador','empleado'] },
        { label:'Disciplinario', icon:'📜', href:'/pages/disciplinario.html', roles:['empresa','administrador'] },
      ]
    },
    {
      seccion: 'IA · Selección', icono: null, desplegable: true,
      roles: ['empresa','administrador'],
      items: [
        { label:'Asistente IA',        icon:'🤖', href:'/pages/asistente-ia.html', roles:['empresa','administrador'] },
        { label:'Aspirantes',          icon:'👔', href:'/pages/aspirantes.html',   roles:['empresa','administrador'] },
        { label:'Plantillas contrato', icon:'📄', href:'/pages/contratos.html',    roles:['empresa','administrador'] },
      ]
    },
    {
      seccion: 'Formación', icono: null, desplegable: true,
      roles: ['empresa','administrador','usuario','empleado'],
      items: [
        { label:'Capacitaciones', icon:'🎓', href:'/pages/capacitaciones.html', roles:['empresa','administrador','usuario','empleado'] },
        { label:'Socialización',  icon:'📢', href:'/pages/socializacion.html',  roles:['empresa','administrador'] },
      ]
    },
    {
      seccion: 'Operaciones', icono: null, desplegable: true,
      roles: ['empresa','administrador','usuario','empleado'],
      items: [
        { label:'Proyectos',        icon:'🏗️', href:'/pages/proyectos.html',       roles:['empresa','administrador','usuario'] },
        { label:'Cláusulas',        icon:'📋', href:'/pages/clausulas.html',        roles:['empresa','administrador'] },
        { label:'Sugerencias jefe', icon:'💬', href:'/pages/sugerencias-jefe.html', roles:['empresa','administrador','empleado'] },
      ]
    },
    {
      seccion: 'Seguridad', icono: null, desplegable: true,
      roles: ['empresa','administrador'],
      items: [
        { label:'Est. seguridad', icon:'🔒', href:'/pages/seguridad.html',            roles:['empresa'] },
        { label:'Validación ID',  icon:'🔐', href:'/pages/validacion-identidad.html', roles:['empresa','administrador'] },
      ]
    },
    {
      seccion: 'Sistema', icono: null, desplegable: true,
      roles: ['empresa','administrador'],
      items: [
        { label:'Informes',      icon:'📈', href:'/pages/informes.html',      roles:['empresa','administrador'] },
        { label:'Usuarios',      icon:'🔑', href:'/pages/usuarios.html',      roles:['empresa','administrador'] },
        { label:'Configuración', icon:'⚙️', href:'/pages/config-empresa.html', roles:['empresa','administrador'] },
        { label:'Backup',        icon:'💾', href:'/pages/backup.html',        roles:['empresa','administrador'] },
        { label:'Auditoría',     icon:'📜', href:'/pages/auditoria.html',     roles:['empresa'] },
      ]
    },
  ];

  // Inyectar estilos del sidebar desplegable una sola vez
  function inyectarEstilos() {
    if (document.getElementById('sidebar-styles')) return;
    var style = document.createElement('style');
    style.id = 'sidebar-styles';
    style.textContent = `
      .nav-grupo-header {
        display:flex;align-items:center;justify-content:space-between;
        padding:4px 16px;cursor:pointer;user-select:none;
        border-radius:var(--radius);transition:background .15s;
      }
      .nav-grupo-header:hover { background:var(--primary-light); }
      .nav-grupo-header .nav-section-label {
        font-size:10px;font-weight:600;letter-spacing:.08em;
        text-transform:uppercase;color:var(--text-muted);
      }
      .nav-grupo-header .nav-chevron {
        font-size:10px;color:var(--text-muted);
        transition:transform .2s;display:inline-block;
      }
      .nav-grupo-header.abierto .nav-chevron { transform:rotate(180deg); }
      .nav-grupo-items {
        overflow:hidden;
        max-height:0;
        transition:max-height .25s ease;
      }
      .nav-grupo-items.abierto { max-height:600px; }
      .nav-grupo-items .nav-item { padding-left:24px; }
    `;
    document.head.appendChild(style);
  }

  function paginaActiva(href, pagina) {
    return pagina && href.indexOf(pagina) !== -1;
  }

  function render(paginaActual, rol) {
    rol = rol || 'empleado';
    var html = '';

    MENU.forEach(function (grupo) {
      var itemsVisibles = grupo.items.filter(function (item) {
        return item.roles.indexOf(rol) !== -1;
      });
      if (itemsVisibles.length === 0) return;

      // Verificar si algún item del grupo está activo
      var grupoActivo = itemsVisibles.some(function(item){
        return paginaActiva(item.href, paginaActual);
      });

      if (grupo.desplegable) {
        // Sección desplegable
        var abierto = grupoActivo ? ' abierto' : '';
        html += '<div class="nav-grupo">';
        html += '<div class="nav-grupo-header' + abierto + '" onclick="Sidebar.toggleGrupo(this)">' +
          '<span class="nav-section-label">' + (grupo.icono ? grupo.icono + ' ' : '') + grupo.seccion + '</span>' +
          '<span class="nav-chevron">▾</span>' +
          '</div>';
        html += '<div class="nav-grupo-items' + abierto + '">';
        itemsVisibles.forEach(function (item) {
          var activo = paginaActiva(item.href, paginaActual) ? ' active' : '';
          html += '<a class="nav-item' + activo + '" href="' + item.href + '">' +
            '<span class="nav-icon">' + item.icon + '</span> ' + item.label + '</a>';
        });
        html += '</div>';
        html += '</div>';
      } else {
        // Sección normal
        html += '<div class="nav-section">' + grupo.seccion + '</div>';
        itemsVisibles.forEach(function (item) {
          var activo = paginaActiva(item.href, paginaActual) ? ' active' : '';
          html += '<a class="nav-item' + activo + '" href="' + item.href + '">' +
            '<span class="nav-icon">' + item.icon + '</span> ' + item.label + '</a>';
        });
      }
    });

    html += '<div class="nav-section">Sesión</div>' +
      '<a class="nav-item" onclick="Auth.logout()" style="cursor:pointer">' +
      '<span class="nav-icon">🚪</span> Cerrar sesión</a>';

    return html;
  }

  function inject(paginaActual) {
    inyectarEstilos();
    var nav = document.getElementById('main-sidebar');
    if (!nav) nav = document.querySelector('nav.sidebar');
    if (!nav) return;
    var session = Auth.getSession ? Auth.getSession() : null;
    var rol = session ? session.rol : 'empleado';
    nav.innerHTML = render(paginaActual, rol);
    // Calcular alturas reales para los grupos ya abiertos
    setTimeout(function() {
      nav.querySelectorAll('.nav-grupo-items.abierto').forEach(function(el) {
        el.style.maxHeight = el.scrollHeight + 'px';
      });
    }, 10);
  }

  function toggleGrupo(header) {
    header.classList.toggle('abierto');
    var items = header.nextElementSibling;
    if (items) {
      items.classList.toggle('abierto');
      // Calcular altura real para animación suave
      if (items.classList.contains('abierto')) {
        items.style.maxHeight = items.scrollHeight + 'px';
      } else {
        items.style.maxHeight = '0';
      }
    }
  }

  return { render:render, inject:inject, toggleGrupo:toggleGrupo, MENU:MENU };
})();
