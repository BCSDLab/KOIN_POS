import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StoreSelectPage from './pages/StoreSelectPage';
import DashboardPage from './pages/DashboardPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useSessionRestore } from './hooks/useSessionRestore';

const queryClient = new QueryClient();

function App(): React.JSX.Element | null {
  const sessionStatus = useSessionRestore();

  if (sessionStatus === 'loading') return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors expand visibleToasts={5} gap={12} />
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              sessionStatus === 'authenticated' ? <Navigate to="/stores" replace /> : <LoginPage />
            }
          />
          <Route path="/stores" element={<StoreSelectPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
