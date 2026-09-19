<template>
  <section class="settings-view">
    <div class="settings-header">
      <div>
        <span>Configuracion</span>
        <h2>Preferencias de MarketGo</h2>
        <p>Administra idioma, tema visual, notificaciones y sesion de trabajo.</p>
      </div>
      <pv-button label="Guardar cambios" icon="pi pi-save" @click="saveSettings()" />
    </div>

    <div class="settings-grid">
      <article>
        <i class="pi pi-language"></i>
        <div>
          <strong>Idioma principal</strong>
          <p>ES - Espanol</p>
        </div>
      </article>
      <article>
        <i class="pi pi-moon"></i>
        <div>
          <strong>Tema visual</strong>
          <p>Claro operativo</p>
        </div>
      </article>
      <article>
        <i class="pi pi-bell"></i>
        <div>
          <strong>Notificaciones</strong>
          <p>Alertas de vencimiento y conservacion activas</p>
        </div>
      </article>
      <article>
        <i class="pi pi-shield"></i>
        <div>
          <strong>Sesion</strong>
          <p>Token local de demostracion protegido por IAM</p>
        </div>
      </article>
    </div>

    <p v-if="savedMessage" class="saved-message">{{ savedMessage }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const savedMessage = ref('');

const saveSettings = () => {
  savedMessage.value = 'Cambios de configuracion guardados localmente.';
};
</script>

<style scoped>
.settings-view {
  display: grid;
  gap: 18px;
}

.settings-header,
.settings-grid article,
.saved-message {
  background: #ffffff;
  border: 1px solid #e8ede9;
  border-radius: 8px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
}

.settings-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px;
}

.settings-header span {
  color: #3d9f7d;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.settings-header h2 {
  color: #16251d;
  font-size: 26px;
  font-weight: 950;
  margin: 6px 0;
}

.settings-header p,
.settings-grid p {
  color: #66756b;
  font-weight: 700;
  margin: 0;
}

.settings-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.settings-grid article {
  align-items: center;
  display: flex;
  gap: 16px;
  padding: 22px;
}

.settings-grid i {
  align-items: center;
  background: #10261c;
  border-radius: 8px;
  color: #ffffff;
  display: inline-flex;
  height: 44px;
  justify-content: center;
  width: 44px;
}

.settings-grid strong {
  color: #16251d;
  display: block;
  font-weight: 950;
  margin-bottom: 4px;
}

.saved-message {
  color: #247b5d;
  font-weight: 900;
  padding: 16px 20px;
}
</style>
