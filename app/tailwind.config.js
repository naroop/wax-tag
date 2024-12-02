/** @type {import('tailwindcss').Config} */
export const mode = 'jit';
export const content = [
  './index.html',
  './src/App.vue',
  './src/components/**/*.{html,js,ts,vue}',
  './src/views/**/*.{html,js,ts,vue}'
];
export const theme = {};
export const corePlugins = {
  preflight: false
};
