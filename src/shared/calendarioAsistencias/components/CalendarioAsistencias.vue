<template>
    <div class="mt-4" v-if="eventosTemporal.length">
        <h3 class="fw-bold mb-1">{{ titulo }}</h3>
        <p v-if="descripcion" class="text-muted">{{ descripcion }}</p>

        <ScheduleXCalendar :calendar-app="calendarApp" class="mt-3" />
    </div>
</template>

<script setup>
import { ScheduleXCalendar } from '@schedule-x/vue'
import { traduccionesES } from '@/global/calendarFunctions/translations'
import {
    createCalendar,
    createViewDay,
    createViewWeek,
    createViewMonthGrid,
    createViewMonthAgenda,
} from '@schedule-x/calendar'

import '@schedule-x/theme-default/dist/index.css'
import { Temporal } from 'temporal-polyfill'
globalThis.Temporal = Temporal

const props = defineProps({
    events: { type: Array, default: () => [] },
    titulo: String,
    descripcion: String
})

function toPlainDT(str) {
    if (!str || typeof str !== "string") {
        console.error("❌ fecha inválida:", str)
        return null
    }

    if (!str.includes(" ")) str = str + " 00:00"

    const [fecha, hora] = str.split(" ")
    const [Y, M, D] = fecha.split("-").map(Number)

    let h = 0, m = 0
    if (hora) {
        const [hh, mm] = hora.split(":")
        h = Number(hh)
        m = Number(mm)
    }

    try {
        return Temporal.PlainDateTime.from({
            year: Y,
            month: M,
            day: D,
            hour: h,
            minute: m,
            second: 0,
        })
    } catch (e) {
        console.error("❌ ERROR al convertir fecha:", str, e)
        return null
    }
}

function normalizeEvent(ev) {
    if (!ev) return null

    const entrada = ev.start ?? ev.fecha_entrada
    let salida = ev.end ?? ev.fecha_salida

    if (!entrada) {
        console.error("❌ Evento sin entrada:", ev)
        return null
    }

    if (!salida) {
        const d = new Date(entrada.replace(" ", "T"))
        d.setHours(d.getHours() + 1)
        salida = d.toISOString().slice(0, 16).replace("T", " ")
    }

    const s = toPlainDT(entrada)
    const e = toPlainDT(salida)

    if (!s || !e) {
        console.error("❌ Evento con fechas inválidas:", ev)
        return null
    }

    return {
        id: ev.id ?? Math.random(),
        title: ev.title ?? ev.nombre ?? "Evento",
        start: s,
        end: e
    }
}

const eventosTemporal = props.events
    .map(normalizeEvent)
    .filter(x => x !== null)

let selectedDate = new Date().toISOString().slice(0, 10)
if (props.events.length > 0) {
    const raw = props.events[0].start ?? props.events[0].fecha_entrada
    if (raw && raw.length >= 10) {
        selectedDate = raw.slice(0, 10)
    }
}

const calendarApp = createCalendar({
    selectedDate,
    locale: 'es-ES',
    translations: traduccionesES,
    views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
    ],
    events: eventosTemporal
})
</script>
