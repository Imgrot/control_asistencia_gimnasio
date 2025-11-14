<template>
    <div class="container py-4">

        <div class="text-center mb-4">
            <h2 class="fw-bold">Bienvenido al Sistema de Control de Asistencia</h2>
            <p class="text-muted">Selecciona una opción para comenzar</p>
        </div>

        <div class="row g-4 justify-content-center">

            <div class="col-12 col-md-5 col-xl-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h4 class="card-title">Clientes</h4>
                        <p class="card-text text-muted">
                            Registra y administra las asistencias de los socios del gimnasio.
                        </p>
                        <RouterLink to="/clientes/registrar-asistencia" class="btn btn-primary w-100 mt-2">
                            Registrar asistencia
                        </RouterLink>
                        <RouterLink to="/clientes/registro-asistencias" class="btn btn-outline-primary w-100 mt-2">
                            Ver asistencias
                        </RouterLink>
                        <RouterLink to="/clientes/estado-membresia" class="btn btn-outline-secondary w-100 mt-2">
                            Estado de membresía
                        </RouterLink>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-5 col-xl-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h4 class="card-title">Funcionarios</h4>
                        <p class="card-text text-muted">
                            Control de asistencia del personal interno del gimnasio.
                        </p>
                        <RouterLink to="/funcionarios/registrar-asistencia" class="btn btn-primary w-100 mt-2">
                            Registrar asistencia
                        </RouterLink>
                        <RouterLink to="/funcionarios/registro-asistencias" class="btn btn-outline-primary w-100 mt-2">
                            Ver asistencias
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.card {
    border-radius: 10px;
}
.card-title {
    font-weight: 600;
}
</style>
