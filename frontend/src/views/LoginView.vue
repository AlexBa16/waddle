<template>
    <div class="absolute inset-0 bg-orange-50 overflow-hidden dark:bg-slate-950 dark:text-orange-50">
        <div class="relative w-screen h-screen">

            <img :src="MountainsBigLight" alt=""
                class="absolute bottom-0 left-[40%] w-[50vw] object-contain z-0 dark:hidden" />
            <img :src="MountainsSmallLight" alt=""
                class="absolute bottom-0 left-[20%] w-[32vw] object-contain z-20 small-z-back dark:hidden" />
            <img :src="MountainsBigDark" alt=""
                class="absolute bottom-0 left-[40%] w-[50vw] object-contain z-0 hidden dark:block" />
            <img :src="MountainsSmallDark" alt=""
                class="absolute bottom-0 left-[20%] w-[32vw] object-contain z-20 small-z-back hidden dark:block" />

            <div class="fixed inset-0 flex items-center justify-center z-10 px-4">
                <div class="bg-slate-200/75 rounded-2xl w-full max-w-md p-8 md:p-10 backdrop-blur shadow-lg dark:bg-slate-600/75">

                    <div class="flex items-center justify-center gap-6 mb-10">
                        <img :src="LogoLight" alt="Waddle Logo" class="w-10 md:w-12 h-auto" />
                        <span class="text-4xl md:text-5xl font-bold pop-reg">Waddle</span>
                    </div>

                    <form class="flex flex-col gap-3 w-full" @submit.prevent="login">
                        <Input v-model="form.username" type="text" label="Benutzername" class="w-full" />
                        <Input v-model="form.password" type="password" label="Passwort" class="w-full" />

                        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

                        <Button :disabled="loading" class="w-full">
                            {{ loading ? 'Wird eingeloggt...' : 'Einloggen' }}
                        </Button>
                    </form>

                    <div class="text-center mt-4">
                        <a href="/register" class="text-sm underline text-slate-600 hover:text-slate-800 dark:text-orange-50 dark:hover:text-blue-100">
                            Noch kein Konto? Hier registrieren
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import LogoLight from '@/assets/logo-light.svg'
import MountainsSmallLight from '@/assets/mountain-small-light.svg'
import MountainsBigLight from '@/assets/mountain-big-light.svg'
import MountainsSmallDark from '@/assets/mountain-small-dark.svg'
import MountainsBigDark from '@/assets/mountain-big-dark.svg'

const router = useRouter()

const form = ref({
    username: '',
    password: '',
})

const error = ref(null)
const loading = ref(false)

async function login() {
    error.value = null
    loading.value = true

    try {
        const response = await fetch('https://localhost/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // credentials: 'include',  // Session-Cookie speichern
            body: JSON.stringify({
                username: form.value.username,
                password: form.value.password,
            }),
        })

        if (!response.ok) {
            error.value = 'Benutzername oder Passwort falsch.'
            return
        }

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