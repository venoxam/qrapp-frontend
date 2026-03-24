import { useEffect, useRef, useCallback, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

const SCANNER_ID = "qr-reader";
const SHOTGUN_ID_RE = /^\d{1,16}$/;

function extractShotgunId(raw: string): string | null {
  const cleaned = raw.trim();
  return SHOTGUN_ID_RE.test(cleaned) ? cleaned : null;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScanned = useRef(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) {
          await scannerRef.current.stop();
        }
      } catch {
        // ignore stop errors
      }
      scannerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Delay slightly to ensure the DOM element is fully painted before html5-qrcode measures it
    const initTimer = setTimeout(() => {
      const el = document.getElementById(SCANNER_ID);
      console.log(
        "[QRScanner] init — element found:",
        !!el,
        "| dimensions:",
        el?.offsetWidth,
        "x",
        el?.offsetHeight,
      );
      console.log(
        "[QRScanner] protocol:",
        window.location.protocol,
        "| host:",
        window.location.host,
      );

      const scanner = new Html5Qrcode(SCANNER_ID, { verbose: false });
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            if (hasScanned.current) return;
            const id = extractShotgunId(decodedText);
            if (!id) return;
            hasScanned.current = true;
            stopScanner().then(() => {
              onScan(id);
            });
          },
          undefined,
        )
        .catch((err: unknown) => {
          const name = err instanceof Error ? err.name : "";
          const message = err instanceof Error ? err.message : String(err);
          const lower = message.toLowerCase();

          console.error("[QRScanner] start failed:", {
            name,
            message,
            raw: err,
          });

          let uiMessage: string;
          if (
            lower.includes("permission") ||
            lower.includes("notallowed") ||
            name === "NotAllowedError"
          ) {
            uiMessage = `Permission denied — ${message}`;
          } else if (
            lower.includes("https") ||
            lower.includes("secure") ||
            lower.includes("insecure")
          ) {
            uiMessage = `HTTPS required — ${message}`;
          } else if (
            lower.includes("notfound") ||
            lower.includes("no camera") ||
            name === "NotFoundError"
          ) {
            uiMessage = `No camera found — ${message}`;
          } else if (
            lower.includes("notreadable") ||
            name === "NotReadableError"
          ) {
            uiMessage = `Camera in use by another app — ${message}`;
          } else {
            uiMessage = `Error (${name || "unknown"}): ${message}`;
          }

          setCameraError(uiMessage);
        });
    }, 100);

    return () => {
      clearTimeout(initTimer);
      stopScanner();
    };
  }, [onScan, stopScanner]);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black animate-fade-in">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-white text-sm font-semibold tracking-widest uppercase">
          Scan QR Code
        </span>
        <button
          onClick={handleClose}
          className="text-white p-2 rounded-full bg-white/10 active:bg-white/20"
          aria-label="Close scanner"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
        {cameraError ? (
          <div className="flex flex-col items-center gap-4 text-center max-w-[280px]">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <CameraOffIcon />
            </div>
            <p className="text-white font-medium">{cameraError}</p>
            <button
              onClick={handleClose}
              className="mt-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm active:scale-95 transition-all"
            >
              Go back
            </button>
          </div>
        ) : (
          <>
            <div className="relative w-full max-w-[280px]">
              <div
                id={SCANNER_ID}
                className="w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio: "1" }}
              />
              <div className="absolute inset-0 pointer-events-none">
                <CornerBrackets />
              </div>
            </div>
            <p className="text-white/60 text-sm text-center">
              Point your camera at a QR code
            </p>

            <button
              onClick={() => onScan("1234567890")}
              className="px-4 py-2 rounded-lg bg-yellow-400 text-black text-xs font-bold tracking-wide active:scale-95 transition-all"
            >
              DEV: Fake Scan
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CameraOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function CornerBrackets() {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M20 60 L20 20 L60 20"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M220 20 L260 20 L260 60"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 220 L20 260 L60 260"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M260 220 L260 260 L220 260"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
