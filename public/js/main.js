const socket = io();

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }
}

function showSection(id, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  if (el) el.classList.add('active');
  if (id === 'rankings') loadRankingsReal();
  if (id === 'arena') loadArenaMock();
  if (id === 'profile') loadProfileStats(); // <-- CARREGA ESTATÍSTICAS REAIS
  if (window.innerWidth < 900) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) toggleMenu();
  }
}

// ... manter funções loadRankingsReal, loadRealUserCount, loadArenaMock, setupChat, socket.on('receiveMessage') ...

async function loadRankingsReal() {
  const container = document.getElementById('ranking-list');
  if (!container) return;
  try {
    const res = await fetch('/api/stats/rankings'); 
    const players = await res.json();
    container.innerHTML = players.map((p, i) => `
      <div class="rank-item" style="display:flex;justify-content:space-between;padding:12px;background:rgba(255,255,255,0.03);margin-bottom:5px;border-radius:8px;">
        <span><strong>#${i+1}</strong> ${p.username}</span>
        <span style="color:#00ff88;">${p.elo} ELO</span>
      </div>`).join('');
  } catch (err) { container.innerHTML = '<p>Erro ao carregar ranking.</p>'; }
}

async function loadRealUserCount() {
  try {
    const res = await fetch('/api/stats/count');
    const data = await res.json();
    const countElement = document.getElementById('user-count-display');
    if (countElement) countElement.innerText = `${data.count} Jogadores Ativos`;
  } catch (err) { console.error(err); }
}

function loadArenaMock() {
  const container = document.getElementById('arena');
  if (container.querySelector('.arena-list')) return;
  const tournaments = [
    { title: 'Copa Iniciante MatchZone', status: 'ABERTO', prize: '500 Créditos', color: '#00ff88' },
    { title: 'Pro Circuit Elite', status: 'EM BREVE', prize: 'R$ 1.200,00', color: '#555' }
  ];
  const html = `
    <h2>Arena de Competição</h2>
    <div class="arena-list" style="margin-top:15px;">
      ${tournaments.map(t => `
        <div class="card" style="margin-bottom:15px; border-left:4px solid ${t.color}">
          <span class="badge" style="background:${t.color}">${t.status}</span>
          <h4 style="margin:10px 0 5px 0;">${t.title}</h4>
          <p style="font-size:12px; opacity:0.7;">Prêmio: ${t.prize}</p>
          ${t.status === 'ABERTO' ? '<button class="primary" style="margin-top:10px; padding:5px 15px; font-size:12px; width:auto;">Inscrever-se</button>' : ''}
        </div>
      `).join('')}
    </div>
  `;
  container.innerHTML = html;
}

function setupChat() {
  const input = document.getElementById('chat-input');
  const btn = document.querySelector('#chat button');
  if (!input || !btn) return;
  const send = () => {
    const text = input.value.trim();
    const user = document.querySelector("#userNameDisplay")?.innerText.split(' ')[0] || "Anónimo";
    if (text) { socket.emit('sendMessage', { user, text }); input.value = ""; }
  };
  btn.onclick = send;
  input.onkeypress = (e) => { if (e.key === 'Enter') send(); };
}

socket.on('receiveMessage', (data) => {
  const box = document.getElementById('chat-messages');
  if (box) {
    box.innerHTML += `<p style="font-size:13px;margin-bottom:8px;"><small style="opacity:0.5">${data.time}</small> <strong>${data.user}:</strong> ${data.text}</p>`;
    box.scrollTop = box.scrollHeight;
  }
});


// Lógica do Perfil Dinâmico e Edição (v1.6.0)
async function loadProfileStats() {
    if (!token) return;

    try {
        // Precisamos de um novo endpoint no backend que junte User + Stats (não existe ainda, então simulamos)
        // Por enquanto, só carregamos o que já temos via API /api/auth/me
        const res = await fetch("/api/auth/me", { headers: { "x-auth-token": token } });
        if (res.ok) {
            const user = await res.json();
            // Dados Mock de stats para preencher o perfil por enquanto
            document.getElementById('profile-rank').innerText = "#12"; 
            document.getElementById('profile-elo').innerText = "1890";
            document.getElementById('profile-wins').innerText = "124";
        }
    } catch (err) {
        console.error("Erro ao carregar estatísticas do perfil:", err);
    }
}

// Função de Edição (Apenas UI por enquanto, não envia nada real)
function saveProfileChanges() {
    const avatarUrl = document.getElementById('edit-avatar-url').value;
    document.getElementById('profile-avatar').src = avatarUrl;
    alert("Alterações salvas (apenas visualmente por enquanto)!");
    showSection('profile'); // Volta para a visualização do perfil
}


const token = localStorage.getItem("token");
async function loadProfile() {
  if (!token) { if (!window.location.pathname.includes('login.html')) window.location.href = "/login.html"; return; }
  try {
    const res = await fetch("/api/auth/me", { headers: { "x-auth-token": token } });
    if (res.ok) {
      const user = await res.json();
      document.querySelector("#userNameDisplay").innerHTML = `${user.username} <span class="verified">✔</span>`;
      document.querySelector("#userHandleDisplay").innerText = `@${user.username.toLowerCase()}`;
    }
  } catch (err) { console.error(err); }
}

function logout() { localStorage.removeItem("token"); window.location.href = "/login.html"; }

document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadRealUserCount();
  setupChat();
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) logoutBtn.onclick = logout;
});
      
