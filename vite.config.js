// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/HoopCast/',   
  plugins: [react()],
})

const gameDetails = {
  season: game.season,
  uid: game.uid,
  userId,
  docId
};

const transformedArray = arr.map(({ game, userId, docId }) => ({
  name: game.name,
  competitions: game.competitions,
  links: game.links,
  status: game.status,
  shortName: game.shortName,
  userId, // Keep only one userId
  date: game.date,
  id: game.id,
  season: game.season,
  uid: game.uid,
  docId
}));
