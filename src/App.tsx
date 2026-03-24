import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Topup } from './pages/Topup';
import { Pay } from './pages/Pay';
import { Dashboard } from './pages/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-full flex flex-col items-center bg-gray-50">
          <div className="w-full max-w-[420px] min-h-screen bg-white flex flex-col shadow-xl shadow-gray-200/50">
            <main className="flex-1 flex flex-col overflow-hidden">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/topup" element={<Topup />} />
                <Route path="/pay" element={<Pay />} />
              </Routes>
            </main>

            <BottomNav />
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function BottomNav() {
  return (
    <nav className="border-t border-gray-100 flex items-center justify-around px-4 py-3 bg-white">
      <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
        <HomeIcon />
        <span className="text-xs font-medium">Home</span>
      </NavLink>
      <NavLink to="/topup" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
        <TopupNavIcon />
        <span className="text-xs font-medium">Top Up</span>
      </NavLink>
      <NavLink to="/pay" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
        <PayNavIcon />
        <span className="text-xs font-medium">Pay</span>
      </NavLink>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function TopupNavIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 5 5 12" />
    </svg>
  );
}

function PayNavIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
