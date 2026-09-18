<template>
  <section class="settings-panel">
    <div>
      <span>Shared</span>
      <h2>Configuracion base</h2>
      <p>Vista reservada para preferencias globales, idioma, tema y ajustes de sesion.</p>
    </div>
    <pv-button label="Guardar cambios" icon="pi pi-save" />
  </section>
</template>

<style scoped>
.settings-panel {
  align-items: center;
  background: #ffffff;
  border: 1px solid #e8ede9;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  padding: 28px;
}

.settings-panel span {
  color: #3d9f7d;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.settings-panel h2 {
  color: #16251d;
  font-size: 24px;
  font-weight: 950;
  margin: 8px 0;
}

.settings-panel p {
  color: #66756b;
  font-weight: 700;
  margin: 0;
}
</style>
