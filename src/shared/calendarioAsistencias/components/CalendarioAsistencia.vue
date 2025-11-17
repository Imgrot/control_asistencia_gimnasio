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

const props = defineProps(['eventos']);

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

    events: props.eventos
})
</script>

<style scoped>
.mt-4 {
    margin-top: 1.5rem;
}
</style>
