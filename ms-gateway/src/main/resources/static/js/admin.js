let users = [];
let plans = [];
let subs = [];
let pagos = [];
let editingUserId = null;
let allSubs = [];
let allPagos = [];

/* ---------- Tabs ---------- */
document.querySelectorAll('[data-tab]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        switchTab(a.dataset.tab);
    });
});

function switchTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
    document.getElementById('tab-' + tab).style.display = 'block';
    document.querySelectorAll('.gw-nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
    if (tab === 'dashboard') loadDashboard();
    if (tab === 'usuarios') loadUsers();
    if (tab === 'suscripciones') loadPlansAndSubs();
    if (tab === 'asistencia') loadAsistencia();
    if (tab === 'pagos') loadPagos();
}

/* ---------- Auth ---------- */
async function checkAuth() {
    try {
        const res = await fetch('/api/usuarios/me');
        if (!res.ok) throw new Error();
        const user = await res.json();
        if (user.rol !== 'DUENO' && user.rol !== 'ADMIN') {
            window.location.href = '/mi-cuenta';
            return;
        }
        document.getElementById('userName').textContent = user.nombre + ' ' + user.apellido;
    } catch { window.location.href = '/login'; }
}

async function handleLogout() {
    await fetch('/api/usuarios/logout', { method: 'POST' });
    window.location.href = '/login';
}

/* ---------- Modal ---------- */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* ---------- Dashboard ---------- */
async function loadDashboard() {
    try {
        const [uRes, sRes, pRes] = await Promise.all([
            fetch('/api/usuarios').then(r => r.json()),
            fetch('/api/suscripciones').then(r => r.json()),
            fetch('/api/pagos').then(r => r.json())
        ]);
        users = uRes; subs = sRes; pagos = pRes;

        document.getElementById('statUsers').textContent = users.length;
        document.getElementById('statActive').textContent = users.filter(u => u.estado === 'activo').length;
        document.getElementById('statSubs').textContent = subs.filter(s => s.estado === 'activa').length;

        const total = pagos.filter(p => p.estado === 'completado').reduce((s, p) => s + Number(p.monto || 0), 0);
        document.getElementById('statRevenue').textContent = '$' + total.toLocaleString('es-CL');

        const recent = users.slice(-5).reverse();
        document.getElementById('recentUsers').innerHTML = recent.map(u => `
            <tr>
                <td>${u.nombre} ${u.apellido}</td>
                <td>${u.email}</td>
                <td><span class="gw-badge">${u.rol}</span></td>
                <td><span class="gw-badge ${u.estado === 'activo' ? 'success' : 'danger'}">${u.estado}</span></td>
            </tr>`).join('');

        const recentPay = pagos.slice(-5).reverse();
        document.getElementById('recentPayments').innerHTML = recentPay.map(p => `
            <tr>
                <td>#${p.usuarioId}</td>
                <td>$${Number(p.monto).toLocaleString('es-CL')}</td>
                <td>${p.metodoPago || '-'}</td>
                <td>${GW.fmtDateTime(p.fechaPago)}</td>
            </tr>`).join('');
    } catch (e) { console.error(e); }
}

/* ---------- Usuarios ---------- */
async function loadUsers() {
    users = await fetch('/api/usuarios').then(r => r.json());
    renderUsers();
}

