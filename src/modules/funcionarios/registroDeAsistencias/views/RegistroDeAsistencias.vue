<template>
    <div class="d-flex justify-content-center mt-4">
        <div class="w-100 contenedor-registro">

            <div class="titulo-seccion mb-4">
                <h2 class="fw-bold">Registro de asistencias de funcionarios</h2>
                <p class="text-muted">Consulta las asistencias registradas según filtros</p>
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

            <div class="card sombra-suave">
                <div class="card-body">

                    <h5 class="fw-semibold mb-3">Listado de asistencias</h5>

                    <div v-if="asistenciasFiltradas.length">
                        <table class="table table-hover tabla-estilada align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Funcionario</th>
                                    <th>RUT</th>
                                    <th>Cargo</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="(a, index) in asistenciasFiltradas" :key="index">
                                    <td>{{ a.fecha }}</td>
                                    <td>{{ a.hora }}</td>
                                    <td>{{ a.nombre }}</td>
                                    <td>{{ a.rut }}</td>
                                    <td>{{ a.cargo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p v-else class="mb-0">
                        No hay asistencias que coincidan con los filtros seleccionados.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, computed } from 'vue'

// Datos simulados
const asistenciasBase = ref([
    {
        fecha: '2025-11-10',
        hora: '08:30',
        nombre: 'Pedro González',
        rut: '12.345.678-9',
        cargo: 'Recepcionista'
    },
    {
        fecha: '2025-11-10',
        hora: '14:00',
        nombre: 'Laura Soto',
        rut: '11.111.111-1',
        cargo: 'Entrenadora'
    },
    {
        fecha: '2025-11-09',
        hora: '17:45',
        nombre: 'Carlos Mora',
        rut: '9.876.543-2',
        cargo: 'Auxiliar'
    }
])

const filtroTexto = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')

const asistenciasFiltradas = computed(() => {
    return asistenciasBase.value.filter((a) => {
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
</script>


<style scoped>
.contenedor-registro {
    max-width: 1100px;
}

.sombra-suave {
    box-shadow: 0px 3px 12px rgba(0, 0, 0, .08);
    border-radius: 10px;
}

.tabla-estilada thead tr {
    background: #f5f5f5;
    border-bottom: 2px solid #ddd;
}

.titulo-seccion h2 {
    font-size: 1.6rem;
}
</style>
