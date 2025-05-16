//vite.config.ts
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
const config: UserConfig = {
  plugins: [react(), vike(), tailwindcss()],
  server: {
    allowedHosts:true,
    port: 3003, 
    hmr: {
      port: 24703,
    },
  },
}


export default config
