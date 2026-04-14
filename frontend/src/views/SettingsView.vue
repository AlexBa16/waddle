<template>
    <div class="p-10 max-w-2xl">
  
      <!-- Header -->
      <h1 class="text-3xl font-bold text-slate-700 dark:text-orange-50 mb-1">Einstellungen</h1>
      <p class="text-slate-500 dark:text-slate-300 mb-8">Verwalte dein Konto und deine Präferenzen.</p>
  
      <!-- Section: Profil -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold text-slate-600 dark:text-orange-100 mb-4">Profil</h2>
        <div class="bg-white dark:bg-slate-700 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
  
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-500 flex items-center justify-center text-2xl">
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
              <label class="text-xs text-slate-400 uppercase tracking-wide">Vorname</label>
              <input
                type="text"
                value="Max"
                class="rounded-lg px-3 py-2 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-orange-50 text-sm outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-slate-400 uppercase tracking-wide">Nachname</label>
              <input
                type="text"
                value="Mustermann"
                class="rounded-lg px-3 py-2 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-orange-50 text-sm outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>
  
        </div>
      </section>
  
      <!-- Section: Erscheinungsbild -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold text-slate-600 dark:text-orange-100 mb-4">Erscheinungsbild</h2>
        <div class="bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
  
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-orange-50">Dark Mode</p>
              <p class="text-xs text-slate-400">Folgt der Systemeinstellung</p>
            </div>
            <!-- Toggle (mock) -->
            <div class="w-11 h-6 bg-slate-300 dark:bg-orange-400 rounded-full relative cursor-pointer transition-colors">
              <div class="w-4 h-4 bg-white rounded-full absolute top-1 left-1 dark:translate-x-5 transition-transform shadow" />
            </div>
          </div>
  
          <hr class="border-slate-100 dark:border-slate-600" />
  
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-orange-50">Sprache</p>
              <p class="text-xs text-slate-400">Anzeigesprache der App</p>
            </div>
            <select class="text-sm rounded-lg px-3 py-2 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-orange-50 outline-none">
              <option>Deutsch</option>
              <option>English</option>
            </select>
          </div>
  
        </div>
      </section>
  
      <!-- Section: Benachrichtigungen -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold text-slate-600 dark:text-orange-100 mb-4">Benachrichtigungen</h2>
        <div class="bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
  
          <div v-for="item in notifications" :key="item.label" class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-orange-50">{{ item.label }}</p>
              <p class="text-xs text-slate-400">{{ item.desc }}</p>
            </div>
            <div
              class="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
              :class="item.enabled ? 'bg-indigo-400' : 'bg-slate-300 dark:bg-slate-500'"
              @click="item.enabled = !item.enabled"
            >
              <div
                class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow"
                :class="item.enabled ? 'translate-x-5' : 'translate-x-1'"
              />
            </div>
          </div>
  
        </div>
      </section>
  
      <!-- Danger Zone -->
      <section>
        <h2 class="text-lg font-semibold text-red-400 mb-4">Gefahrenzone</h2>
        <div class="bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-700 dark:text-orange-50">Konto löschen</p>
            <p class="text-xs text-slate-400">Diese Aktion kann nicht rückgängig gemacht werden.</p>
          </div>
          <button class="text-sm px-4 py-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors font-medium">
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