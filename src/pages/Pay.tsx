import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { AmountDisplay } from '../components/AmountDisplay';
import { Digipad } from '../components/Digipad';
import { ActionButton } from '../components/ActionButton';
import { QRScanner } from '../components/QRScanner';
import { ResultScreen } from '../components/ResultScreen';
import { usePay } from '../hooks/usePay';
import { digitsToAmount } from '../utils/amount';

export function Pay() {
  const [digits, setDigits] = useState('0');
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const payMutation = usePay();

  const amount = digitsToAmount(digits);
  const canSubmit = amount > 0;

  const handlePay = () => {
    if (amount <= 0) return;
    setShowScanner(true);
  };

  const handleScan = (id: string) => {
    setScannedId(id);
    setShowScanner(false);
    payMutation.mutate({ id, amount });
  };

  const handleDismissResult = () => {
    payMutation.reset();
    setDigits('0');
    setScannedId(null);
  };

  const errorMessage = payMutation.error
    ? payMutation.error.code === 'ACCOUNT_NOT_FOUND'
      ? 'Account not found. Please scan a valid QR code.'
      : payMutation.error.code === 'INSUFFICIENT_BALANCE'
        ? 'Insufficient balance for this payment.'
        : payMutation.error.message
    : null;

  if (payMutation.isSuccess) {
    return (
      <ResultScreen
        type="success"
        title="Payment successful"
        subtitle={`€${amount.toFixed(2)} was deducted from account ${scannedId}`}
        amount={amount}
        balance={payMutation.data?.balance}
        onDismiss={handleDismissResult}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Navbar title="Pay" />

      <div className="flex-1 flex flex-col">
        <AmountDisplay digits={digits} />

        {errorMessage && (
          <div className="mx-5 mb-3 px-4 py-3 bg-red-50 rounded-xl animate-fade-in">
            <p className="text-red-600 text-sm text-center">{errorMessage}</p>
          </div>
        )}

        <div className="flex-1" />
        <Digipad digits={digits} onChange={setDigits} />
      </div>

      <ActionButton label="PAY" onClick={handlePay} disabled={!canSubmit} loading={payMutation.isPending} />

      {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </div>
  );
}
