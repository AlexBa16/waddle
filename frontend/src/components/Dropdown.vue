<template>
    <div class="relative w-full" ref="wrapperRef">
      
      <!-- Button -->
      <button
        class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-orange-50 transition-all duration-200 shadow-lg cursor-pointer sm:px-5 lg:px-6 sm:py-4 rounded-xl sm:rounded-2xl sm:text-base lg:text-lg"
        :class="isOpen
          ? 'bg-indigo-400 dark:bg-slate-800'
          : 'bg-indigo-300 hover:bg-indigo-400 dark:bg-slate-700 dark:hover:bg-slate-800'"
        @click="toggle"
      >
        <span class="truncate">{{ selectedLabel }}</span>
  
        <svg
          class="w-4 h-4 transition-transform sm:w-5 sm:h-5"
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
          class="absolute left-0 right-0 z-50 px-3 pt-4 pb-3 mt-2 overflow-y-auto bg-indigo-400 shadow-xl dark:bg-slate-800 rounded-xl sm:rounded-2xl sm:px-4 max-h-64"
        >
          <ul class="flex flex-col gap-1">
            <li
              v-for="option in options"
              :key="option.id"
              class="px-3 py-2 text-sm text-orange-50 transition rounded-lg cursor-pointer sm:px-4 sm:py-3 sm:rounded-xl sm:text-base"
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
            class="flex items-center w-full gap-2 px-3 py-2 text-sm font-medium transition rounded-lg cursor-pointer sm:px-4 sm:py-3 sm:rounded-xl sm:text-base text-orange-50/90 hover:bg-white/20 hover:text-orange-50"
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
