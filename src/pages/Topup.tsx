import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { AmountDisplay } from '../components/AmountDisplay';
import { Digipad } from '../components/Digipad';
import { ActionButton } from '../components/ActionButton';
import { QRScanner } from '../components/QRScanner';
import { BalanceOverlay } from '../components/BalanceOverlay';
import { ResultScreen } from '../components/ResultScreen';
import { useTopup } from '../hooks/useTopup';
import { useBalance } from '../hooks/useBalance';
import { digitsToAmount } from '../utils/amount';

export function Topup() {
  const [digits, setDigits] = useState('0');
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const topupMutation = useTopup();
  const balanceQuery = useBalance(scannedId);

  const amount = digitsToAmount(digits);
  const canSubmit = amount > 0 && !!scannedId;

  const handleScan = (id: string) => {
    setScannedId(id);
    setShowScanner(false);
    setShowBalance(true);
  };

  const handleTopup = () => {
    if (!scannedId || amount <= 0) return;
    topupMutation.mutate({ id: scannedId, amount });
  };

  const handleDismissResult = () => {
    topupMutation.reset();
    setDigits('0');
    setScannedId(null);
  };

  if (topupMutation.isSuccess) {
    return (
      <ResultScreen
        type="success"
        title="Top-up successful"
        subtitle={`€${amount.toFixed(2)} has been added to account ${scannedId}`}
        amount={amount}
        balance={topupMutation.data?.balance}
        onDismiss={handleDismissResult}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Navbar title="Top Up" onScanClick={() => setShowScanner(true)} scannedId={scannedId} />

      <div className="flex-1 flex flex-col">
        <AmountDisplay digits={digits} />

        {topupMutation.isError && (
          <div className="mx-5 mb-3 px-4 py-3 bg-red-50 rounded-xl animate-fade-in">
            <p className="text-red-600 text-sm text-center">{topupMutation.error.message}</p>
          </div>
        )}

        {!scannedId && (
          <div className="mx-5 mb-3">
            <button
              onClick={() => setShowScanner(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-medium flex items-center justify-center gap-2 active:bg-gray-50"
            >
              <ScanIcon />
              Tap to scan account QR
            </button>
          </div>
        )}

        <div className="flex-1" />
        <Digipad digits={digits} onChange={setDigits} />
      </div>

      <ActionButton label="TOP UP" onClick={handleTopup} disabled={!canSubmit} loading={topupMutation.isPending} />

      {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}

      {showBalance && scannedId && (
        <BalanceOverlay id={scannedId} data={balanceQuery.data} isLoading={balanceQuery.isLoading} error={balanceQuery.error} onClose={() => setShowBalance(false)} />
      )}
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
