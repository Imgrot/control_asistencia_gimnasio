import registroDeAsistenciasRouter from '@/modules/clientes/registroDeAsistencias/router/registroDeAsistenciasRouter.js'
import registrarAsistenciasRouter from '@/modules/clientes/registrarAsistencias/router/registrarAsistenciasRouter.js'
import estadoMembresiaRouter from '@/modules/clientes/estadoMembresia/router/estadoMembresiaRouter.js'

export default {
    path: '/clientes',
    name: 'Clientes',
    meta: { title: 'Clientes' },
    children: [
        registroDeAsistenciasRouter,
        registrarAsistenciasRouter,
        estadoMembresiaRouter
    ]
}
