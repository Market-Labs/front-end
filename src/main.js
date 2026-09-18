import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router.js'
import pinia from './pinia.js'
import i18n from './i18n.js'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Drawer from 'primevue/drawer'
import InputText from 'primevue/inputtext'
import Menu from 'primevue/menu'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import Toolbar from 'primevue/toolbar'
import Tooltip from 'primevue/tooltip'

createApp(App)
  .use(i18n)
  .use(PrimeVue, {
    theme: {
      preset: Material,
      options: {
        darkModeSelector: '.app-dark-mode',
      },
    },
    ripple: true,
  })
  .use(ToastService)
  .use(ConfirmationService)
  .use(DialogService)
  .use(pinia)
  .use(router)
  .component('pv-button', Button)
  .component('pv-card', Card)
  .component('pv-chart', Chart)
  .component('pv-column', Column)
  .component('pv-confirm-dialog', ConfirmDialog)
  .component('pv-data-table', DataTable)
  .component('pv-dialog', Dialog)
  .component('pv-drawer', Drawer)
  .component('pv-input-text', InputText)
  .component('pv-menu', Menu)
  .component('pv-select', Select)
  .component('pv-tag', Tag)
  .component('pv-toast', Toast)
  .component('pv-toolbar', Toolbar)
  .directive('tooltip', Tooltip)
  .mount('#app')
