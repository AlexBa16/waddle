<template>
    <div class="relative w-screen h-screen">
        <img :src="MountainsLight" alt="" class="absolute bottom-0 left-0 w-full object-center z-0" />
        <div class="fixed inset-0 bg-slate-200/75 flex items-center justify-center z-10">
            <div>
                <div class="logo-section flex flex-row items-center gap-6 justify-center mb-10">
                    <img :src="LogoLight" alt="Waddle Logo" class="w-12 h-auto" />
                    <span class="text-5xl font-bold">Waddle</span>
                </div>
                <form class="form flex flex-col gap-1">
                    <Input type="text" label="Benutzername" class="w-90" />
                    <Input type="email" label="E-Mail" class="w-90" />
                    <Input type="password" label="Passwort" class="w-90" />
                    <Input type="password" label="Passwort bestätigen" class="w-90" />
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import Input from '@/components/Input.vue';
import LogoLight from '@/assets/waddle-logo-light.svg';
import MountainsLight from '@/assets/waddle-mountains-light.svg';
</script>

<style scoped>
</style>
