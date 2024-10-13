import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/App.scss'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './QueryClient.ts'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient} >
    <App />
  </QueryClientProvider>
)
