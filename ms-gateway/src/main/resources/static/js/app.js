document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navegar(link.dataset.page);
        });
    });
});

function navegar(page) {
    const content = document.getElementById('app-content');
    switch (page) {
        case 'usuarios':
            content.innerHTML = renderUsuarios();
            cargarUsuarios();
            break;
        case 'asistencia':
            content.innerHTML = renderAsistencia();
            cargarAsistencia();
            break;
        case 'suscripciones':
            content.innerHTML = renderSuscripciones();
            cargarPlanes();
            cargarSuscripciones();
            break;
        case 'pagos':
            content.innerHTML = renderPagos();
            cargarPagos();
            break;
        default:
            window.location.href = '/';
    }
}
