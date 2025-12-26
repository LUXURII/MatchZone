/* ===============================
   PROTEÇÃO DE ROTA (2025)
================================ */
const token = localStorage.getItem("token");
if (!token) {
  // Se não houver token, redireciona para o login
  window.location.href = "/login.html";
}

/* ===============================
   NAVEGAÇÃO & MENU
================================ */
function showSection(id, el) {
  // Esconde todas as seções
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));

  // Mostra a seção desejada
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');

  // Atualiza classe ativa no menu
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  if (el) el.classList.add('active');

  // Fecha menu no mobile se estiver aberto
  if (window.innerWidth < 900) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('open')) toggleMenu();
  }
}

function toggleMenu() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('active');
}

/* ===============================
   CARREGAR PERFIL (VIA API REFORMULADA)
================================ */
async function loadProfile() {
  try {
    // ❗ ATENÇÃO: Ajustado para o caminho correto do novo server: /api/auth/me
    const res = await fetch("/api/auth/me", {
      headers: {
        "x-auth-token": token // ❗ ATENÇÃO: Ajustado para o padrão do novo middleware
      }
    });

    if (!res.ok) throw new Error("Sessão expirada");

    const user = await res.json();

    // Atualiza o Visual com dados reais do MongoDB
    const userDisplay = document.querySelector("#profile h2");
    if (userDisplay) {
        userDisplay.innerHTML = `${user.username} <span class="verified">✔</span>`;
    }

    const handleDisplay = document.querySelector("#profile .muted");
    if (handleDisplay) {
        handleDisplay.innerText = `@${user.username.toLowerCase()}`;
    }

  } catch (err) {
    console.error("Erro no perfil:", err);
    // Em caso de token inválido, desloga por segurança
    // logout(); 
  }
}

/* ===============================
   RANKING (VIA API)
================================ */
async function fetchGlobalRanking() {
  try {
    const r = await fetch('/api/ranking/global');
    if (!r.ok) return;
    const data = await r.json();
    const ul = document.getElementById('ranking-list');
    if (!ul) return;
    
    ul.innerHTML = '';
    data.forEach((p, i) => {
      const li = document.createElement('li');
      li.textContent = `#${i + 1} ${p.username} — ${p.eloScore}`;
      ul.appendChild(li);
    });
  } catch {
    const ul = document.getElementById('ranking-list');
    if (ul) ul.innerHTML = '<li>Ranking indisponível</li>';
  }
}

/* ===============================
   CHAT LOCAL (MANTER)
================================ */
const chatBox = document.getElementById("chat-messages");
const input = document.getElementById("chat-input");

if (input) {
  input.addEventListener("keypress", e => {
    if (e.key === "Enter" && input.value) {
      const d = document.createElement("div");
      d.className = "message"; // Estilize no CSS
      d.textContent = input.value;
      chatBox.appendChild(d);
      chatBox.scrollTop = chatBox.scrollHeight;
      input.value = "";
    }
  });
}

/* ===============================
   LOGOUT
================================ */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

/* ===============================
   INICIALIZAÇÃO AO CARREGAR
================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Carrega os dados iniciais
  loadProfile();
  fetchGlobalRanking();
  
  // Adiciona evento de logout no botão
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) logoutBtn.onclick = logout;
});
