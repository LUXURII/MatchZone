const socket = io();
const token = localStorage.getItem("token");

// A função toggleMenu() original foi removida pois o Bootstrap 5 Offcanvas lida com isso automaticamente via data attributes no HTML.

function showSection(id, el) {
    // Esconde todas as secções
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    const t = document.getElementById(id);
    if (t) t.classList.remove('hidden');
    
    // Atualiza o link ativo no novo menu offcanvas
    if (el) {
        // Usa o novo seletor para os links dentro do offcanvas
        document.querySelectorAll('.offcanvas-body .list-group-item-action').forEach(a => a.classList.remove('active-link'));
        el.classList.add('active-link');
    }
    
    // Carrega conteúdo dinâmico
    if (id === 'rankings') loadRankingsReal();
    if (id === 'arena') loadArenaContent();
    if (id === 'live') loadLiveContent();
}

async function loadProfile() {
    if (!token) { if (!window.location.pathname.includes('login.html')) window.location.href = "/login.html"; return; }
    try {
        const res = await fetch("/api/auth/me", { headers: { "x-auth-token": token } });
        if (res.ok) {
            const u = await res.json();
            document.querySelector("#userNameDisplay").innerText = u.username;
            // Usa querySelector para garantir compatibilidade com o novo HTML
            document.querySelector("#topbar-avatar").src = u.avatarUrl || 'i.pravatar.cc';
            document.getElementById('profile-avatar').src = u.avatarUrl || 'i.pravatar.cc';
            document.getElementById('profile-bio').innerText = u.bio || 'Bem-vindo ao MatchZone!';
            document.getElementById('edit-bio').value = u.bio || '';
        }
    } catch (err) { console.error(err); }
}

function loadArenaContent() {
    const container = document.getElementById('arena-container');
    const mocks = [
        { title: '🏆 Premier League eSports', status: 'Inscrições Abertas', color: '#00ff88' },
        { title: '⚽ Champions MatchZone', status: 'Em breve', color: '#ffaa00' }
    ];
    // Adicionado a classe Bootstrap 'card' e 'p-3' para melhor visual
    container.innerHTML = mocks.map(m => `
        <div class="card p-3" style="border-left: 4px solid ${m.color}; margin-bottom:10px;">
            <h3 class="text-white">${m.title}</h3>
            <span class="badge" style="background:${m.color}">${m.status}</span>
        </div>
    `).join('');
}

function loadLiveContent() {
    // Adicionado classes Bootstrap 'card' e 'bg-dark' para melhor visual
    document.getElementById('live-container').innerHTML = `
        <div class="card bg-dark" style="text-align:center; padding:40px;">
            <p style="color:red; font-weight:bold;">🔴 LIVE: Final Regional</p>
            <small class="text-muted">Acompanhe em tempo real</small>
        </div>
    `;
}

async function saveProfileChanges() {
    const btn = document.getElementById('save-profile-btn');
    const bio = document.getElementById('edit-bio').value;
    const file = document.getElementById('edit-avatar-file').files[0];
    
    btn.innerText = "Processando..."; btn.disabled = true;

    // Lógica de upload de arquivo e atualização de bio existente...
    // (Mantido como estava, apenas garantindo que os seletores de elementos funcionem com o novo HTML)
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ avatarUrl: e.target.result, bio })
            });
            if (res.ok) { alert("Perfil atualizado!"); loadProfile(); showSection('profile'); }
            btn.innerText = "Salvar Alterações"; btn.disabled = false;
        };
        reader.readAsDataURL(file);
    } else {
        const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ bio })
        });
        if (res.ok) { alert("Bio atualizada!"); loadProfile(); showSection('profile'); }
        btn.innerText = "Salvar Alterações"; btn.disabled = false;
    }
}

async function loadRankingsReal() {
    const res = await fetch('/api/stats/rankings');
    const data = await res.json();
    // Adicionado classes Bootstrap para melhor visual
    document.getElementById('ranking-list').innerHTML = data.map((p, i) => `
        <div class="rank-item d-flex justify-content-between bg-dark p-3 mb-2 rounded shadow-sm">
            <span>#${i+1} ${p.username}</span>
            <strong style="color:#00ff88">${p.elo || 1000} ELO</strong>
        </div>
    `).join('');
}

async function loadUserCount() {
    const res = await fetch('/api/stats/count');
    const data = await res.json();
    // Este seletor foi removido do index.html. O novo contador usa #online-count
    // document.getElementById('user-count-display').innerText = `${data.count} Jogadores Ativos`;
    console.log(`User count loaded: ${data.count}. Now updated via the animated counter.`);
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (text) {
        socket.emit('sendMessage', { user: document.querySelector("#userNameDisplay").innerText, text });
        input.value = "";
    }
}

socket.on('receiveMessage', (d) => {
    const m = document.getElementById('chat-messages');
    if (m) {
        m.innerHTML += `<p class="mb-2"><small class="text-muted">${d.time}</small> <strong>${d.user}:</strong> ${d.text}</p>`;
        m.scrollTop = m.scrollHeight;
    }
});


// =======================================================
// --- NOVAS FUNCIONALIDADES MATCHZONE 2.0 (UX/UI) ---
// =======================================================

// 1. Contador Animado para Status ONLINE (Função)
function animateCounter(targetId, start, end, duration) {
    const target = document.getElementById(targetId);
    if (!target) return;
    let startTime = null;
    const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        target.textContent = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) { requestAnimationFrame(animate); }
    };
    requestAnimationFrame(animate);
}


// 2. Ripple Effect (Função)
function applyRippleEffect(button) {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => { ripple.remove(); });
    });
}


// 3. Inicialização e Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProfile(); 
    // loadUserCount() original foi removido, usamos o novo contador:
    animateCounter('online-count', 0, 1248, 1500); // Inicia a contagem mockada

    // Aplica Ripple Effect a todos os elementos com a classe
    document.querySelectorAll('.ripple-button').forEach(applyRippleEffect);
    
    // Seletor de logout atualizado para o novo HTML (é um link agora, não uma div)
    const logoutLink = document.querySelector('a[onclick="showSection(\'logout\', this)"]');
    if(logoutLink) {
        logoutLink.onclick = (e) => {
            e.preventDefault(); // Previne navegação se necessário
            localStorage.removeItem("token"); 
            window.location.href = "/login.html"; 
        };
    }
});
