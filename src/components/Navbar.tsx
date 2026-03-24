interface NavbarProps {
  title: string;
  onScanClick: () => void;
  scannedId?: string | null;
}

export function Navbar({ title, onScanClick, scannedId }: NavbarProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <button
        onClick={onScanClick}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 active:bg-gray-200 transition-colors"
        aria-label="Scan QR code"
      >
        <QRIcon />
        {scannedId ? (
          <span className="text-xs font-medium text-gray-500 max-w-[80px] truncate">{scannedId}</span>
        ) : (
          <span className="text-xs font-medium text-gray-500">Scan</span>
        )}
      </button>

      <h1 className="text-sm font-bold tracking-widest text-gray-400 uppercase">{title}</h1>

      <div className="w-16" />
    </div>
  );
}

function QRIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="18" y="14" width="3" height="3" />
      <rect x="14" y="18" width="3" height="3" />
      <rect x="18" y="18" width="3" height="3" />
    </svg>
  );
}
