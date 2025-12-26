/* ==========================================
   SISTEMA DE NAVEGAÇÃO E PERFIL (v1.1.3)
========================================== */

const token = localStorage.getItem("token");

// Carrega os dados reais do jogador após o Login
async function loadProfile() {
  if (!token) {
    // Se não houver token, redireciona para o login apenas se não estiver lá
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
      // Atualiza o nome no Dashboard
      const profileName = document.querySelector("#profile h2");
      if (profileName) profileName.innerHTML = `${user.username} <span class="verified">✔</span>`;
      
      const profileAt = document.querySelector("#profile .muted");
      if (profileAt) profileAt.innerText = `@${user.username.toLowerCase()}`;
    }
  } catch (err) {
    console.error("Erro ao carregar dados do servidor.");
  }
}

// Troca entre Home, Perfil, Ranking, etc.
function showSection(id, el) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(s => s.classList.add('hidden'));

  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');

  const links = document.querySelectorAll('.sidebar-nav a');
  links.forEach(a => a.classList.remove('active'));
  if (el) el.classList.add('active');

  // Fecha o menu no telemóvel ao clicar
  if (window.innerWidth < 900) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

// Inicializa o sistema
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  
  // Evento de Logout se o botão existir
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) logoutBtn.onclick = logout;
});
