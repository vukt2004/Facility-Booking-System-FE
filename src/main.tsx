import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import './index.css' // File css reset mặc định

// Mã màu Cam FPT: #f57224
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#f57224', // Màu chủ đạo toàn app
          borderRadius: 8,         // Bo góc mềm mại hơn
          fontFamily: "'Inter', sans-serif", // Font hiện đại (nếu muốn)
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)