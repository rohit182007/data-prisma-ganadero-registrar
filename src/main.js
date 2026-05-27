import './style.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;

const REDIRECT_URI = `${window.location.origin}/`;
const TOKEN_STORAGE_KEY = 'demo_auth_tokens';
const PKCE_STORAGE_KEY = 'demo_pkce_verifier';
const MANUAL_LOGOUT_KEY = 'demo_manual_logout';

document.querySelector('#app').innerHTML = `
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">✦</div>
        <div>
          <h1>Holstein</h1>
          <p>de México</p>
        </div>
      </div>

      <nav class="menu">
        <p class="menu-section">Principal</p>

        <button class="menu-item ghost" id="dashboardBtn" type="button">
          <span>⌂</span>
          Dashboard
        </button>

        <button class="menu-item active" id="vacasMenuBtn" type="button">
          <span>🐄</span>
          Animales
          <small>Vacas</small>
        </button>

        <button class="menu-item ghost" id="hatoRanchoBtn" type="button">
          <span>⌘</span>
          Hato y Rancho
        </button>

        <p class="menu-section">Operaciones</p>

        <button class="submenu-item active" id="registrarVacaBtn" type="button">
          <span>＋</span>
          Registrar
        </button>

        <button class="submenu-item" id="vista360Btn" type="button">
          <span>◎</span>
          Vista 360
        </button>

        <button class="menu-item ghost" id="produccionBtn" type="button">
          <span>◌</span>
          Producción
        </button>

        <button class="menu-item ghost" id="laboratorioBtn" type="button">
          <span>▣</span>
          Laboratorio
        </button>

        <button class="menu-item ghost" id="certificacionBtn" type="button">
          <span>✓</span>
          Certificación
        </button>

        <p class="menu-section">Gestión</p>

        <button class="menu-item ghost" id="reportesBtn" type="button">
          <span>◈</span>
          Reportes
        </button>

        <button class="menu-item ghost" id="analyticsBtn" type="button">
          <span>▤</span>
          Analytics
        </button>

        <p class="menu-section">Configuración</p>

        <button class="menu-item ghost" id="usuariosBtn" type="button">
          <span>⚙</span>
          Usuarios
        </button>
      </nav>

      <div class="sidebar-footer">
        <p id="authStatus">Revisando sesión...</p>
        <button id="loginBtn" class="secondary hidden">Iniciar sesión</button>
        <button id="logoutBtn" class="secondary hidden">Cerrar sesión</button>
      </div>
    </aside>

    <main class="main-content">
      <section class="app-topbar">
        <div class="global-search">
          <span>⌕</span>
          <input id="globalSearchInput" type="search" placeholder="Buscar animales, aretes, socios, hatos..." />
        </div>

        <div class="topbar-actions">
          <button class="quick-add" id="quickAddBtn" type="button">+ Nuevo</button>
          <button class="icon-button" type="button" aria-label="Notificaciones">◔</button>
          <div class="user-chip">
            <span>AV</span>
            <div>
              <strong>Ana Vargas</strong>
              <small>Administrador</small>
            </div>
          </div>
        </div>
      </section>

      <section class="topbar module-header">
        <div>
          <div class="breadcrumb">
            <span>Registro</span>
            <span>›</span>
            <span>Animales</span>
            <span>›</span>
            <strong id="breadcrumbCurrent">Registrar</strong>
          </div>
          <p class="eyebrow" id="moduleEyebrow">Módulo de Vacas</p>
          <h2 id="moduleTitle">Registrar Vaca</h2>
          <p class="subtitle" id="moduleSubtitle">
            Alta de animales Holstein dentro del sistema ganadero.
          </p>
        </div>
      </section>

      <section id="appContent" class="hidden">
        <section id="registrarSection" class="content-grid">
          <form id="cowForm" class="card form-card">
            <div class="section-heading-row">
              <div>
                <p class="eyebrow">Alta individual</p>
                <h3>Registrar vaca</h3>
              </div>
              <span class="status-pill soft">Registro</span>
            </div>

            <div class="form-grid">
              <label>
                Número de arete *
                <input id="arete" type="text" placeholder="Ej. MX-001" required />
              </label>

              <label>
                Nombre / identificación
                <input id="nombre" type="text" placeholder="Ej. Luna" />
              </label>

              <label>
                Raza
                <select id="raza">
                  <option value="Holstein">Holstein</option>
                  <option value="Jersey">Jersey</option>
                  <option value="Pardo Suizo">Pardo Suizo</option>
                  <option value="Otra">Otra</option>
                </select>
              </label>

              <label>
                Fecha de nacimiento
                <input id="fechaNacimiento" type="date" />
              </label>

              <label>
                Sexo
                <select id="sexo">
                  <option value="Hembra">Hembra</option>
                  <option value="Macho">Macho</option>
                </select>
              </label>

              <label>
                Estado productivo
                <select id="estadoProductivo">
                  <option value="Becerra">Becerra</option>
                  <option value="Vaquilla">Vaquilla</option>
                  <option value="Vaca en producción">Vaca en producción</option>
                  <option value="Vaca seca">Vaca seca</option>
                  <option value="Baja">Baja</option>
                </select>
              </label>

              <label>
                Padre
                <input id="padre" type="text" placeholder="Ej. Toro 123" />
              </label>

              <label>
                Madre
                <input id="madre" type="text" placeholder="Ej. Vaca 456" />
              </label>

              <label>
                Rancho / establo
                <input id="rancho" type="text" placeholder="Ej. Rancho Principal" />
              </label>
            </div>

            <label>
              Observaciones
              <textarea id="observaciones" placeholder="Notas clínicas, productivas o administrativas"></textarea>
            </label>

            <button type="submit" id="submitBtn">Guardar vaca</button>
            <p id="formMessage"></p>
          </form>

          <section class="card helper-card dashboard-helper">
            <div class="mini-dashboard-card">
              <span>Flujo recomendado</span>
              <strong>Alta → Vista 360 → Eventos</strong>
              <p>Registra una vaca o becerra y después consulta su ficha completa por arete o nombre.</p>
            </div>

            <div class="mini-dashboard-list">
              <div><span></span> Datos generales y genealogía</div>
              <div><span></span> Eventos de producción, salud y reproducción</div>
              <div><span></span> Historial integrado por animal</div>
            </div>
          </section>
        </section>

        <section id="vista360Section" class="hidden">
          <section class="card search-panel">
            <div class="section-heading-row">
              <div>
                <p class="eyebrow">Consulta individual</p>
                <h3>Vista 360 de vaca</h3>
                <p class="muted">
                  Busca una vaca por número de arete o nombre para consultar su información completa.
                </p>
              </div>
              <span class="status-pill soft">Activo</span>
            </div>

            <div class="search-row">
              <input id="cowSearchInput" type="text" placeholder="Buscar por arete o nombre. Ej. MX-001 o Luna" />
              <button id="cowSearchBtn" type="button">Buscar</button>
            </div>

            <div id="searchMessage" class="muted"></div>
            <div id="cow360Result" class="cow360-result"></div>
          </section>
        </section>

        <section id="dashboardSection" class="hidden module-page">
          <section class="card module-page-hero">
            <div>
              <p class="eyebrow">Resumen operativo</p>
              <h3>Dashboard</h3>
              <p class="muted">Vista ejecutiva del sistema ganadero: animales, producción, alertas y actividad reciente.</p>
            </div>
            <span class="status-pill soft">Preparado</span>
          </section>

          <div class="module-card-grid">
            <article class="module-feature-card"><span>🐄</span><strong>Animales activos</strong><p>Resumen del hato y accesos rápidos a registros.</p></article>
            <article class="module-feature-card"><span>◌</span><strong>Producción</strong><p>Indicadores productivos y eventos recientes.</p></article>
            <article class="module-feature-card"><span>⚕</span><strong>Salud</strong><p>Alertas veterinarias, vacunas y revisiones.</p></article>
            <article class="module-feature-card"><span>▤</span><strong>Analytics</strong><p>Base para métricas y reportes ejecutivos.</p></article>
          </div>
        </section>

        <section id="hatoRanchoSection" class="hidden module-page">
          <section class="card module-page-hero">
            <div>
              <p class="eyebrow">Estructura ganadera</p>
              <h3>Hato y Rancho</h3>
              <p class="muted">Administración de ranchos, establos, hatos, corrales y ubicación operativa de animales.</p>
            </div>
            <span class="status-pill soft">Módulo base</span>
          </section>

          <div class="module-card-grid">
            <article class="module-feature-card"><span>⌘</span><strong>Ranchos / establos</strong><p>Catálogo de unidades productivas.</p></article>
            <article class="module-feature-card"><span>▥</span><strong>Hatos</strong><p>Agrupación de animales por operación.</p></article>
            <article class="module-feature-card"><span>⌖</span><strong>Corrales</strong><p>Ubicación física y manejo de lotes.</p></article>
          </div>
        </section>

        <section id="produccionSection" class="hidden module-page">
          <section class="card module-page-hero">
            <div>
              <p class="eyebrow">Operaciones</p>
              <h3>Producción</h3>
              <p class="muted">Consulta global de producción de leche por vaca, fecha, turno y calidad.</p>
            </div>
            <div class="module-actions">
              <button id="productionRefreshBtn" type="button">Actualizar</button>
              <span class="status-pill soft">Conectado a eventos</span>
            </div>
          </section>

          <section class="card production-filters-card">
            <div class="section-heading-row">
              <div>
                <p class="eyebrow">Filtros</p>
                <h3>Filtrar registros de producción</h3>
              </div>
              <span class="status-pill soft">Fecha / vaca / turno</span>
            </div>

            <div class="production-filters-grid">
              <label>
                Desde
                <input id="productionDateFrom" type="date" />
              </label>

              <label>
                Hasta
                <input id="productionDateTo" type="date" />
              </label>

              <label>
                Vaca / arete
                <input id="productionCowFilter" type="search" placeholder="Ej. MX-001 o Luna" />
              </label>

              <label>
                Turno
                <select id="productionShiftFilter">
                  <option value="">Todos</option>
                  <option value="Mañana">Mañana</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noche">Noche</option>
                </select>
              </label>

              <label>
                Calidad
                <input id="productionQualityFilter" type="search" placeholder="Ej. buena, normal" />
              </label>
            </div>

            <div class="filter-actions">
              <button id="productionApplyFiltersBtn" type="button">Aplicar filtros</button>
              <button id="productionClearFiltersBtn" class="secondary-light" type="button">Limpiar filtros</button>
            </div>
          </section>

          <section id="productionContent" class="production-content">
            <section class="card">
              <p class="muted">Carga el módulo para consultar los registros de producción.</p>
            </section>
          </section>
        </section>

        <section id="laboratorioSection" class="hidden module-page">
          <section class="card module-page-hero">
            <div>
              <p class="eyebrow">Operaciones</p>
              <h3>Laboratorio</h3>
              <p class="muted">Preparado para muestras, resultados, análisis de leche, sanidad y trazabilidad técnica.</p>
            </div>
            <span class="status-pill soft">Pendiente integración</span>
          </section>

          <div class="module-card-grid">
            <article class="module-feature-card"><span>▣</span><strong>Muestras</strong><p>Recepción y control de muestras por animal.</p></article>
            <article class="module-feature-card"><span>⚗</span><strong>Resultados</strong><p>Captura de resultados de laboratorio.</p></article>
            <article class="module-feature-card"><span>📎</span><strong>Documentos</strong><p>Adjuntos y evidencias futuras.</p></article>
          </div>
        </section>

        <section id="certificacionSection" class="hidden module-page">
          <section class="card module-page-hero">
            <div>
              <p class="eyebrow">Operaciones</p>
              <h3>Certificación</h3>
              <p class="muted">Seguimiento de certificaciones, pureza Holstein, evaluaciones y cumplimiento.</p>
            </div>
            <span class="status-pill soft">Módulo base</span>
          </section>

          <div class="module-card-grid">
            <article class="module-feature-card"><span>✓</span><strong>Certificados</strong><p>Preparado para constancias y documentos.</p></article>
            <article class="module-feature-card"><span>✦</span><strong>Pureza</strong><p>Base para indicadores de raza y linaje.</p></article>
            <article class="module-feature-card"><span>◎</span><strong>Evaluación</strong><p>Conexión futura con evaluación genética.</p></article>
          </div>
        </section>

        <section id="reportesSection" class="hidden module-page">
          <section class="card module-page-hero">
            <div>
              <p class="eyebrow">Gestión</p>
              <h3>Reportes</h3>
              <p class="muted">Centro de reportes operativos para animales, producción, salud, reproducción y administración.</p>
            </div>
            <span class="status-pill soft">Preparado</span>
          </section>

          <div class="module-card-grid">
            <article class="module-feature-card"><span>◈</span><strong>Reporte de animales</strong><p>Inventario y estado productivo.</p></article>
            <article class="module-feature-card"><span>◌</span><strong>Reporte productivo</strong><p>Producción por fecha, turno y animal.</p></article>
            <article class="module-feature-card"><span>⚕</span><strong>Reporte sanitario</strong><p>Vacunas y revisiones veterinarias.</p></article>
          </div>
        </section>

        <section id="analyticsSection" class="hidden module-page">
          <section class="card module-page-hero">
            <div>
              <p class="eyebrow">Gestión</p>
              <h3>Analytics</h3>
              <p class="muted">Indicadores avanzados, gráficas, tendencias productivas y métricas ejecutivas.</p>
            </div>
            <span class="status-pill soft">Próxima fase</span>
          </section>

          <div class="module-card-grid">
            <article class="module-feature-card"><span>▤</span><strong>Producción histórica</strong><p>Gráficas por animal y hato.</p></article>
            <article class="module-feature-card"><span>↗</span><strong>Tendencias</strong><p>Variación productiva y alertas.</p></article>
            <article class="module-feature-card"><span>◎</span><strong>KPIs</strong><p>Resumen ejecutivo de operación.</p></article>
          </div>
        </section>

        <section id="usuariosSection" class="hidden module-page">
          <section class="card module-page-hero">
            <div>
              <p class="eyebrow">Configuración</p>
              <h3>Usuarios</h3>
              <p class="muted">Administración futura de usuarios, roles, permisos y acceso por módulo.</p>
            </div>
            <span class="status-pill soft">Cognito</span>
          </section>

          <div class="module-card-grid">
            <article class="module-feature-card"><span>⚙</span><strong>Roles</strong><p>Admin, veterinario y supervisor.</p></article>
            <article class="module-feature-card"><span>👤</span><strong>Usuarios</strong><p>Gestión futura conectada con Cognito.</p></article>
            <article class="module-feature-card"><span>🔒</span><strong>Permisos</strong><p>Acceso por módulo y acción.</p></article>
          </div>
        </section>
      </section>
    </main>
  </div>
`;

