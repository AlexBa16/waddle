<template>
    <div class="flex flex-col gap-4 items-center justify-center">
        <IconLabelInput :iconPath="languageIcon" label="Sprache ändern: " :select="true" v-model="form.language" />
        <IconLabelInput :iconPath="viewModeIcon" label="Hell/Dunkel: " :selectViewMode="true"
            :modelValue="selectedTheme" @update:modelValue="onThemeChange" />
        <hr class="w-6/12 dark:border-slate-300 my-5 border-[#cbd4fe] rounded" />
        <IconLabelInput :iconPath="userIcon" label="Benutzernamen ändern: " placeholder="Neuer Benutzername..."
            v-model="form.username" />
        <hr class="w-6/12 dark:border-slate-300 my-5 border-[#cbd4fe] rounded" />
        <IconLabelInput :iconPath="passwordIcon" label="Passwort ändern: " placeholder="Neues Passwort..."
            type="password" v-model="form.password" />
        <IconLabelInput :iconPath="passwordIcon" label="Passwort bestätigen: "
            placeholder="Neues Passwort bestätigen..." type="password" v-model="form.passwordConfirm" />
        <hr class="w-6/12 dark:border-slate-300 my-5 border-[#cbd4fe] rounded" />
        <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-sm text-green-500">{{ successMsg }}</p>
        <div class="flex w-1/2 justify-end">
            <Button :disabled="loading" @click="saveSettings">
                {{ loading ? 'Wird gespeichert...' : 'Speichern' }}
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import IconLabelInput from '@/components/IconLabelInput.vue'
import Button from '@/components/Button.vue'
import userIcon from '@/assets/user-settings/light/user.svg'
import languageIcon from '@/assets/user-settings/light/language.svg'
import passwordIcon from '@/assets/user-settings/light/password.svg'
import viewModeIcon from '@/assets/user-settings/light/viewModeIcon.svg'

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark', e.matches)
    }
})
import { useRouter } from 'vue-router'
const router = useRouter();

const auth = useAuthStore()

// Dark mode
const storedTheme = localStorage.getItem('theme') ?? 'system'
const selectedTheme = ref(storedTheme)

function onThemeChange(val) {
    selectedTheme.value = val

    if (val === 'dark') {
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.add('dark')
    } else if (val === 'light') {
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
    } else {
        localStorage.removeItem('theme')
        document.documentElement.classList.toggle(
            'dark',
            window.matchMedia('(prefers-color-scheme: dark)').matches
        )
    }
}

// Form
const form = ref({
    username: auth.username ?? '',
    password: '',
    passwordConfirm: '',
    language: 'German',
})

const loading = ref(false)
const errorMsg = ref(null)
const successMsg = ref(null)

async function saveSettings() {
    errorMsg.value = null
    successMsg.value = null
    loading.value = true
    try {
        if (form.value.password) {
            await auth.updatePassword(form.value.password, form.value.passwordConfirm)
        }

        if (form.value.username && form.value.username !== auth.username) {
            await auth.updateUsername(form.value.username)
        }

        // Nach jeder Änderung ausloggen → neu einloggen mit neuen Daten
        auth.logout()
        router.push('/login')

    } catch (e) {
        errorMsg.value = e.message
        loading.value = false  // nur bei Fehler, sonst logout übernimmt
    }
}
</script>
