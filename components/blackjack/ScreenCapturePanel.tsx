'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ROI_SIZE_PRESETS, roiToSourceRect, type Roi } from '@/lib/blackjack/roi';
import { recognizeRankFromCanvas, type RecognitionResult } from '@/lib/blackjack/ocr';
import type { CardDestination, Rank } from '@/lib/blackjack/types';

type SizeKey = keyof typeof ROI_SIZE_PRESETS;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const ROLE_ORDER: CardDestination[] = ['player', 'dealer', 'other'];

const ROLE_META: Record<CardDestination, { label: string; short: string; boxClass: string; chipClass: string }> = {
  player: { label: 'Τα χαρτιά μου', short: 'Εγώ', boxClass: 'border-sky-400 bg-sky-400/10', chipClass: 'bg-sky-600' },
  dealer: { label: 'Dealer', short: 'Dealer', boxClass: 'border-emerald-400 bg-emerald-400/10', chipClass: 'bg-emerald-600' },
  other: { label: 'Άλλο', short: 'Άλλο', boxClass: 'border-violet-400 bg-violet-400/10', chipClass: 'bg-violet-600' },
};

interface ScanLogEntry {
  roiId: string;
  role: CardDestination;
  rank: Rank | null;
  raw: string;
  confidence: number;
  committed: boolean;
}

