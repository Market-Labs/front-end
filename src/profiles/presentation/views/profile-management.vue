<template>
  <section class="profiles-view">
    <div class="view-header">
      <div>
        <span>Profiles</span>
        <h2>Perfiles de minimarket y proveedor</h2>
        <p>Consulta y actualizacion de datos comerciales, contacto y cobertura.</p>
      </div>
      <pv-button label="Actualizar perfil" icon="pi pi-pencil" />
    </div>

    <div class="profiles-grid">
      <article v-for="profile in profilesStore.profiles" :key="profile.id">
        <div class="profile-type">{{ profile.type }}</div>
        <h3>{{ profile.businessName }}</h3>
        <p>{{ profile.address }}</p>
        <dl>
          <div>
            <dt>Telefono</dt>
            <dd>{{ profile.phone }}</dd>
          </div>
          <div>
            <dt>Zona</dt>
            <dd>{{ profile.displayArea }}</dd>
          </div>
          <div v-if="profile.specialty">
            <dt>Especialidad</dt>
            <dd>{{ profile.specialty }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProfilesStore } from '../../application/profiles.store.js';

const profilesStore = useProfilesStore();

onMounted(() => {
  profilesStore.fetchProfiles();
});
</script>

<style scoped>
.profiles-view {
  display: grid;
  gap: 18px;
}

.view-header,
.profiles-grid article {
  background: #ffffff;
  border: 1px solid #e8ede9;
  border-radius: 8px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
}

.view-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px;
}

.view-header span,
.profile-type {
  color: #3d9f7d;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2,
.profiles-grid h3 {
  color: #16251d;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p,
.profiles-grid p,
dd {
  color: #66756b;
  font-weight: 700;
}

.profiles-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.profiles-grid article {
  padding: 24px;
}

dl {
  display: grid;
  gap: 12px;
  margin: 20px 0 0;
}

dt {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 900;
}

dd {
  margin: 4px 0 0;
}
</style>
