<template>
    <div class="relative min-h-screen w-full overflow-hidden">
        <!-- Background image -->
        <img
            :src="MountainsLight"
            alt=""
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] sm:w-2/3 object-center z-0"
        />

        <!-- Overlay -->
        <div class="fixed inset-0 bg-slate-200/70 flex items-center justify-center z-10 backdrop-blur px-4">
            <div class="w-full max-w-md">
                
                <!-- Logo -->
                <div class="flex flex-row items-center gap-4 justify-center mb-8 sm:mb-10">
                    <img :src="LogoLight" alt="Waddle Logo" class="w-10 sm:w-12 h-auto" />
                    <span class="text-3xl sm:text-5xl pop-reg font-bold">Waddle</span>
                </div>

                <!-- Form -->
                <form class="flex flex-col gap-3" @submit.prevent="register">
                    <Input v-model="form.username" type="text" label="Benutzername" class="w-full" />
                    <Input v-model="form.email" type="email" label="E-Mail" class="w-full" />
                    <Input v-model="form.password" type="password" label="Passwort" class="w-full" />
                    <Input v-model="form.passwordConfirm" type="password" label="Passwort bestätigen" class="w-full" />

                    <!-- Errors -->
                    <div v-if="errors" class="text-red-500 text-sm mt-1">
                        <p v-for="(msg, field) in errors" :key="field">{{ msg }}</p>
                    </div>
                    <p v-if="generalError" class="text-red-500 text-sm mt-1">{{ generalError }}</p>

                    <Button :disabled="loading" class="mt-2 w-full">
                        {{ loading ? 'Wird registriert...' : 'Registrieren' }}
                    </Button>
                </form>

                <!-- Login link -->
                <div class="text-center mt-4">
                    <a href="/login" class="text-sm underline text-slate-600 hover:text-slate-800">
                        Bereits ein Konto? Hier anmelden
                    </a>
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
import MountainsLight from '@/assets/mountains-light.svg';

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
                email:    form.value.email,
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