import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useTimeEntryStore } from "@/stores/timeEntry";

const STORAGE_KEY = "waddle_running_timer";

export const useRunningTimerStore = defineStore("runningTimer", () => {
    const timeEntryStore = useTimeEntryStore();

    const startTime = ref(null);
    const description = ref("");
    const projectId = ref(null);

    const isRunning = computed(() => startTime.value !== null);

    const elapsedSeconds = computed(() => {
        if (!startTime.value) return 0;
        return Math.floor(
            (Date.now() - new Date(startTime.value).getTime()) / 1000,
        );
    });

    function persist() {
        if (!startTime.value) return;
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                startTime: startTime.value,
                description: description.value,
                projectId: projectId.value,
            }),
        );
    }

    watch([description, projectId], persist);

    function restore() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            startTime.value = data.startTime;
            description.value = data.description;
            projectId.value = data.projectId;
        }
    }

    function start(desc, projId) {
        startTime.value = new Date().toISOString();
        description.value = desc;
        projectId.value = projId;
        persist();
    }

    async function stop() {
        if (!startTime.value) return;
        const endTime = new Date().toISOString();
        await timeEntryStore.save(
            projectId.value,
            description.value,
            startTime.value,
            endTime,
        );
        reset();
    }

    function reset() {
        startTime.value = null;
        description.value = "";
        projectId.value = null;
        localStorage.removeItem(STORAGE_KEY);
    }

    restore();

    return { startTime, description, projectId, isRunning, start, stop, reset };
});
