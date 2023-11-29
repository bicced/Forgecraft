import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Navbar from './components/Navbar'
import { ConfigProvider } from 'antd'
import WagmiConfiguration from './utils/WagmiConfig'
import { StateProvider } from './utils/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WagmiConfiguration>
      <StateProvider>
        <ConfigProvider>
          <Navbar />
          <App />
        </ConfigProvider>
      </StateProvider>
  </WagmiConfiguration>
)