function renderUsers() {
    document.getElementById('usersBody').innerHTML = users.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nombre} ${u.apellido || ''}</td>
            <td>${u.email}</td>
            <td>${u.rut || '-'}</td>
            <td>${u.telefono || '-'}</td>
            <td><span class="gw-badge ${u.rol === 'DUENO' ? 'danger' : u.rol === 'ADMIN' ? 'warning' : 'info'}">${u.rol}</span></td>
            <td><span class="gw-badge ${u.estado === 'activo' ? 'success' : 'danger'}">${u.estado}</span></td>
            <td>${GW.fmtDate(u.fechaRegistro)}</td>
            <td>
                <div class="flex gap-2">
                    <button class="gw-btn sm" onclick="editUser(${u.id})"><i class="bi bi-pencil"></i></button>
                    <button class="gw-btn sm danger" onclick="deleteUser(${u.id})"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>`).join('');
}

function openUserModal(id) {
    editingUserId = null;
    document.getElementById('userModalTitle').textContent = 'Nuevo Usuario';
    document.getElementById('pwdHint').textContent = '(mínimo 4)';
    ['uNombre','uApellido','uEmail','uPassword','uRut','uTelefono','uDireccion'].forEach(x => document.getElementById(x).value = '');
    document.getElementById('uRol').value = 'MIEMBRO';
    document.getElementById('uEstado').value = 'activo';
    openModal('userModal');
}

function editUser(id) {
    const u = users.find(x => x.id === id);
    if (!u) return;
    editingUserId = id;
    document.getElementById('userModalTitle').textContent = 'Editar Usuario';
    document.getElementById('pwdHint').textContent = '(dejar vacío para no cambiar)';
    document.getElementById('uNombre').value = u.nombre;
    document.getElementById('uApellido').value = u.apellido || '';
    document.getElementById('uEmail').value = u.email;
    document.getElementById('uPassword').value = '';
    document.getElementById('uRut').value = u.rut || '';
    document.getElementById('uTelefono').value = u.telefono || '';
    document.getElementById('uDireccion').value = u.direccion || '';
    document.getElementById('uRol').value = u.rol;
    document.getElementById('uEstado').value = u.estado;
    openModal('userModal');
}

async function saveUser() {
    const data = {
        nombre: document.getElementById('uNombre').value.trim(),
        apellido: document.getElementById('uApellido').value.trim(),
        email: document.getElementById('uEmail').value.trim().toLowerCase(),
        password: document.getElementById('uPassword').value,
        rut: document.getElementById('uRut').value.trim(),
        telefono: document.getElementById('uTelefono').value.trim(),
        direccion: document.getElementById('uDireccion').value.trim(),
        rol: document.getElementById('uRol').value,
        estado: document.getElementById('uEstado').value
    };
    if (!data.nombre || !data.email) { GW.toast('Nombre y email son requeridos', 'error'); return; }
    if (!editingUserId && (!data.password || data.password.length < 4)) { GW.toast('Contraseña mínimo 4 caracteres', 'error'); return; }

    if (editingUserId) {
        if (!data.password) delete data.password;
        await fetch('/api/usuarios/' + editingUserId, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
    } else {
        const res = await fetch('/api/usuarios', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
    }
    closeModal('userModal');
    GW.toast('Usuario guardado', 'success');
    loadUsers();
}

async function deleteUser(id) {
    if (!confirm('¿Desactivar este usuario?')) return;
    await fetch('/api/usuarios/' + id, { method: 'DELETE' });
    GW.toast('Usuario desactivado', 'success');
    loadUsers();
}

/* ---------- Suscripciones ---------- */
async function loadPlansAndSubs() {
    [plans, subs] = await Promise.all([
        fetch('/api/suscripciones/planes').then(r => r.json()),
        fetch('/api/suscripciones').then(r => r.json())
    ]);
    allSubs = subs; allPagos = pagos;
    renderPlans(); renderSubs();
}

function renderPlans() {
    document.getElementById('plansBody').innerHTML = plans.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>$${Number(p.precio).toLocaleString('es-CL')}</td>
            <td>${p.duracionDias} días</td>
            <td>${p.descripcion || '-'}</td>
        </tr>`).join('');
}

