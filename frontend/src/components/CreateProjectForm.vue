<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="modelValue" class="fixed inset-0 z-100 flex items-center justify-center"
                @mousedown.self="$emit('update:modelValue', false)">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

                <!-- Panel -->
                <div
                    class="relative w-full max-w-md mx-4 overflow-hidden bg-white shadow-2xl dark:bg-slate-800 rounded-3xl">

                    <!-- Header bar -->
                    <div class="bg-[#7C86FF] px-8 py-6 flex items-center justify-between">
                        <h2 class="text-xl font-semibold tracking-tight text-white">{{ t('nav.createProject.title') }}
                        </h2>
                        <button class="transition-colors duration-150 cursor-pointer text-white/70 hover:text-white"
                            @click="$emit('update:modelValue', false)">
                            <svg class="w-5 h-5 cursor-pointer" viewBox="0 0 24 24" fill="none">
                                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.5"
                                    stroke-linecap="round" />
                                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.5"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="flex flex-col gap-6 px-8 py-7">

                        <!-- Name -->
                        <div class="flex flex-col gap-2">
                            <label
                                class="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                                Name
                            </label>
                            <input ref="nameInputRef" v-model="form.name" type="text"
                                :placeholder="t('nav.createProject.placeholder-name')"
                                class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 text-sm font-medium outline-none focus:border-[#7C86FF] transition-colors duration-150" />
                        </div>

                        <!-- Description -->
                        <div class="flex flex-col gap-2">
                            <label
                                class="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                                {{ t('nav.createProject.label-description') }}
                            </label>
                            <textarea v-model="form.description"
                                :placeholder="t('nav.createProject.placeholder-description')" rows="3"
                                class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 text-sm font-medium outline-none focus:border-[#7C86FF] transition-colors duration-150 resize-none" />
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-end gap-3 px-8 pb-7">
                        <button
                            class="cursor-pointer px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors duration-150"
                            @click="$emit('update:modelValue', false)">
                            {{ t('nav.createProject.label-description') }}
                        </button>
                        <button
                            class="cursor-pointer px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 shadow-md"
                            :class="canSubmit ? 'bg-[#7C86FF] hover:bg-[#6c75e8] shadow-[#7C86FF]/30' : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'"
                            :disabled="!canSubmit" @click="submit">
                            {{ t('nav.createProject.createButton')  }}
                        </button>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'create'])

const nameInputRef = ref(null)

const defaultForm = () => ({
    name: '',
    description: '',
    useIdentifier: false,
    identifier: '',
})

const form = ref(defaultForm())

const canSubmit = computed(() => form.value.name.trim().length > 0)

// Auto-focus name input when modal opens; reset form when it closes
watch(
    () => props.modelValue,
    (val) => {
        if (val) {
            nextTick(() => nameInputRef.value?.focus())
        } else {
            form.value = defaultForm()
        }
    }
)

function submit() {
    if (!canSubmit.value) return
    emit('create', {
        name: form.value.name.trim(),
        description: form.value.description.trim(),
        useIdentifier: form.value.useIdentifier,
        identifier: form.value.useIdentifier ? form.value.identifier.trim() : null,
    })
    emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .relative {
    transform: translateY(12px) scale(0.98);
    opacity: 0;
}

.modal-leave-to .relative {
    transform: translateY(6px) scale(0.99);
    opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease, max-height 0.2s ease;
    max-height: 100px;
    overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-6px);
    max-height: 0;
}
</style>
