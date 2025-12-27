/* ==========================================
   SISTEMA DE NAVEGAÇÃO E MENU (v1.2.0)
========================================== */

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
  if (target) {
    target.classList.remove('hidden');
  }

  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  if (el) el.classList.add('active');

  // Carrega dados específicos ao abrir a seção
  if (id === 'rankings') loadRankingsMock();
  if (id === 'arena') loadArenaMock();

  if (window.innerWidth < 900) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) toggleMenu();
  }
}

/* ==========================================
   CONTEÚDO REALISTA (MOCK DATA v1.2.0)
========================================== */

function loadRankingsMock() {
  const container = document.getElementById('ranking-list');
  if (!container) return;

  const players = [
    { pos: 1, name: 'StormRider', elo: 2850 },
    { pos: 2, name: 'Vortex_Pro', elo: 2720 },
    { pos: 3, name: 'Nightm4re', elo: 2690 },
    { pos: 4, name: 'CyberKing', elo: 2550 },
    { pos: 5, name: 'EliteGamer', elo: 2410 }
  ];

  container.innerHTML = players.map(p => `
    <div class="rank-item" style="display:flex; justify-content:space-between; padding:12px; background:rgba(255,255,255,0.03); margin-bottom:5px; border-radius:8px;">
      <span><strong>#${p.pos}</strong> ${p.name}</span>
      <span style="color:#00ff88;">${p.elo} ELO</span>
    </div>
  `).join('');
}

function loadArenaMock() {
  const container = document.getElementById('arena');
  // Evita duplicar o título se já existir
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

/* ==========================================
   DADOS DO PERFIL E AUTENTICAÇÃO
========================================== */
const token = localStorage.getItem("token");

async function loadProfile() {
  if (!token) {
    if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = "/login.html";
    }
    return;
  }

  try {
    const res = await fetch("/api/auth/me", {
      headers: { "x-auth-token": token }
    });

    if (res.ok) {
      const user = await res.json();
      const profileName = document.querySelector("#userNameDisplay");
      const profileAt = document.querySelector("#userHandleDisplay");
      
      if (profileName) profileName.innerHTML = `${user.username} <span class="verified">✔</span>`;
      if (profileAt) profileAt.innerText = `@${user.username.toLowerCase()}`;
    }
  } catch (err) {
    console.error("Erro ao carregar dados do perfil.");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) logoutBtn.onclick = logout;
});
