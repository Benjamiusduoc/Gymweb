let planEditandoId = null;

function renderPlanForm() {
    return `
        <div class="modal fade" id="planModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nuevo Plan</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="planForm">
                            <div class="mb-3">
                                <label class="form-label">Nombre del Plan</label>
                                <input type="text" class="form-control" id="pNombre" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Precio ($)</label>
                                <input type="number" step="0.01" class="form-control" id="pPrecio" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Duración (días)</label>
                                <input type="number" class="form-control" id="pDuracion" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Descripción</label>
                                <textarea class="form-control" id="pDescripcion" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarPlan()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderAsignarModal() {
    return `
        <div class="modal fade" id="asignarModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Asignar Suscripción</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">ID Usuario</label>
                            <input type="number" class="form-control" id="asignarUsuarioId" min="1" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Plan</label>
                            <select class="form-select" id="asignarPlanId"></select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="asignarSuscripcion()">Asignar</button>
                    </div>
                </div>
            </div>
        </div>`;
}

async function cargarPlanesDropdown() {
    const planes = await get(`${API.SUSCRIPCIONES}/planes`);
    const sel = document.getElementById('asignarPlanId');
    sel.innerHTML = planes.map(p => `<option value="${p.id}">${p.nombre} - $${p.precio} (${p.duracionDias} días)</option>`).join('');
}

async function cargarPlanes() {
    const data = await get(`${API.SUSCRIPCIONES}/planes`);
    const tbody = document.querySelector('#planesTable tbody');
    tbody.innerHTML = data.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.duracionDias} días</td>
            <td>${p.descripcion || '-'}</td>
        </tr>
    `).join('');
}

async function cargarSuscripciones() {
    const data = await get(API.SUSCRIPCIONES);
    const tbody = document.querySelector('#suscripcionesTable tbody');
    tbody.innerHTML = data.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${s.usuarioId}</td>
            <td>${s.planId}</td>
            <td>${s.fechaInicio}</td>
            <td>${s.fechaFin}</td>
            <td><span class="badge bg-${s.estado === 'activa' ? 'success' : 'secondary'}">${s.estado}</span></td>
            <td>${s.estado === 'activa' ? `<button class="btn btn-sm btn-outline-danger" onclick="cancelarSuscripcion(${s.id})">Cancelar</button>` : '-'}</td>
        </tr>
    `).join('');
}

function abrirNuevoPlan() {
    planEditandoId = null;
    document.getElementById('planForm').reset();
    new bootstrap.Modal(document.getElementById('planModal')).show();
}

async function guardarPlan() {
    const data = {
        nombre: document.getElementById('pNombre').value,
        precio: parseFloat(document.getElementById('pPrecio').value),
        duracionDias: parseInt(document.getElementById('pDuracion').value),
        descripcion: document.getElementById('pDescripcion').value
    };
    await post(`${API.SUSCRIPCIONES}/planes`, data);
    bootstrap.Modal.getInstance(document.getElementById('planModal')).hide();
    cargarPlanes();
}

async function abrirAsignar() {
    await cargarPlanesDropdown();
    document.getElementById('asignarUsuarioId').value = '';
    new bootstrap.Modal(document.getElementById('asignarModal')).show();
}

async function asignarSuscripcion() {
    const usuarioId = parseInt(document.getElementById('asignarUsuarioId').value);
    const planId = parseInt(document.getElementById('asignarPlanId').value);
    if (!usuarioId) { alert('Ingrese ID de usuario'); return; }
    await post(`${API.SUSCRIPCIONES}/asignar`, { usuarioId, planId });
    bootstrap.Modal.getInstance(document.getElementById('asignarModal')).hide();
    cargarSuscripciones();
}

async function cancelarSuscripcion(id) {
    if (!confirm('¿Cancelar esta suscripción?')) return;
    await put(`${API.SUSCRIPCIONES}/${id}/cancelar`, {});
    cargarSuscripciones();
}

function renderSuscripciones() {
    return `
        <h4><i class="bi bi-card-list"></i> Planes</h4>
        <div class="d-flex justify-content-end mb-2">
            <button class="btn btn-primary btn-sm" onclick="abrirNuevoPlan()"><i class="bi bi-plus-lg"></i> Nuevo Plan</button>
        </div>
        <div class="table-responsive mb-4">
            <table class="table table-striped table-hover" id="planesTable">
                <thead class="table-dark">
                    <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Duración</th><th>Descripción</th></tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h4><i class="bi bi-person-check"></i> Suscripciones</h4>
            <button class="btn btn-success btn-sm" onclick="abrirAsignar()"><i class="bi bi-plus-lg"></i> Asignar</button>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-hover" id="suscripcionesTable">
                <thead class="table-dark">
                    <tr><th>ID</th><th>Usuario</th><th>Plan</th><th>Inicio</th><th>Fin</th><th>Estado</th><th>Acción</th></tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        ${renderPlanForm()}
        ${renderAsignarModal()}`;
}
