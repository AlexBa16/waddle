<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="modelValue"
                class="fixed inset-0 z-100 flex items-center justify-center"
                @mousedown.self="cancel"
            >
                <div
                    class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                <div
                    class="relative w-full max-w-md mx-4 overflow-hidden bg-white shadow-2xl dark:bg-slate-800 rounded-3xl"
                >
                    <div
                        class="bg-[#7C86FF] px-8 py-6 flex items-center justify-between"
                    >
                        <h2
                            class="text-xl font-semibold tracking-tight text-white"
                        >
                            {{ title }}
                        </h2>
                        <button
                            class="transition-colors duration-150 cursor-pointer text-white/70 hover:text-white"
                            @click="cancel"
                        >
                            <svg
                                class="w-5 h-5 cursor-pointer"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <line
                                    x1="18"
                                    y1="6"
                                    x2="6"
                                    y2="18"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                />
                                <line
                                    x1="6"
                                    y1="6"
                                    x2="18"
                                    y2="18"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    <div class="flex flex-col gap-2 px-8 py-7">
                        <p
                            class="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300"
                        >
                            {{ message }}
                        </p>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-end gap-3 px-8 pb-7">
                        <button
                            class="cursor-pointer px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors duration-150"
                            @click="cancel"
                        >
                            {{ cancelText }}
                        </button>
                        <button
                            class="cursor-pointer px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 shadow-md bg-[#7C86FF] hover:bg-[#6c75e8] shadow-[#7C86FF]/30"
                            @click="confirm"
                        >
                            {{ confirmText }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, required: true },
    message: { type: String, required: true },
    confirmText: { type: String, default: "Bestätigen" },
    cancelText: { type: String, default: "Abbrechen" },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

function confirm() {
    emit("confirm");
    emit("update:modelValue", false);
}

function cancel() {
    emit("cancel");
    emit("update:modelValue", false);
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
    transition:
        transform 0.2s ease,
        opacity 0.2s ease;
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
</style>
