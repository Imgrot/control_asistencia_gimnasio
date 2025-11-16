<template>
    <FullCalendar :options="calendarOptions" ref="calendarRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

const props = defineProps({
    events: { type: Array, default: () => [] }
})

const calendarOptions = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: 'es',
    locales: [esLocale],

    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    events: props.events,

    dateClick(info) {
        console.log('Día clickeado:', info.dateStr)
    },

    eventClick(info) {
        console.log('Evento clickeado:', info.event.title)
    }
})

const calendarRef = ref(null)

</script>
