<template>
    <div class="flex w-1/2 gap-6 px-6 py-5 mt-5 mb-3 bg-[#dde3ef] rounded-2xl shadow-md shadow-black/10" :class="bigField
            ? 'flex-col items-stretch'
            : 'flex-row items-center justify-between'
        ">
        <div class="flex items-center gap-3 shrink-0">
            <div class="w-5 h-5 flex items-center justify-center text-slate-700 dark:invert">
                <img :src="iconPath" alt="icon" class="w-full h-full object-contain" />
            </div>
            <span class="text-sm font-bold text-slate-800 tracking-wide">{{
                label
                }}</span>
        </div>

        <select v-if="selectViewMode" :value="modelValue" @change="emit('update:modelValue', $event.target.value)"
            class="...">
            <option value="light">Hell</option>
            <option value="dark">Dunkel</option>
        </select>

        <select v-if="select" :value="modelValue" @change="emit('update:modelValue', $event.target.value)" class="...">
            <option value="German">Deutsch</option>
            <option value="English">Englisch</option>
            
        </select>

<<<<<<< HEAD
        <input v-if="!bigField && !select && !selectViewMode" :type="type" :placeholder="placeholder"
            :value="modelValue" @input="emit('update:modelValue', $event.target.value)" class="..." />
=======
        <input v-if="!bigField && !select && !selectViewMode" type="text" :placeholder="placeholder"
            class="w-6/12 px-4 py-2 text-sm rounded-xl bg-orange-50 border border-indigo-300 text-slate-700 dark:bg-slate-500 dark:placeholder-indigo-50 dark:border-slate-400 placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-400 transition-colors duration-150 font-medium" />
>>>>>>> 91d6301 (implement darkmode correctly to settings and project settings)

        <textarea v-else-if="!select && !selectViewMode" :placeholder="placeholder" rows="3"
            class="resize-none w-6/12 px-4 py-2 text-sm rounded-xl bg-orange-50 border border-indigo-300 text-slate-700 dark:bg-slate-500 dark:placeholder-indigo-50 dark:border-slate-400 placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-400 transition-colors duration-150 font-medium" />
    </div>
</template>

<script setup>
const props = defineProps({
    iconPath: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: { type: String, default: "" },
    bigField: { type: Boolean, default: false },
    select: { type: Boolean, default: false },
    selectViewMode: { type: Boolean, default: false },
    modelValue: { type: String, default: "" }, // ← neu
    type: { type: String, default: 'text' },
});

const emit = defineEmits(["update:modelValue"]); // ← neu
</script>
