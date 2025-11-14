export default {
    path: '/clientes/estado-membresia',
    name: 'ClientesEstadoMembresia',
    meta: { title: 'Estado de Membresía - Clientes' },
    component: () => import('@/modules/clientes/estadoMembresia/views/EstadoMembresia.vue')
}
