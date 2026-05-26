<template>
    <div class="flex flex-col w-10/12 sm:w-4/5 lg:w-3/5 xl:w-1/2 gap-4 px-6 sm:px-10 py-7 mt-4 mb-2
           bg-[#dde3ef] dark:bg-slate-600
           rounded-2xl shadow-md shadow-black/10 border border-indigo-100 dark:border-slate-500">
        <div class="flex items-center gap-4">
            <img :src="AddIconLight" alt="" class="block w-5 h-5 shrink-0 dark:hidden">
            <img :src="AddIconDark" alt="" class="hidden w-5 h-5 shrink-0 dark:block">
            <label for="description" class="font-bold dark:text-orange-50">{{ t('nav.add.label') }}</label>
        </div>
        <div>
            <textarea :placeholder="t('nav.add.placeholder')" v-model="description" rows="4"
                class="w-full px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none resize-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 dark:bg-slate-500 dark:text-orange-50 dark:placeholder-orange-50 dark:border-slate-400 focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div class="flex flex-col gap-4 mt-5 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <label class="dark:text-orange-50 shrink-0">{{ t('nav.add.timeframe') }}</label>
                <div class="flex items-center w-full gap-2 sm:w-auto">
                    <input type="time" v-model="startTime" @change="onStartChange"
                        class="flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none sm:flex-none rounded-xl bg-orange-50 text-slate-700 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400 focus:ring-2 focus:ring-indigo-400" />
                    <span class="dark:text-orange-50 shrink-0">-</span>
                    <input type="time" v-model="endTime" :min="startTime" @change="touched = true"
                        class="flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none sm:flex-none rounded-xl bg-orange-50 text-slate-700 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400 focus:ring-2 focus:ring-indigo-400"
                        :class="{ 'border-red-400 dark:border-red-400 focus:ring-red-400': touched && timeError }" />
                </div>
            </div>
            <Button class="w-full lg:w-auto lg:shrink-0" @click="save" :disabled="saving || (touched && !!timeError)">
                <span class="dark:text-orange-50">{{ saving ? '...' : t('nav.add.label') }}</span>
            </Button>
        </div>
        <p v-if="touched && timeError" class="text-sm text-red-500 dark:text-red-400">{{ timeError }}</p>
        <p v-else-if="timeEntryStore.error" class="text-sm text-red-500 dark:text-red-400">{{ timeEntryStore.error }}</p>
    </div>
</template>

<script setup>
import AddIconLight from '@/assets/plus-light.svg'
import AddIconDark from '@/assets/plus-dark.svg'
import Button from '@/components/Button.vue'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useTimeEntryStore } from '@/stores/timeEntry'
import { useProjectStore } from '@/stores/project'

const { t } = useI18n()

const emit = defineEmits(['addEntry'])

const timeEntryStore = useTimeEntryStore()
const projectStore = useProjectStore()

const description = ref('')

const now = new Date()
const pad = n => String(n).padStart(2, '0')
const startTime = ref(`${pad(now.getHours())}:${pad(now.getMinutes())}`)
const endTime = ref(`${pad(now.getHours())}:${pad(now.getMinutes())}`)
const saving = ref(false)
const touched = ref(false)

function onStartChange() {
    touched.value = true
    if (endTime.value < startTime.value) {
        endTime.value = startTime.value
    }
}

const timeError = computed(() => {
    if (endTime.value < startTime.value) return 'End time cannot be before start time'
    if (endTime.value === startTime.value) return 'Start and end time cannot be the same'
    return null
})

function localTimeToISO(hhmm) {
    const [hours, minutes] = hhmm.split(':').map(Number)
    const d = new Date()
    d.setHours(hours, minutes, 0, 0)
    return d.toISOString()
}

async function save() {
    touched.value = true
    if (timeError.value) return

    const startISO = localTimeToISO(startTime.value)
    const endISO = localTimeToISO(endTime.value)

    saving.value = true
    const entry = await timeEntryStore.save(
        projectStore.selectedId,
        description.value,
        startISO,
        endISO,
    )
    saving.value = false

    if (entry) {
        emit('addEntry', entry)
        description.value = ''
        touched.value = false
        const after = new Date()
        startTime.value = `${pad(after.getHours())}:${pad(after.getMinutes())}`
        endTime.value = `${pad(after.getHours())}:${pad(after.getMinutes())}`
    }
}
</script>