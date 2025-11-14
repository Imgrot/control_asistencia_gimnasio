<template>
  <div class="d-flex justify-content-center mt-4">
    <div class="w-100 contenedor-registro">

      <div class="titulo-seccion mb-4">
        <h2 class="fw-bold">Registrar asistencia de clientes</h2>
        <p class="text-muted">Busca un cliente y registra su asistencia del día</p>
      </div>

      <div class="card sombra-suave mb-4">
        <div class="card-body">
          <form class="row g-3" @submit.prevent="buscarCliente">
            <div class="col-md-8">
              <label class="form-label fw-semibold">RUT o nombre del cliente</label>
              <input v-model="busqueda" type="text" class="form-control" placeholder="Ej: 12.345.678-9 o Juan Pérez" />
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button class="btn btn-primary w-100">Buscar</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="cliente" class="card sombra-suave mb-4">
        <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div class="mb-3 mb-md-0">
            <h5 class="fw-bold mb-1">{{ cliente.nombre }}</h5>
            <p class="mb-1">
              Plan: <span class="fw-semibold">{{ cliente.plan }}</span>
            </p>
            <p class="mb-0">
              Estado:
              <span :class="[
                'badge',
                cliente.estadoMembresia === 'Activa' ? 'bg-success' : 'bg-danger'
              ]">
                {{ cliente.estadoMembresia }}
              </span>
            </p>
          </div>
          <button class="btn btn-success" @click="registrarAsistencia" :disabled="cliente.estadoMembresia !== 'Activa'">
            Registrar asistencia de hoy
          </button>
        </div>
      </div>

      <div v-if="cliente && asistencias.length" class="card sombra-suave">
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
              <tr v-for="(a, index) in asistencias" :key="index">
                <td>{{ a.fecha }}</td>
                <td>{{ a.hora }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p v-else-if="cliente" class="text-muted">
        No hay asistencias registradas para este cliente todavía.
      </p>

    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const busqueda = ref('')
const cliente = ref(null)
const asistencias = ref([])

const buscarCliente = () => {
  if (!busqueda.value.trim()) return

  cliente.value = {
    nombre: 'Juan Pérez',
    plan: 'Mensual ilimitado',
    estadoMembresia: 'Activa'
  }

  asistencias.value = [
    { fecha: '2025-11-10', hora: '08:30' },
    { fecha: '2025-11-11', hora: '18:15' }
  ]
}

const registrarAsistencia = () => {
  const n = new Date()
  const fecha = n.toISOString().slice(0, 10)
  const hora = n.toTimeString().slice(0, 5)

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