const authStatus = document.querySelector('#authStatus');
const loginBtn = document.querySelector('#loginBtn');
const logoutBtn = document.querySelector('#logoutBtn');
const appContent = document.querySelector('#appContent');

const cowForm = document.querySelector('#cowForm');
const formMessage = document.querySelector('#formMessage');

const moduleTitle = document.querySelector('#moduleTitle');
const moduleSubtitle = document.querySelector('#moduleSubtitle');
const breadcrumbCurrent = document.querySelector('#breadcrumbCurrent');

const dashboardBtn = document.querySelector('#dashboardBtn');
const vacasMenuBtn = document.querySelector('#vacasMenuBtn');
const hatoRanchoBtn = document.querySelector('#hatoRanchoBtn');
const registrarVacaBtn = document.querySelector('#registrarVacaBtn');
const vista360Btn = document.querySelector('#vista360Btn');
const produccionBtn = document.querySelector('#produccionBtn');
const laboratorioBtn = document.querySelector('#laboratorioBtn');
const certificacionBtn = document.querySelector('#certificacionBtn');
const reportesBtn = document.querySelector('#reportesBtn');
const analyticsBtn = document.querySelector('#analyticsBtn');
const usuariosBtn = document.querySelector('#usuariosBtn');
const quickAddBtn = document.querySelector('#quickAddBtn');

