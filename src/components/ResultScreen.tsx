type ResultType = 'success' | 'error';

interface ResultScreenProps {
  type: ResultType;
  title: string;
  subtitle: string;
  amount?: number;
  balance?: number;
  onDismiss: () => void;
}

export function ResultScreen({ type, title, subtitle, amount, balance, onDismiss }: ResultScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6 animate-scale-in">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
        {type === 'success' ? <CheckIcon /> : <XIcon />}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{title}</h2>

      {amount !== undefined && (
        <p className="text-4xl font-bold text-gray-900 my-4">€{amount.toFixed(2)}</p>
      )}

      <p className="text-gray-500 text-center text-sm leading-relaxed">{subtitle}</p>

      {balance !== undefined && (
        <p className="text-gray-400 text-sm mt-3">
          New balance: <span className="font-semibold text-gray-700">€{balance.toFixed(2)}</span>
        </p>
      )}

      <button onClick={onDismiss} className="mt-10 w-full max-w-[320px] h-14 rounded-2xl bg-gray-900 text-white font-semibold active:scale-[0.98] transition-all">
        Done
      </button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
