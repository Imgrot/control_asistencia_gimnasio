<template>
    <header class="bg-dark text-white py-3 position-relative z-3 w-100">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-12 col-md-6 col-xl-4 text-center text-md-start mb-2 mb-md-0">
                    <RouterLink class="text-decoration-none text-white" to="/">
                        <h1 class="h4 m-0">{{ nombreGimnasio }}</h1>
                    </RouterLink>
                </div>
                <div
                    class="col-12 col-md-6 col-xl-8 d-flex gap-4 justify-content-md-center justify-content-start ps-3 ps-md-0 flex-wrap">
                    <div class="dropdown position-relative" @mouseenter="abrirDropdown('miembros')"
                        @mouseleave="cerrarDropdown">
                        <span class="text-light dropdown-toggle" role="button">
                            Miembros
                        </span>
                        <ul v-if="dropdownActivo === 'miembros'" class="dropdown-menu show"
                            style="margin-top: 0 !important; z-index: 1050;">
                            <li>
                                <RouterLink class="dropdown-item" to="/clientes/registro-asistencias">
                                    Registro de asistencias
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" to="/clientes/registrar-asistencia">
                                    Registrar asistencia
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" to="/clientes/estado-membresia">
                                    Estado de membresía
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                    <div class="dropdown position-relative" @mouseenter="abrirDropdown('funcionarios')"
                        @mouseleave="cerrarDropdown">
                        <span class="text-light dropdown-toggle" role="button">
                            Funcionarios
                        </span>
                        <ul v-if="dropdownActivo === 'funcionarios'" class="dropdown-menu show"
                            style="margin-top: 0 !important; z-index: 1050;">
                            <li>
                                <RouterLink class="dropdown-item" to="/funcionarios/registro-asistencias">
                                    Registro de asistencias
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" to="/funcionarios/registrar-asistencia">
                                    Registrar asistencia
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div v-if="dropdownActivo" class="backdrop-dark" @mouseenter="cerrarDropdown"></div>
</template>


<script setup>
import { ref } from 'vue'

const nombreGimnasio = "Nombre del Gimnasio"

const dropdownActivo = ref(null)

function abrirDropdown(menu) {
    dropdownActivo.value = menu
}

function cerrarDropdown() {
    dropdownActivo.value = null
}
</script>


<style scoped>
.backdrop-dark {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.55);
    z-index: 2;
}

.dropdown {
    padding-bottom: 4px;
}

@media (max-width: 768px) {
    .dropdown {
        margin-left: 8px;
    }
}
</style>