const registrarSection = document.querySelector('#registrarSection');
const vista360Section = document.querySelector('#vista360Section');
const dashboardSection = document.querySelector('#dashboardSection');
const hatoRanchoSection = document.querySelector('#hatoRanchoSection');
const produccionSection = document.querySelector('#produccionSection');
const laboratorioSection = document.querySelector('#laboratorioSection');
const certificacionSection = document.querySelector('#certificacionSection');
const reportesSection = document.querySelector('#reportesSection');
const analyticsSection = document.querySelector('#analyticsSection');
const usuariosSection = document.querySelector('#usuariosSection');

const cowSearchInput = document.querySelector('#cowSearchInput');
const cowSearchBtn = document.querySelector('#cowSearchBtn');
const searchMessage = document.querySelector('#searchMessage');
const cow360Result = document.querySelector('#cow360Result');
const globalSearchInput = document.querySelector('#globalSearchInput');

function getTokens() {
  const rawTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
  return rawTokens ? JSON.parse(rawTokens) : null;
}

function isLoggedIn() {
  const tokens = getTokens();
  return Boolean(tokens?.access_token);
}

function getAuthToken() {
  return getTokens()?.access_token;
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function showSection(sectionName) {
  const pageConfig = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Resumen ejecutivo del sistema Holstein.',
      breadcrumb: 'Dashboard',
      section: dashboardSection,
      activeButtons: [dashboardBtn]
    },
    registrar: {
      title: 'Registrar Vaca',
      subtitle: 'Alta de animales Holstein dentro del sistema ganadero.',
      breadcrumb: 'Registrar',
      section: registrarSection,
      activeButtons: [vacasMenuBtn, registrarVacaBtn]
    },
    vista360: {
      title: 'Vista 360',
      subtitle: 'Consulta integral de una vaca por arete o nombre.',
      breadcrumb: 'Ficha 360',
      section: vista360Section,
      activeButtons: [vacasMenuBtn, vista360Btn]
    },
    hatoRancho: {
      title: 'Hato y Rancho',
      subtitle: 'Administración de ranchos, hatos, corrales y estructura ganadera.',
      breadcrumb: 'Hato y Rancho',
      section: hatoRanchoSection,
      activeButtons: [hatoRanchoBtn]
    },
    produccion: {
      title: 'Producción',
      subtitle: 'Registro y análisis de producción lechera por animal, fecha y turno.',
      breadcrumb: 'Producción',
      section: produccionSection,
      activeButtons: [produccionBtn]
    },
    laboratorio: {
      title: 'Laboratorio',
      subtitle: 'Control de muestras, resultados y trazabilidad técnica.',
      breadcrumb: 'Laboratorio',
      section: laboratorioSection,
      activeButtons: [laboratorioBtn]
    },
    certificacion: {
      title: 'Certificación',
      subtitle: 'Seguimiento de certificaciones, pureza, linaje y evaluación.',
      breadcrumb: 'Certificación',
      section: certificacionSection,
      activeButtons: [certificacionBtn]
    },
    reportes: {
      title: 'Reportes',
      subtitle: 'Reportes operativos y administrativos del sistema ganadero.',
      breadcrumb: 'Reportes',
      section: reportesSection,
      activeButtons: [reportesBtn]
    },
    analytics: {
      title: 'Analytics',
      subtitle: 'Indicadores avanzados, tendencias y análisis ejecutivo.',
      breadcrumb: 'Analytics',
      section: analyticsSection,
      activeButtons: [analyticsBtn]
    },
    usuarios: {
      title: 'Usuarios',
      subtitle: 'Administración futura de usuarios, roles y permisos del sistema.',
      breadcrumb: 'Usuarios',
      section: usuariosSection,
      activeButtons: [usuariosBtn]
    }
  };

  const config = pageConfig[sectionName] || pageConfig.dashboard;

  moduleTitle.textContent = config.title;
  moduleSubtitle.textContent = config.subtitle;
  breadcrumbCurrent.textContent = config.breadcrumb;

  Object.values(pageConfig).forEach((page) => {
    page.section?.classList.add('hidden');
  });

  document.querySelectorAll('.menu-item, .submenu-item').forEach((button) => {
    button.classList.remove('active');
  });

  config.section?.classList.remove('hidden');
  config.activeButtons.forEach((button) => button?.classList.add('active'));

  if (sectionName === 'produccion') {
    loadProductionModule();
  }
}

