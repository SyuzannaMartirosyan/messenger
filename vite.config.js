import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  publicDir: 'static',
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main:               resolve(__dirname, 'index.html'),
        messenger:          resolve(__dirname, 'messenger.html'),
        registration:       resolve(__dirname, 'registration.html'),
        profile:            resolve(__dirname, 'profile.html'),
        changePasswordForm: resolve(__dirname, 'change-password-form.html'),
        profileSettings:    resolve(__dirname, 'profile-settings-form.html'),
        error404:           resolve(__dirname, 'error404.html'),
        error505:           resolve(__dirname, 'error505.html'),
      },
    },
  },
})
