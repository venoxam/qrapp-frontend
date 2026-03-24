interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ActionButton({ label, onClick, disabled = false, loading = false }: ActionButtonProps) {
  return (
    <div className="px-5 pb-8 pt-4">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          w-full h-14 rounded-2xl text-base font-semibold tracking-wide
          transition-all duration-200 flex items-center justify-center gap-2
          ${
            disabled || loading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white active:scale-[0.98] active:bg-black shadow-lg shadow-gray-900/20'
          }
        `}
      >
        {loading ? (
          <>
            <SpinnerIcon />
            <span>Processing…</span>
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
