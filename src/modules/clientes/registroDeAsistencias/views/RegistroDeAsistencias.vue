<template>
  <div class="d-flex justify-content-center mt-4">
    <div class="w-100" style="max-width: 1100px;">

      <h2 class="mb-4 text-center text-md-start">Registro de asistencias de clientes</h2>

      <div class="card mb-4">
        <div class="card-body">
          <form class="row g-3" @submit.prevent="buscar">
            <div class="col-12 d-flex align-items-center gap-3">
              <span class="fw-semibold">Buscar por:</span>

              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="busquedaPorNombre">
                <label class="form-check-label">
                  {{ busquedaPorNombre ? "Nombre" : "RUT" }}
                </label>
              </div>
            </div>

            <div class="col-md-8" v-if="!busquedaPorNombre">
              <label class="form-label">RUT</label>
              <input v-model="rut" type="text" class="form-control" placeholder="12.345.678-9" />
            </div>

            <div class="col-md-8" v-else>
              <label class="form-label">Nombre o Apellidos</label>
              <input v-model="nombreBusqueda" type="text" class="form-control"
                placeholder="Ej: Juan / Soto / Pérez Soto" />
            </div>

            <div class="col-md-4 d-flex align-items-end">
              <button type="submit" class="btn btn-primary w-100">Buscar</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="buscado && coincidencias.length === 0 && !clienteSeleccionado" class="alert alert-warning">
        No se encontraron coincidencias.
      </div>

      <div v-if="coincidencias.length > 0" class="card mb-4">
        <div class="card-body">
          <h5 class="mb-3">Coincidencias encontradas</h5>

          <DataTable :value="coincidencias" tableStyle="min-width: 100%">
            <Column field="rut" header="RUT" />
            <Column field="nombres" header="Nombres" />
            <Column field="apellidos" header="Apellidos" />
            <Column field="tipo_membresia" header="Membresía" />

            <Column header="">
              <template #body="slotProps">
                <button class="btn btn-success btn-sm" @click="seleccionarCliente(slotProps.data)">
                  Seleccionar
                </button>
              </template>
            </Column>
          </DataTable>

        </div>
      </div>

      <div v-if="clienteSeleccionado" class="card mb-4">
        <div class="card-body">
          <h5>{{ clienteSeleccionado.nombres }} {{ clienteSeleccionado.apellidos }}</h5>
          <p class="mb-0 text-muted">
            RUT: {{ clienteSeleccionado.rut }} · Membresía: {{ clienteSeleccionado.tipo_membresia }}
          </p>
        </div>
      </div>

      <CalendarioAsistencias v-if="mostrarCalendario" :eventos="eventosCalendario" />

    </div>
  </div>
</template>

<script setup>
import { ref, toRaw } from "vue"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import CalendarioAsistencias from "@/shared/calendarioAsistencias/components/CalendarioAsistencia.vue"
import { alertaFallida } from "@/global/alerts/alerts"

const clientesBase = [
  {
    id: 1,
    rut: "12.345.678-9",
    nombres: "Juan",
    apellidos: "Pérez Sáez",
    tipo_membresia: "Mensual ilimitado",
    asistencias: [
      { fecha_entrada: "2025-11-10 08:30", fecha_salida: "2025-11-10 09:15" },
      { fecha_entrada: "2025-11-10 19:15", fecha_salida: null }
    ]
  },
  {
    id: 2,
    rut: "11.222.333-4",
    nombres: "Juan",
    apellidos: "Díaz Figueroa",
    tipo_membresia: "3 meses",
    asistencias: [
      { fecha_entrada: "2025-11-11 10:00", fecha_salida: "2025-11-11 12:00" }
    ]
  },
  {
    id: 3,
    rut: "9.111.222-3",
    nombres: "María",
    apellidos: "Pérez Soto",
    tipo_membresia: "Mensual ilimitado",
    asistencias: [
      { fecha_entrada: "2025-11-09 16:00", fecha_salida: "2025-11-09 17:00" }
    ]
  }
]

const busquedaPorNombre = ref(true)
const rut = ref("")
const nombreBusqueda = ref("")
const coincidencias = ref([])
const clienteSeleccionado = ref(null)
const buscado = ref(false)
const mostrarCalendario = ref(false);
const eventosCalendario = ref([]);

