import './style.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;

const REDIRECT_URI = `${window.location.origin}/`;
const TOKEN_STORAGE_KEY = 'demo_auth_tokens';
const PKCE_STORAGE_KEY = 'demo_pkce_verifier';

document.querySelector('#app').innerHTML = `
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">🐄</div>
        <div>
          <h1>Holstein</h1>
          <p>Sistema Ganadero</p>
        </div>
      </div>
    
      <nav class="menu">
        <p class="menu-section">Módulos</p>
      
        <button class="menu-item active" id="vacasMenuBtn">
          <span>🐄</span>
          Vacas
        </button>
      
        <button class="submenu-item active" id="registrarVacaBtn">
          Registrar
        </button>
      
        <button class="submenu-item" id="vista360Btn">
          Vista 360
        </button>
      </nav>

      <div class="sidebar-footer">
        <p id="authStatus">Revisando sesión...</p>
        <button id="logoutBtn" class="secondary hidden">Cerrar sesión</button>
      </div>
    </aside>

    <main class="main-content">
      <section class="topbar">
        <div>
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
            <h3>Registrar vaca</h3>
      
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
      
          <section class="card helper-card">
            <h3>Registro individual</h3>
            <p>
              Utiliza esta pantalla para dar de alta una vaca o becerra dentro del sistema Holstein.
            </p>
            <p class="muted">
              Después de guardar, podrás buscarla en Vista 360 por número de arete o por nombre.
            </p>
          </section>
        </section>
      
        <section id="vista360Section" class="hidden">
          <section class="card">
            <h3>Vista 360 de vaca</h3>
            <p class="muted">
              Busca una vaca por número de arete o nombre para consultar su información completa.
            </p>
      
            <div class="search-row">
              <input id="cowSearchInput" type="text" placeholder="Buscar por arete o nombre. Ej. MX-001 o Luna" />
              <button id="cowSearchBtn" type="button">Buscar</button>
            </div>
      
            <div id="searchMessage" class="muted"></div>
            <div id="cow360Result" class="cow360-result"></div>
          </section>
        </section>
      </section>
    </main>
  </div>
`;

const authStatus = document.querySelector('#authStatus');
const logoutBtn = document.querySelector('#logoutBtn');
const appContent = document.querySelector('#appContent');
const cowForm = document.querySelector('#cowForm');
const formMessage = document.querySelector('#formMessage');
const refreshBtn = document.querySelector('#refreshBtn');
const loadingMessage = document.querySelector('#loadingMessage');
const errorMessage = document.querySelector('#errorMessage');
const itemsList = document.querySelector('#itemsList');
const moduleTitle = document.querySelector('#moduleTitle');
const moduleSubtitle = document.querySelector('#moduleSubtitle');

const registrarVacaBtn = document.querySelector('#registrarVacaBtn');
const vista360Btn = document.querySelector('#vista360Btn');

const registrarSection = document.querySelector('#registrarSection');
const vista360Section = document.querySelector('#vista360Section');

const cowSearchInput = document.querySelector('#cowSearchInput');
const cowSearchBtn = document.querySelector('#cowSearchBtn');
const searchMessage = document.querySelector('#searchMessage');
const cow360Result = document.querySelector('#cow360Result');

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
  if (sectionName === 'registrar') {
    moduleTitle.textContent = 'Registrar Vaca';
    moduleSubtitle.textContent = 'Alta de animales Holstein dentro del sistema ganadero.';

    registrarSection.classList.remove('hidden');
    vista360Section.classList.add('hidden');

    registrarVacaBtn.classList.add('active');
    vista360Btn.classList.remove('active');
    return;
  }

  if (sectionName === 'vista360') {
    moduleTitle.textContent = 'Vista 360';
    moduleSubtitle.textContent = 'Consulta integral de una vaca por arete o nombre.';

    registrarSection.classList.add('hidden');
    vista360Section.classList.remove('hidden');

    registrarVacaBtn.classList.remove('active');
    vista360Btn.classList.add('active');
  }
}

function updateAuthUI() {
  if (isLoggedIn()) {
    authStatus.textContent = 'Sesión iniciada';
    logoutBtn.classList.remove('hidden');
    appContent.classList.remove('hidden');
    showSection('registrar');
    return;
  }

  authStatus.textContent = 'Redirigiendo a inicio de sesión...';
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
    throw new Error('No se encontró el verificador PKCE. Intenta iniciar sesión otra vez.');
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
function renderCow360(cow) {
  cow360Result.innerHTML = `
    <div class="cow-profile">
      <div class="cow-profile-header">
        <div class="cow-profile-avatar">🐄</div>
        <div>
          <p class="eyebrow">Ficha individual</p>
          <h3>${cow.arete || 'Sin arete'} — ${cow.nombre || 'Sin nombre'}</h3>
          <p>${cow.raza || 'Raza no definida'} · ${cow.estadoProductivo || 'Estado no definido'}</p>
        </div>
      </div>

      <div class="info-grid">
        <div>
          <span>Arete</span>
          <strong>${cow.arete || 'N/D'}</strong>
        </div>

        <div>
          <span>Nombre</span>
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
          <span>Padre</span>
          <strong>${cow.padre || 'N/D'}</strong>
        </div>

        <div>
          <span>Madre</span>
          <strong>${cow.madre || 'N/D'}</strong>
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

      <div class="profile-actions">
        <button class="danger" type="button" id="deleteCow360Btn">Eliminar vaca</button>
      </div>
    </div>
  `;

  document.querySelector('#deleteCow360Btn').addEventListener('click', async () => {
    await deleteCow(cow.id);
    cow360Result.innerHTML = '';
    searchMessage.textContent = 'Vaca eliminada correctamente.';
  });
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

registrarVacaBtn.addEventListener('click', () => showSection('registrar'));
vista360Btn.addEventListener('click', () => showSection('vista360'));

cowForm.addEventListener('submit', createCow);
cowSearchBtn.addEventListener('click', searchCow360);

cowSearchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchCow360();
  }
});

try {
  await handleAuthCallback();
  updateAuthUI();
} catch (error) {
  console.error(error);
  authStatus.textContent = error.message;
}
