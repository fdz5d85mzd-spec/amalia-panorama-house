'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ROI_SIZE_PRESETS, roiToSourceRect, type Roi } from '@/lib/blackjack/roi';
import { recognizeRankFromCanvas, type RecognitionResult } from '@/lib/blackjack/ocr';
import type { Rank } from '@/lib/blackjack/types';

type SizeKey = keyof typeof ROI_SIZE_PRESETS;
type Destination = 'player' | 'dealer' | 'other';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

interface Suggestion {
  roi: Roi;
  result: RecognitionResult;
}

export default function ScreenCapturePanel({
  onRecognized,
}: {
  onRecognized: (destination: Destination, rank: Rank) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rois, setRois] = useState<Roi[]>([]);
  const [sizeKey, setSizeKey] = useState<SizeKey>('M');
  const [scanning, setScanning] = useState(false);
  const [autoScan, setAutoScan] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const stopCapture = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setActive(false);
    setAutoScan(false);
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

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const preset = ROI_SIZE_PRESETS[sizeKey];
    const xPct = clamp((e.clientX - rect.left) / rect.width - preset.w / 2, 0, 1 - preset.w);
    const yPct = clamp((e.clientY - rect.top) / rect.height - preset.h / 2, 0, 1 - preset.h);
    setRois((prev) => [
      ...prev,
      { id: `roi-${Date.now()}-${prev.length}`, xPct, yPct, wPct: preset.w, hPct: preset.h },
    ]);
  };

  const removeRoi = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRois((prev) => prev.filter((r) => r.id !== id));
    setSuggestions((prev) => prev.filter((s) => s.roi.id !== id));
  };

  const scanAll = useCallback(async () => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || rois.length === 0 || scanning) return;
    setScanning(true);
    try {
      const containerRect = container.getBoundingClientRect();
      const collected: Suggestion[] = [];
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
        try {
          const result = await recognizeRankFromCanvas(canvas);
          collected.push({ roi, result });
        } catch {
          collected.push({ roi, result: { rank: null, raw: '', confidence: 0 } });
        }
      }
      setSuggestions(collected);
    } finally {
      setScanning(false);
    }
  }, [rois, scanning]);

  useEffect(() => {
    if (!active || !autoScan || rois.length === 0) return;
    const interval = setInterval(() => {
      scanAll();
    }, 3000);
    return () => clearInterval(interval);
  }, [active, autoScan, rois.length, scanAll]);

  const acceptSuggestion = (roiId: string, destination: Destination, rank: Rank) => {
    onRecognized(destination, rank);
    setSuggestions((prev) => prev.filter((s) => s.roi.id !== roiId));
  };

  const dismissSuggestion = (roiId: string) => {
    setSuggestions((prev) => prev.filter((s) => s.roi.id !== roiId));
  };

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
              style={{
                left: `${roi.xPct * 100}%`,
                top: `${roi.yPct * 100}%`,
                width: `${roi.wPct * 100}%`,
                height: `${roi.hPct * 100}%`,
              }}
              className="absolute rounded border-2 border-copper-light/90 bg-copper/10"
            >
              <button
                type="button"
                onClick={(e) => removeRoi(roi.id, e)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-wine text-[10px] text-limestone-50"
                aria-label="Αφαίρεση πλαισίου"
              >
                ×
              </button>
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
                {scanning ? 'Σάρωση…' : 'Σάρωσε όλα'}
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
              <div className="ml-auto flex items-center gap-1 text-xs text-limestone-100/60">
                Μέγεθος πλαισίου:
                {(Object.keys(ROI_SIZE_PRESETS) as SizeKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSizeKey(key)}
                    className={`h-6 w-6 rounded text-xs font-semibold ${
                      sizeKey === key ? 'bg-copper text-limestone-50' : 'bg-felt-800 text-limestone-100/70'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
              {rois.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setRois([]);
                    setSuggestions([]);
                  }}
                  className="rounded-lg border border-limestone-100/20 px-3 py-1.5 text-xs text-limestone-100/70 hover:bg-felt-800"
                >
                  Καθαρισμός πλαισίων
                </button>
              )}
              <button
                type="button"
                onClick={stopCapture}
                className="rounded-lg border border-limestone-100/30 px-3 py-1.5 text-xs text-limestone-50 hover:bg-felt-800"
              >
                Διακοπή
              </button>
            </>
          )}
        </div>
        {active && (
          <p className="text-[11px] leading-relaxed text-limestone-100/45">
            Κάνε κλικ πάνω στο βίντεο για να τοποθετήσεις ένα πλαίσιο πάνω σε κάθε θέση χαρτιού
            (π.χ. τα χαρτιά του παίκτη, το ανοιχτό χαρτί του dealer). Μετά «Σάρωσε όλα» για αυτόματη
            αναγνώριση με OCR — η πρώτη σάρωση αργεί λίγα δευτερόλεπτα όσο φορτώνει η μηχανή.
          </p>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-felt-line bg-felt-900/60 p-3">
          {suggestions.map(({ roi, result }) => (
            <div
              key={roi.id}
              className="flex items-center gap-2 rounded-lg border border-limestone-100/15 bg-felt-800 px-2 py-1.5"
            >
              {result.rank ? (
                <>
                  <span className="font-display text-lg font-semibold text-limestone-50">{result.rank}</span>
                  <span className="text-[10px] text-limestone-100/40">{Math.round(result.confidence)}%</span>
                  <button
                    type="button"
                    onClick={() => acceptSuggestion(roi.id, 'player', result.rank as Rank)}
                    className="rounded bg-sky-600 px-2 py-1 text-[11px] text-limestone-50 hover:bg-sky-500"
                  >
                    Παίκτης
                  </button>
                  <button
                    type="button"
                    onClick={() => acceptSuggestion(roi.id, 'dealer', result.rank as Rank)}
                    className="rounded bg-emerald-600 px-2 py-1 text-[11px] text-limestone-50 hover:bg-emerald-500"
                  >
                    Dealer
                  </button>
                  <button
                    type="button"
                    onClick={() => acceptSuggestion(roi.id, 'other', result.rank as Rank)}
                    className="rounded bg-violet-600 px-2 py-1 text-[11px] text-limestone-50 hover:bg-violet-500"
                  >
                    Άλλο
                  </button>
                </>
              ) : (
                <span className="text-[11px] text-limestone-100/50">
                  δεν αναγνωρίστηκε{result.raw ? ` ('${result.raw}')` : ''} — πρόσθεσε χειροκίνητα
                </span>
              )}
              <button
                type="button"
                onClick={() => dismissSuggestion(roi.id)}
                className="text-limestone-100/40 hover:text-copper-light"
                aria-label="Απόρριψη"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
