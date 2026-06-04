<template>
  <div class="relative w-full" ref="wrapperRef">
    
    <button
      type="button"
      class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-orange-50 transition-all duration-200 shadow-lg cursor-pointer sm:px-5 lg:px-6 sm:py-4 rounded-xl sm:rounded-2xl sm:text-base lg:text-lg"
      :class="isOpen
        ? 'bg-indigo-400 dark:bg-slate-800'
        : 'bg-indigo-300 hover:bg-indigo-400 dark:bg-slate-700 dark:hover:bg-slate-800'"
      @click="toggle"
    >
      <span class="truncate">{{ selectedLabel }}</span>

      <svg
        class="w-4 h-4 transition-transform sm:w-5 sm:h-5 shrink-0 ml-2"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 24 24"
      >
        <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2.5" fill="none" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 z-50 px-3 pt-3 pb-3 mt-2 overflow-hidden bg-indigo-400 shadow-xl dark:bg-slate-800 rounded-xl sm:rounded-2xl sm:px-4 max-h-72 flex flex-col"
      >
        <div v-if="searchable" class="mb-2 shrink-0">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full px-3 py-2 text-sm bg-indigo-500/30 dark:bg-slate-700 border border-white/20 rounded-lg text-orange-50 placeholder-orange-200/50 focus:outline-none focus:ring-2 focus:ring-white/40"
            @click.stop
          />
        </div>

        <ul class="flex flex-col gap-1 overflow-y-auto grow pr-1 specify-scrollbar">
          <li
            v-for="option in filteredOptions"
            :key="option[valueKey]"
            class="px-3 py-2 text-sm text-orange-50 transition rounded-lg cursor-pointer sm:px-4 sm:py-3 sm:rounded-xl sm:text-base"
            :class="modelValue === option[valueKey]
              ? 'bg-indigo-300 dark:bg-slate-600 font-medium'
              : 'hover:bg-white/20'"
            @click="select(option)"
          >
            <slot name="option" :option="option">
              {{ option[labelKey] }}
            </slot>
          </li>
          
          <li v-if="filteredOptions.length === 0" class="px-3 py-4 text-xs text-center text-orange-100/50 italic">
            Keine Ergebnisse gefunden
          </li>
        </ul>

        <div v-if="showCreateButton" class="shrink-0">
          <div class="my-2 border-t border-white/30" />
          <button
            type="button"
            class="flex items-center w-full gap-2 px-3 py-2 text-sm font-medium transition rounded-lg cursor-pointer sm:px-4 sm:py-3 sm:rounded-xl sm:text-base text-orange-50/90 hover:bg-white/20 hover:text-orange-50"
            @click="onCreateClick"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.5"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.5"/>
            </svg>
            {{ t('nav.createProject.description', 'Projekt erstellen') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: [String, Number, Object], default: null },
  // FEHLERBEHEBUNG: Fallback auf leeres Array, falls Daten undefined sind
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Auswählen...' },
  labelKey: { type: String, default: 'projectName' }, 
  valueKey: { type: String, default: 'id' },
  searchable: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: 'Suchen...' },
  showCreateButton: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'create'])

const isOpen = ref(false)
const wrapperRef = ref(null)
const searchQuery = ref('')

const safeOptions = computed(() => props.options || [])

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return safeOptions.value
  const query = searchQuery.value.toLowerCase().trim()
  return safeOptions.value.filter(option => {
    const label = String(option[props.labelKey] || '').toLowerCase()
    return label.includes(query)
  })
})

const selectedLabel = computed(() => {
  // FEHLERBEHEBUNG: Sicherer Zugriff durch safeOptions.value
  const found = safeOptions.value.find((o) => o[props.valueKey] === props.modelValue)
  return found ? found[props.labelKey] : props.placeholder
})

function toggle() { 
  isOpen.value = !isOpen.value 
  if (isOpen.value) searchQuery.value = '' 
}

function select(option) {
  emit('update:modelValue', option[props.valueKey])
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
.specify-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.specify-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
