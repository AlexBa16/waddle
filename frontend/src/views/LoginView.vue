<template>
    <div class="absolute inset-0 overflow-hidden bg-orange-50 dark:bg-slate-950">
        <div class="relative w-screen h-screen">

            <img :src="MountainsBigLight" alt=""
                class="absolute bottom-0 left-[40%] w-[50vw] object-contain z-0 dark:hidden" />
            <img :src="MountainsSmallLight" alt=""
                class="absolute bottom-0 left-[20%] w-[32vw] object-contain z-20 small-z-back dark:hidden pointer-events-none" />
            <img :src="MountainsBigDark" alt=""
                class="absolute bottom-0 left-[40%] w-[50vw] object-contain z-0 hidden dark:block" />
            <img :src="MountainsSmallDark" alt=""
                class="absolute bottom-0 left-[20%] w-[32vw] object-contain z-20 small-z-back hidden dark:block pointer-events-none" />

            <div class="fixed inset-0 z-10 flex items-center justify-center px-4">
                <div class="w-full max-w-md p-8 shadow-lg bg-slate-200/75 rounded-2xl md:p-10 backdrop-blur dark:bg-slate-600/75">

                    <div class="flex items-center justify-center gap-6 mb-10">
                        <img :src="LogoLight" alt="Waddle Logo" class="w-12 h-auto dark:hidden" />
                        <img :src="LogoDark" alt="Waddle Logo" class="hidden w-12 h-auto dark:block" />
                        <span class="text-4xl font-bold md:text-5xl pop-reg text-slate-700 dark:text-orange-50">Waddle</span>
                    </div>

                    <form class="flex flex-col w-full gap-3" @submit.prevent="login">
                        <Input v-model="form.username" type="text" :label="t('register.username')" class="w-full" />
                        <Input v-model="form.password" type="password" :label="t('register.password')" class="w-full" />

                        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

                        <Button :disabled="loading" class="w-full">
                            {{ loading ? t('login.logging-in') : t('login.login') }}
                        </Button>
                    </form>

                    <div class="mt-4 text-center">
                        <a href="/register" class="text-sm underline text-slate-600 hover:text-slate-800 dark:text-orange-50 dark:hover:text-blue-100">
                            {{t('login.registerInfo')}}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Toast ref="toast" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import LogoLight from '@/assets/logo-light.svg'
import LogoDark from '@/assets/logo-dark.svg'
import MountainsSmallLight from '@/assets/mountain-small-light.svg'
import MountainsBigLight from '@/assets/mountain-big-light.svg'
import MountainsSmallDark from '@/assets/mountain-small-dark.svg'
import MountainsBigDark from '@/assets/mountain-big-dark.svg'
import Toast from '@/components/Toast.vue'


const {t} = useI18n();

const form = ref({
    username: '',
    password: '',
})

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const toast = useToast()

const error = ref(null)
const loading = ref(false)

onMounted(() => {
  if (route.query.msg === 'saved') {
    toast.success('Erfolgreich gespeichert, bitte einloggen um Änderungen zu sehen')
  }
})

async function login() {
    error.value = null
    loading.value = true

    try {
        const response = await fetch('https://localhost/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: form.value.username,
                password: form.value.password,
            }),
        })

        if (!response.ok) {
            error.value = 'Benutzername oder Passwort falsch.'
            return
        }

        const data = await response.json()
        auth.setToken(data.token)
        auth.setUsername(form.value.username) 
        router.push('/dashboard')

    } catch (e) {
        error.value = 'Server nicht erreichbar.'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
@media (max-height: 895px) {
    .small-z-back {
        z-index: 0 !important;
    }
}
</style>
