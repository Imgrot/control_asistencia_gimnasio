export default {
    path: '/funcionarios/registrar-asistencia',
    name: 'FuncionariosRegistrarAsistencia',
    meta: { title: 'Registrar Asistencia - Funcionarios' },
    component: () => import('@/modules/funcionarios/registrarAsistencias/views/RegistrarAsistencias.vue')
}
