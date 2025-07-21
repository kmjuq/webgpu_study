<script setup>
import { useWebGPUStore } from '@/stores/WebGPUStore';
import { onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const routes = computed(() =>
  router.options.routes.filter(route =>
    !route.meta?.hidden === true
  )
);

const webgpuStore = useWebGPUStore();
const { initWebGPU, destroyWebGPU } = webgpuStore

onMounted(() => {
  initWebGPU();
});

onUnmounted(() => {
  destroyWebGPU();
});

</script>

<template>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink v-for="(route, index) in routes" :key="route.name" :to="route.path" :class="{
      'layout-router-link': true,
      'btn-active': router.currentRoute.value.meta.id === route.meta.id,
    }">
      {{ route.meta?.title || route.name }}
    </RouterLink>
  </nav>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
@reference "tailwindcss";

.layout-router-link {
  @apply pl-2 pr-2 mr-2;
}

.btn-active {
  @apply border-2 border-solid;
}
</style>