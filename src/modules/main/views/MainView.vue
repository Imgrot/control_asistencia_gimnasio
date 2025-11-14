<template>
    <div class="d-flex flex-column justify-content-between min-vh-100">
        <Header />
        <div class="flex-grow-1 d-flex">
            <div class="w-100 mt-3 px-3">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from '@/modules/main/components/Header.vue'
</script>
