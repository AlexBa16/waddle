import { createApp } from "vue";
import { createPinia } from "pinia";

import i18n from "./i18n";
import "./assets/main.css";

import Toast from "vue-toastification/dist/index.mjs";
import "vue-toastification/dist/index.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Toast, {
    position: "bottom-right",
    timeout: 5000,
});

document.documentElement.classList.toggle(
    "dark",
    localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
            window.matchMedia("(prefers-color-scheme: dark)").matches),
);

app.mount("#app");
