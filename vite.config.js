import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        aboutMe: resolve(__dirname, 'aboutMe.html'),
        blog: resolve(__dirname, 'blog.html'),
        goals: resolve(__dirname, 'goals.html'),
        keyboard: resolve(__dirname, 'keyboard.html'),
        musichat: resolve(__dirname, 'musichat.html'),
        personalSite: resolve(__dirname, 'personalSite.html'),
        blinkyBoard: resolve(__dirname, 'blinkyBoard.html'),
        stillBuilding: resolve(__dirname, 'stillBuilding.html'),
      },
    },
  },
});