async function cargarPagos() {
    const data = await get(API.PAGOS);
    const tbody = document.querySelector('#pagosTable tbody');
    tbody.innerHTML = data.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.usuarioId}</td>
            <td>${p.suscripcionId || '-'}</td>
            <td>$${p.monto}</td>
            <td>${new Date(p.fechaPago).toLocaleString()}</td>
            <td>${p.metodoPago || '-'}</td>
            <td><span class="badge bg-${p.estado === 'completado' ? 'success' : p.estado === 'pendiente' ? 'warning' : 'danger'}">${p.estado}</span></td>
        </tr>
    `).join('');
}

async function abrirNuevoPago() {
    document.getElementById('pagoForm').reset();
    new bootstrap.Modal(document.getElementById('pagoModal')).show();
}

async function guardarPago() {
    const data = {
        usuarioId: parseInt(document.getElementById('pgUsuarioId').value),
        suscripcionId: parseInt(document.getElementById('pgSuscripcionId').value) || null,
        monto: parseFloat(document.getElementById('pgMonto').value),
        metodoPago: document.getElementById('pgMetodo').value,
        estado: 'completado'
    };
    if (!data.usuarioId || !data.monto) { alert('Usuario y monto son requeridos'); return; }
    await post(API.PAGOS, data);
    bootstrap.Modal.getInstance(document.getElementById('pagoModal')).hide();
    cargarPagos();
}

function renderPagoForm() {
    return `
        <div class="modal fade" id="pagoModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Registrar Pago</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="pagoForm">
                            <div class="mb-3">
                                <label class="form-label">ID Usuario</label>
                                <input type="number" class="form-control" id="pgUsuarioId" min="1" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">ID Suscripción (opcional)</label>
                                <input type="number" class="form-control" id="pgSuscripcionId" min="1">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Monto ($)</label>
                                <input type="number" step="0.01" class="form-control" id="pgMonto" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Método de Pago</label>
                                <select class="form-select" id="pgMetodo">
                                    <option value="efectivo">Efectivo</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="transferencia">Transferencia</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarPago()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderPagos() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4><i class="bi bi-credit-card"></i> Pagos</h4>
            <button class="btn btn-primary" onclick="abrirNuevoPago()"><i class="bi bi-plus-lg"></i> Nuevo Pago</button>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-hover" id="pagosTable">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Suscripción</th>
                        <th>Monto</th>
                        <th>Fecha</th>
                        <th>Método</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        ${renderPagoForm()}`;
}
