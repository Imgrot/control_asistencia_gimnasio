<template>
    <div class="d-flex justify-content-center mt-4">
        <div class="w-100" style="max-width: 1100px;">

            <h2 class="mb-4 text-center text-md-start">Registro de asistencias de Funcionarios</h2>

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
                                placeholder="Ej: Carlos / Díaz / Díaz Molina" />
                        </div>

                        <div class="col-md-4 d-flex align-items-end">
                            <button type="submit" class="btn btn-primary w-100">Buscar</button>
                        </div>
                    </form>
                </div>
            </div>

            <div v-if="buscado && coincidencias.length === 0 && !funcionarioSeleccionado" class="alert alert-warning">
                No se encontraron coincidencias.
            </div>

            <div v-if="coincidencias.length > 0" class="card mb-4">
                <div class="card-body">
                    <h5 class="mb-3">Coincidencias encontradas</h5>

                    <DataTable :value="coincidencias" tableStyle="min-width: 100%">
                        <Column field="rut" header="RUT" />
                        <Column field="nombres" header="Nombres" />
                        <Column field="apellidos" header="Apellidos" />
                        <Column field="cargo" header="Cargo" />

                        <Column header="">
                            <template #body="slotProps">
                                <button class="btn btn-success btn-sm" @click="seleccionarFuncionario(slotProps.data)">
                                    Seleccionar
                                </button>
                            </template>
                        </Column>
                    </DataTable>

                </div>
            </div>

            <div v-if="funcionarioSeleccionado" class="card mb-4">
                <div class="card-body">
                    <h5>{{ funcionarioSeleccionado.nombres }} {{ funcionarioSeleccionado.apellidos }}</h5>
                    <p class="mb-0 text-muted">
                        RUT: {{ funcionarioSeleccionado.rut }} · Cargo: {{ funcionarioSeleccionado.cargo }}
                    </p>
                </div>
            </div>

            <CalendarioAsistencias v-if="mostrarCalendario" :eventos="eventosCalendario" />

        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import CalendarioAsistencias from "@/shared/calendarioAsistencias/components/CalendarioAsistencia.vue"
import { alertaFallida } from "@/global/alerts/alerts"

const funcionariosBase = [
    {
        id: 1,
        rut: "11.111.111-1",
        nombres: "Carlos",
        apellidos: "Díaz Molina",
        cargo: "Entrenador",
        asistencias: [
            { fecha_entrada: "2025-11-10 08:30", fecha_salida: "2025-11-10 12:30" },
            { fecha_entrada: "2025-11-11 08:28", fecha_salida: "2025-11-11 12:35" },
            { fecha_entrada: "2025-11-12 14:00", fecha_salida: null } // Aún en el recinto
        ]
    },
    {
        id: 2,
        rut: "12.345.678-9",
        nombres: "Pedro",
        apellidos: "González Soto",
        cargo: "Recepcionista",
        asistencias: [
            { fecha_entrada: "2025-11-09 17:45", fecha_salida: "2025-11-09 18:30" }
        ]
    },
    {
        id: 3,
        rut: "9.111.222-3",
        nombres: "Ana",
        apellidos: "Martínez",
        cargo: "Kinesióloga",
        asistencias: [
            { fecha_entrada: "2025-11-10 10:00", fecha_salida: "2025-11-10 13:00" },
            { fecha_entrada: "2025-11-11 10:00", fecha_salida: "2025-11-11 12:00" }
        ]
    }
]

const busquedaPorNombre = ref(true)
const rut = ref("")
const nombreBusqueda = ref("")
const coincidencias = ref([])
const funcionarioSeleccionado = ref(null)
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
    funcionarioSeleccionado.value = null
    eventosCalendario.value = []

    if (!busquedaPorNombre.value) {
        const f = funcionariosBase.find(func => func.rut === rut.value.trim())
        if (f) seleccionarFuncionario(f)
        return
    }

    const t = nombreBusqueda.value.trim()
    if (!t) return

    const lista = funcionariosBase.filter(func => coincide(func, t))

    if (lista.length === 1 && coincideExacto(lista[0], t)) {
        seleccionarFuncionario(lista[0]);
        return
    }

    coincidencias.value = lista
}

function seleccionarFuncionario(funcionario) {
    mostrarCalendario.value = false;
    funcionarioSeleccionado.value = funcionario;
    coincidencias.value = []

    const nombreCompleto = `${funcionario.nombres} ${funcionario.apellidos}`

    const eventos = funcionario.asistencias.map((asistencia, index) => {

        const { fecha_entrada, fecha_salida } = asistencia;

        let endISO = null;
        let salidaTexto = "Actualmente en el recinto";

        if (fecha_salida) {
            endISO = fecha_salida.replace(" ", "T");
            salidaTexto = formatearHora(fecha_salida);
        } else {
            const d = new Date(fecha_entrada.replace(" ", "T"));
            d.setHours(d.getHours() + 1);
            endISO = d.toISOString().slice(0, 16);
        }

        return {
            id: `${funcionario.id}-${index}`,
            title: nombreCompleto,
            start: fecha_entrada.replace(" ", "T"),
            end: endISO,
            extendedProps: {
                cliente: nombreCompleto,
                entrada: fecha_entrada,
                salida: fecha_salida,
                salidaTexto: salidaTexto
            }
        };
    });

    eventosCalendario.value = eventos;

    if (eventos.length === 0) {
        alertaFallida("No se encontraron registros de asistencia para este funcionario.");
        mostrarCalendario.value = false;
    } else {
        mostrarCalendario.value = true;
    }
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