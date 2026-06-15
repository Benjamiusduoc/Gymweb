async function cargarAsistencia() {
    const data = await get(API.ASISTENCIA);
    const tbody = document.querySelector('#asistenciaTable tbody');
    tbody.innerHTML = data.map(a => `
        <tr>
            <td>${a.id}</td>
            <td>${a.usuarioId}</td>
            <td>${a.fecha}</td>
            <td>${a.horaEntrada || '-'}</td>
            <td>${a.horaSalida || '-'}</td>
            <td>${a.horaSalida ? '<span class="badge bg-success">Completo</span>' : '<span class="badge bg-warning">En curso</span>'}</td>
        </tr>
    `).join('');
}

async function registrarEntrada() {
    const id = document.getElementById('entradaUsuarioId').value;
    if (!id) { alert('Ingrese ID de usuario'); return; }
    try {
        await post(`${API.ASISTENCIA}/entrada/${id}`, {});
        document.getElementById('entradaUsuarioId').value = '';
        cargarAsistencia();
        alert('Entrada registrada correctamente');
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

async function registrarSalida() {
    const id = document.getElementById('salidaUsuarioId').value;
    if (!id) { alert('Ingrese ID de usuario'); return; }
    try {
        await put(`${API.ASISTENCIA}/salida/${id}`, {});
        document.getElementById('salidaUsuarioId').value = '';
        cargarAsistencia();
        alert('Salida registrada correctamente');
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

function renderAsistencia() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4><i class="bi bi-calendar-check"></i> Asistencia</h4>
        </div>
        <div class="row mb-4 g-3">
            <div class="col-md-6">
                <div class="card border-success">
                    <div class="card-body d-flex align-items-center gap-3">
                        <input type="number" class="form-control" id="entradaUsuarioId" placeholder="ID Usuario" min="1">
                        <button class="btn btn-success" onclick="registrarEntrada()"><i class="bi bi-box-arrow-in-right"></i> Registrar Entrada</button>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card border-warning">
                    <div class="card-body d-flex align-items-center gap-3">
                        <input type="number" class="form-control" id="salidaUsuarioId" placeholder="ID Usuario" min="1">
                        <button class="btn btn-warning" onclick="registrarSalida()"><i class="bi bi-box-arrow-right"></i> Registrar Salida</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-hover" id="asistenciaTable">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Usuario ID</th>
                        <th>Fecha</th>
                        <th>Entrada</th>
                        <th>Salida</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`;
}
