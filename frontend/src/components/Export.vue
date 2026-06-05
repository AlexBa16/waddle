<template>
    <div class="mt-10 text-center text-sm text-slate-500">
        <Button @click="showModal = true">{{ t('nav.reports.exportLabel') }}</Button>
        <ExportModal v-model="showModal" :is-admin="isAdmin" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import ExportModal from '@/components/ExportModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const showModal = ref(false)
</script>
