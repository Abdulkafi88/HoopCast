import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { gameDetailsFrom, transformGames } from './src/utils/transform';

export default defineConfig({
  base: '/HoopCast/',
  plugins: [react()],
});

// Example usage of the utility functions
const gameDetails = gameDetailsFrom(game, userId, docId);

const transformedArray = transformGames(arr);