function updateAuthUI() {
  if (isLoggedIn()) {
    sessionStorage.removeItem(MANUAL_LOGOUT_KEY);

    authStatus.textContent = 'Sesión iniciada';
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    appContent.classList.remove('hidden');
    showSection('registrar');
    return;
  }

  const wasManualLogout = sessionStorage.getItem(MANUAL_LOGOUT_KEY) === 'true';

  if (wasManualLogout) {
    authStatus.textContent = 'Sesión cerrada';
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    appContent.classList.add('hidden');
    return;
  }

  authStatus.textContent = 'Redirigiendo a inicio de sesión...';
  loginBtn.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  appContent.classList.add('hidden');

  login();
}

async function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function login() {
  const verifier = await generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  sessionStorage.setItem(PKCE_STORAGE_KEY, verifier);

  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    response_type: 'code',
    scope: 'openid email profile',
    redirect_uri: REDIRECT_URI,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  });

  window.location.href = `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
}

function logout() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(PKCE_STORAGE_KEY);
  sessionStorage.setItem(MANUAL_LOGOUT_KEY, 'true');

  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    logout_uri: REDIRECT_URI
  });

  window.location.href = `${COGNITO_DOMAIN}/logout?${params.toString()}`;
}

async function handleAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (!code) {
    return;
  }

  const verifier = sessionStorage.getItem(PKCE_STORAGE_KEY);

  if (!verifier) {
    window.history.replaceState({}, document.title, REDIRECT_URI);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(PKCE_STORAGE_KEY);
    await login();
    return;
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: COGNITO_CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier
  });

  const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al obtener token: ${text}`);
  }

  const tokens = await response.json();

  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  sessionStorage.removeItem(PKCE_STORAGE_KEY);

  window.history.replaceState({}, document.title, REDIRECT_URI);
}

function getCowPayload() {
  return {
    type: 'cow',
    arete: document.querySelector('#arete').value.trim(),
    nombre: document.querySelector('#nombre').value.trim(),
    raza: document.querySelector('#raza').value,
    fechaNacimiento: document.querySelector('#fechaNacimiento').value,
    sexo: document.querySelector('#sexo').value,
    estadoProductivo: document.querySelector('#estadoProductivo').value,
    padre: document.querySelector('#padre').value.trim(),
    madre: document.querySelector('#madre').value.trim(),
    rancho: document.querySelector('#rancho').value.trim(),
    observaciones: document.querySelector('#observaciones').value.trim()
  };
}

async function getCows() {
  const response = await fetch(`${API_BASE_URL}/items`, {
    headers: {
      ...authHeaders()
    }
  });

  if (!response.ok) {
    throw new Error(`Error al cargar vacas: ${response.status}`);
  }

  const items = await response.json();

  return items.filter((item) => item.type === 'cow' || item.arete);
}

async function getCowsAndEvents() {
  const response = await fetch(`${API_BASE_URL}/items`, {
    headers: {
      ...authHeaders()
    }
  });

  if (!response.ok) {
    throw new Error(`Error al cargar información: ${response.status}`);
  }

  return response.json();
}

