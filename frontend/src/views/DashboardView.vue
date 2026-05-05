<template>
  <div class="flex h-screen overflow-hidden bg-orange-50 dark:bg-slate-800">
    <Sidebar />

    <!-- Background (last normal page stays visible) -->
    <main class="flex-1 overflow-y-auto bg-orange-50 dark:bg-slate-800 min-w-0">
      <component :is="backgroundComponent" class="pt-10 pb-10" />
    </main>

    <!-- Mobile backdrop -->
    <Transition name="fade">
      <div
        v-if="route.meta.modal"
        class="fixed inset-0 z-20 bg-black/40 lg:hidden"
        @click="$router.back()"
      />
    </Transition>

    <!-- Modal panel -->
    <Transition name="slide-over">
      <div
        v-if="route.meta.modal"
        class="
          fixed bottom-0 left-0 right-0 z-30
          h-[90vh] rounded-t-2xl
          sm:left-auto sm:right-0 sm:top-0 sm:bottom-auto sm:h-screen sm:w-[420px] sm:rounded-none
          lg:static lg:h-auto lg:w-[480px] lg:rounded-none lg:z-auto
          bg-slate-200 dark:bg-slate-700 shadow-2xl overflow-y-auto
          border-t border-slate-300 dark:border-slate-600
          sm:border-t-0 sm:border-l
        "
      >
        <RouterView />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import DashboardView from '@/views/DashboardView.vue'

const route = useRoute()
const backgroundComponent = ref(null)

watch(
  () => route.fullPath,
  () => {
    if (!route.meta.modal && route.matched.length) {
      const comp = route.matched
        .map(r => r.components.default)
        .find(c => c !== DashboardView)
      if (comp) backgroundComponent.value = markRaw(comp)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.slide-over-enter-active,
.slide-over-leave-active {
  transition: transform 0.3s ease;
}

.slide-over-enter-from,
.slide-over-leave-to {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .slide-over-enter-from,
  .slide-over-leave-to {
    transform: translateX(100%);
  }
}

@media (min-width: 1024px) {
  .slide-over-enter-from,
  .slide-over-leave-to {
    transform: translateX(100%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
