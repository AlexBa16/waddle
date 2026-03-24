<template>
    <div class="relative w-screen h-screen dark:bg-black">
        <img :src="MountainsLight" alt="" class="absolute bottom-0 left-1/6 w-2/3 object-center z-0 dark:hidden" />
        <img :src="MountainsDark" alt="" class="absolute bottom-0 left-1/6 w-2/3 object-center z-0 hidden dark:block" />
        <div
            class="fixed inset-0 bg-slate-200/66 flex items-center justify-center z-10 backdrop-blur dark:bg-slate-600/66">
            <div>
                <div class="logo-section flex flex-row items-center gap-6 justify-center mb-10">
                    <img :src="LogoLight" alt="Waddle Logo" class="w-12 h-auto dark:hidden" />
                    <img :src="LogoDark" alt="Waddle Logo" class="w-12 h-auto hidden dark:block" />
                    <span class="text-5xl pop-reg font-bold text-slate-700 dark:text-orange-50">Waddle</span>
                </div>
                <form class="form flex flex-col gap-1" @submit.prevent="register">
                    <Input v-model="form.username" type="text" label="Benutzername" class="w-90" />
                    <Input v-model="form.email" type="email" label="E-Mail" class="w-90" />
                    <Input v-model="form.password" type="password" label="Passwort" class="w-90" />
                    <Input v-model="form.passwordConfirm" type="password" label="Passwort bestätigen" class="w-90" />
                </form>

                <div class="text-center mt-4">
                    <a href="/login"
                        class="text-sm underline text-slate-600 hover:text-slate-800 dark:text-orange-50 dark:hover:text-indigo-100">Bereits
                        ein Konto? Hier anmelden</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Input from '@/components/Input.vue';
import Button from '@/components/Button.vue';
import LogoLight from '@/assets/logo-light.svg';
import LogoDark from '@/assets/logo-dark.svg';
import MountainsLight from '@/assets/mountains-light.svg';
import MountainsDark from '@/assets/mountains-dark.svg';

const router = useRouter();

const form = ref({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
});

const errors = ref(null);
const generalError = ref(null);
const loading = ref(false);

async function register() {
    errors.value = null;
    generalError.value = null;

    // Passwörter prüfen bevor Request
    if (form.value.password !== form.value.passwordConfirm) {
        errors.value = { passwordConfirm: 'Passwörter stimmen nicht überein.' };
        return;
    }

    loading.value = true;

    try {
        const response = await fetch('https://localhost:443/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: form.value.username,
                email: form.value.email,
                password: form.value.password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Validierungsfehler vom Backend (422)
            errors.value = data.errors ?? null;
            generalError.value = data.error ?? null;
            return;
        }

        // Erfolgreich → zum Login weiterleiten
        router.push('/login');

    } catch (e) {
        generalError.value = 'Server nicht erreichbar.';
    } finally {
        loading.value = false;
    }
}
</script>