async function createCow(event) {
  event.preventDefault();

  const payload = getCowPayload();

  if (!payload.arete) {
    formMessage.textContent = 'El número de arete es obligatorio.';
    formMessage.className = 'error';
    return;
  }

  formMessage.textContent = 'Guardando vaca...';
  formMessage.className = 'muted';

  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error al guardar vaca: ${response.status}`);
    }

    cowForm.reset();
    document.querySelector('#raza').value = 'Holstein';
    document.querySelector('#sexo').value = 'Hembra';
    document.querySelector('#estadoProductivo').value = 'Becerra';

    formMessage.textContent = 'Vaca registrada correctamente.';
    formMessage.className = 'success';

    showSection('vista360');
    cowSearchInput.value = payload.arete;
    await searchCow360();
  } catch (error) {
    console.error(error);
    formMessage.textContent = error.message;
    formMessage.className = 'error';
  }
}

function calculateAge(fechaNacimiento) {
  if (!fechaNacimiento) {
    return 'N/D';
  }

  const birthDate = new Date(fechaNacimiento);
  const today = new Date();

  if (Number.isNaN(birthDate.getTime())) {
    return 'N/D';
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0) {
    return `${months} meses`;
  }

  if (months === 0) {
    return `${years} años`;
  }

  return `${years} años ${months} meses`;
}

function renderCow360(cow) {
  cow360Result.innerHTML = `
    <div class="cow-profile">
      <div class="cow-profile-hero">
        <div class="cow-photo-card">
          <div class="cow-photo">🐄</div>
          <button class="photo-action" type="button">Ver galería</button>
        </div>

        <div class="cow-identity-card">
          <div class="identity-topline">
            <p class="eyebrow">Ficha 360</p>
            <span class="status-pill">Activo</span>
          </div>
          <h3>${cow.nombre || 'Sin nombre'} <small>${cow.arete || 'Sin arete'}</small></h3>
          <div class="identity-grid">
            <div><span>Hato</span><strong>${cow.rancho || 'N/D'}</strong></div>
            <div><span>Sexo</span><strong>${cow.sexo || 'N/D'}</strong></div>
            <div><span>Raza</span><strong>${cow.raza || 'N/D'}</strong></div>
            <div><span>Estado</span><strong>${cow.estadoProductivo || 'N/D'}</strong></div>
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card highlight">
          <span>Estado</span>
          <strong>${cow.estadoProductivo || 'N/D'}</strong>
        </div>

        <div class="kpi-card">
          <span>Pureza / raza</span>
          <strong>${cow.raza || 'N/D'}</strong>
        </div>

        <div class="kpi-card">
          <span>Edad aprox.</span>
          <strong>${calculateAge(cow.fechaNacimiento)}</strong>
        </div>

        <div class="kpi-card">
          <span>Rancho</span>
          <strong>${cow.rancho || 'N/D'}</strong>
        </div>
      </div>

      <div class="tabs-360">
        <button class="tab-360 active" data-tab="general">Resumen</button>
        <button class="tab-360" data-tab="genealogia">Genealogía</button>
        <button class="tab-360" data-tab="produccion">Producción</button>
        <button class="tab-360" data-tab="reproduccion">Reproducción</button>
        <button class="tab-360" data-tab="salud">Salud</button>
        <button class="tab-360" data-tab="historial">Historial</button>
      </div>

      <div class="tab-content-360" id="tab-general">
        <h4>Resumen general</h4>

        <div class="info-grid">
          <div>
            <span>Número de arete</span>
            <strong>${cow.arete || 'N/D'}</strong>
          </div>

          <div>
            <span>Nombre / identificación</span>
            <strong>${cow.nombre || 'N/D'}</strong>
          </div>

          <div>
            <span>Raza</span>
            <strong>${cow.raza || 'N/D'}</strong>
          </div>

          <div>
            <span>Fecha de nacimiento</span>
            <strong>${cow.fechaNacimiento || 'N/D'}</strong>
          </div>

          <div>
            <span>Sexo</span>
            <strong>${cow.sexo || 'N/D'}</strong>
          </div>

          <div>
            <span>Estado productivo</span>
            <strong>${cow.estadoProductivo || 'N/D'}</strong>
          </div>

          <div>
            <span>Rancho / establo</span>
            <strong>${cow.rancho || 'N/D'}</strong>
          </div>

          <div>
            <span>Fecha de alta</span>
            <strong>${cow.createdAt ? new Date(cow.createdAt).toLocaleString() : 'N/D'}</strong>
          </div>
        </div>

        <div class="notes-box">
          <span>Observaciones</span>
          <p>${cow.observaciones || 'Sin observaciones registradas.'}</p>
        </div>
      </div>

      <div class="tab-content-360 hidden" id="tab-genealogia">
        <h4>Genealogía</h4>
      
        <div class="pedigree-board">
          <div class="pedigree-row ancestors">
            <div class="pedigree-card muted-card">
              <span>Abuelo paterno</span>
              <strong>N/D</strong>
            </div>
      
            <div class="pedigree-card muted-card">
              <span>Abuela paterna</span>
              <strong>N/D</strong>
            </div>
      
            <div class="pedigree-card muted-card">
              <span>Abuelo materno</span>
              <strong>N/D</strong>
            </div>
      
            <div class="pedigree-card muted-card">
              <span>Abuela materna</span>
              <strong>N/D</strong>
            </div>
          </div>
      
          <div class="pedigree-row parents">
            <div class="pedigree-card">
              <span>Padre</span>
              <strong>${cow.padre || 'N/D'}</strong>
            </div>
      
            <div class="pedigree-card">
              <span>Madre</span>
              <strong>${cow.madre || 'N/D'}</strong>
            </div>
          </div>
      
          <div class="pedigree-row current">
            <div class="pedigree-card current-animal">
              <span>Animal actual</span>
              <strong>${cow.arete || 'Sin arete'} — ${cow.nombre || 'Sin nombre'}</strong>
              <p>${cow.raza || 'Raza no definida'} · ${cow.estadoProductivo || 'Estado no definido'}</p>
            </div>
          </div>
        </div>
      
        <p class="muted">
          Esta sección queda preparada para integrar evaluación genética, pureza Holstein,
          abuelo materno, abuelo paterno e indicadores de linaje.
        </p>
      </div>

      <div class="tab-content-360 hidden" id="tab-produccion">
        <h4>Producción</h4>
        <div id="productionEventsList" class="timeline">
          <p class="muted">Cargando eventos de producción...</p>
        </div>
      </div>

      <div class="tab-content-360 hidden" id="tab-reproduccion">
        <h4>Reproducción</h4>
        <div id="reproductionEventsList" class="timeline">
          <p class="muted">Cargando eventos reproductivos...</p>
        </div>
      </div>

      <div class="tab-content-360 hidden" id="tab-salud">
        <h4>Salud</h4>
        <div id="healthEventsList" class="timeline">
          <p class="muted">Cargando eventos de salud...</p>
        </div>
      </div>

      <div class="tab-content-360 hidden" id="tab-historial">
        <h4>Historial de eventos</h4>

        <form id="cowEventForm" class="event-form">
          <div class="form-grid">
            <label>
              Tipo de evento
              <select id="eventType">
                <option value="Observación general">Observación general</option>
                <option value="Parto">Parto</option>
                <option value="Servicio / inseminación">Servicio / inseminación</option>
                <option value="Vacuna">Vacuna</option>
                <option value="Revisión veterinaria">Revisión veterinaria</option>
                <option value="Producción">Producción</option>
                <option value="Baja">Baja</option>
              </select>
            </label>

            <label>
              Fecha del evento
              <input id="eventDate" type="date" />
            </label>

            <label>
              Responsable
              <input id="eventResponsible" type="text" placeholder="Ej. Dr. López" />
            </label>
          </div>

          <div id="eventDynamicFields" class="dynamic-fields"></div>

          <label>
            Descripción
            <textarea id="eventDescription" placeholder="Describe el evento registrado"></textarea>
          </label>

          <button type="submit">Agregar evento</button>
          <p id="eventMessage" class="muted"></p>
        </form>

        <div id="cowEventsList" class="timeline">
          <p class="muted">Cargando eventos...</p>
        </div>
      </div>

      <div class="profile-actions">
        <button class="danger" type="button" id="deleteCow360Btn">Eliminar vaca</button>
      </div>
    </div>
  `;

  document.querySelectorAll('.tab-360').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedTab = button.dataset.tab;

      document.querySelectorAll('.tab-360').forEach((tabButton) => {
        tabButton.classList.remove('active');
      });

      document.querySelectorAll('.tab-content-360').forEach((content) => {
        content.classList.add('hidden');
      });

      button.classList.add('active');
      document.querySelector(`#tab-${selectedTab}`).classList.remove('hidden');
    });
  });

  document.querySelector('#deleteCow360Btn').addEventListener('click', async () => {
    await deleteCow(cow.id);
    cow360Result.innerHTML = '';
    searchMessage.textContent = 'Vaca eliminada correctamente.';
  });

  renderEventDynamicFields();

  document.querySelector('#eventType').addEventListener('change', renderEventDynamicFields);

  document.querySelector('#cowEventForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await createCowEvent(cow);
  });

  loadCowEvents(cow.id);
  loadCowCategoryEvents(cow.id, 'production');
  loadCowCategoryEvents(cow.id, 'reproduction');
  loadCowCategoryEvents(cow.id, 'health');
}

async function searchCow360() {
  const query = cowSearchInput.value.trim().toLowerCase();

  if (!query) {
    searchMessage.textContent = 'Ingresa un arete o nombre para buscar.';
    cow360Result.innerHTML = '';
    return;
  }

  searchMessage.textContent = 'Buscando vaca...';
  cow360Result.innerHTML = '';

  try {
    const cows = await getCows();

    const cow = cows.find((item) => {
      const arete = String(item.arete || '').toLowerCase();
      const nombre = String(item.nombre || '').toLowerCase();

      return arete.includes(query) || nombre.includes(query);
    });

    if (!cow) {
      searchMessage.textContent = 'No se encontró ninguna vaca con ese arete o nombre.';
      return;
    }

    searchMessage.textContent = '';
    renderCow360(cow);
  } catch (error) {
    console.error(error);
    searchMessage.textContent = error.message;
  }
}


