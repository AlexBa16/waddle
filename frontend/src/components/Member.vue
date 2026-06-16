<template>
    <div class="p-4 flex flex-col items-center w-full max-w-3xl mx-auto">
        <div
            class="w-full mb-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md shadow-black/5"
        >
            <div class="flex items-center justify-between mb-4">
                <h3
                    class="text-sm font-semibold text-slate-700 dark:text-orange-50 tracking-wide"
                >
                    {{ t("nav.reports.trackedFor") }}:
                    <span class="text-indigo-500 dark:text-indigo-400">{{
                        username
                    }}</span>
                </h3>

                <select
                    v-model="timeframe"
                    class="text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-orange-50 px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                >
                    <option value="week">
                        {{ t("nav.reports.thisWeek") }}
                    </option>
                    <option value="month">
                        {{ t("nav.reports.thisMonth") }}
                    </option>
                    <option value="year">
                        {{ t("nav.reports.thisYear") }}
                    </option>
                </select>
            </div>

            <div
                v-if="timelineChartData.labels.length === 0"
                class="text-gray-500 dark:text-gray-400 text-sm text-center py-8"
            >
                {{ t("nav.reports.noTimeEntries") }}
            </div>
            <div v-else class="w-full h-48">
                <Bar
                    :data="timelineChartData"
                    :options="timelineChartOptions"
                />
            </div>
        </div>

        <div
            class="w-full bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md shadow-black/5 flex flex-col"
        >
            <h3
                class="text-sm font-semibold text-slate-700 dark:text-orange-50 tracking-wide mb-6 w-full text-left"
            >
                {{ t("nav.reports.distribution") }}
            </h3>

            <div
                v-if="pieSlices.length === 0"
                class="text-gray-500 dark:text-gray-400 text-sm py-12 text-center"
            >
                {{ t("nav.reports.noTimeEntries") }}
            </div>

            <div
                v-else
                class="flex flex-col sm:flex-row gap-8 items-start w-full"
            >
                <div
                    class="flex-1 w-full space-y-2 max-h-64 overflow-y-auto pr-1"
                >
                    <div
                        v-for="entry in memberEntries"
                        :key="entry.id"
                        class="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                    >
                        <div class="flex flex-col flex-1 min-w-0">
                            <span
                                class="text-xs font-semibold text-slate-700 dark:text-orange-50"
                            >
                                {{ formatDate(entry.startTime) }}
                            </span>
                            <span class="text-xs text-slate-400 truncate">
                                {{ entry.description || "—" }}
                            </span>
                        </div>
                        <span
                            class="font-mono text-xs text-slate-500 dark:text-orange-50/60 shrink-0"
                        >
                            {{ calcDuration(entry.startTime, entry.endTime) }}
                        </span>
                    </div>
                </div>

                <div class="flex flex-col items-center shrink-0">
                    <div class="w-52 h-52 flex items-center justify-center">
                        <Pie :data="pieChartData" :options="pieChartOptions" />
                    </div>
                    <div
                        class="mt-4 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300 w-full"
                    >
                        <div
                            v-for="(slice, idx) in pieSlices"
                            :key="slice.label"
                            class="flex items-center gap-2"
                        >
                            <span
                                class="inline-block w-3 h-3 rounded-full shrink-0"
                                :style="{
                                    background:
                                        sliceColors[idx % sliceColors.length],
                                }"
                            ></span>
                            <span class="flex-1 truncate">{{
                                slice.label
                            }}</span>
                            <strong class="tabular-nums shrink-0">{{
                                formatHours(slice.ms)
                            }}</strong>
                        </div>
                        <div
                            class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2"
                        >
                            <span
                                class="flex-1 font-semibold text-slate-700 dark:text-orange-50"
                            >
                                {{ t("nav.reports.total", "Gesamt") }}
                            </span>
                            <strong
                                class="tabular-nums text-slate-700 dark:text-orange-50"
                            >
                                {{ formatHours(totalMemberMs) }}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Bar, Pie } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import { useTimeEntryStore } from "@/stores/timeEntry";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
);

const props = defineProps({
    username: {
        type: String,
        required: true,
    },
});

const timeEntryStore = useTimeEntryStore();
const timeframe = ref("week");

