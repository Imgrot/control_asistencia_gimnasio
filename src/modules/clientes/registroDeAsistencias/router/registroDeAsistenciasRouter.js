export default {
    path: '/clientes/registro-asistencias',
    name: 'ClientesRegistroAsistencias',
    meta: { title: 'Registro de Asistencias - Clientes' },
    component: () => import('@/modules/clientes/registroDeAsistencias/views/RegistroDeAsistencias.vue')
}