function renderEventDynamicFields() {
  const eventType = document.querySelector('#eventType')?.value;
  const container = document.querySelector('#eventDynamicFields');

  if (!container) {
    return;
  }

  const templates = {
    Producción: `
      <div class="form-grid">
        <label>
          Litros producidos
          <input id="eventLiters" type="number" min="0" step="0.1" placeholder="Ej. 28.5" />
        </label>

        <label>
          Turno
          <select id="eventShift">
            <option value="">Seleccionar</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>
        </label>

        <label>
          Calidad
          <input id="eventQuality" type="text" placeholder="Ej. Buena, normal, alta grasa" />
        </label>
      </div>
    `,

    Vacuna: `
      <div class="form-grid">
        <label>
          Producto / vacuna
          <input id="eventVaccineProduct" type="text" placeholder="Ej. Brucelosis" />
        </label>

        <label>
          Dosis
          <input id="eventDose" type="text" placeholder="Ej. 2 ml" />
        </label>

        <label>
          Lote
          <input id="eventBatch" type="text" placeholder="Ej. L-2026-01" />
        </label>
      </div>
    `,

    Parto: `
      <div class="form-grid">
        <label>
          Sexo de cría
          <select id="eventCalfSex">
            <option value="">Seleccionar</option>
            <option value="Hembra">Hembra</option>
            <option value="Macho">Macho</option>
          </select>
        </label>

        <label>
          Arete de cría
          <input id="eventCalfTag" type="text" placeholder="Ej. MX-CRIA-001" />
        </label>

        <label>
          Resultado del parto
          <input id="eventBirthResult" type="text" placeholder="Ej. Normal, asistido, complicado" />
        </label>
      </div>
    `,

    'Servicio / inseminación': `
      <div class="form-grid">
        <label>
          Toro / semen
          <input id="eventBull" type="text" placeholder="Ej. Toro 123 / semen ABC" />
        </label>

        <label>
          Técnico
          <input id="eventTechnician" type="text" placeholder="Ej. Dr. López" />
        </label>

        <label>
          Resultado
          <input id="eventServiceResult" type="text" placeholder="Ej. Pendiente, positivo, repetir" />
        </label>
      </div>
    `,

    'Revisión veterinaria': `
      <div class="form-grid">
        <label>
          Diagnóstico
          <input id="eventDiagnosis" type="text" placeholder="Ej. Mastitis leve" />
        </label>

        <label>
          Tratamiento
          <input id="eventTreatment" type="text" placeholder="Ej. Antibiótico 3 días" />
        </label>

        <label>
          Medicamento
          <input id="eventMedicine" type="text" placeholder="Ej. Producto aplicado" />
        </label>
      </div>
    `,

    Baja: `
      <div class="form-grid">
        <label>
          Motivo de baja
          <input id="eventExitReason" type="text" placeholder="Ej. Venta, muerte, descarte" />
        </label>
      </div>
    `
  };

  container.innerHTML = templates[eventType] || '';
}

function getEventDetails() {
  const eventType = document.querySelector('#eventType')?.value;

  if (eventType === 'Producción') {
    return {
      liters: document.querySelector('#eventLiters')?.value || '',
      shift: document.querySelector('#eventShift')?.value || '',
      quality: document.querySelector('#eventQuality')?.value.trim() || ''
    };
  }

  if (eventType === 'Vacuna') {
    return {
      product: document.querySelector('#eventVaccineProduct')?.value.trim() || '',
      dose: document.querySelector('#eventDose')?.value.trim() || '',
      batch: document.querySelector('#eventBatch')?.value.trim() || ''
    };
  }

  if (eventType === 'Parto') {
    return {
      calfSex: document.querySelector('#eventCalfSex')?.value || '',
      calfTag: document.querySelector('#eventCalfTag')?.value.trim() || '',
      birthResult: document.querySelector('#eventBirthResult')?.value.trim() || ''
    };
  }

  if (eventType === 'Servicio / inseminación') {
    return {
      bull: document.querySelector('#eventBull')?.value.trim() || '',
      technician: document.querySelector('#eventTechnician')?.value.trim() || '',
      serviceResult: document.querySelector('#eventServiceResult')?.value.trim() || ''
    };
  }

  if (eventType === 'Revisión veterinaria') {
    return {
      diagnosis: document.querySelector('#eventDiagnosis')?.value.trim() || '',
      treatment: document.querySelector('#eventTreatment')?.value.trim() || '',
      medicine: document.querySelector('#eventMedicine')?.value.trim() || ''
    };
  }

  if (eventType === 'Baja') {
    return {
      exitReason: document.querySelector('#eventExitReason')?.value.trim() || ''
    };
  }

  return {};
}

function renderEventDetails(event) {
  const details = event.details || {};

  const labels = {
    liters: 'Litros',
    shift: 'Turno',
    quality: 'Calidad',
    product: 'Producto',
    dose: 'Dosis',
    batch: 'Lote',
    calfSex: 'Sexo cría',
    calfTag: 'Arete cría',
    birthResult: 'Resultado parto',
    bull: 'Toro / semen',
    technician: 'Técnico',
    serviceResult: 'Resultado servicio',
    diagnosis: 'Diagnóstico',
    treatment: 'Tratamiento',
    medicine: 'Medicamento',
    exitReason: 'Motivo de baja'
  };

  const entries = Object.entries(details).filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '');

  if (entries.length === 0) {
    return '';
  }

  return `
    <div class="event-detail-list">
      ${entries
        .map(([key, value]) => `
          <span><strong>${labels[key] || key}:</strong> ${value}</span>
        `)
        .join('')}
    </div>
  `;
}

