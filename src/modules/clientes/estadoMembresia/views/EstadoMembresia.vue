<template>
  <div class="estado-membresia-page py-4">
    <div class="d-flex justify-content-center">
      <div class="w-100" style="max-width: 1100px;">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h2 class="mb-1">Estado de membresía de clientes</h2>
          </div>
        </div>


        <div class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="card shadow-soft border-0">
              <div class="card-body">
                <p class="text-muted mb-1">Total clientes</p>
                <h3 class="mb-0">{{ resumen.total }}</h3>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="card shadow-soft border-0">
              <div class="card-body">
                <p class="text-muted mb-1">Membresías activas</p>
                <h3 class="mb-0 text-success">{{ resumen.activas }}</h3>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="card shadow-soft border-0">
              <div class="card-body">
                <p class="text-muted mb-1">Por vencer (7 días)</p>
                <h3 class="mb-0 text-warning">{{ resumen.porVencer }}</h3>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="card shadow-soft border-0">
              <div class="card-body">
                <p class="text-muted mb-1">Membresías vencidas</p>
                <h3 class="mb-0 text-danger">{{ resumen.vencidas }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="card shadow-soft mb-4">
          <div class="card-body">
            <form class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Buscar por nombre o RUT</label>
                <input v-model="filtroTexto" type="text" class="form-control" placeholder="Ej: Juan o 12.345.678-9" />
              </div>

              <div class="col-md-3">
                <label class="form-label">Estado de membresía</label>
                <select v-model="filtroEstado" class="form-select">
                  <option value="">Todos</option>
                  <option value="Activa">Activa</option>
                  <option value="Por vencer">Por vencer</option>
                  <option value="Vencida">Vencida</option>
                </select>
              </div>

              <div class="col-md-3 d-flex align-items-end">
                <button type="button" class="btn btn-outline-secondary w-100" @click="limpiarFiltros">
                  Limpiar filtros
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tabla de estados de membresía -->
        <div class="card shadow-soft">
          <div class="card-body">
            <h5 class="card-title d-flex justify-content-between align-items-center">
              <span>Listado de clientes</span>
              <small class="text-muted">
                Mostrando {{ membresiasFiltradas.length }} de {{ resumen.total }}
              </small>
            </h5>

            <div v-if="membresiasFiltradas.length">
              <table class="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>RUT</th>
                    <th>Plan</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                    <th>Progreso</th>
                    <th class="text-end">Días restantes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, index) in membresiasFiltradas" :key="index">
                    <td>{{ m.nombre }}</td>
                    <td>{{ m.rut }}</td>
                    <td>{{ m.plan }}</td>
                    <td>{{ m.fechaInicio }}</td>
                    <td>{{ m.fechaFin }}</td>
                    <td>
                      <span :class="['badge', getBadgeClass(m.estado)]">
                        {{ m.estado }}
                      </span>
                    </td>
                    <!-- Barra de progreso del plan -->
                    <td style="min-width: 140px;">
                      <div class="progress membership-progress">
                        <div class="progress-bar" role="progressbar" :style="{ width: m.progreso + '%' }"
                          :class="getProgressBarClass(m.estado)" :aria-valuenow="m.progreso" aria-valuemin="0"
                          aria-valuemax="100"></div>
                      </div>
                      <small class="text-muted">
                        {{ m.progreso }}%
                      </small>
                    </td>
                    <!-- Días restantes -->
                    <td class="text-end">
                      <span v-if="m.estado === 'Vencida'" class="text-danger fw-semibold">
                        Vencida
                      </span>
                      <span v-else :class="[
                        'fw-semibold',
                        m.diasRestantes <= 7 ? 'text-warning' : 'text-muted'
                      ]">
                        {{ m.diasRestantes }} días
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p v-else class="text-muted mb-0">
              No hay clientes que coincidan con los filtros aplicados.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Datos simulados de clientes y su membresía
const membresiasBase = ref([
  {
    nombre: 'Juan Pérez',
    rut: '12.345.678-9',
    plan: 'Mensual ilimitado',
    fechaInicio: '2025-11-01',
    fechaFin: '2025-11-30'
  },
  {
    nombre: 'María López',
    rut: '9.876.543-2',
    plan: '3 meses',
    fechaInicio: '2025-09-15',
    fechaFin: '2025-12-15'
  },
  {
    nombre: 'Carlos Díaz',
    rut: '11.111.111-1',
    plan: 'Mensual limitado',
    fechaInicio: '2025-10-01',
    fechaFin: '2025-10-31'
  },
  {
    nombre: 'Ana Torres',
    rut: '22.222.222-2',
    plan: 'Anual',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-12-31'
  }
])

