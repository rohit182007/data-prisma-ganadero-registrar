import './style.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;

const REDIRECT_URI = `${window.location.origin}/`;
const TOKEN_STORAGE_KEY = 'demo_auth_tokens';
const PKCE_STORAGE_KEY = 'demo_pkce_verifier';

document.querySelector('#app').innerHTML = `
  <main class="container">
    <header class="header">
      <div>
        <p class="eyebrow">AWS Demo</p>
        <h1>Web + API + DynamoDB</h1>
        <p class="subtitle">
          Frontend en Amplify, login con Cognito, API Gateway, Lambda y DynamoDB.
        </p>
      </div>

      <div class="auth-box">
        <p id="authStatus">Revisando sesión...</p>
        <button id="loginBtn">Iniciar sesión</button>
        <button id="logoutBtn" class="secondary hidden">Cerrar sesión</button>
      </div>
    </header>

    <section id="appContent" class="hidden">
      <section class="card">
        <h2>Crear registro</h2>

        <div class="form-row">
          <input id="nameInput" placeholder="Nombre del item" maxlength="100" />
          <button id="saveBtn">Guardar</button>
        </div>

        <p id="formMessage" class="message"></p>
      </section>

      <section class="card">
        <div class="section-header">
          <h2>Registros</h2>
          <button id="loadBtn" class="secondary">Actualizar</button>
        </div>

        <p id="listMessage" class="message"></p>
        <ul id="itemsList" class="items-list"></ul>
      </section>
    </section>
  </main>
`;

const authStatus = document.querySelector('#authStatus');
const loginBtn = document.querySelector('#loginBtn');
const logoutBtn = document.querySelector('#logoutBtn');
const appContent = document.querySelector('#appContent');

const nameInput = document.querySelector('#nameInput');
const saveBtn = document.querySelector('#saveBtn');
const loadBtn = document.querySelector('#loadBtn');
const itemsList = document.querySelector('#itemsList');
const formMessage = document.querySelector('#formMessage');
const listMessage = document.querySelector('#listMessage');

function getTokens() {
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setTokens(tokens) {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

function clearTokens() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(PKCE_STORAGE_KEY);
}

function getAccessToken() {
  return getTokens()?.access_token;
}

function isLoggedIn() {
  const tokens = getTokens();

  if (!tokens?.expires_at) {
    return false;
  }

  return Date.now() < tokens.expires_at;
}

function updateAuthUI() {
  if (isLoggedIn()) {
    authStatus.textContent = 'Sesión iniciada';
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    appContent.classList.remove('hidden');
    loadItems();
    return;
  }

  authStatus.textContent = 'Redirigiendo a inicio de sesión...';
  loginBtn.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  appContent.classList.add('hidden');
  console.log('No hay sesión. Redirigiendo a Cognito...', {
  COGNITO_CLIENT_ID,
  COGNITO_DOMAIN
  });
  login();
}

async function login() {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem(PKCE_STORAGE_KEY, verifier);

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
  clearTokens();

  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    logout_uri: REDIRECT_URI
  });

  window.location.href = `${COGNITO_DOMAIN}/logout?${params.toString()}`;
}

async function handleAuthCallback() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');

  if (!code) {
    return;
  }

  const verifier = localStorage.getItem(PKCE_STORAGE_KEY);

  if (!verifier) {
    throw new Error('No se encontró el PKCE verifier local.');
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.error || 'Error al obtener token');
  }

  const expiresAt = Date.now() + data.expires_in * 1000;

  setTokens({
    ...data,
    expires_at: expiresAt
  });

  localStorage.removeItem(PKCE_STORAGE_KEY);

  window.history.replaceState({}, document.title, REDIRECT_URI);
}

function authHeaders() {
  const token = getAccessToken();

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

function setLoading(isLoading) {
  saveBtn.disabled = isLoading;
  loadBtn.disabled = isLoading;
  saveBtn.textContent = isLoading ? 'Guardando...' : 'Guardar';
}

function showMessage(element, text, type = 'info') {
  element.textContent = text;
  element.className = `message ${type}`;
}

async function loadItems() {
  if (!isLoggedIn()) {
    return;
  }

  try {
    loadBtn.disabled = true;
    loadBtn.textContent = 'Cargando...';
    showMessage(listMessage, 'Cargando registros...', 'info');

    const response = await fetch(`${API_BASE_URL}/items`, {
      headers: {
        ...authHeaders()
      }
    });

    if (!response.ok) {
      throw new Error(`Error al cargar registros: ${response.status}`);
    }

    const items = await response.json();

    itemsList.innerHTML = '';

    if (!items.length) {
      showMessage(listMessage, 'No hay registros todavía.', 'info');
      return;
    }

    showMessage(listMessage, `${items.length} registro(s) encontrado(s).`, 'success');

    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'item';

      const createdAt = item.createdAt
        ? new Date(item.createdAt).toLocaleString()
        : 'Sin fecha';

      li.innerHTML = `
        <div class="item-content">
          <strong>${escapeHtml(item.name)}</strong>
          <span>ID: ${escapeHtml(item.id)}</span>
          <small>${createdAt}</small>
        </div>
        <button class="danger" data-id="${escapeHtml(item.id)}">
          Eliminar
        </button>
      `;

      itemsList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    showMessage(listMessage, error.message, 'error');
  } finally {
    loadBtn.disabled = false;
    loadBtn.textContent = 'Actualizar';
  }
}

async function saveItem() {
  const name = nameInput.value.trim();

  if (!name) {
    showMessage(formMessage, 'Escribe un nombre antes de guardar.', 'error');
    return;
  }

  if (name.length > 100) {
    showMessage(formMessage, 'El nombre no puede superar 100 caracteres.', 'error');
    return;
  }

  try {
    setLoading(true);
    showMessage(formMessage, 'Guardando registro...', 'info');

    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ name })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al guardar');
    }

    nameInput.value = '';
    showMessage(formMessage, `Registro guardado correctamente: ${data.id}`, 'success');

    await loadItems();
  } catch (error) {
    console.error(error);
    showMessage(formMessage, error.message, 'error');
  } finally {
    setLoading(false);
  }
}

async function deleteItem(id) {
  const confirmed = window.confirm(`¿Eliminar el item ${id}?`);

  if (!confirmed) {
    return;
  }

  try {
    showMessage(listMessage, 'Eliminando registro...', 'info');

    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeaders()
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar');
    }

    showMessage(listMessage, 'Registro eliminado correctamente.', 'success');
    await loadItems();
  } catch (error) {
    console.error(error);
    showMessage(listMessage, error.message, 'error');
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  return base64UrlEncode(array);
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);

  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(arrayBuffer) {
  return btoa(String.fromCharCode(...arrayBuffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);
saveBtn.addEventListener('click', saveItem);
loadBtn.addEventListener('click', loadItems);

nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    saveItem();
  }
});

itemsList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');

  if (!button) {
    return;
  }

  deleteItem(button.dataset.id);
});

try {
  await handleAuthCallback();
  updateAuthUI();
} catch (error) {
  console.error(error);
  authStatus.textContent = error.message;
}