async function createCowEvent(cow) {
  const eventMessage = document.querySelector('#eventMessage');

  const payload = {
    type: 'cow_event',
    cowId: cow.id,
    cowArete: cow.arete || '',
    cowName: cow.nombre || '',
    eventType: document.querySelector('#eventType').value,
    eventDate: document.querySelector('#eventDate').value || new Date().toISOString().slice(0, 10),
    responsible: document.querySelector('#eventResponsible').value.trim(),
    description: document.querySelector('#eventDescription').value.trim(),
    details: getEventDetails()
  };

  if (!payload.description) {
    eventMessage.textContent = 'La descripción del evento es obligatoria.';
    eventMessage.className = 'error';
    return;
  }

  eventMessage.textContent = 'Guardando evento...';
  eventMessage.className = 'muted';

  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error al guardar evento: ${response.status}`);
    }

    document.querySelector('#cowEventForm').reset();
    renderEventDynamicFields();

    eventMessage.textContent = 'Evento agregado correctamente.';
    eventMessage.className = 'success';

    await loadCowEvents(cow.id);
    await loadCowCategoryEvents(cow.id, 'production');
    await loadCowCategoryEvents(cow.id, 'reproduction');
    await loadCowCategoryEvents(cow.id, 'health');
  } catch (error) {
    console.error(error);
    eventMessage.textContent = error.message;
    eventMessage.className = 'error';
  }
}

async function loadCowEvents(cowId) {
  const cowEventsList = document.querySelector('#cowEventsList');

  try {
    const items = await getCowsAndEvents();

    const events = items
      .filter((item) => item.type === 'cow_event' && item.cowId === cowId)
      .sort((a, b) => {
        const dateA = new Date(a.eventDate || a.createdAt || 0);
        const dateB = new Date(b.eventDate || b.createdAt || 0);
        return dateB - dateA;
      });

    if (events.length === 0) {
      cowEventsList.innerHTML = '<p class="muted">No hay eventos registrados para esta vaca.</p>';
      return;
    }

    cowEventsList.innerHTML = events
      .map(
        (event) => `
          <div class="timeline-item">
            <span></span>
            <div>
              <strong>${event.eventType || 'Evento'}</strong>
              <p>${event.eventDate || 'Fecha no definida'} · ${event.responsible || 'Responsable no definido'}</p>
              <p>${event.description || 'Sin descripción'}</p>
              ${renderEventDetails(event)}
            </div>
          </div>
        `
      )
      .join('');
  } catch (error) {
    console.error(error);
    cowEventsList.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

async function loadCowCategoryEvents(cowId, category) {
  const categoryConfig = {
    production: {
      elementId: 'productionEventsList',
      types: ['Producción'],
      emptyMessage: 'No hay eventos de producción registrados para esta vaca.'
    },
    reproduction: {
      elementId: 'reproductionEventsList',
      types: ['Parto', 'Servicio / inseminación'],
      emptyMessage: 'No hay eventos reproductivos registrados para esta vaca.'
    },
    health: {
      elementId: 'healthEventsList',
      types: ['Vacuna', 'Revisión veterinaria'],
      emptyMessage: 'No hay eventos de salud registrados para esta vaca.'
    }
  };

  const config = categoryConfig[category];
  const targetElement = document.querySelector(`#${config.elementId}`);

  if (!targetElement) {
    return;
  }

  try {
    const items = await getCowsAndEvents();

    const events = items
      .filter((item) => {
        return (
          item.type === 'cow_event' &&
          item.cowId === cowId &&
          config.types.includes(item.eventType)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.eventDate || a.createdAt || 0);
        const dateB = new Date(b.eventDate || b.createdAt || 0);
        return dateB - dateA;
      });

    if (events.length === 0) {
      targetElement.innerHTML = `<p class="muted">${config.emptyMessage}</p>`;
      return;
    }

    targetElement.innerHTML = events
      .map(
        (event) => `
          <div class="timeline-item">
            <span></span>
            <div>
              <strong>${event.eventType || 'Evento'}</strong>
              <p>${event.eventDate || 'Fecha no definida'} · ${event.responsible || 'Responsable no definido'}</p>
              <p>${event.description || 'Sin descripción'}</p>
              ${renderEventDetails(event)}
            </div>
          </div>
        `
      )
      .join('');
  } catch (error) {
    console.error(error);
    targetElement.innerHTML = `<p class="error">${error.message}</p>`;
  }
}


function parseProductionLiters(value) {
  const liters = Number.parseFloat(value);
  return Number.isFinite(liters) ? liters : 0;
}

