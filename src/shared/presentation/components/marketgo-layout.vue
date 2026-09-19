<template>
  <div class="marketgo-layout">
    <aside class="sidebar">
      <div>
        <router-link to="/home" class="brand">
          <span class="brand-mark">
            <img src="/logo-marketgo.png" alt="MarketGo" />
          </span>
          <span>
            <strong>{{ t('app.name') }}</strong>
            <small>{{ t('app.tagline') }}</small>
          </span>
        </router-link>

        <nav class="menu" aria-label="MarketGo navigation">
          <router-link v-for="item in visibleMenuItems" :key="item.to" :to="item.to" class="menu-item">
            <i :class="item.icon"></i>
            <span>{{ t(item.labelKey) }}</span>
          </router-link>
        </nav>
      </div>

      <div class="sidebar-footer">
        <label class="role-switcher">
          <span>{{ t('common.current_role') }}</span>
          <select :value="iamStore.currentUser?.id" @change="iamStore.switchDemoUser($event.target.value)">
            <option v-for="user in iamStore.users" :key="user.id" :value="user.id">
              {{ user.roles[0] }}
            </option>
          </select>
        </label>
        <button type="button" class="logout-button">
          <i class="pi pi-sign-out"></i>
          <span>{{ t('option.logout') }}</span>
        </button>
        <button type="button" class="profile-button" @click="router.push('/settings')">
          <span class="avatar">{{ userInitials }}</span>
          <span>
            <strong>{{ iamStore.userName }}</strong>
            <small>{{ iamStore.userRole }}</small>
          </span>
          <i class="pi pi-ellipsis-v"></i>
        </button>
      </div>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <div>
          <h1>{{ pageTitle }}</h1>
          <p>{{ todayDate }}</p>
        </div>

        <div class="topbar-actions">
          <div class="search-box">
            <i class="pi pi-search"></i>
            <input v-model="searchQuery" :placeholder="t('common.search_placeholder')" type="search" />
          </div>
          <button type="button" class="icon-button" aria-label="Notifications">
            <i class="pi pi-bell"></i>
            <span class="notification-dot"></span>
          </button>
          <language-switcher />
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './language-switcher.vue';
import { useIamStore } from '../../../iam/application/iam.store.js';

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const iamStore = useIamStore();
const searchQuery = ref('');

provide('marketgoSearchQuery', searchQuery);

watch(() => route.fullPath, () => {
  searchQuery.value = '';
});

const menuItems = [
  { to: '/home', icon: 'pi pi-microsoft', labelKey: 'option.dashboard', roles: ['admin', 'supplier'] },
  { to: '/inventory', icon: 'pi pi-box', labelKey: 'option.inventory', roles: ['admin'] },
  { to: '/products', icon: 'pi pi-shopping-bag', labelKey: 'option.products', roles: ['admin', 'supplier'] },
  { to: '/requisition', icon: 'pi pi-list-check', labelKey: 'option.requisition', roles: ['admin', 'supplier'] },
  { to: '/procurements', icon: 'pi pi-truck', labelKey: 'option.procurements', roles: ['admin', 'supplier'] },
  { to: '/suppliers', icon: 'pi pi-users', labelKey: 'option.suppliers', roles: ['admin', 'supplier'] },
  { to: '/conservation', icon: 'pi pi-cloud', labelKey: 'option.conservation', roles: ['admin'] },
  { to: '/analytics', icon: 'pi pi-chart-bar', labelKey: 'option.analytics', roles: ['admin', 'supplier'] },
  { to: '/communication', icon: 'pi pi-comments', labelKey: 'option.communication', roles: ['admin', 'supplier'] },
  { to: '/profiles', icon: 'pi pi-id-card', labelKey: 'option.profiles', roles: ['admin', 'supplier'] },
  { to: '/iam', icon: 'pi pi-shield', labelKey: 'option.iam', roles: ['admin'] },
  { to: '/settings', icon: 'pi pi-cog', labelKey: 'option.settings', roles: ['admin', 'supplier'] },
];

const activeRoleKey = computed(() => (iamStore.isSupplier ? 'supplier' : 'admin'));

const visibleMenuItems = computed(() => (
  menuItems.filter((item) => item.roles.includes(activeRoleKey.value))
));

const alwaysAllowedPaths = ['/dashboard', '/access-denied'];

const userInitials = computed(() => iamStore.userName
  .split(' ')
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase());

const routeTitleKeys = {
  home: 'option.dashboard',
  settings: 'option.settings',
  'access-denied': 'page.accessDenied.title',
};

