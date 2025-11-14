export default {
    path: '/clientes/registrar-asistencia',
    name: 'ClientesRegistrarAsistencia',
    meta: { title: 'Registrar Asistencia - Clientes' },
    component: () => import('@/modules/clientes/registrarAsistencias/views/RegistrarAsistencias.vue')
}
