<template>

  <div class="d-flex justify-content-center mt-4">
    <div class="w-100" style="max-width: 1100px;">
      <h2 class="mb-4 text-center text-md-start">
        Registro de asistencias de clientes
      </h2>

      <!-- el filtroh-->
      <div class="card mb-4">
        <div class="card-body">
          <form class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Buscar por nombre o RUT</label>
              <input v-model="filtroTexto" type="text" class="form-control" placeholder="Ej: Juan o 12.345.678-9" />
            </div>

            <div class="col-md-3">
              <label class="form-label">Fecha desde</label>
              <input v-model="fechaDesde" type="date" class="form-control" />
            </div>

            <div class="col-md-3">
              <label class="form-label">Fecha hasta</label>
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

      <!-- La tablita -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Listado de asistencias</h5>

          <div v-if="asistenciasFiltradas.length">
            <table class="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Hora</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">RUT</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Estado membresía</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(a, index) in asistenciasFiltradas" :key="index">
                  <td>{{ a.fecha }}</td>
                  <td>{{ a.hora }}</td>
                  <td>{{ a.nombre }}</td>
                  <td>{{ a.rut }}</td>
                  <td>{{ a.plan }}</td>
                  <td>
                    <span :class="[
                      'badge',
                      a.estadoMembresia === 'Activa'
                        ? 'bg-success'
                        : 'bg-danger'
                    ]">
                      {{ a.estadoMembresia }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p v-else class="text-muted mb-0">
            No hay asistencias que coincidan con los filtros seleccionados.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Datos que simulé x mientras
const asistenciasBase = ref([
  {
    fecha: '2025-11-10',
    hora: '08:30',
    nombre: 'Juan Pérez',
    rut: '12.345.678-9',
    plan: 'Mensual ilimitado',
    estadoMembresia: 'Activa'
  },
  {
    fecha: '2025-11-10',
    hora: '19:15',
    nombre: 'María López',
    rut: '9.876.543-2',
    plan: '3 meses',
    estadoMembresia: 'Activa'
  },
  {
    fecha: '2025-11-09',
    hora: '18:05',
    nombre: 'Carlos Díaz',
    rut: '11.111.111-1',
    plan: 'Mensual limitado',
    estadoMembresia: 'Vencida'
  }
])

// lo del Filtroh
const filtroTexto = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')

// el Computed para aplicar los filtros
const asistenciasFiltradas = computed(() => {
  return asistenciasBase.value.filter((a) => {
    const texto = filtroTexto.value.trim().toLowerCase()
    const coincideTexto =
      !texto ||
      a.nombre.toLowerCase().includes(texto) ||
      a.rut.toLowerCase().includes(texto)

    const desde = fechaDesde.value
    const hasta = fechaHasta.value

    const dentroDeRango =
      (!desde || a.fecha >= desde) &&
      (!hasta || a.fecha <= hasta)

    return coincideTexto && dentroDeRango
  })
})

const limpiarFiltros = () => {
  filtroTexto.value = ''
  fechaDesde.value = ''
  fechaHasta.value = ''
}
</script>
