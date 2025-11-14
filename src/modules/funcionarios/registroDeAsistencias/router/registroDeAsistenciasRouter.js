export default {
    path: '/funcionarios/registro-asistencias',
    name: 'FuncionariosRegistroAsistencias',
    meta: { title: 'Registro de Asistencias - Funcionarios' },
    component: () => import('@/modules/funcionarios/registroDeAsistencias/views/RegistroDeAsistencias.vue')
}