// Filtros
const filtroTexto = ref('')
const filtroEstado = ref('')

// Fecha de referencia (hoy)
const hoy = new Date()

const diasEntre = (inicioStr, finStr) => {
  const inicio = new Date(inicioStr + 'T00:00:00')
  const fin = new Date(finStr + 'T00:00:00')
  const diffMs = fin.getTime() - inicio.getTime()
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

const calcularDiasRestantes = (fechaFinStr) => {
  const fin = new Date(fechaFinStr + 'T00:00:00')
  const diffMs = fin.getTime() - hoy.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

const calcularEstadoYProgreso = (fechaInicioStr, fechaFinStr) => {
  const totalDias = diasEntre(fechaInicioStr, fechaFinStr)
  const inicio = new Date(fechaInicioStr + 'T00:00:00')
  const diffTranscurrido = hoy.getTime() - inicio.getTime()
  const diasTranscurridos = Math.floor(diffTranscurrido / (1000 * 60 * 60 * 24))

  const diasRestantes = calcularDiasRestantes(fechaFinStr)

  let estado = 'Activa'
  if (diasRestantes < 0) {
    estado = 'Vencida'
  } else if (diasRestantes <= 7) {
    estado = 'Por vencer'
  }

  let progreso = 0
  if (diasTranscurridos <= 0) {
    progreso = 0
  } else if (diasRestantes < 0) {
    progreso = 100
  } else {
    progreso = Math.min(100, Math.max(0, Math.round((diasTranscurridos / totalDias) * 100)))
  }

  return { estado, diasRestantes: Math.max(diasRestantes, 0), progreso }
}

// Membresías enriquecidas con estado, días restantes y porcentaje de progreso
const membresiasConEstado = computed(() =>
  membresiasBase.value.map((m) => {
    const info = calcularEstadoYProgreso(m.fechaInicio, m.fechaFin)
    return {
      ...m,
      estado: info.estado,
      diasRestantes: info.diasRestantes,
      progreso: info.progreso
    }
  })
)

// Filtro principal
const membresiasFiltradas = computed(() => {
  const texto = filtroTexto.value.trim().toLowerCase()
  const estado = filtroEstado.value

  return membresiasConEstado.value.filter((m) => {
    const coincideTexto =
      !texto ||
      m.nombre.toLowerCase().includes(texto) ||
      m.rut.toLowerCase().includes(texto)

    const coincideEstado = !estado || m.estado === estado

    return coincideTexto && coincideEstado
  })
})

// Resumen para las tarjetas de arriba
const resumen = computed(() => {
  const total = membresiasConEstado.value.length
  const activas = membresiasConEstado.value.filter((m) => m.estado === 'Activa').length
  const porVencer = membresiasConEstado.value.filter((m) => m.estado === 'Por vencer').length
  const vencidas = membresiasConEstado.value.filter((m) => m.estado === 'Vencida').length

  return { total, activas, porVencer, vencidas }
})

const getBadgeClass = (estado) => {
  if (estado === 'Activa') return 'bg-success'
  if (estado === 'Por vencer') return 'bg-warning text-dark'
  if (estado === 'Vencida') return 'bg-danger'
  return 'bg-secondary'
}

const getProgressBarClass = (estado) => {
  if (estado === 'Activa') return 'bg-success'
  if (estado === 'Por vencer') return 'bg-warning'
  if (estado === 'Vencida') return 'bg-danger'
  return 'bg-secondary'
}

const limpiarFiltros = () => {
  filtroTexto.value = ''
  filtroEstado.value = ''
}
</script>

<style scoped>
.estado-membresia-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9f5ff 40%, #f8f9fa 100%);
  min-height: calc(100vh - 80px);
}

.shadow-soft {
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  border-radius: 0.75rem;
}

.membership-progress {
  height: 8px;
  border-radius: 999px;
  background-color: #e9ecef;
}

.membership-progress .progress-bar {
  border-radius: 999px;
}
</style>
