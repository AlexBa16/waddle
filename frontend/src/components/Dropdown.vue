<template>
    <div class="relative w-full" ref="wrapperRef">
      
      <!-- Button -->
      <button
        class="w-full flex items-center justify-between
               px-4 sm:px-5 lg:px-6
               py-3 sm:py-4
               rounded-xl sm:rounded-2xl
               text-sm sm:text-base lg:text-lg
               text-white font-medium
               transition-all duration-200 shadow-lg"
        :class="isOpen
          ? 'bg-indigo-400 dark:bg-slate-800'
          : 'bg-indigo-300 hover:bg-indigo-400 dark:bg-slate-700 dark:hover:bg-slate-800'"
        @click="toggle"
      >
        <span class="truncate">{{ selectedLabel }}</span>
  
        <svg
          class="w-4 h-4 sm:w-5 sm:h-5 transition-transform"
          :class="{ 'rotate-180': isOpen }"
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9"
            stroke="currentColor"
            stroke-width="2.5"
            fill="none"
          />
        </svg>
      </button>
  
      <!-- Panel -->
      <Transition name="dropdown">
        <div
          v-if="isOpen"
          class="absolute left-0 right-0 mt-2
                 bg-indigo-400 dark:bg-slate-800
                 rounded-xl sm:rounded-2xl
                 px-3 sm:px-4 pt-4 pb-3
                 z-50 shadow-xl
                 max-h-64 overflow-y-auto"
        >
          <ul class="flex flex-col gap-1">
            <li
              v-for="option in options"
              :key="option.id"
              class="px-3 sm:px-4 py-2 sm:py-3
                     rounded-lg sm:rounded-xl
                     text-sm sm:text-base
                     text-white cursor-pointer transition"
              :class="modelValue === option.id
                ? 'bg-indigo-300 dark:bg-slate-600 font-medium'
                : 'hover:bg-white/20'"
              @click="select(option)"
            >
              {{ option.projectName }}
            </li>
          </ul>
  
          <div class="my-2 border-t border-white/30" />
  
          <button
            class="w-full flex items-center gap-2
                   px-3 sm:px-4 py-2 sm:py-3
                   rounded-lg sm:rounded-xl
                   text-sm sm:text-base
                   text-white/90 font-medium
                   hover:bg-white/20 hover:text-white transition"
            @click="onCreateClick"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.5"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.5"/>
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
    return found ? found.projectName : props.placeholder
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
