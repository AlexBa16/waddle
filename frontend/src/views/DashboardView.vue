<template>
  <div class="flex h-screen overflow-hidden bg-orange-50 dark:bg-slate-800">
    <Sidebar />

    <!-- Slide-over Panel -->
    <Transition name="slide-over">
      <div v-if="route.meta.modal"
           class="absolute left-72 lg:left-85 top-0 z-30 h-screen w-[480px] max-w-full
                  bg-slate-200 dark:bg-slate-700 shadow-2xl overflow-y-auto border-l border-slate-300 dark:border-slate-600">
        <RouterView />
      </div>
    </Transition>

    <!-- Main Content: immer sichtbar -->
    <main class="flex-1 overflow-y-auto bg-orange-50 dark:bg-slate-800">
      <component :is="lastPageComponent" v-bind="lastPageProps" class="pt-10 pb-10" />
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, markRaw } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()

const lastPageComponent = ref(null)
const lastPageProps = ref({})

watch(route, (newRoute) => {
  if (!newRoute.meta.modal && newRoute.matched.length > 0) {
    const matched = newRoute.matched[newRoute.matched.length - 1]
    lastPageComponent.value = markRaw(matched.components.default)
  }
}, { immediate: true })
</script>

<style scoped>
.slide-over-enter-active,
.slide-over-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-over-enter-from,
.slide-over-leave-to {
  transform: translateX(-100%);
}
</style>
