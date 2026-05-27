import './style.css';

document.querySelector('#app').innerHTML = `
  <main class="container">
    <h1>Demo AWS Web + API + DynamoDB</h1>
    <p>Frontend desplegado con AWS Amplify.</p>

    <section class="card">
      <h2>Crear registro</h2>
      <input id="nameInput" placeholder="Nombre del item" />
      <button id="saveBtn">Guardar</button>
    </section>

    <section class="card">
      <h2>Registros</h2>
      <button id="loadBtn">Cargar registros</button>
      <ul id="itemsList"></ul>
    </section>
  </main>
`;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;; // env variable .env file

document.querySelector('#saveBtn').addEventListener('click', async () => {
  const name = document.querySelector('#nameInput').value.trim();

  if (!name) {
    alert('Escribe un nombre');
    return;
  }

  if (!API_BASE_URL) {
    alert('API todavía no configurada');
    return;
  }

  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });

  const data = await response.json();
  alert(`Guardado: ${data.id}`);
});

document.querySelector('#loadBtn').addEventListener('click', async () => {
  if (!API_BASE_URL) {
    alert('API todavía no configurada');
    return;
  }

  const response = await fetch(`${API_BASE_URL}/items`);
  const items = await response.json();

  const list = document.querySelector('#itemsList');
  list.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.id} - ${item.name}`;
    list.appendChild(li);
  });
});
