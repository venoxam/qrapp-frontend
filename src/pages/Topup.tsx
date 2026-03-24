import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { AmountDisplay } from '../components/AmountDisplay';
import { Digipad } from '../components/Digipad';
import { ActionButton } from '../components/ActionButton';
import { QRScanner } from '../components/QRScanner';
import { ResultScreen } from '../components/ResultScreen';
import { useTopup } from '../hooks/useTopup';
import { digitsToAmount } from '../utils/amount';

export function Topup() {
  const [digits, setDigits] = useState('0');
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const topupMutation = useTopup();

  const amount = digitsToAmount(digits);
  const canSubmit = amount > 0;

  const handleTopup = () => {
    if (amount <= 0) return;
    setShowScanner(true);
  };

  const handleScan = (id: string) => {
    setScannedId(id);
    setShowScanner(false);
    topupMutation.mutate({ id, amount });
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
      <Navbar title="Top Up" />

      <div className="flex-1 flex flex-col">
        <AmountDisplay digits={digits} />

        {topupMutation.isError && (
          <div className="mx-5 mb-3 px-4 py-3 bg-red-50 rounded-xl animate-fade-in">
            <p className="text-red-600 text-sm text-center">{topupMutation.error.message}</p>
          </div>
        )}

        <div className="flex-1" />
        <Digipad digits={digits} onChange={setDigits} />
      </div>

      <ActionButton label="TOP UP" onClick={handleTopup} disabled={!canSubmit} loading={topupMutation.isPending} />

      {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </div>
  );
}
