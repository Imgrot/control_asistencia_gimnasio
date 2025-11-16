<template>
    <div class="mt-4">
        <FullCalendar :options="options" />
    </div>

    <div class="modal fade" id="detalleEventoModal" tabindex="-1">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h6 class="modal-title">Detalle de asistencia</h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <p class="mb-1"><strong>Nombre:</strong> {{ modalData.nombre }}</p>

                    <template v-if="modalData.mismoDia">
                        <p class="mb-1"><strong>Día del registro:</strong> {{ modalData.fecha }}</p>
                    </template>
                    <template v-else>
                        <p class="mb-1"><strong>Fecha de entrada:</strong> {{ modalData.fechaEntrada }}</p>
                        <p class="mb-1"><strong>Fecha de salida:</strong> {{ modalData.fechaSalida }}</p>
                    </template>

                    <p class="mb-1"><strong>Hora de Entrada:</strong> {{ modalData.entrada }}</p>
                    <p class="mb-0"><strong>Hora de Salida:</strong> {{ modalData.salida }}</p>
                </div>

                <div class="modal-footer p-2">
                    <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from "@fullcalendar/core/locales/es"
import * as bootstrap from "bootstrap"

function formatearFecha(fechaStr) {
    if (!fechaStr) return null
    const [y, m, d] = fechaStr.split(" ")[0].split("-")
    return `${d}/${m}/${y}`
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

function sonMismoDia(entrada, salida) {
    if (!salida) return true
    return entrada.split(" ")[0] === salida.split(" ")[0]
}

function generarAsistenciasNoSolapadas(cantidad, nombre, apellido) {
    const asistencias = []
    const year = new Date().getFullYear()
    const ultimoFinPorDia = {}

    for (let i = 0; i < cantidad; i++) {
        const dia = Math.floor(Math.random() * 20) + 1
        const fechaBase = `${year}-11-${dia.toString().padStart(2, "0")}`

        let entradaDate

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

const modalData = ref({
    nombre: "",
    fecha: "",
    fechaEntrada: "",
    fechaSalida: "",
    entrada: "",
    salida: "",
    mismoDia: true
})

let modalInstance = null

onMounted(() => {
    const el = document.getElementById("detalleEventoModal")
    modalInstance = new bootstrap.Modal(el)
})

const eventos = generarAsistenciasNoSolapadas(
    10,
    "María",
    "Pérez Soto"
)

const options = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "timeGridWeek",
    locale: "es",
    locales: [esLocale],

    headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
    },

    dateClick(info) {
        info.view.calendar.changeView("timeGridDay", info.dateStr)
    },

    eventClick(info) {
        const { cliente, entrada, salida, salidaTexto } = info.event.extendedProps

        const mismoDia = salida ? sonMismoDia(entrada, salida) : true

        modalData.value = {
            nombre: cliente,
            fecha: mismoDia ? formatearFecha(entrada) : "",
            fechaEntrada: formatearFecha(entrada),
            fechaSalida: salida ? formatearFecha(salida) : "",
            entrada: formatearHora(entrada),
            salida: salida ? formatearHora(salida) : salidaTexto,
            mismoDia
        }

        modalInstance.show()
    },

    events: eventos
})
</script>

<style scoped>
.mt-4 {
    margin-top: 1.5rem;
}
</style>
