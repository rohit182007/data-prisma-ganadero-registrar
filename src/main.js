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

        <button class="menu-item active" id="registroMenuBtn">
          <span>📋</span>
          Registro
        </button>

        <button class="submenu-item active" id="registroVacasBtn">
          Registro de Vacas
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
          <p class="eyebrow">Módulo de Registro</p>
          <h2>Registro de Vacas</h2>
          <p class="subtitle">
            Alta y consulta de animales Holstein dentro del sistema ganadero.
          </p>
        </div>
      </section>

      <section id="appContent" class="content-grid hidden">
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

        <section class="card list-card">
          <div class="list-header">
            <div>
              <h3>Vacas registradas</h3>
              <p>Animales dados de alta en el sistema.</p>
            </div>
            <button id="refreshBtn" class="secondary">Actualizar</button>
          </div>

          <div id="loadingMessage" class="muted">Cargando registros...</div>
          <div id="errorMessage" class="error hidden"></div>
          <ul id="itemsList" class="cow-list"></ul>
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

function updateAuthUI() {
  if (isLoggedIn()) {
    authStatus.textContent = 'Sesión iniciada';
    logoutBtn.classList.remove('hidden');
    appContent.classList.remove('hidden');
    loadItems();
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

async function loadItems() {
  loadingMessage.classList.remove('hidden');
  errorMessage.classList.add('hidden');
  itemsList.innerHTML = '';

  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      headers: {
        ...authHeaders()
      }
    });

    if (!response.ok) {
      throw new Error(`Error al cargar registros: ${response.status}`);
    }

    const items = await response.json();
    const cows = items.filter((item) => item.type === 'cow' || item.arete);

    if (cows.length === 0) {
      itemsList.innerHTML = '<li class="empty">No hay vacas registradas todavía.</li>';
      return;
    }

    itemsList.innerHTML = cows
      .map(
        (cow) => `
          <li class="cow-item" data-id="${cow.id}">
            <div class="cow-main">
              <div class="cow-avatar">🐄</div>
              <div>
                <h4>${cow.arete || 'Sin arete'} — ${cow.nombre || 'Sin nombre'}</h4>
                <p>
                  ${cow.raza || 'Raza no definida'} ·
                  ${cow.estadoProductivo || 'Estado no definido'} ·
                  ${cow.rancho || 'Rancho no definido'}
                </p>
                <small>
                  Nacimiento: ${cow.fechaNacimiento || 'N/D'} ·
                  Padre: ${cow.padre || 'N/D'} ·
                  Madre: ${cow.madre || 'N/D'}
                </small>
                ${
                  cow.observaciones
                    ? `<small class="observaciones">Observaciones: ${cow.observaciones}</small>`
                    : ''
                }
              </div>
            </div>

            <button class="danger delete-btn" data-id="${cow.id}">
              Eliminar
            </button>
          </li>
        `
      )
      .join('');
  } catch (error) {
    console.error(error);
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
  } finally {
    loadingMessage.classList.add('hidden');
  }
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

    await loadItems();
  } catch (error) {
    console.error(error);
    formMessage.textContent = error.message;
    formMessage.className = 'error';
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

    await loadItems();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

logoutBtn.addEventListener('click', logout);
refreshBtn.addEventListener('click', loadItems);
cowForm.addEventListener('submit', createCow);

itemsList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.delete-btn');

  if (!deleteButton) {
    return;
  }

  deleteCow(deleteButton.dataset.id);
});

try {
  await handleAuthCallback();
  updateAuthUI();
} catch (error) {
  console.error(error);
  authStatus.textContent = error.message;
}