const pageTitle = computed(() => {
  const key = route.meta.titleKey || routeTitleKeys[route.name];
  return key ? t(key) : route.meta.title || t('option.dashboard');
});

watch([() => route.path, visibleMenuItems], () => {
  const hasVisibleRoute = visibleMenuItems.value.some((item) => route.path === item.to);
  if (!hasVisibleRoute && !alwaysAllowedPaths.includes(route.path)) {
    router.push('/access-denied');
  }
});

const todayDate = computed(() => (
  new Date().toLocaleDateString(locale.value === 'es' ? 'es-PE' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
));
</script>

<style scoped>
.marketgo-layout {
  display: flex;
  min-height: 100vh;
  background: #eff3fa;
}

.sidebar {
  align-self: stretch;
  background: #021c45;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 10px;
  padding: 18px 0;
  width: 300px;
}

.brand {
  align-items: center;
  color: #ffffff;
  display: flex;
  gap: 12px;
  padding: 10px 22px 24px;
  text-decoration: none;
}

.brand-mark {
  align-items: center;
  background: #ffffff;
  border-radius: 8px;
  display: inline-flex;
  flex: 0 0 46px;
  height: 46px;
  justify-content: center;
  overflow: hidden;
  width: 46px;
}

.brand-mark img {
  display: block;
  height: 100%;
  object-fit: contain;
  width: 100%;
}

.brand strong,
.profile-button strong {
  display: block;
  font-size: 15px;
}

.brand small,
.profile-button small {
  color: #b8c9e8;
  display: block;
  font-size: 11px;
  font-weight: 700;
  margin-top: 2px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  align-items: center;
  border-radius: 8px;
  color: #b8c9e8;
  display: flex;
  font-size: 14px;
  font-weight: 800;
  gap: 14px;
  margin: 0 14px;
  min-height: 44px;
  padding: 0 18px;
  text-decoration: none;
  transition: background 0.18s ease, color 0.18s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}

.menu-item.router-link-active {
  background: #0d8cfb;
  color: #ffffff;
}

.sidebar-footer {
  display: grid;
  gap: 12px;
  padding: 0 14px;
}

.role-switcher {
  color: #b8c9e8;
  display: grid;
  font-size: 11px;
  font-weight: 800;
  gap: 6px;
  text-transform: uppercase;
}

.role-switcher select {
  background: #ffffff;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  color: #023192;
  font: inherit;
  min-height: 40px;
  padding: 0 10px;
  text-transform: none;
}

.logout-button,
.profile-button {
  align-items: center;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  min-height: 48px;
  padding: 10px 14px;
  text-align: left;
  width: 100%;
}

.logout-button {
  background: #023192;
  color: #eff3fa;
  font-weight: 800;
}

.profile-button {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.avatar {
  align-items: center;
  background: #0d8cfb;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex: 0 0 38px;
  font-size: 13px;
  font-weight: 900;
  height: 38px;
  justify-content: center;
}

.profile-button .pi-ellipsis-v {
  margin-left: auto;
}

.workspace {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  min-height: 86px;
  padding: 24px 40px 16px;
}

.topbar h1 {
  color: #021c45;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
}

.topbar p {
  color: #526780;
  font-size: 13px;
  font-weight: 700;
  margin: 6px 0 0;
}

.topbar-actions {
  align-items: center;
  display: flex;
  gap: 14px;
}

.search-box {
  align-items: center;
  background: #ffffff;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
  display: flex;
  gap: 10px;
  height: 46px;
  padding: 0 14px;
  width: 310px;
}

.search-box input {
  border: 0;
  color: #023192;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  outline: 0;
  width: 100%;
}

.search-box .pi {
  color: #526780;
}

.icon-button {
  align-items: center;
  background: #ffffff;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  color: #475569;
  cursor: pointer;
  display: inline-flex;
  height: 46px;
  justify-content: center;
  position: relative;
  width: 46px;
}

.notification-dot {
  background: #fc6910;
  border: 2px solid #ffffff;
  border-radius: 50%;
  height: 10px;
  position: absolute;
  right: 11px;
  top: 10px;
  width: 10px;
}

.content {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 0 40px 40px;
}

@media (max-width: 1000px) {
  .marketgo-layout {
    display: block;
  }

  .sidebar {
    border-radius: 0;
    margin: 0;
    min-height: auto;
    width: 100%;
  }

  .menu {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .topbar,
  .topbar-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .topbar {
    padding: 16px;
  }

  .content {
    padding: 0 16px 16px;
  }
}
</style>
