import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRScanner } from '../components/QRScanner';
import { useBalance } from '../hooks/useBalance';

export function Dashboard() {
  const navigate = useNavigate();
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const balanceQuery = useBalance(scannedId);

  const handleScan = (id: string) => {
    setScannedId(id);
    setShowScanner(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="text-sm font-bold tracking-widest text-gray-400 uppercase">Dashboard</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-4">
        <div className="rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Account Lookup</p>

          {!scannedId ? (
            <button
              onClick={() => setShowScanner(true)}
              className="w-full py-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-medium flex items-center justify-center gap-2 active:bg-gray-50"
            >
              <ScanIcon />
              Scan a QR code
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{scannedId}</span>
                <button onClick={() => setScannedId(null)} className="text-xs text-gray-400 underline">Clear</button>
              </div>

              {balanceQuery.isLoading && (
                <div className="flex items-center justify-center py-6">
                  <svg className="animate-spin h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}

              {balanceQuery.error && (
                <div className="bg-red-50 rounded-xl px-4 py-3">
                  <p className="text-red-500 text-sm">
                    {balanceQuery.error.code === 'ACCOUNT_NOT_FOUND' ? 'Account not found' : balanceQuery.error.message}
                  </p>
                </div>
              )}

              {balanceQuery.data && (
                <div className="animate-scale-in">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-gray-400">€</span>
                    <span className="text-5xl font-bold text-gray-900">{balanceQuery.data.balance.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Last updated: {new Date(balanceQuery.data.updated_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/topup')} className="rounded-2xl bg-gray-900 text-white p-5 flex flex-col gap-3 active:scale-[0.98] transition-all text-left">
            <TopupIcon />
            <span className="font-semibold text-base">Top Up</span>
            <span className="text-xs text-white/60">Add funds to an account</span>
          </button>

          <button onClick={() => navigate('/pay')} className="rounded-2xl bg-gray-100 text-gray-900 p-5 flex flex-col gap-3 active:scale-[0.98] transition-all text-left">
            <PayIcon />
            <span className="font-semibold text-base">Pay</span>
            <span className="text-xs text-gray-400">Deduct from an account</span>
          </button>
        </div>
      </div>

      {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </div>
  );
}

function ScanIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function TopupIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 5 5 12" />
    </svg>
  );
}

function PayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
