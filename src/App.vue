<template>
  <router-view v-if="$route.meta.public" />
  <marketgo-layout v-else />
</template>

<script setup>
import MarketgoLayout from './shared/presentation/components/marketgo-layout.vue';
</script>