function normalizar(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

function palabras(str) {
  return normalizar(str).split(/\s+/).filter(p => p.length)
}

function coincide(cliente, termino) {
  const t = palabras(termino)
  const c = palabras(cliente.nombres + " " + cliente.apellidos)
  return t.every(p => c.includes(p))
}

function coincideExacto(cliente, termino) {
  const tParts = palabras(termino)
  const cParts = palabras(cliente.nombres + " " + cliente.apellidos)
  if (tParts.length !== cParts.length) return false
  return tParts.every(p => cParts.includes(p))
}

function buscar() {
  mostrarCalendario.value = false;
  buscado.value = true
  coincidencias.value = []
  clienteSeleccionado.value = null
  eventosCalendario.value = []
  if (!busquedaPorNombre.value) {
    const c = clientesBase.find(cli => cli.rut === rut.value.trim())
    if (c) seleccionarCliente(c)
    return
  }

  const t = nombreBusqueda.value.trim()
  if (!t) return

  const lista = clientesBase.filter(cli => coincide(cli, t))

  if (lista.length === 1 && coincideExacto(lista[0], t)) {
    eventosCalendario.value = seleccionarCliente(lista[0]);
    if (eventosCalendario.value.length == 0) {
      mostrarCalendario.value = false;
      alertaFallida("No se encontraron registros para el cliente.")
    }
    return
  }

  coincidencias.value = lista
}

async function seleccionarCliente(c) {
  mostrarCalendario.value = false;
  clienteSeleccionado.value = c;
  eventosCalendario.value = await generarAsistenciasNoSolapadas(
    10,
    c.nombres,
    c.apellidos
  )
  let eventos = JSON.parse(JSON.stringify(toRaw(eventosCalendario.value)))
  console.log(eventos);
  if (eventos.length == 0) {
    return alertaFallida("No se encontraron registros para el cliente.")
  }
  mostrarCalendario.value = true;
}


async function generarAsistenciasNoSolapadas(cantidad, nombre, apellido) {
  const asistencias = []
  const year = new Date().getFullYear()
  const ultimoFinPorDia = {}

  for (let i = 0; i < cantidad; i++) {
    const dia = Math.floor(Math.random() * 20) + 1
    const fechaBase = `${year}-11-${dia.toString().padStart(2, "0")}`

    let entradaDate;

    while (true) {
      const h = Math.floor(Math.random() * 11) + 7
      const m = Math.random() < 0.5 ? 0 : 30

      entradaDate = new Date(year, 10, dia, h, m)
      const ultimoFin = ultimoFinPorDia[fechaBase] || null

      if (!ultimoFin || entradaDate > ultimoFin) break
    }

    const entradaStr = `${fechaBase} ${entradaDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${entradaDate.getMinutes().toString().padStart(2, "0")}`

    const sinSalida = Math.random() < 0.3

    let salidaStr = null
    let endISO = null
    let salidaTexto = null

    if (!sinSalida) {
      const duracion = Math.floor(Math.random() * 9) + 1
      const salidaDate = new Date(entradaDate.getTime())
      salidaDate.setHours(salidaDate.getHours() + duracion)

      salidaStr = `${fechaBase} ${salidaDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${salidaDate.getMinutes().toString().padStart(2, "0")}`

      endISO = salidaStr.replace(" ", "T")
      salidaTexto = formatearHora(salidaStr)
      ultimoFinPorDia[fechaBase] = salidaDate
    } else {
      const salidaDate = new Date(entradaDate.getTime())
      salidaDate.setHours(salidaDate.getHours() + 1)

      endISO = `${fechaBase}T${salidaDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${salidaDate.getMinutes().toString().padStart(2, "0")}`

      salidaStr = null
      salidaTexto = "Actualmente en el recinto (Sin hora de salida)"
      ultimoFinPorDia[fechaBase] = salidaDate
    }

    asistencias.push({
      id: i + 1,
      title: `${nombre} ${apellido}`,
      start: entradaStr.replace(" ", "T"),
      end: endISO,
      extendedProps: {
        cliente: `${nombre} ${apellido}`,
        entrada: entradaStr,
        salida: salidaStr,
        salidaTexto
      }
    })
  }

  return asistencias
}
function formatearHora(fechaStr) {
  if (!fechaStr) return null
  const hora = fechaStr.split(" ")[1]
  let [h, min] = hora.split(":")

  h = Number(h)
  const suf = h >= 12 ? "PM" : "AM"
  h = h % 12
  if (h === 0) h = 12

  return `${h}:${min} ${suf}`
}
</script>

<style scoped>
.form-check-label {
  cursor: pointer;
}
</style>
