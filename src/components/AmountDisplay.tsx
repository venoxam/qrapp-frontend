interface AmountDisplayProps {
  digits: string;
}

export function AmountDisplay({ digits }: AmountDisplayProps) {
  const formatted = formatAmount(digits);

  return (
    <div className="flex items-baseline justify-center gap-1 py-6">
      <span className="text-4xl font-semibold text-gray-400 mb-1">€</span>
      <span
        className={`font-bold tracking-tight transition-all duration-150 ${
          formatted.length > 6 ? 'text-5xl' : 'text-7xl'
        } text-gray-900`}
      >
        {formatted}
      </span>
    </div>
  );
}

function formatAmount(digits: string): string {
  if (!digits || digits === '0') return '0';
  const num = parseInt(digits, 10);
  const euros = Math.floor(num / 100);
  const cents = num % 100;
  return `${euros}.${String(cents).padStart(2, '0')}`;
}
