<template>
    <div class="d-flex justify-content-center mt-4">
        <div class="w-100 contenedor-registro">

            <div class="titulo-seccion mb-4">
                <h2 class="fw-bold">Registrar asistencia de funcionarios</h2>
                <p class="text-muted">Busca al funcionario y registra su asistencia del día</p>
            </div>

            <div class="card sombra-suave mb-4">
                <div class="card-body">
                    <form class="row g-3" @submit.prevent="buscarFuncionario">
                        <div class="col-md-8">
                            <label class="form-label fw-semibold">RUT o nombre del funcionario</label>
                            <input v-model="busqueda" type="text" class="form-control"
                                placeholder="Ej: 12.345.678-9 o Pedro González" />
                        </div>
                        <div class="col-md-4 d-flex align-items-end">
                            <button type="submit" class="btn btn-primary w-100">
                                Buscar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div v-if="funcionarioSeleccionado" class="card sombra-suave mb-4">
                <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div class="mb-3 mb-md-0">
                        <h5 class="fw-bold mb-1">{{ funcionarioSeleccionado.nombre }}</h5>
                        <p class="mb-1">
                            Cargo: <span class="fw-semibold">{{ funcionarioSeleccionado.cargo }}</span>
                        </p>
                        <p class="mb-0">
                            Estado:
                            <span :class="[
                                'badge',
                                funcionarioSeleccionado.activo ? 'bg-success' : 'bg-danger'
                            ]">
                                {{ funcionarioSeleccionado.activo ? 'Activo' : 'Inactivo' }}
                            </span>
                        </p>
                    </div>
                    <button class="btn btn-success" @click="registrarAsistencia"
                        :disabled="!funcionarioSeleccionado.activo">
                        Registrar asistencia de hoy
                    </button>
                </div>
            </div>

            <div v-if="funcionarioSeleccionado && asistencias.length" class="card sombra-suave">
                <div class="card-body">
                    <h5 class="fw-semibold">Historial de asistencias</h5>
                    <table class="table table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(a, i) in asistencias" :key="i">
                                <td>{{ a.fecha }}</td>
                                <td>{{ a.hora }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <p v-else-if="funcionarioSeleccionado" class="text-muted">
                No hay asistencias registradas para este funcionario todavía.
            </p>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'

const busqueda = ref('')
const funcionarioSeleccionado = ref(null)
const asistencias = ref([])

const buscarFuncionario = () => {
    if (!busqueda.value) return

    funcionarioSeleccionado.value = {
        id: 1,
        nombre: 'Pedro González',
        cargo: 'Recepcionista',
        activo: true
    }

    asistencias.value = [
        { fecha: '2025-11-09', hora: '08:30' },
        { fecha: '2025-11-10', hora: '14:40' }
    ]
}

const registrarAsistencia = () => {
    const now = new Date()
    const fecha = now.toISOString().slice(0, 10)
    const hora = now.toTimeString().slice(0, 5)

    asistencias.value.unshift({ fecha, hora })
}
</script>


<style scoped>
.contenedor-registro {
    max-width: 900px;
}

.sombra-suave {
    border-radius: 10px;
    box-shadow: 0px 3px 12px rgba(0, 0, 0, .08);
}

.titulo-seccion h2 {
    font-size: 1.6rem;
}
</style>
