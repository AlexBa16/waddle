<template>
    <div class="flex justify-between bg-[#AFB7F8]/31 rounded-lg py-4 px-4">
        <div class="ml-0.5 flex items-center gap-3.5">
            <img :src=profileIcon alt="profile icon">
            <span class="text-sm font-medium text-slate-700 dark:text-orange-50">Linsu Bitter</span>
        </div>
        <Button class="flex items-center justify-center w-8 h-8 p-1 rounded-md cursor-pointer hover:bg-red-300 text-slate-700 dark:text-orange-50" @click="logout">
            <img :src=logOutIcon alt="logout icon">
        </Button>
    </div>
</template>

<script setup>
import profileIcon from '@/assets/SidebarIcons/light/profile-icon.svg'
import logOutIcon from '@/assets/SidebarIcons/light/logout-icon.svg'
</script>
