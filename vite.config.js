import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  publicDir: "static",
  server: {
    port: 3000,
  },

  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        messenger: path.resolve(__dirname, "messenger.html"),
        registration: path.resolve(__dirname, "registration.html"),
        profile: path.resolve(__dirname, "profile.html"),
        changePasswordForm: path.resolve(
          __dirname,
          "change-password-form.html"
        ),
        profileSettings: path.resolve(
          __dirname,
          "profile-settings-form.html"
        ),
        error404: path.resolve(__dirname, "error404.html"),
        error505: path.resolve(__dirname, "error505.html"),
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
