<template>
    <div class="flex flex-col justify-center items-center">
        <!-- Reports Navigation -->
        <div class="flex gap-5">
            <TabButton :isActive="activeTab === 'me'" @click="activeTab = 'me'">{{ t('nav.reports.me') }}</TabButton>
            <TabButton :isActive="activeTab === 'team'" @click="activeTab = 'team'">{{ t('nav.reports.team') }}</TabButton>
        </div>
        
        <!-- Reports Content -->
        <div class="mt-10">
            <component :is="currentTabComponent" />
        </div>
    </div>
</template>

<script setup>
import TabButton from '@/components/TabButton.vue';
import Me from '@/components/Me.vue';
import Team from '@/components/Team.vue';
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

const { t } = useI18n()
const activeTab = ref('me');

const tabComponents = {
    me: Me,
    team: Team
}

const currentTabComponent = computed(() => tabComponents[activeTab.value]);
</script>
