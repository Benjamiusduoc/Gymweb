let currentUser = null;
let currentSub = null;
let allPlans = [];
let selectedPlanId = null;

/* ---------- Tabs ---------- */
document.querySelectorAll('[data-tab]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        switchTab(a.dataset.tab);
    });
});

function switchTab(tab) {
    document.querySelectorAll('.member-tab').forEach(t => t.style.display = 'none');
    document.getElementById('tab-' + tab).style.display = 'block';
    document.querySelectorAll('.gw-nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
    if (tab === 'perfil') loadPerfil();
    if (tab === 'suscripcion') loadMiSuscripcion();
    if (tab === 'pagar') loadPlanesPago();
}

/* ---------- Auth ---------- */
async function checkAuth() {
    try {
        const res = await fetch('/api/usuarios/me');
        if (!res.ok) throw new Error();
        currentUser = await res.json();
        document.getElementById('userName').textContent = currentUser.nombre + ' ' + currentUser.apellido;
    } catch { window.location.href = '/login'; }
}

async function handleLogout() {
    await fetch('/api/usuarios/logout', { method: 'POST' });
    window.location.href = '/login';
}

/* ---------- Modal ---------- */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* ---------- Perfil ---------- */
async function loadPerfil() {
    if (!currentUser) return;
    document.getElementById('miNombre').textContent = currentUser.nombre || '-';
    document.getElementById('miApellido').textContent = currentUser.apellido || '-';
    document.getElementById('miEmail').textContent = currentUser.email || '-';
    document.getElementById('miRut').textContent = currentUser.rut || '-';
    document.getElementById('miTelefono').textContent = currentUser.telefono || '-';
    document.getElementById('miDireccion').textContent = currentUser.direccion || '-';
    document.getElementById('miEstado').textContent = currentUser.estado || '-';
    document.getElementById('miEstado').className = 'gw-badge ' + (currentUser.estado === 'activo' ? 'success' : 'danger');
    document.getElementById('miRegistro').textContent = GW.fmtDate(currentUser.fechaRegistro);
}

/* ---------- Mi suscripción ---------- */
async function loadMiSuscripcion() {
    if (!currentUser) return;
    try {
        const res = await fetch('/api/suscripciones/usuario/' + currentUser.id);
        if (res.ok) {
            const list = await res.json();
            currentSub = list.find(s => s.estado === 'activa') || null;

            if (currentSub) {
                document.getElementById('noSubCard').style.display = 'none';
                document.getElementById('subCard').style.display = 'block';
                document.getElementById('subInicio').textContent = currentSub.fechaInicio;
                document.getElementById('subFin').textContent = currentSub.fechaFin;
                document.getElementById('subEstado').textContent = currentSub.estado;
                document.getElementById('subEstado').className = 'gw-badge success';

                try {
                    const planRes = await fetch('/api/suscripciones/planes/' + currentSub.planId);
                    if (planRes.ok) {
                        const plan = await planRes.json();
                        document.getElementById('subPlanName').textContent = plan.nombre;
                        document.getElementById('subPlanDesc').textContent = plan.descripcion || '';
                        document.getElementById('subPrecio').textContent = '$' + Number(plan.precio).toLocaleString('es-CL');
                    }
                } catch {}

                const others = list.filter(s => s.id !== currentSub.id);
                if (others.length) {
                    document.getElementById('subHistory').style.display = 'block';
                    document.getElementById('subHistoryBody').innerHTML = others.map(s => `
                        <tr>
                            <td>#${s.planId}</td>
                            <td>${s.fechaInicio}</td>
                            <td>${s.fechaFin}</td>
                            <td><span class="gw-badge ${s.estado === 'activa' ? 'success' : 'danger'}">${s.estado}</span></td>
                        </tr>`).join('');
                }
            } else {
                document.getElementById('noSubCard').style.display = 'block';
                document.getElementById('subCard').style.display = 'none';
            }
        }
    } catch { }
}

/* ---------- Pagar ---------- */
async function loadPlanesPago() {
    try {
        const res = await fetch('/api/suscripciones/planes');
        allPlans = await res.json();
        renderPlansPago();
    } catch { }
}

function renderPlansPago() {
    const featuredIndex = 1;
    document.getElementById('plansGrid').innerHTML = allPlans.map((p, i) => `
        <div class="plan-card ${i === featuredIndex ? 'featured' : ''}">
            <h4>${p.nombre}</h4>
            <div class="price">$${Number(p.precio).toLocaleString('es-CL')} <small>/ mes</small></div>
            <p class="text-muted fs-sm">${p.descripcion || p.duracionDias + ' días de acceso'}</p>
            <ul>
                <li><i class="bi bi-check2"></i> ${p.duracionDias} días de acceso</li>
                <li><i class="bi bi-check2"></i> Gimnasio completo</li>
            </ul>
            <button class="gw-btn ${i === featuredIndex ? 'primary' : ''}" style="width:100%; justify-content:center;" onclick="selectPlan(${p.id}, '${p.nombre.replace(/'/g, "\\'")}', ${p.precio})">
                <i class="bi bi-credit-card"></i> Elegir ${p.nombre}
            </button>
        </div>
    `).join('');
}

function selectPlan(id, name, price) {
    selectedPlanId = id;
    document.getElementById('payPlanName').textContent = name;
    document.getElementById('payPlanPrice').textContent = '$' + Number(price).toLocaleString('es-CL');
    openModal('payModal');
}

async function confirmPay() {
    if (!selectedPlanId || !currentUser) return;
    const btn = document.getElementById('confirmPayBtn');
    btn.disabled = true;
    btn.textContent = 'Procesando...';

    try {
        const res = await fetch('/api/pagos/pagar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuarioId: currentUser.id,
                planId: selectedPlanId,
                metodoPago: document.getElementById('payMetodo').value
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Error al procesar pago');
        }

        closeModal('payModal');
        document.getElementById('paymentResult').style.display = 'block';
        document.getElementById('paymentResultMsg').textContent = 'Tu suscripción ha sido activada. ¡A disfrutar del gym!';
        GW.toast('¡Pago registrado exitosamente!', 'success');
    } catch (e) {
        GW.toast(e.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-lock"></i> Confirmar pago';
    }
}

/* ---------- Init ---------- */
checkAuth().then(() => {
    loadPerfil();
});
