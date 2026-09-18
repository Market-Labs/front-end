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
  border: 1px solid #e8ede9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
  min-height: 420px;
  text-align: center;
}

.access-denied .pi-lock {
  color: #f08a24;
  font-size: 42px;
}

.access-denied h2 {
  color: #16251d;
  font-size: 28px;
  font-weight: 950;
  margin: 0;
}

.access-denied p {
  color: #66756b;
  font-weight: 700;
  margin: 0;
}
</style>
