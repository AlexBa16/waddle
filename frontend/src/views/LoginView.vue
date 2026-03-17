<template>
    <div class="absolute inset-0 bg-orange-50 overflow-hidden">
        <div class="relative w-screen h-screen">

            <!-- Big mountain -->
            <img
                :src="MountainsBigLight"
                alt=""
                class="absolute bottom-0 left-[40%] w-[50vw] object-contain z-0"
            />

            <!-- Small mountain -->
            <img
                :src="MountainsSmallLight"
                alt=""
                class="absolute bottom-0 left-[20%] w-[32vw] object-contain z-20 small-z-back"
            />

            <!-- UI -->
            <div class="fixed inset-0 flex items-center justify-center z-10 px-4">
                <div
                    class="bg-slate-200/75 rounded-2xl
                           w-full max-w-md
                           p-8 md:p-10
                           backdrop-blur
                           shadow-lg"
                >
                    <!-- Logo -->
                    <div class="flex items-center justify-center gap-6 mb-10">
                        <img :src="LogoLight" alt="Waddle Logo" class="w-10 md:w-12 h-auto" />
                        <span class="text-4xl md:text-5xl font-bold pop-reg">Waddle</span>
                    </div>

                    <!-- Form -->
                    <form class="flex flex-col gap-3 w-full">
                        <Input type="text" label="Benutzername" class="w-full" />
                        <Input type="password" label="Passwort" class="w-full" />
                        <Button @click="goToDash" class="w-full">Einloggen</Button>
                    </form>

                    <!-- Register -->
                    <div class="text-center mt-4">
                        <a
                            href="/register"
                            class="text-sm underline text-slate-600 hover:text-slate-800"
                        >
                            Noch kein Konto? Hier registrieren
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import LogoLight from '@/assets/logo-light.svg'
import MountainsSmallLight from '@/assets/mountain-small-light.svg'
import MountainsBigLight from '@/assets/mountain-big-light.svg'

const router = useRouter()

function goToDash() {
    router.push('/dashboard')
}
</script>

<style scoped>
    @media (max-height: 895px) {
        .small-z-back {
            z-index: 0 !important;
        }
    }
</style>