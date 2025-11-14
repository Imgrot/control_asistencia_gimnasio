import registroDeAsistenciasRouter from '@/modules/funcionarios/registroDeAsistencias/router/registroDeAsistenciasRouter.js'
import registrarAsistenciasRouter from '@/modules/funcionarios/registrarAsistencias/router/registrarAsistenciasRouter.js'

export default {
    path: '/funcionarios',
    name: 'Funcionarios',
    meta: { title: 'Funcionarios' },
    children: [
        registroDeAsistenciasRouter,
        registrarAsistenciasRouter
    ]
}
