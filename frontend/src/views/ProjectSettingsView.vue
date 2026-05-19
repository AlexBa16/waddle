<template>
    <div class="flex flex-col items-center justify-center">
        <IconLabelInput
            :iconPath="NameIcon"
            :label="t('nav.projectSettings.changeProjectName')"
            :placeholder="t('nav.projectSettings.enterNewName')"
            v-model="form.name"
        />
        <IconLabelInput
            :iconPath="DescriptionIcon"
            :label="t('nav.projectSettings.changeProjectDescription')"
            :placeholder="t('nav.projectSettings.enterNewDescription')"
            :bigField="true"
            v-model="form.description"
        />
        <hr
            class="w-6/12 dark:border-slate-300 my-5 border-[#cbd4fe] rounded"
        />

        <!-- Mitglieder einladen -->
        <div
            class="flex w-1/2 gap-6 px-6 py-5 mt-5 mb-3 bg-[#dde3ef] dark:bg-slate-600 rounded-2xl shadow-md shadow-black/10 flex-row items-center justify-between"
        >
            <div class="flex items-center gap-3 shrink-0">
                <div
                    class="flex items-center justify-center w-5 h-5 dark:invert"
                >
                    <img
                        :src="MemberIcon"
                        alt="icon"
                        class="object-contain w-full h-full"
                    />
                </div>
                <span
                    class="text-sm font-bold tracking-wide text-slate-800 dark:text-orange-50"
                >
                    {{ t("nav.projectSettings.addMembers") }}
                </span>
            </div>

            <div class="relative w-6/12">
                <input
                    type="text"
                    v-model="searchQuery"
                    @input="onSearchInput"
                    :placeholder="t('nav.projectSettings.findMembers')"
                    class="w-full px-4 py-2 text-sm font-medium transition-colors duration-150 border border-indigo-300 outline-none rounded-xl bg-orange-50 text-slate-700 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400 placeholder-slate-400 focus:ring-1 focus:ring-indigo-400"
                />

                <!-- Suchergebnisse Dropdown -->
                <div
                    v-if="searchResults.length > 0"
                    class="absolute z-50 w-full mt-1 overflow-hidden bg-white border border-indigo-200 shadow-lg dark:bg-slate-700 dark:border-slate-500 rounded-xl"
                >
                    <div
                        v-for="user in searchResults"
                        :key="user.id"
                        @click="inviteUser(user)"
                        class="flex items-center justify-between px-4 py-2 text-sm cursor-pointer text-slate-700 dark:text-orange-50 hover:bg-indigo-50 dark:hover:bg-slate-600"
                    >
                        <span>{{ user.username }}</span>
                        <span class="text-xs text-indigo-400">{{
                            t("nav.projectSettings.invite")
                        }}</span>
                    </div>
                </div>
                <div
                    v-else-if="searchQuery.length >= 2 && !searching"
                    class="absolute z-50 w-full px-4 py-3 mt-1 text-sm bg-white border border-indigo-200 shadow-lg dark:bg-slate-700 dark:border-slate-500 rounded-xl text-slate-400 dark:text-slate-300"
                >
                    {{ t("nav.projectSettings.noUsersFound") }}
                </div>
            </div>
        </div>

        <p
            v-if="inviteMsg"
            class="mt-1 text-sm"
            :class="inviteError ? 'text-red-500' : 'text-green-500'"
        >
            {{ inviteMsg }}
        </p>

        <ManageMembers
            ref="manageMembersRef"
            :iconPath="ManageMemberIcon"
            :headerLabel="t('nav.projectSettings.manageMembers')"
            :searchPlaceholder="t('nav.projectSettings.searchMembers')"
        />
        <hr
            class="w-6/12 dark:border-slate-300 my-5 mt-10 border-[#cbd4fe] rounded"
        />

        <DeleteProject />
        

        <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-sm text-green-500">{{ successMsg }}</p>

        <div class="flex justify-end w-1/2">
            <Button :disabled="loading" @click="saveSettings" class="mt-5">
                {{
                    loading
                        ? t("nav.settings.beingSaved")
                        : t("nav.settings.saved-project")
                }}
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import DeleteProject from "@/components/DeleteProject.vue";
import IconLabelInput from "@/components/IconLabelInput.vue";
import ManageMembers from "../components/ManageMembers.vue";
import Button from "@/components/Button.vue";
import NameIcon from "@/assets/project-settings/light/name.svg";
import MemberIcon from "@/assets/project-settings/light/member.svg";
import ManageMemberIcon from "@/assets/project-settings/light/manage-members.svg";
import DescriptionIcon from "@/assets/project-settings/light/description.svg";
import { useI18n } from "vue-i18n";
import { useProjectStore } from "@/stores/project";
import { useInvitationStore } from "@/stores/invitation";

const manageMembersRef = ref(null)

const { t } = useI18n();
const projectStore = useProjectStore();
const invitationStore = useInvitationStore();

const form = ref({
    name: projectStore.selected?.projectName ?? "",
    description: projectStore.selected?.description ?? "",
});

watch(
    () => projectStore.selected,
    (project) => {
        if (project) {
            form.value.name = project.projectName;
            form.value.description = project.description ?? "";
        }
    },
    { immediate: true },
);

const loading = ref(false);
const errorMsg = ref(null);
const successMsg = ref(null);

async function saveSettings() {
    if (!projectStore.selected) return;
    errorMsg.value = null;
    successMsg.value = null;
    loading.value = true;
    const id = projectStore.selected.id;
    try {
        if (
            form.value.name &&
            form.value.name !== projectStore.selected.projectName
        ) {
            await projectStore.updateProjectName(id, form.value.name);
        }
        if (
            form.value.description !== (projectStore.selected.description ?? "")
        ) {
            await projectStore.updateProjectDescription(
                id,
                form.value.description,
            );
        }
        successMsg.value = "Einstellungen gespeichert!";
    } catch (e) {
        errorMsg.value = e.message;
    } finally {
        loading.value = false;
    }
}

// Mitglieder einladen
const searchQuery = ref("");
const searchResults = ref([]);
const inviteMsg = ref(null);
const inviteError = ref(false);
let searchTimeout = null;

const searching = ref(false)

function onSearchInput() {
    clearTimeout(searchTimeout)
    inviteMsg.value = null
    if (searchQuery.value.length < 2) {
        searchResults.value = []
        return
    }
    searchTimeout = setTimeout(async () => {
        searching.value = true
        searchResults.value = await invitationStore.searchUsers(searchQuery.value)
        searching.value = false
    }, 300)
}

async function inviteUser(user) {
    if (!projectStore.selected) return;
    searchResults.value = [];
    searchQuery.value = "";
    inviteError.value = false;
    try {
        await invitationStore.invite(projectStore.selected.id, user.id);
        inviteMsg.value = `${user.username} wurde eingeladen.`;
        manageMembersRef.value?.loadMembers()
    } catch (e) {
        inviteError.value = true;
        inviteMsg.value = e.message;
    }
}
</script>
