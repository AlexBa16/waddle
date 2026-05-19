<template>
    <div class="flex flex-col w-10/12 sm:w-4/5 lg:w-3/5 xl:w-1/2 gap-4 px-6 sm:px-10 py-7 mt-4 mb-2
           bg-[#dde3ef] dark:bg-slate-600
           rounded-2xl shadow-md shadow-black/10 border border-indigo-100 dark:border-slate-500">
        <div class="flex items-center gap-4">
            <img :src="AddIconLight" alt="" class="block w-5 h-5 shrink-0 dark:hidden">
            <img :src="AddIconDark" alt="" class="hidden w-5 h-5 shrink-0 dark:block">
            <label for="description" class="dark:text-orange-50">{{ t('nav.add.label') }}</label>
        </div>
        <div>
            <textarea :placeholder="t('nav.add.placeholder')" :value="modelValue"
                @input="emit('update:modelValue', $event.target.value)" rows="4"
                class="w-full px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none resize-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 dark:bg-slate-500 dark:text-orange-50 dark:placeholder-orange-50 dark:border-slate-400 focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div class="flex flex-col gap-4 mt-5 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <label class="dark:text-orange-50 shrink-0">{{ t('nav.add.timeframe') }}</label>
                <div class="flex items-center w-full gap-2 sm:w-auto">
                    <input type="time" v-model="startTime"
                        class="flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none sm:flex-none rounded-xl bg-orange-50 text-slate-700 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400 focus:ring-2 focus:ring-indigo-400" />
                    <span class="dark:text-orange-50 shrink-0">-</span>
                    <input type="time" v-model="endTime"
                        class="flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none sm:flex-none rounded-xl bg-orange-50 text-slate-700 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400 focus:ring-2 focus:ring-indigo-400" />
                </div>
            </div>
            <Button class="w-full lg:w-auto lg:shrink-0" @click="save">
                <span class="dark:text-orange-50">{{ t('nav.add.label') }}</span>
            </Button>
        </div>
    </div>
</template>

<script setup>
import AddIconLight from '@/assets/plus-light.svg'
import AddIconDark from '@/assets/plus-dark.svg'
import Button from '@/components/Button.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'addEntry'])

const startTime = ref('00:00')
const endTime = ref('00:00')

function save() {
    // TODO: implement actual save
    console.log('Saving entry:', { startTime: startTime.value, endTime: endTime.value })
}
</script>