function formatProductionDate(dateValue) {
  if (!dateValue) {
    return 'N/D';
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

function getProductionFilters() {
  return {
    dateFrom: document.querySelector('#productionDateFrom')?.value || '',
    dateTo: document.querySelector('#productionDateTo')?.value || '',
    cow: (document.querySelector('#productionCowFilter')?.value || '').trim().toLowerCase(),
    shift: document.querySelector('#productionShiftFilter')?.value || '',
    quality: (document.querySelector('#productionQualityFilter')?.value || '').trim().toLowerCase()
  };
}

function normalizeProductionRecord(event) {
  const details = event.details || {};

  return {
    id: event.id,
    cowId: event.cowId || '',
    cowArete: event.cowArete || 'Sin arete',
    cowName: event.cowName || 'Sin nombre',
    eventDate: event.eventDate || event.createdAt?.slice(0, 10) || '',
    responsible: event.responsible || 'Responsable no definido',
    description: event.description || 'Sin descripción',
    liters: parseProductionLiters(details.liters),
    shift: details.shift || 'Sin turno',
    quality: details.quality || 'Sin calidad'
  };
}

function filterProductionRecords(records, filters) {
  return records.filter((record) => {
    const date = record.eventDate || '';
    const cowText = `${record.cowArete} ${record.cowName}`.toLowerCase();
    const qualityText = String(record.quality || '').toLowerCase();

    if (filters.dateFrom && date < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && date > filters.dateTo) {
      return false;
    }

    if (filters.cow && !cowText.includes(filters.cow)) {
      return false;
    }

    if (filters.shift && record.shift !== filters.shift) {
      return false;
    }

    if (filters.quality && !qualityText.includes(filters.quality)) {
      return false;
    }

    return true;
  });
}

function summarizeProductionRecords(records) {
  const totalRecords = records.length;
  const totalLiters = records.reduce((sum, record) => sum + record.liters, 0);
  const averageLiters = totalRecords > 0 ? totalLiters / totalRecords : 0;
  const latestRecord = [...records].sort((a, b) => new Date(b.eventDate || 0) - new Date(a.eventDate || 0))[0];

  const byCow = records.reduce((acc, record) => {
    const key = `${record.cowArete} — ${record.cowName}`;

    if (!acc[key]) {
      acc[key] = {
        cowLabel: key,
        records: 0,
        liters: 0
      };
    }

    acc[key].records += 1;
    acc[key].liters += record.liters;
    return acc;
  }, {});

  const topCows = Object.values(byCow)
    .sort((a, b) => b.liters - a.liters)
    .slice(0, 5);

  return {
    totalRecords,
    totalLiters,
    averageLiters,
    latestRecord,
    topCows
  };
}

function renderProductionChart(records) {
  if (records.length === 0) {
    return '<p class="muted">No hay datos suficientes para graficar.</p>';
  }

  const groupedByDate = records.reduce((acc, record) => {
    const date = record.eventDate || 'Sin fecha';
    acc[date] = (acc[date] || 0) + record.liters;
    return acc;
  }, {});

  const points = Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-12);

  const maxLiters = Math.max(...points.map(([, liters]) => liters), 1);

  return `
    <div class="production-chart">
      ${points
        .map(([date, liters]) => {
          const height = Math.max(8, Math.round((liters / maxLiters) * 120));
          return `
            <div class="production-bar-wrap">
              <span class="production-bar-value">${liters.toFixed(1)} L</span>
              <div class="production-bar" style="height: ${height}px"></div>
              <small>${formatProductionDate(date).replace(' de ', ' ')}</small>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderTopProductionCows(topCows) {
  if (topCows.length === 0) {
    return '<p class="muted">No hay vacas con producción capturada para los filtros seleccionados.</p>';
  }

  const maxLiters = Math.max(...topCows.map((cow) => cow.liters), 1);

  return `
    <div class="top-cow-list">
      ${topCows
        .map((cow, index) => {
          const width = Math.max(6, Math.round((cow.liters / maxLiters) * 100));
          return `
            <div class="top-cow-item">
              <div>
                <strong>${index + 1}. ${cow.cowLabel}</strong>
                <span>${cow.records} registro(s) · ${cow.liters.toFixed(1)} L</span>
              </div>
              <div class="top-cow-track"><span style="width: ${width}%"></span></div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderProductionTable(records) {
  if (records.length === 0) {
    return '<p class="muted">No hay registros de producción que coincidan con los filtros.</p>';
  }

  return `
    <div class="production-table-wrap">
      <table class="production-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Vaca</th>
            <th>Litros</th>
            <th>Turno</th>
            <th>Calidad</th>
            <th>Responsable</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          ${records
            .slice(0, 50)
            .map((record) => `
              <tr>
                <td>${formatProductionDate(record.eventDate)}</td>
                <td><strong>${record.cowArete}</strong><br /><span>${record.cowName}</span></td>
                <td>${record.liters.toFixed(1)} L</td>
                <td>${record.shift}</td>
                <td>${record.quality}</td>
                <td>${record.responsible}</td>
                <td>${record.description}</td>
              </tr>
            `)
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function loadProductionModule() {
  const productionContent = document.querySelector('#productionContent');

  if (!productionContent) {
    return;
  }

  productionContent.innerHTML = `
    <section class="card">
      <p class="muted">Cargando registros de producción...</p>
    </section>
  `;

  try {
    const items = await getCowsAndEvents();
    const filters = getProductionFilters();

    const allProductionRecords = items
      .filter((item) => item.type === 'cow_event' && item.eventType === 'Producción')
      .map(normalizeProductionRecord)
      .sort((a, b) => new Date(b.eventDate || 0) - new Date(a.eventDate || 0));

    const records = filterProductionRecords(allProductionRecords, filters);
    const summary = summarizeProductionRecords(records);

    productionContent.innerHTML = `
      <section class="production-kpi-grid">
        <article class="kpi-card highlight">
          <span>Total litros</span>
          <strong>${summary.totalLiters.toFixed(1)} L</strong>
        </article>

        <article class="kpi-card">
          <span>Promedio por registro</span>
          <strong>${summary.averageLiters.toFixed(1)} L</strong>
        </article>

        <article class="kpi-card">
          <span>Registros filtrados</span>
          <strong>${summary.totalRecords}</strong>
        </article>

        <article class="kpi-card">
          <span>Último registro</span>
          <strong>${summary.latestRecord ? formatProductionDate(summary.latestRecord.eventDate) : 'N/D'}</strong>
        </article>
      </section>

      <section class="production-layout-grid">
        <article class="card production-chart-card">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Tendencia</p>
              <h3>Producción por fecha</h3>
            </div>
            <span class="status-pill soft">Últimos 12 días con datos</span>
          </div>
          ${renderProductionChart(records)}
        </article>

        <article class="card">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Ranking</p>
              <h3>Top vacas por litros</h3>
            </div>
          </div>
          ${renderTopProductionCows(summary.topCows)}
        </article>
      </section>

      <section class="card">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Detalle</p>
            <h3>Tabla de registros de producción</h3>
            <p class="muted">Mostrando hasta 50 registros recientes según los filtros seleccionados.</p>
          </div>
          <span class="status-pill soft">${records.length} resultado(s)</span>
        </div>
        ${renderProductionTable(records)}
      </section>
    `;
  } catch (error) {
    console.error(error);
    productionContent.innerHTML = `<section class="card"><p class="error">${error.message}</p></section>`;
  }
}

function clearProductionFilters() {
  document.querySelector('#productionDateFrom').value = '';
  document.querySelector('#productionDateTo').value = '';
  document.querySelector('#productionCowFilter').value = '';
  document.querySelector('#productionShiftFilter').value = '';
  document.querySelector('#productionQualityFilter').value = '';
  loadProductionModule();
}

async function deleteCow(id) {
  const confirmed = confirm('¿Seguro que deseas eliminar esta vaca?');

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeaders()
      }
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar vaca: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

loginBtn.addEventListener('click', () => {
  sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
  login();
});

logoutBtn.addEventListener('click', logout);

dashboardBtn.addEventListener('click', () => showSection('dashboard'));
vacasMenuBtn.addEventListener('click', () => showSection('vista360'));
hatoRanchoBtn.addEventListener('click', () => showSection('hatoRancho'));
registrarVacaBtn.addEventListener('click', () => showSection('registrar'));
vista360Btn.addEventListener('click', () => showSection('vista360'));
produccionBtn.addEventListener('click', () => showSection('produccion'));
laboratorioBtn.addEventListener('click', () => showSection('laboratorio'));
certificacionBtn.addEventListener('click', () => showSection('certificacion'));
reportesBtn.addEventListener('click', () => showSection('reportes'));
analyticsBtn.addEventListener('click', () => showSection('analytics'));
usuariosBtn.addEventListener('click', () => showSection('usuarios'));
quickAddBtn.addEventListener('click', () => showSection('registrar'));

document.querySelector('#productionRefreshBtn')?.addEventListener('click', loadProductionModule);
document.querySelector('#productionApplyFiltersBtn')?.addEventListener('click', loadProductionModule);
document.querySelector('#productionClearFiltersBtn')?.addEventListener('click', clearProductionFilters);

document.querySelectorAll('#productionDateFrom, #productionDateTo, #productionShiftFilter').forEach((input) => {
  input?.addEventListener('change', loadProductionModule);
});

document.querySelectorAll('#productionCowFilter, #productionQualityFilter').forEach((input) => {
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      loadProductionModule();
    }
  });
});

cowForm.addEventListener('submit', createCow);
cowSearchBtn.addEventListener('click', searchCow360);

cowSearchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchCow360();
  }
});

globalSearchInput.addEventListener('keydown', async (event) => {
  if (event.key !== 'Enter') {
    return;
  }

  const query = globalSearchInput.value.trim();

  if (!query) {
    return;
  }

  showSection('vista360');
  cowSearchInput.value = query;
  await searchCow360();
});

try {
  await handleAuthCallback();
  updateAuthUI();
} catch (error) {
  console.error(error);
  authStatus.textContent = error.message;
}
