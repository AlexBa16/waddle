<template>
  <div class="flex h-screen overflow-hidden bg-orange-50 dark:bg-slate-800">
    <Sidebar />

    <!-- 🔹 BACKGROUND (letzte normale Seite bleibt fix sichtbar) -->
    <main class="flex-1 overflow-y-auto bg-orange-50 dark:bg-slate-800">
      <component :is="backgroundComponent" class="pt-10 pb-10" />
    </main>

    <!-- 🔹 MODAL (Inbox etc.) -->
    <Transition name="slide-over">
      <div
        v-if="route.meta.modal"
        class="absolute left-72 lg:left-85 top-0 z-30 h-screen w-[480px] max-w-full
               bg-slate-200 dark:bg-slate-700 shadow-2xl overflow-y-auto
               border-l border-slate-300 dark:border-slate-600"
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

const route = useRoute()

const backgroundComponent = ref(null)

// 👉 speichert letzte NICHT-modal Seite
watch(
  () => route.fullPath,
  () => {
    if (!route.meta.modal && route.matched.length) {
      const comp = route.matched.at(-1).components.default
      backgroundComponent.value = markRaw(comp)
    }
  },
  { immediate: true }
)
</script>
