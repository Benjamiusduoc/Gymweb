let usuarioEditandoId = null;

function renderUsuarioForm() {
    return `
        <div class="modal fade" id="usuarioModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="usuarioModalTitle">Nuevo Usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="usuarioForm">
                            <div class="mb-3">
                                <label class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="uNombre" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="uEmail" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Teléfono</label>
                                <input type="text" class="form-control" id="uTelefono">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Dirección</label>
                                <input type="text" class="form-control" id="uDireccion">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Fecha de Nacimiento</label>
                                <input type="date" class="form-control" id="uFechaNac">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Estado</label>
                                <select class="form-select" id="uEstado">
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarUsuario()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>`;
}

async function cargarUsuarios() {
    const data = await get(API.USUARIOS);
    const tbody = document.querySelector('#usuariosTable tbody');
    tbody.innerHTML = data.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>${u.telefono || '-'}</td>
            <td><span class="badge bg-${u.estado === 'activo' ? 'success' : 'secondary'}">${u.estado}</span></td>
            <td>${new Date(u.fechaRegistro).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editarUsuario(${u.id})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(${u.id})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function abrirNuevoUsuario() {
    usuarioEditandoId = null;
    document.getElementById('usuarioModalTitle').textContent = 'Nuevo Usuario';
    document.getElementById('usuarioForm').reset();
    new bootstrap.Modal(document.getElementById('usuarioModal')).show();
}

async function editarUsuario(id) {
    usuarioEditandoId = id;
    const u = await get(`${API.USUARIOS}/${id}`);
    document.getElementById('usuarioModalTitle').textContent = 'Editar Usuario';
    document.getElementById('uNombre').value = u.nombre;
    document.getElementById('uEmail').value = u.email;
    document.getElementById('uTelefono').value = u.telefono || '';
    document.getElementById('uDireccion').value = u.direccion || '';
    document.getElementById('uFechaNac').value = u.fechaNacimiento || '';
    document.getElementById('uEstado').value = u.estado;
    new bootstrap.Modal(document.getElementById('usuarioModal')).show();
}

async function guardarUsuario() {
    const data = {
        nombre: document.getElementById('uNombre').value,
        email: document.getElementById('uEmail').value,
        telefono: document.getElementById('uTelefono').value,
        direccion: document.getElementById('uDireccion').value,
        fechaNacimiento: document.getElementById('uFechaNac').value || null,
        estado: document.getElementById('uEstado').value
    };
    if (usuarioEditandoId) {
        await put(`${API.USUARIOS}/${usuarioEditandoId}`, data);
    } else {
        await post(API.USUARIOS, data);
    }
    bootstrap.Modal.getInstance(document.getElementById('usuarioModal')).hide();
    cargarUsuarios();
}

async function eliminarUsuario(id) {
    if (!confirm('¿Eliminar (desactivar) este usuario?')) return;
    await del(`${API.USUARIOS}/${id}`);
    cargarUsuarios();
}

function renderUsuarios() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4><i class="bi bi-people"></i> Usuarios</h4>
            <button class="btn btn-primary" onclick="abrirNuevoUsuario()"><i class="bi bi-plus-lg"></i> Nuevo</button>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-hover" id="usuariosTable">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th>Registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        ${renderUsuarioForm()}`;
}
