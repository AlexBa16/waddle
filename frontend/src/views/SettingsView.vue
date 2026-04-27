<template>
    <div class="max-w-2xl p-10">
  
      <!-- Header -->
      <h1 class="mb-1 text-3xl font-bold text-slate-700 dark:text-orange-50">Einstellungen</h1>
      <p class="mb-8 text-slate-500 dark:text-slate-300">Verwalte dein Konto und deine Präferenzen.</p>
  
      <!-- Section: Profil -->
      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-slate-600 dark:text-orange-100">Profil</h2>
        <div class="flex flex-col gap-4 p-6 bg-white shadow-sm dark:bg-slate-700 rounded-2xl">
  
          <div class="flex items-center gap-5">
            <div class="flex items-center justify-center w-16 h-16 text-2xl rounded-full bg-slate-300 dark:bg-slate-500">
              🐧
            </div>
            <div>
              <p class="font-semibold text-slate-700 dark:text-orange-50">Max Mustermann</p>
              <p class="text-sm text-slate-400">max@beispiel.at</p>
            </div>
            <button class="ml-auto text-sm px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-orange-50 hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors">
              Bearbeiten
            </button>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs tracking-wide uppercase text-slate-400">Vorname</label>
              <input
                type="text"
                value="Max"
                class="px-3 py-2 text-sm rounded-lg outline-none bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-orange-50 focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs tracking-wide uppercase text-slate-400">Nachname</label>
              <input
                type="text"
                value="Mustermann"
                class="px-3 py-2 text-sm rounded-lg outline-none bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-orange-50 focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>
  
        </div>
      </section>
  
      <!-- Section: Erscheinungsbild -->
      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-slate-600 dark:text-orange-100">Erscheinungsbild</h2>
        <div class="flex flex-col gap-4 p-6 bg-white shadow-sm dark:bg-slate-700 rounded-2xl">
  
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-orange-50">Dark Mode</p>
              <p class="text-xs text-slate-400">Folgt der Systemeinstellung</p>
            </div>
            <!-- Toggle (mock) -->
            <div class="relative h-6 transition-colors rounded-full cursor-pointer w-11 bg-slate-300 dark:bg-orange-400">
              <div class="absolute w-4 h-4 transition-transform bg-white rounded-full shadow top-1 left-1 dark:translate-x-5" />
            </div>
          </div>
  
          <hr class="border-slate-100 dark:border-slate-600" />
  
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-orange-50">Sprache</p>
              <p class="text-xs text-slate-400">Anzeigesprache der App</p>
            </div>
            <select class="px-3 py-2 text-sm rounded-lg outline-none bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-orange-50">
              <option>Deutsch</option>
              <option>English</option>
            </select>
          </div>
  
        </div>
      </section>
  
      <!-- Section: Benachrichtigungen -->
      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-slate-600 dark:text-orange-100">Benachrichtigungen</h2>
        <div class="flex flex-col gap-4 p-6 bg-white shadow-sm dark:bg-slate-700 rounded-2xl">
  
          <div v-for="item in notifications" :key="item.label" class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-orange-50">{{ item.label }}</p>
              <p class="text-xs text-slate-400">{{ item.desc }}</p>
            </div>
            <div
              class="relative h-6 transition-colors rounded-full cursor-pointer w-11"
              :class="item.enabled ? 'bg-indigo-400' : 'bg-slate-300 dark:bg-slate-500'"
              @click="item.enabled = !item.enabled"
            >
              <div
                class="absolute w-4 h-4 transition-transform bg-white rounded-full shadow top-1"
                :class="item.enabled ? 'translate-x-5' : 'translate-x-1'"
              />
            </div>
          </div>
  
        </div>
      </section>
  
      <!-- Danger Zone -->
      <section>
        <h2 class="mb-4 text-lg font-semibold text-red-400">Gefahrenzone</h2>
        <div class="flex items-center justify-between p-6 bg-white shadow-sm dark:bg-slate-700 rounded-2xl">
          <div>
            <p class="text-sm font-medium text-slate-700 dark:text-orange-50">Konto löschen</p>
            <p class="text-xs text-slate-400">Diese Aktion kann nicht rückgängig gemacht werden.</p>
          </div>
          <button class="px-4 py-2 text-sm font-medium text-red-500 transition-colors bg-red-100 rounded-lg hover:bg-red-200">
            Löschen
          </button>
        </div>
      </section>
  
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  
  const notifications = reactive([
    { label: 'E-Mail Benachrichtigungen', desc: 'Erhalte Updates per E-Mail',      enabled: true  },
    { label: 'Push Benachrichtigungen',   desc: 'Benachrichtigungen im Browser',   enabled: false },
    { label: 'Wöchentlicher Bericht',     desc: 'Zusammenfassung jeden Montag',    enabled: true  },
  ])
  </script>
