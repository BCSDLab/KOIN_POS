import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StoreSelectPage from './pages/StoreSelectPage';
import DashboardPage from './pages/DashboardPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/stores" element={<StoreSelectPage />} />
        <Route path="/dashboard/" element={<DashboardPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
