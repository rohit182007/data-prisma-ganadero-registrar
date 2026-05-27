import './style.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

document.querySelector('#app').innerHTML = `
  <main class="container">
    <header class="header">
      <div>
        <p class="eyebrow">AWS Demo</p>
        <h1>Web + API + DynamoDB</h1>
        <p class="subtitle">
          Frontend en Amplify, API Gateway, Lambda y DynamoDB.
        </p>
      </div>
    </header>

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
  </main>
`;

const nameInput = document.querySelector('#nameInput');
const saveBtn = document.querySelector('#saveBtn');
const loadBtn = document.querySelector('#loadBtn');
const itemsList = document.querySelector('#itemsList');
const formMessage = document.querySelector('#formMessage');
const listMessage = document.querySelector('#listMessage');

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
  try {
    loadBtn.disabled = true;
    loadBtn.textContent = 'Cargando...';
    showMessage(listMessage, 'Cargando registros...', 'info');

    const response = await fetch(`${API_BASE_URL}/items`);

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
        'Content-Type': 'application/json'
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
      method: 'DELETE'
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

loadItems();