function renderSubs() {
    document.getElementById('subsBody').innerHTML = subs.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>#${s.usuarioId}</td>
            <td>#${s.planId}</td>
            <td>${s.fechaInicio}</td>
            <td>${s.fechaFin}</td>
            <td><span class="gw-badge ${s.estado === 'activa' ? 'success' : 'danger'}">${s.estado}</span></td>
            <td>${s.estado === 'activa' ? `<button class="gw-btn sm danger" onclick="cancelSub(${s.id})"><i class="bi bi-x-lg"></i></button>` : '-'}</td>
        </tr>`).join('');
}

function openPlanModal() {
    ['pNombre','pPrecio','pDuracion','pDescripcion'].forEach(x => document.getElementById(x).value = '');
    openModal('planModal');
}

async function savePlan() {
    const data = {
        nombre: document.getElementById('pNombre').value.trim(),
        precio: parseFloat(document.getElementById('pPrecio').value),
        duracionDias: parseInt(document.getElementById('pDuracion').value),
        descripcion: document.getElementById('pDescripcion').value.trim()
    };
    if (!data.nombre || isNaN(data.precio) || isNaN(data.duracionDias)) { GW.toast('Datos incompletos', 'error'); return; }
    await fetch('/api/suscripciones/planes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    closeModal('planModal');
    GW.toast('Plan creado', 'success');
    loadPlansAndSubs();
}

function openAssignModal() {
    document.getElementById('asignarUserId').value = '';
    const sel = document.getElementById('asignarPlanId');
    sel.innerHTML = plans.map(p => `<option value="${p.id}">${p.nombre} - $${p.precio} (${p.duracionDias} días)</option>`).join('');
    openModal('assignModal');
}

async function saveAssign() {
    const usuarioId = parseInt(document.getElementById('asignarUserId').value);
    const planId = parseInt(document.getElementById('asignarPlanId').value);
    if (!usuarioId) { GW.toast('Ingresa ID de usuario', 'error'); return; }
    await fetch('/api/suscripciones/asignar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, planId })
    });
    closeModal('assignModal');
    GW.toast('Suscripción asignada', 'success');
    loadPlansAndSubs();
}

async function cancelSub(id) {
    if (!confirm('¿Cancelar esta suscripción?')) return;
    await fetch('/api/suscripciones/' + id + '/cancelar', { method: 'PUT' });
    GW.toast('Suscripción cancelada', 'success');
    loadPlansAndSubs();
}

/* ---------- Asistencia ---------- */
async function loadAsistencia() {
    const data = await fetch('/api/asistencia').then(r => r.json());
    document.getElementById('asistenciaBody').innerHTML = data.map(a => `
        <tr>
            <td>${a.id}</td>
            <td>#${a.usuarioId}</td>
            <td>${a.fecha}</td>
            <td>${a.horaEntrada || '-'}</td>
            <td>${a.horaSalida || '-'}</td>
            <td>${a.horaSalida ? '<span class="gw-badge success">Completo</span>' : '<span class="gw-badge warning">En curso</span>'}</td>
        </tr>`).join('');
}

async function regEntrada() {
    const id = document.getElementById('entradaUserId').value;
    if (!id) { GW.toast('Ingresa ID de usuario', 'error'); return; }
    try {
        await fetch('/api/asistencia/entrada/' + id, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        document.getElementById('entradaUserId').value = '';
        GW.toast('Entrada registrada', 'success');
        loadAsistencia();
    } catch (e) { GW.toast(e.message, 'error'); }
}

async function regSalida() {
    const id = document.getElementById('salidaUserId').value;
    if (!id) { GW.toast('Ingresa ID de usuario', 'error'); return; }
    try {
        await fetch('/api/asistencia/salida/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        document.getElementById('salidaUserId').value = '';
        GW.toast('Salida registrada', 'success');
        loadAsistencia();
    } catch (e) { GW.toast(e.message, 'error'); }
}

/* ---------- Pagos ---------- */
async function loadPagos() {
    pagos = await fetch('/api/pagos').then(r => r.json());
    document.getElementById('pagosBody').innerHTML = pagos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>#${p.usuarioId}</td>
            <td>$${Number(p.monto).toLocaleString('es-CL')}</td>
            <td>${GW.fmtDateTime(p.fechaPago)}</td>
            <td>${p.metodoPago || '-'}</td>
            <td><span class="gw-badge ${p.estado === 'completado' ? 'success' : 'warning'}">${p.estado}</span></td>
        </tr>`).join('');
}

/* ---------- Init ---------- */
checkAuth();
loadDashboard();
