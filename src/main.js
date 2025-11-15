import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import localeES from '@/assets/es.json';
import "primeicons/primeicons.css";
import StyleClass from 'primevue/styleclass';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
    .use(router)
    .use(PrimeVue,
        {
            locale: localeES,
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: '.dark',
                    cssLayer: false,
                }
            }
        })
    .directive('styleclass', StyleClass)

app.mount('#app')