const sliceColors = [
    "#7f84ff",
    "#ff7eb3",
    "#43d9a2",
    "#ffc764",
    "#60c3f7",
    "#b97fff",
    "#ff6b6b",
    "#4ecdc4",
    "#f7b731",
    "#a29bfe",
];


function msFromEntry(entry) {
    const start = new Date(entry.startTime).getTime();
    const end = new Date(entry.endTime).getTime();
    return !isNaN(start) && !isNaN(end) ? end - start : 0;
}

function formatHours(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
}

function msToDecimalHours(ms) {
    return parseFloat((ms / 3600000).toFixed(2));
}

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

function calcDuration(start, end) {
    if (!start || !end) return "—";
    const secs = Math.floor((new Date(end) - new Date(start)) / 1000);
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}


const memberEntries = computed(() =>
    timeEntryStore.entries
        .filter((e) => e.trackedBy?.username === props.username)
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)),
);


const pieSlices = computed(() => {
    const map = {};
    for (const entry of memberEntries.value) {
        const label =
            entry.description?.trim() ||
            t("nav.reports.noDescription", "Ohne Beschreibung");
        map[label] = (map[label] || 0) + msFromEntry(entry);
    }
    return Object.entries(map)
        .map(([label, ms]) => ({ label, ms }))
        .sort((a, b) => b.ms - a.ms);
});

const totalMemberMs = computed(() =>
    pieSlices.value.reduce((sum, s) => sum + s.ms, 0),
);

const pieChartData = computed(() => ({
    labels: pieSlices.value.map((s) => s.label),
    datasets: [
        {
            data: pieSlices.value.map((s) => s.ms),
            backgroundColor: pieSlices.value.map(
                (_, i) => sliceColors[i % sliceColors.length],
            ),
            borderColor: pieSlices.value.map(
                (_, i) => sliceColors[i % sliceColors.length],
            ),
            borderWidth: 1,
        },
    ],
}));

const pieChartOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx) => ` ${ctx.label}: ${formatHours(ctx.raw)}`,
            },
        },
    },
};


const timelineChartData = computed(() => {
    const baseDate = new Date();
    const currentYear = baseDate.getFullYear();
    const currentMonth = baseDate.getMonth();
    const weekdayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const monthNamesDe = [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dez",
    ];

    const startOfWeek = new Date(baseDate);
    const currentDay = startOfWeek.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const dailyMap = {};

    memberEntries.value.forEach((entry) => {
        if (!entry.startTime) return;
        const entryDate = new Date(entry.startTime);
        const ms = msFromEntry(entry);

        if (timeframe.value === "week") {
            if (entryDate >= startOfWeek) {
                const key = weekdayNames[entryDate.getDay()];
                dailyMap[key] = (dailyMap[key] || 0) + ms;
            }
        } else if (timeframe.value === "month") {
            if (
                entryDate.getMonth() === currentMonth &&
                entryDate.getFullYear() === currentYear
            ) {
                const key = `KW ${getWeekNumber(entryDate)}`;
                dailyMap[key] = (dailyMap[key] || 0) + ms;
            }
        } else if (timeframe.value === "year") {
            if (entryDate.getFullYear() === currentYear) {
                const key = monthNamesDe[entryDate.getMonth()];
                dailyMap[key] = (dailyMap[key] || 0) + ms;
            }
        }
    });

    let labels = [];
    if (timeframe.value === "week") {
        labels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    } else if (timeframe.value === "year") {
        labels = monthNamesDe;
    } else {
        labels = Object.keys(dailyMap).sort(
            (a, b) =>
                parseInt(a.replace("KW ", "")) - parseInt(b.replace("KW ", "")),
        );
    }

    const durationData = labels.map((l) => msToDecimalHours(dailyMap[l] || 0));
    const finalLabels =
        timeframe.value === "month"
            ? labels.filter((_, i) => durationData[i] > 0)
            : labels;
    const finalData =
        timeframe.value === "month"
            ? durationData.filter((v) => v > 0)
            : durationData;

    return {
        labels: finalLabels,
        datasets: [
            {
                label: props.username,
                data: finalData,
                backgroundColor: "#7f84ff",
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };
});

const timelineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx) => ` ${ctx.raw}h`,
            },
        },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: "#94a3b8" },
        },
        y: {
            beginAtZero: true,
            ticks: {
                color: "#94a3b8",
                callback: (value) => `${value}h`,
            },
        },
    },
};
</script>
