interface DigipadProps {
  digits: string;
  onChange: (digits: string) => void;
}

const MAX_DIGITS = 7;

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'] as const;

type Key = (typeof KEYS)[number];

export function Digipad({ digits, onChange }: DigipadProps) {
  const handleKey = (key: Key) => {
    if (key === 'del') {
      onChange(digits.length <= 1 ? '0' : digits.slice(0, -1));
      return;
    }
    if (key === '.') return;
    if (digits === '0') {
      onChange(key);
      return;
    }
    if (digits.length >= MAX_DIGITS) return;
    onChange(digits + key);
  };

  return (
    <div className="grid grid-cols-3 gap-2 px-4">
      {KEYS.map((key) => (
        <button
          key={key}
          onClick={() => handleKey(key)}
          className={`
            h-16 rounded-2xl text-2xl font-medium transition-all duration-100
            active:scale-95 select-none
            ${
              key === 'del'
                ? 'text-gray-500 bg-gray-100 active:bg-gray-200'
                : key === '.'
                  ? 'bg-transparent cursor-default text-transparent'
                  : 'text-gray-900 bg-gray-100 active:bg-gray-200'
            }
          `}
          disabled={key === '.'}
          aria-label={key === 'del' ? 'Delete' : key}
        >
          {key === 'del' ? (
            <span className="flex items-center justify-center">
              <BackspaceIcon />
            </span>
          ) : key === '.' ? null : (
            key
          )}
        </button>
      ))}
    </div>
  );
}

function BackspaceIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      <line x1="18" y1="9" x2="12" y2="15" />
      <line x1="12" y1="9" x2="18" y2="15" />
    </svg>
  );
}
