<template>
    <div class="relative w-screen h-screen dark:bg-black">
        <img
            :src="MountainsLight"
            alt=""
            class="absolute bottom-0 z-0 object-center w-2/3 left-1/6 dark:hidden"
        />
        <img
            :src="MountainsDark"
            alt=""
            class="absolute bottom-0 z-0 hidden object-center w-2/3 left-1/6 dark:block"
        />
        <div
            class="fixed inset-0 z-10 flex items-center justify-center bg-slate-200/66 backdrop-blur dark:bg-slate-600/66"
        >
            <div>
                <div
                    class="flex flex-row items-center justify-center gap-6 mb-10 logo-section"
                >
                    <img
                        :src="LogoLight"
                        alt="Waddle Logo"
                        class="w-12 h-auto dark:hidden"
                    />
                    <img
                        :src="LogoDark"
                        alt="Waddle Logo"
                        class="hidden w-12 h-auto dark:block"
                    />
                    <span
                        class="text-5xl font-bold pop-reg text-slate-700 dark:text-orange-50"
                        >Waddle</span
                    >
                </div>
                <form
                    class="flex flex-col gap-1 form"
                    @submit.prevent="register"
                >
                    <Input
                        v-model="form.username"
                        type="text"
                        :label="t('register.username')"
                        class="w-90"
                    />
                    <Input
                        v-model="form.email"
                        type="email"
                        :label="t('register.email')"
                        class="w-90"
                    />
                    <Input
                        v-model="form.password"
                        type="password"
                        :label="t('register.password')"
                        class="w-90"
                    />
                    <Input
                        v-model="form.passwordConfirm"
                        type="password"
                        :label="t('register.rePassword')"
                        class="w-90"
                    />

                    <div v-if="v$.$error" class="mt-1 text-sm text-red-500">
                        <p v-if="v$.username.$error">
                            Benutzername ist erforderlich.
                        </p>
                        <p v-if="v$.email.required.$invalid">
                            E-Mail ist erforderlich.
                        </p>
                        <p v-if="v$.email.email.$invalid">
                            Ungültige E-Mail-Adresse.
                        </p>
                        <p v-if="v$.password.required.$invalid">
                            Passwort ist erforderlich.
                        </p>
                        <p v-if="v$.password.minLength.$invalid">
                            Passwort muss mindestens 8 Zeichen haben.
                        </p>
                        <p v-if="v$.passwordConfirm.sameAs.$invalid">
                            Passwörter stimmen nicht überein.
                        </p>
                    </div>
                    <p v-if="generalError" class="mt-1 text-sm text-red-500">
                        {{ generalError }}
                    </p>

                    <Button :disabled="loading" class="w-full mt-2">
                        {{
                            loading
                                ? t("register.registering")
                                : t("register.register")
                        }}
                    </Button>
                </form>

                <div class="mt-4 text-center">
                    <a
                        href="/login"
                        class="text-sm underline text-slate-600 hover:text-slate-800 dark:text-orange-50 dark:hover:text-indigo-100"
                    >
                        {{ t("register.loginInfo") }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";
import { useI18n } from "vue-i18n";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";
import LogoLight from "@/assets/logo-light.svg";
import LogoDark from "@/assets/logo-dark.svg";
import MountainsLight from "@/assets/mountains-light.svg";
import MountainsDark from "@/assets/mountains-dark.svg";

const { t } = useI18n();
const router = useRouter();

const form = ref({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
});

const rules = computed(() => ({
    username: { required },
    email: { required, email },
    password: { required, minLength: minLength(8) },
    passwordConfirm: {
        required,
        sameAs: sameAs(computed(() => form.value.password)),
    },
}));

const v$ = useVuelidate(rules, form);

const generalError = ref(null);
const loading = ref(false);

async function register() {
    generalError.value = null;

    const valid = await v$.value.$validate();
    if (!valid) return;

    loading.value = true;

    try {
        const response = await fetch("https://localhost:443/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: form.value.username,
                email: form.value.email,
                password: form.value.password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            generalError.value = data.error ?? "Registrierung fehlgeschlagen.";
            return;
        }

        router.push("/login");
    } catch (e) {
        generalError.value = "Server nicht erreichbar.";
    } finally {
        loading.value = false;
    }
}
</script>
