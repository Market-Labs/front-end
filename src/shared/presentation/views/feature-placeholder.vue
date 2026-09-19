<template>
  <section class="feature-placeholder">
    <div class="feature-icon">
      <i class="pi pi-sitemap"></i>
    </div>
    <div>
      <span>{{ context }}</span>
      <h2>{{ title }}</h2>
      <p>{{ $t('common.coming_soon') }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.feature-placeholder {
  align-items: center;
  background: #ffffff;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  display: flex;
  gap: 18px;
  min-height: 240px;
  padding: 28px;
}

.feature-icon {
  align-items: center;
  background: #021c45;
  border-radius: 8px;
  color: #ffffff;
  display: inline-flex;
  height: 58px;
  justify-content: center;
  width: 58px;
}

.feature-placeholder span {
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.feature-placeholder h2 {
  color: #021c45;
  font-size: 28px;
  font-weight: 950;
  margin: 6px 0;
}

.feature-placeholder p {
  color: #526780;
  font-weight: 700;
  margin: 0;
}
</style>
