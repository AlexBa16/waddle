import { createI18n } from 'vue-i18n'
import de from './locales/de.json'
import en from './locales/en.json'

export default createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'de',
  fallbackLocale: 'en',
  messages: { de, en }
})