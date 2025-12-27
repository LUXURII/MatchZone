const socket = io();
const token = localStorage.getItem("token");

function toggleMenu() {
    const s = document.getElementById('sidebar'), o = document.getElementById('overlay');
    if (s && o) { s.classList.toggle('open'); o.classList.toggle('active'); }
}

function showSection(id, el) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    const t = document.getElementById(id);
    if (t) t.classList.remove('hidden');
    if (el) {
        document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
        el.classList.add('active');
    }
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
    container.innerHTML = mocks.map(m => `
        <div class="card" style="border-left: 4px solid ${m.color}; margin-bottom:10px;">
            <h3>${m.title}</h3>
            <span class="badge" style="background:${m.color}">${m.status}</span>
        </div>
    `).join('');
}

function loadLiveContent() {
    document.getElementById('live-container').innerHTML = `
        <div class="card" style="background:#000; text-align:center; padding:40px;">
            <p style="color:red; font-weight:bold;">🔴 LIVE: Final Regional</p>
            <small>Acompanhe em tempo real</small>
        </div>
    `;
}

async function saveProfileChanges() {
    const btn = document.getElementById('save-profile-btn');
    const bio = document.getElementById('edit-bio').value;
    const file = document.getElementById('edit-avatar-file').files[0];
    
    btn.innerText = "Processando..."; btn.disabled = true;

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
    document.getElementById('ranking-list').innerHTML = data.map((p, i) => `
        <div class="rank-item" style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.05); padding:10px; margin-bottom:5px; border-radius:8px;">
            <span>#${i+1} ${p.username}</span>
            <strong style="color:#00ff88">${p.elo || 1000} ELO</strong>
        </div>
    `).join('');
}

async function loadUserCount() {
    const res = await fetch('/api/stats/count');
    const data = await res.json();
    document.getElementById('user-count-display').innerText = `${data.count} Jogadores Ativos`;
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
        m.innerHTML += `<p style="margin-bottom:8px;"><small style="opacity:0.5">${d.time}</small> <strong>${d.user}:</strong> ${d.text}</p>`;
        m.scrollTop = m.scrollHeight;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadProfile(); loadUserCount();
    document.querySelector('.logout').onclick = () => { localStorage.removeItem("token"); window.location.href = "/login.html"; };
});
