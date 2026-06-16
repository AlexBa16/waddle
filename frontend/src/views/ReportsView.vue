<template>
    <div
        class="flex flex-col justify-center items-center w-full max-w-3xl mx-auto pt-6"
    >
        <div
            class="flex flex-col sm:flex-row gap-4 items-center w-full justify-between border-b border-slate-200 dark:border-slate-700 pb-4"
        >
            <div class="flex gap-2">
                <TabButton
                    :isActive="activeTab === 'me'"
                    @click="activeTab = 'me'"
                >
                    {{ t("nav.reports.me") }}
                </TabButton>
                <TabButton
                    v-if="isAdmin"
                    :isActive="activeTab === 'team'"
                    @click="
                        activeTab = 'team';
                        selectedMemberId = null;
                    "
                >
                    {{ t("nav.reports.team") }}
                </TabButton>
            </div>

            <div v-if="activeTab === 'team'" class="w-full sm:w-64">
                <Dropdown
                    v-model="selectedMemberId"
                    :options="members"
                    label-key="name"
                    value-key="id"
                    searchable
                    :search-placeholder="
                        t(
                            'nav.reports.searchMemberPlaceholder',
                            'Name eingeben...',
                        )
                    "
                    :placeholder="t('nav.reports.selectMember')"
                />
            </div>
        </div>

        <div v-if="loading" class="text-sm text-slate-500 mt-6 animate-pulse">
            Mitglieder werden geladen...
        </div>
        <div v-else-if="error" class="text-sm text-red-500 mt-6">
            {{ error }}
        </div>

        <div class="mt-10 w-full">
            <component
                :is="currentTabComponent"
                :member-id="selectedMemberId"
            />
        </div>
        <div class="mt-10 flex justify-end w-full text-sm text-slate-500">
            <Export :is-admin="isAdmin" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useProjectStore } from "@/stores/project";
import { useAuthStore } from "@/stores/auth";
import { useInvitationStore } from "@/stores/invitation";

import TabButton from "@/components/TabButton.vue";
import Me from "@/components/Me.vue";
import Team from "@/components/Team.vue";
import Dropdown from "@/components/Dropdown.vue";
import Export from "@/components/Export.vue";

const { t } = useI18n();
const projectStore = useProjectStore();
const invitationStore = useInvitationStore();
const authStore = useAuthStore();

const activeTab = ref("me");
const selectedMemberId = ref(null);
const members = ref([]);
const loading = ref(false);
const error = ref(null);
const isAdmin = ref(false);

async function loadMembers() {
    if (!projectStore.selected) {
        members.value = [];
        return;
    }

    loading.value = true;
    error.value = null;
    try {
        const data = await invitationStore.fetchMembers(
            projectStore.selected.id,
        );
        const allMembers = data || [];
        const currentUsername = authStore.getUsername();

        const me = allMembers.find((m) => m.name === currentUsername);
        isAdmin.value = me?.isAdmin ?? false;

        members.value = allMembers.filter(
            (m) => m.name !== currentUsername && !m.pending,
        );
        selectedMemberId.value = null;
    } catch (err) {
        isAdmin.value = false;
        members.value = [];
    } finally {
        loading.value = false;
    }
}

watch(
    () => projectStore.selected,
    () => {
        selectedMemberId.value = null;
        loadMembers();
    },
    { immediate: true },
);

const tabComponents = {
    me: Me,
    team: Team,
};

const currentTabComponent = computed(() => tabComponents[activeTab.value]);
</script>
