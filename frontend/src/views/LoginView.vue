<template>
    <div class="relative w-screen h-screen">
        <img :src="MountainsBigLight" alt="" class="absolute bottom-0 left-2/5 w-1/2 object-center z-0" />

        <!-- Small mountain -->
        <img :src="MountainsSmallLight" alt="" class="absolute bottom-0 left-1/5 w-1/3 object-center z-20" />

        <!-- UI -->
        <div class="fixed inset-0 flex items-center justify-center z-10">
            <div class="bg-slate-200/75 rounded-2xl p-10 h-2/3">
                <div class="logo-section flex flex-row items-center gap-6 justify-center mb-10">
                    <img :src="LogoLight" alt="Waddle Logo" class="w-12 h-auto" />
                    <span class="text-5xl font-bold pop-reg">Waddle</span>
                </div>

                <form class="form flex flex-col gap-1">
                    <Input type="text" label="Benutzername" class="w-90" /> 
                    <Input type="password" label="Passwort" class="w-90" />
                    <Button>Einloggen</Button>
                </form>
                <div class="text-center mt-4">
                    <a href="/register" class="text-sm underline text-slate-600 hover:text-slate-800">Noch kein Konto? Hier registrieren</a>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import LogoLight from '@/assets/logo-light.svg'
import MountainsSmallLight from '@/assets/mountain-small-light.svg'
import MountainsBigLight from '@/assets/mountain-big-light.svg'
</script>

<style scoped></style>