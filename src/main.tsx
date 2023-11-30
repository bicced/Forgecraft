import ReactDOM from 'react-dom/client'
import App from './App'
import Navbar from './components/Navbar'
import WagmiConfiguration from './utils/WagmiConfig'
import { StateProvider } from './utils/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WagmiConfiguration>
    <StateProvider>
      <Navbar />
      <App />
    </StateProvider>
  </WagmiConfiguration> as any
)