export default function ScreenCapturePanel({
  onRecognized,
  resetSignal,
}: {
  onRecognized: (destination: CardDestination, rank: Rank) => void;
  resetSignal?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rois, setRois] = useState<Roi[]>([]);
  const [sizeKey, setSizeKey] = useState<SizeKey>('M');
  const [activeRole, setActiveRole] = useState<CardDestination>('player');
  const [scanning, setScanning] = useState(false);
  const [autoScan, setAutoScan] = useState(true);
  const [scanLog, setScanLog] = useState<ScanLogEntry[]>([]);

  // Μνήμη ανά πλαίσιο ώστε ένα χαρτί που δεν άλλαξε να μην ξαναπροστίθεται
  // σε κάθε σάρωση. Ένα νέο rank πρέπει να διαβαστεί 2 φορές στη σειρά πριν
  // καταχωρηθεί, ώστε ένα μεμονωμένο λάθος OCR να μην περάσει σαν νέο χαρτί.
  const lastCommittedRef = useRef<Record<string, Rank>>({});
  const pendingRef = useRef<Record<string, { rank: Rank; count: number }>>({});

  const stopCapture = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setActive(false);
  }, []);

  const startCapture = useCallback(async () => {
    setError(null);
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
      setError('Ο browser δεν υποστηρίζει screen capture (χρειάζεται HTTPS ή localhost, desktop browser).');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 15 } },
        audio: false,
      });
      streamRef.current = stream;
      stream.getVideoTracks()[0]?.addEventListener('ended', stopCapture);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch {
      setError('Δεν επιλέχθηκε παράθυρο/tab για κοινή χρήση, ή δεν δόθηκε άδεια.');
    }
  }, [stopCapture]);

  useEffect(() => stopCapture, [stopCapture]);

  // Νέος γύρος / νέο shoe από τη σελίδα -> ξέχασε τι είχε δει κάθε πλαίσιο,
  // αλλιώς ένα ίδιο rank στο ίδιο πλαίσιο σε νέο γύρο δεν θα ξαναπροστεθεί.
  useEffect(() => {
    lastCommittedRef.current = {};
    pendingRef.current = {};
  }, [resetSignal]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const preset = ROI_SIZE_PRESETS[sizeKey];
    const xPct = clamp((e.clientX - rect.left) / rect.width - preset.w / 2, 0, 1 - preset.w);
    const yPct = clamp((e.clientY - rect.top) / rect.height - preset.h / 2, 0, 1 - preset.h);
    setRois((prev) => [
      ...prev,
      { id: `roi-${Date.now()}-${prev.length}`, xPct, yPct, wPct: preset.w, hPct: preset.h, role: activeRole },
    ]);
  };

  const removeRoi = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRois((prev) => prev.filter((r) => r.id !== id));
    setScanLog((prev) => prev.filter((s) => s.roiId !== id));
    delete lastCommittedRef.current[id];
    delete pendingRef.current[id];
  };

  const cycleRole = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRois((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, role: ROLE_ORDER[(ROLE_ORDER.indexOf(r.role) + 1) % ROLE_ORDER.length] } : r
      )
    );
  };

  const MIN_SIZE = 0.02;

  const handleResizePointerDown = (roi: Roi, e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = roi.wPct;
    const startH = roi.hPct;

    const onMove = (moveEvent: PointerEvent) => {
      const dxPct = (moveEvent.clientX - startX) / containerRect.width;
      const dyPct = (moveEvent.clientY - startY) / containerRect.height;
      setRois((prev) =>
        prev.map((r) =>
          r.id === roi.id
            ? {
                ...r,
                wPct: clamp(startW + dxPct, MIN_SIZE, 1 - r.xPct),
                hPct: clamp(startH + dyPct, MIN_SIZE, 1 - r.yPct),
              }
            : r
        )
      );
    };
    const onUp = () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
  };

  const scanAll = useCallback(async () => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || rois.length === 0 || scanning) return;
    setScanning(true);
    try {
      const containerRect = container.getBoundingClientRect();
      const log: ScanLogEntry[] = [];
      for (const roi of rois) {
        const rect = roiToSourceRect(
          roi,
          { width: containerRect.width, height: containerRect.height },
          { videoWidth: video.videoWidth, videoHeight: video.videoHeight }
        );
        if (!rect) continue;
        const scaleUp = 3;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(rect.sw * scaleUp));
        canvas.height = Math.max(1, Math.round(rect.sh * scaleUp));
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        ctx.drawImage(video, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, canvas.width, canvas.height);

        let result: RecognitionResult;
        try {
          result = await recognizeRankFromCanvas(canvas);
        } catch {
          result = { rank: null, raw: '', confidence: 0 };
        }

        let committed = false;
        if (result.rank) {
          const rank = result.rank;
          if (lastCommittedRef.current[roi.id] !== rank) {
            const pending = pendingRef.current[roi.id];
            if (pending && pending.rank === rank) {
              pending.count += 1;
              if (pending.count >= 2) {
                onRecognized(roi.role, rank);
                lastCommittedRef.current[roi.id] = rank;
                delete pendingRef.current[roi.id];
                committed = true;
              }
            } else {
              pendingRef.current[roi.id] = { rank, count: 1 };
            }
          }
        }
        log.push({ roiId: roi.id, role: roi.role, rank: result.rank, raw: result.raw, confidence: result.confidence, committed });
      }
      setScanLog(log);
    } finally {
      setScanning(false);
    }
  }, [rois, scanning, onRecognized]);

  useEffect(() => {
    if (!active || !autoScan || rois.length === 0) return;
    const interval = setInterval(() => {
      scanAll();
    }, 3000);
    return () => clearInterval(interval);
  }, [active, autoScan, rois.length, scanAll]);

  return (
    <div className="overflow-hidden rounded-xl border border-felt-line bg-black">
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={`relative aspect-video w-full select-none bg-felt-900 ${active ? 'cursor-crosshair' : ''}`}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full object-contain ${active ? '' : 'hidden'}`}
        />
        {!active && (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-limestone-100/60">
              Ξεκίνα screen capture και επίλεξε το tab ή το παράθυρο όπου παίζει το live-dealer stream.
            </p>
            {error && <p className="text-xs text-copper-light">{error}</p>}
          </div>
        )}
        {active &&
          rois.map((roi) => (
            <div
              key={roi.id}
              onClick={(e) => cycleRole(roi.id, e)}
              style={{
                left: `${roi.xPct * 100}%`,
                top: `${roi.yPct * 100}%`,
                width: `${roi.wPct * 100}%`,
                height: `${roi.hPct * 100}%`,
              }}
              className={`absolute cursor-pointer rounded border-2 ${ROLE_META[roi.role].boxClass}`}
            >
              <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-felt-900/90 px-1 text-[10px] text-limestone-50">
                {ROLE_META[roi.role].short}
              </span>
              <button
                type="button"
                onClick={(e) => removeRoi(roi.id, e)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-wine text-[10px] text-limestone-50"
                aria-label="Αφαίρεση πλαισίου"
              >
                ×
              </button>
              <div
                onPointerDown={(e) => handleResizePointerDown(roi, e)}
                className="absolute -bottom-1.5 -right-1.5 h-4 w-4 touch-none cursor-nwse-resize rounded-sm border border-limestone-50 bg-copper-light"
                aria-label="Αλλαγή μεγέθους πλαισίου"
              />
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-2 bg-felt-900/80 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {!active ? (
            <button
              type="button"
              onClick={startCapture}
              className="rounded-lg bg-copper px-4 py-2 text-sm font-semibold text-limestone-50 hover:bg-copper-dark"
            >
              Έναρξη screen capture
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={scanAll}
                disabled={rois.length === 0 || scanning}
                className="rounded-lg bg-limestone-50 px-4 py-2 text-sm font-semibold text-ink hover:bg-limestone-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {scanning ? 'Σάρωση…' : 'Σάρωσε τώρα'}
              </button>
              <label className="flex items-center gap-1.5 text-xs text-limestone-100/70">
                <input
                  type="checkbox"
                  checked={autoScan}
                  onChange={(e) => setAutoScan(e.target.checked)}
                  disabled={rois.length === 0}
                />
                Αυτόματη σάρωση κάθε 3&Prime;
              </label>
              {rois.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setRois([]);
                    setScanLog([]);
                    lastCommittedRef.current = {};
                    pendingRef.current = {};
                  }}
                  className="rounded-lg border border-limestone-100/20 px-3 py-1.5 text-xs text-limestone-100/70 hover:bg-felt-800"
                >
                  Καθαρισμός πλαισίων
                </button>
              )}
              <button
                type="button"
                onClick={stopCapture}
                className="ml-auto rounded-lg border border-limestone-100/30 px-3 py-1.5 text-xs text-limestone-50 hover:bg-felt-800"
              >
                Διακοπή
              </button>
            </>
          )}
        </div>

        {active && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-limestone-100/70">
            <span>Επόμενο πλαίσιο για:</span>
            {ROLE_ORDER.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                  activeRole === role ? `${ROLE_META[role].chipClass} text-limestone-50` : 'bg-felt-800 text-limestone-100/60'
                }`}
              >
                {ROLE_META[role].label}
              </button>
            ))}
            <span className="ml-2">Μέγεθος:</span>
            {(Object.keys(ROI_SIZE_PRESETS) as SizeKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSizeKey(key)}
                className={`h-6 w-6 rounded font-semibold ${
                  sizeKey === key ? 'bg-copper text-limestone-50' : 'bg-felt-800 text-limestone-100/70'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        )}

        {active && (
          <p className="text-[11px] leading-relaxed text-limestone-100/45">
            Διάλεξε ρόλο πάνω, μετά κάνε κλικ στο βίντεο για να τοποθετήσεις πλαίσιο σε κάθε θέση
            χαρτιού (σύρε τη λαβή κάτω-δεξιά για αλλαγή μεγέθους, κλικ μέσα στο πλαίσιο για αλλαγή
            ρόλου, × για αφαίρεση). Με αυτόματη σάρωση ενεργή, κάθε νέο χαρτί προστίθεται μόνο του
            μόλις επιβεβαιωθεί σε 2 διαδοχικές σαρώσεις — χωρίς άλλο κλικ.
          </p>
        )}
      </div>

      {scanLog.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-felt-line bg-felt-900/60 p-3">
          {scanLog.map((entry) => (
            <div
              key={entry.roiId}
              className="flex items-center gap-1.5 rounded-lg border border-limestone-100/15 bg-felt-800 px-2 py-1 text-[11px]"
            >
              <span className={`rounded px-1.5 py-0.5 text-[10px] text-limestone-50 ${ROLE_META[entry.role].chipClass}`}>
                {ROLE_META[entry.role].short}
              </span>
              {entry.rank ? (
                <span className="text-limestone-50">
                  {entry.rank}
                  <span className="text-limestone-100/40"> {Math.round(entry.confidence)}%</span>
                </span>
              ) : (
                <span className="text-limestone-100/40">δεν αναγνωρίστηκε</span>
              )}
              {entry.committed && <span className="text-emerald-400">✓ προστέθηκε</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
