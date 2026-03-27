import { useEffect, useRef, useCallback, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

interface QRScanner2Props {
  isOpen: boolean;
  onScan: (result: string) => void;
  onClose: () => void;
}

const SCANNER_ID = "qr-reader";
const SHOTGUN_ID_RE = /^\d{1,16}$/;

// Mémoire "session page"
let cameraPermissionGrantedInSession = false;

function extractShotgunId(raw: string): string | null {
  const cleaned = raw.trim();
  return SHOTGUN_ID_RE.test(cleaned) ? cleaned : null;
}

async function ensureCameraPermission(): Promise<void> {
  if (cameraPermissionGrantedInSession) {
    return;
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false,
  });

  stream.getTracks().forEach((track) => track.stop());
  cameraPermissionGrantedInSession = true;
}

export function QRScanner2({ isOpen, onScan, onClose }: QRScanner2Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);
  const isStartingRef = useRef(false);
  const isMountedRef = useRef(true);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScannerRunning, setIsScannerRunning] = useState(false);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      return;
    }

    try {
      const state = scanner.getState();

      if (state === Html5QrcodeScannerState.SCANNING) {
        await scanner.stop();
      }
    } catch (error) {
      console.warn("[QRScanner2] stop error:", error);
    } finally {
      try {
        await scanner.clear();
      } catch (error) {
        console.warn("[QRScanner2] clear error:", error);
      }

      scannerRef.current = null;

      if (isMountedRef.current) {
        setIsScannerRunning(false);
      }
    }
  }, []);

  const startScanner = useCallback(async () => {
    if (!isMountedRef.current || !isOpen) {
      return;
    }

    if (scannerRef.current || isStartingRef.current) {
      return;
    }

    isStartingRef.current = true;
    setCameraError(null);
    hasScannedRef.current = false;

    try {
      await ensureCameraPermission();

      if (!isMountedRef.current || !isOpen) {
        return;
      }

      const element = document.getElementById(SCANNER_ID);
      if (!element) {
        throw new Error("Scanner container not found in DOM.");
      }

      const scanner = new Html5Qrcode(SCANNER_ID, {
        verbose: false,
      });

      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1,
        },
        async (decodedText) => {
          if (hasScannedRef.current) {
            return;
          }

          const id = extractShotgunId(decodedText);
          if (!id) {
            return;
          }

          hasScannedRef.current = true;

          await stopScanner();
          onScan(id);
        },
        undefined,
      );

      if (isMountedRef.current) {
        setIsScannerRunning(true);
      }
    } catch (err: unknown) {
      const name = err instanceof Error ? err.name : "";
      const message = err instanceof Error ? err.message : String(err);
      const lower = message.toLowerCase();

      console.error("[QRScanner2] start failed:", {
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

      if (isMountedRef.current) {
        setCameraError(uiMessage);
      }

      // On reset la mémoire si la permission a échoué
      if (
        name === "NotAllowedError" ||
        lower.includes("permission") ||
        lower.includes("notallowed")
      ) {
        cameraPermissionGrantedInSession = false;
      }

      await stopScanner();
    } finally {
      isStartingRef.current = false;
    }
  }, [isOpen, onScan, stopScanner]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    const timer = window.setTimeout(() => {
      startScanner();
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen, startScanner, stopScanner]);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

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
              {isScannerRunning
                ? "Point your camera at a QR code"
                : "Opening camera..."}
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
