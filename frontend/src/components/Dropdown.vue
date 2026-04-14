<template>
    <div class="relative w-full" ref="wrapperRef">
      <!-- Trigger Button -->
      <button
        class="cursor-pointer w-full flex items-center justify-between px-6 py-4 rounded-2xl text-white font-medium text-lg transition-all duration-200 shadow-lg"
        :class="isOpen ? 'bg-indigo-400 dark:bg-slate-800' : 'bg-indigo-300 hover:bg-indigo-400 dark:bg-slate-700 dark:hover:bg-slate-800'"
        @click="toggle"
      >
        <span>{{ selectedLabel }}</span>
        <svg
          class="w-5 h-5 transition-transform duration-250"
          :class="{ 'rotate-180': isOpen }"
          viewBox="0 0 24 24"
          fill="none"
        >
          <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
  
      <!-- Dropdown Panel -->
      <Transition name="dropdown">
        <div
          v-if="isOpen"
          class="absolute top-[calc(100%+8px)] left-0 right-0 bg-indigo-400 dark:bg-slate-800 rounded-2xl px-4 pt-5 pb-4 z-50 shadow-xl"
        >
          <ul class="flex flex-col gap-1 list-none m-0 p-0">
            <li
              v-for="option in options"
              :key="option.id"
              class="px-4 py-3 rounded-xl text-white cursor-pointer transition-colors duration-150"
              :class="modelValue === option.id ? 'bg-indigo-300 dark:bg-slate-600 font-medium' : 'hover:bg-white/20'"
              @click="select(option)"
            >
              {{ option.name }}
            </li>
          </ul>
  
          <div class="my-3 border-t border-white/30" />
  
          <button
            class="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-white/90 font-medium cursor-pointer transition-colors duration-150 hover:bg-white/20 hover:text-white"
            @click="onCreateClick"
          >
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            </svg>
            Projekt erstellen
          </button>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  
  const props = defineProps({
    modelValue: { type: [String, Number], default: null },
    options: { type: Array, required: true },
    placeholder: { type: String, default: 'Projekt wählen' },
  })
  
  const emit = defineEmits(['update:modelValue', 'create'])
  
  const isOpen = ref(false)
  const wrapperRef = ref(null)
  
  const selectedLabel = computed(() => {
    const found = props.options.find((o) => o.id === props.modelValue)
    return found ? found.name : props.placeholder
  })
  
  function toggle() { isOpen.value = !isOpen.value }
  
  function select(option) {
    emit('update:modelValue', option.id)
    isOpen.value = false
  }
  
  function onCreateClick() {
    isOpen.value = false
    emit('create')
  }
  
  function handleOutsideClick(e) {
    if (wrapperRef.value && !wrapperRef.value.contains(e.target)) isOpen.value = false
  }
  
  onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
  onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick))
  </script>
  
  <style scoped>
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
    transform-origin: top;
  }
  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: scaleY(0);
  }
  </style>
