<template>
  <section class="access-denied">
    <i class="pi pi-lock"></i>
    <h2>Acceso denegado</h2>
    <p>No tienes permisos para consultar este recurso.</p>
    <pv-button label="Volver al inicio" icon="pi pi-home" @click="$router.push('/home')" />
  </section>
</template>

<style scoped>
.access-denied {
  align-items: center;
  background: #ffffff;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
  min-height: 420px;
  text-align: center;
}

.access-denied .pi-lock {
  color: #fc6910;
  font-size: 42px;
}

.access-denied h2 {
  color: #021c45;
  font-size: 28px;
  font-weight: 950;
  margin: 0;
}

.access-denied p {
  color: #526780;
  font-weight: 700;
  margin: 0;
}
</style>
