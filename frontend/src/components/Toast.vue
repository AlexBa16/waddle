<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();

function success(msg = "Erfolgreich") {
    toast.success(msg);
}

function error(msg = "Ein Fehler ist aufgetreten") {
    toast.error(msg);
}

function warning(msg) {
    toast.warning(msg);
}

function info(msg) {
    toast.info(msg);
}

function saved(msg = "Einstellungen gespeichert") {
    toast.success(msg);
}

defineExpose({ success, error, warning, info, saved });
</script>

<template></template>

<style scoped>

.Vue-Toastification__toast {
    font-family: inherit;
    border-radius: 12px;
    padding: 12px 18px;
    font-size: 13.5px;
    font-weight: 500;
    min-width: 240px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.Vue-Toastification__toast--success {
    background-color: #6b63d8;
    color: #fff;
}

.Vue-Toastification__toast--success .Vue-Toastification__progress-bar {
    background-color: rgba(255, 255, 255, 0.4);
}

.Vue-Toastification__toast--error {
    background-color: #2b2b3a;
    color: #fff;
    border-left: 4px solid #e24b4a;
}

.Vue-Toastification__toast--error .Vue-Toastification__progress-bar {
    background-color: #e24b4a;
}

.Vue-Toastification__toast--warning {
    background-color: #2b2b3a;
    color: #fff;
    border-left: 4px solid #ef9f27;
}

.Vue-Toastification__toast--warning .Vue-Toastification__progress-bar {
    background-color: #ef9f27;
}

.Vue-Toastification__toast--info {
    background-color: #2b2b3a;
    color: #fff;
    border-left: 4px solid #6b63d8;
}

.Vue-Toastification__toast--info .Vue-Toastification__progress-bar {
    background-color: #6b63d8;
}

.Vue-Toastification__close-button {
    color: rgba(255, 255, 255, 0.6);
}

.Vue-Toastification__close-button:hover {
    color: #fff;
}
</style>
