<template>
  <!-- Contenedor centrado -->
  <div class="d-flex justify-content-center mt-4">
    <!-- Ancho máximo para que no ocupe toda la pantalla -->
    <div class="w-100" style="max-width: 900px;">
      <h2 class="mb-4 text-center text-md-start">
        Registrar asistencia de clientes
      </h2>

      <!-- Buscar cliente -->
      <div class="card mb-4">
        <div class="card-body">
          <form class="row g-3" @submit.prevent="buscarCliente">
            <div class="col-md-8">
              <label class="form-label">RUT o nombre del cliente</label>
              <input v-model="busqueda" type="text" class="form-control" placeholder="Ej: 12.345.678-9 o Juan Pérez" />
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button type="submit" class="btn btn-primary w-100">
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Datos del cliente -->
      <div v-if="clienteSeleccionado" class="card mb-4">
        <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div class="mb-3 mb-md-0">
            <h5 class="card-title mb-1">{{ clienteSeleccionado.nombre }}</h5>
            <p class="mb-0">
              Plan: {{ clienteSeleccionado.plan }} ·
              Estado:
              <span :class="[
                'badge',
                clienteSeleccionado.estadoMembresia === 'Activa'
                  ? 'bg-success'
                  : 'bg-danger'
              ]">
                {{ clienteSeleccionado.estadoMembresia }}
              </span>
            </p>
          </div>

          <button class="btn btn-success" @click="registrarAsistencia"
            :disabled="clienteSeleccionado.estadoMembresia !== 'Activa'">
            Registrar asistencia de hoy
          </button>
        </div>
      </div>

      <!-- Historial de asistencias -->
      <div v-if="asistencias.length" class="card">
        <div class="card-body">
          <h5 class="card-title">Historial de asistencias del cliente</h5>
          <table class="table table-striped mb-0">
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Hora</th>
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

      <p v-else class="text-muted">
        No hay asistencias registradas para este cliente todavía.
      </p>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

// Campo de búsqueda (por el RUT o Nombre)
const busqueda = ref('')

// Cliente seleccionado (simulación x mientras)
const clienteSeleccionado = ref(null)

// Lista de asistencias del cliente (simulada)
const asistencias = ref([])

// Función que "busca" un cliente (dsps con la API)
const buscarCliente = () => {
  if (!busqueda.value) return

  // Simulacion: siempre devuelve el mismo cliente
  clienteSeleccionado.value = {
    id: 1,
    nombre: 'Juan Pérez',
    plan: 'Mensual ilimitado',
    estadoMembresia: 'Activa' // o inactiva
  }

  // Simulación de historial de asistencias
  asistencias.value = [
    { fecha: '2025-11-10', hora: '08:30' },
    { fecha: '2025-11-11', hora: '18:15' }
  ]
}

// Registra una nueva asistencia "hoy"
const registrarAsistencia = () => {
  const ahora = new Date()
  const fecha = ahora.toISOString().slice(0, 10)
  const hora = ahora.toTimeString().slice(0, 5)

  asistencias.value.unshift({ fecha, hora })
}
</script>
