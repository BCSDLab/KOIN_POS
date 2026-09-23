import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import StoreSelectPage from './pages/StoreSelectPage'
import DashboardPage from './pages/DashboardPage'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/stores" element={<StoreSelectPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

export default App
