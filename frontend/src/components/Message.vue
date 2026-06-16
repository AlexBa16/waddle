<template>
    <div
        class="flex flex-col px-2 py-4 border border-slate-300 rounded-xl bg-orange-50 dark:bg-slate-600 dark:border-slate-500 dark:text-white"
    >
        <div class="flex-1 p-2">
            <span class="font-bold">{{ message.author }} </span>
            <span> hat dich zu </span>
            <span class="font-bold">{{ message.project }}</span>
            <span> eingeladen.</span>
        </div>
        <div class="flex items-end justify-end gap-1 p-2 mt-5">
            <button class="cursor-pointer" @click="$emit('accept', message.id)">
                <img
                    :src="acceptIcon"
                    alt="accept icon"
                    class="inline-block w-6 h-6 mr-1"
                />
            </button>
            <button
                class="cursor-pointer"
                @click="$emit('decline', message.id)"
            >
                <img
                    :src="declineIcon"
                    alt="decline icon"
                    class="dark:hidden inline-block w-6 h-6 mr-1"
                />
                <img
                    :src="declineIconDark"
                    alt="decline icon"
                    class="w-6 h-6 mr-1 hidden dark:block"
                />
            </button>
        </div>
    </div>
</template>

<script setup>
import acceptIcon from "@/assets/accept.svg";
import declineIcon from "@/assets/decline.svg";
import declineIconDark from "@/assets/decline-dark.svg";
defineProps({
    message: {
        type: Object,
        required: true,
    },
});
defineEmits(["accept", "decline"]);
</script>
