<template>
    <div class="d-flex justify-content-center mt-4">
        <div class="w-100 contenedor-registro">

            <div class="titulo-seccion mb-4">
                <h2 class="fw-bold">Registro de asistencias de funcionarios</h2>
                <p class="text-muted">Control horario semanal del personal</p>
            </div>

            <div class="card sombra-suave mb-4">
                <div class="card-body">
                    <form class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Buscar por nombre o RUT</label>
                            <input v-model="filtroTexto" type="text" class="form-control"
                                placeholder="Ej: Juan o 12.345.678-9" />
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">Fecha desde</label>
                            <input v-model="fechaDesde" type="date" class="form-control" />
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">Fecha hasta</label>
                            <input v-model="fechaHasta" type="date" class="form-control" />
                        </div>
                        <div class="col-md-2 d-flex align-items-end">
                            <button type="button" class="btn btn-outline-secondary w-100" @click="limpiarFiltros">
                                Limpiar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card sombra-suave mb-4">
                <div class="card-body">
                    <h5 class="fw-semibold mb-3">Listado de asistencias</h5>
                    <div v-if="asistenciasFiltradas.length">
                        <table class="table table-hover table-striped align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Hora Entrada</th>
                                    <th>Funcionario</th>
                                    <th>RUT</th>
                                    <th>Cargo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(a, i) in asistenciasFiltradas" :key="i">
                                    <td>{{ a.fecha }}</td>
                                    <td>{{ a.hora }}</td>
                                    <td>{{ a.nombre }}</td>
                                    <td>{{ a.rut }}</td>
                                    <td>{{ a.cargo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p v-else class="text-muted mb-0">
                        No hay asistencias que coincidan con los filtros.
                    </p>
                </div>
            </div>

            <CalendarioAsistencias :events="eventosCalendario" titulo="Calendario semanal de asistencias (Funcionarios)"
                descripcion="Vista semanal de entradas y salidas por funcionario" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CalendarioAsistencias from '@/shared/calendarioAsistencias/components/CalendarioAsistencias.vue'

const asistenciasBase = ref([
    {
        fecha: '2025-11-10',
        hora: '08:30',
        nombre: 'Carlos Díaz',
        rut: '11.111.111-1',
        cargo: 'Entrenador',

        fecha_entrada: '2025-11-10 08:30',
        fecha_salida: null,
        nombres: 'Carlos Díaz Molina',
        tipo: 'funcionario'
    },
    {
        fecha: '2025-11-09',
        hora: '17:45',
        nombre: 'Pedro González',
        rut: '12.345.678-9',
        cargo: 'Recepcionista',

        fecha_entrada: '2025-11-09 17:45',
        fecha_salida: '2025-11-09 18:30',
        nombres: 'Pedro González Soto',
        tipo: 'funcionario'
    }
])

const eventosCalendario = ref([])
const filtroTexto = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')

onMounted(() => {
    eventosCalendario.value = generarEventosFicticios(asistenciasBase.value)
})

const asistenciasFiltradas = computed(() => {
    return asistenciasBase.value.filter(a => {
        const texto = filtroTexto.value.trim().toLowerCase()

        const coincideTexto =
            !texto ||
            a.nombre.toLowerCase().includes(texto) ||
            a.rut.toLowerCase().includes(texto)

        const desde = fechaDesde.value
        const hasta = fechaHasta.value

        const enRango =
            (!desde || a.fecha >= desde) &&
            (!hasta || a.fecha <= hasta)

        return coincideTexto && enRango
    })
})

const limpiarFiltros = () => {
    filtroTexto.value = ''
    fechaDesde.value = ''
    fechaHasta.value = ''
}

function generarEventosFicticios(lista) {
    return lista.map(a => {
        const start = a.fecha_entrada
        let end = a.fecha_salida

        if (!end) {
            const d = new Date(start)
            d.setHours(d.getHours() + 1)
            end = d.toISOString().slice(0, 16).replace('T', ' ')
        }

        return {
            id: crypto.randomUUID(),
            title: `${a.nombres} — Entrada`,
            start,
            end,
            color: '#2196f3',
            tipo: 'funcionario'
        }
    })
}
</script>

<style scoped>
.contenedor-registro {
    max-width: 1100px;
}

.sombra-suave {
    border-radius: 10px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, .08);
}

.titulo-seccion h2 {
    font-size: 1.6rem;
}
</style>
