import type { BalanceResponse, ApiError } from '../types/api';

interface BalanceOverlayProps {
  id: string;
  data?: BalanceResponse;
  isLoading: boolean;
  error?: ApiError | null;
  onClose: () => void;
}

export function BalanceOverlay({ id, data, isLoading, error, onClose }: BalanceOverlayProps) {
  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col animate-slide-up">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">Balance</span>
        <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 active:bg-gray-200 transition-colors" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>

        <p className="text-sm text-gray-400 font-mono">{id}</p>

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Loading…</span>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-500 font-medium">
              {error.code === 'ACCOUNT_NOT_FOUND' ? 'Account not found' : error.message}
            </p>
            <p className="text-gray-400 text-sm mt-1">This account doesn't exist yet. Top up first to create it.</p>
          </div>
        )}

        {data && (
          <div className="text-center animate-scale-in">
            <div className="flex items-baseline gap-1 justify-center">
              <span className="text-3xl font-semibold text-gray-400">€</span>
              <span className="text-7xl font-bold text-gray-900">{data.balance.toFixed(2)}</span>
            </div>
            <p className="text-gray-400 text-sm mt-3">Available balance</p>
          </div>
        )}
      </div>

      <div className="px-5 pb-8">
        <button onClick={onClose} className="w-full h-14 rounded-2xl bg-gray-900 text-white font-semibold text-base active:scale-[0.98] transition-all">
          Continue
        </button>
      </div>
    </div>
  );
}
