<template>
    <div class="mt-5 w-full md:w-8/12 lg:w-6/12 bg-[#dde3ef] dark:bg-slate-600 rounded-2xl overflow-hidden shadow-md shadow-black/10">

        <!-- Header -->
        <div class="flex items-center gap-3 px-6 py-4">
            <img :src="AddIconLight" alt="" class="block w-5 h-5 shrink-0 dark:hidden">
            <img :src="AddIconDark" alt="" class="hidden w-5 h-5 shrink-0 dark:block">
            <label for="description" class="text-sm font-bold tracking-wide text-slate-800 dark:text-orange-50">
                {{ t('nav.add.label') }}
            </label>
        </div>

        <!-- Body -->
        <div class="bg-[#d4dae8] dark:bg-slate-500/40 px-6 py-4 space-y-5">
            <textarea :placeholder="t('nav.add.placeholder')" v-model="description" rows="4"
                class="w-full px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none resize-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 dark:bg-slate-500 dark:text-orange-50 dark:placeholder-orange-50 dark:border-slate-400 focus:ring-1 focus:ring-indigo-400" />

            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <label class="text-sm text-slate-700 dark:text-orange-50 shrink-0">{{ t('nav.add.timeframe') }}</label>
                    <div class="flex items-center gap-2">
                        <input type="time" v-model="startTime" @change="onStartChange"
                            class="flex-1 px-4 py-2 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none sm:flex-none rounded-xl bg-orange-50 text-slate-700 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400 focus:ring-1 focus:ring-indigo-400" />
                        <span class="text-slate-500 dark:text-orange-50 shrink-0">-</span>
                        <input type="time" v-model="endTime" :min="startTime" @change="touched = true"
                            class="flex-1 px-4 py-2 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none sm:flex-none rounded-xl bg-orange-50 text-slate-700 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400 focus:ring-1 focus:ring-indigo-400"
                            :class="{ 'border-red-400 dark:border-red-400 focus:ring-red-400': touched && timeError }" />
                    </div>
                </div>
                <Button class="w-full sm:w-auto sm:shrink-0" @click="save" :disabled="saving || (touched && !!timeError)">
                    <span class="dark:text-orange-50">{{ saving ? '...' : t('nav.add.label') }}</span>
                </Button>
            </div>

            <p v-if="touched && timeError" class="text-sm text-red-500 dark:text-red-400">{{ timeError }}</p>
            <p v-else-if="timeEntryStore.error" class="text-sm text-red-500 dark:text-red-400">{{ timeEntryStore.error }}</p>
        </div>
    </div>
    <Toast ref="toast" />
</template>

<script setup>
import AddIconLight from '@/assets/plus-light.svg'
import AddIconDark from '@/assets/plus-dark.svg'
import Button from '@/components/Button.vue'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useTimeEntryStore } from '@/stores/timeEntry'
import { useProjectStore } from '@/stores/project'
import Toast from './Toast.vue'

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

const toast = ref(null)

function onStartChange() {
    touched.value = true
    if (endTime.value < startTime.value) {
        endTime.value = startTime.value
    }
}

const timeError = computed(() => {
    if (endTime.value < startTime.value) return t('entries.errors.endBeforeStart')
    if (endTime.value === startTime.value) return t('entries.errors.sameStartTimeEndTime')
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
        toast.value.success(t('nav.add.entryAdded'))
    }
}
</script>
