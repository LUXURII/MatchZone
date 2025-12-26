/* ==========================================
   SISTEMA DE NAVEGAÇÃO E MENU (v1.1.4)
========================================== */

// 1. Função para abrir/fechar o menu lateral (Mobile)
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }
}

// 2. Função para trocar entre Home, Perfil, Rankings, etc.
function showSection(id, el) {
  // Esconde todas as seções
  document.querySelectorAll('.section').forEach(s => {
    s.classList.add('hidden');
  });

  // Mostra a seção clicada
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('hidden');
  }

  // Atualiza a cor do botão no menu lateral
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    a.classList.remove('active');
  });
  if (el) el.classList.add('active');

  // Se estiver no telemóvel, fecha o menu após clicar
  if (window.innerWidth < 900) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      toggleMenu();
    }
  }
}

/* ==========================================
   DADOS DO PERFIL E AUTENTICAÇÃO
========================================== */
const token = localStorage.getItem("token");

async function loadProfile() {
  if (!token) {
    // Redireciona para login se não estiver autenticado
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
      // Atualiza o nome no Perfil
      const profileName = document.querySelector("#profile h2");
      if (profileName) profileName.innerHTML = `${user.username} <span class="verified">✔</span>`;
      
      const profileAt = document.querySelector("#profile .muted");
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

// Inicializa tudo quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  
  // Configura o clique no botão de logout da sidebar
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) logoutBtn.onclick = logout;
});
