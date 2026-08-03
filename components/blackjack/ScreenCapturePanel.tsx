'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export default function ScreenCapturePanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  const stopCapture = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setActive(false);
  }, []);

  const startCapture = useCallback(async () => {
    setError(null);
    setSnapshot(null);
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

  const takeSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setSnapshot(canvas.toDataURL('image/jpeg', 0.85));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-felt-line bg-black">
      <div className="relative aspect-video w-full bg-felt-900">
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
      </div>
      <div className="flex items-center justify-between gap-2 bg-felt-900/80 p-3">
        <div className="flex gap-2">
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
                onClick={takeSnapshot}
                className="rounded-lg bg-limestone-50 px-4 py-2 text-sm font-semibold text-ink hover:bg-limestone-200"
              >
                Λήψη frame
              </button>
              <button
                type="button"
                onClick={stopCapture}
                className="rounded-lg border border-limestone-100/30 px-4 py-2 text-sm text-limestone-50 hover:bg-felt-800"
              >
                Διακοπή
              </button>
            </>
          )}
        </div>
        {snapshot && (
          <img
            src={snapshot}
            alt="Στιγμιότυπο παιχνιδιού"
            className="h-12 w-16 rounded object-cover ring-1 ring-limestone-100/30"
          />
        )}
      </div>
      <p className="border-t border-felt-line bg-felt-900/60 px-3 py-2 text-[11px] leading-relaxed text-limestone-100/45">
        Αυτόματη αναγνώριση χαρτιών από το frame δεν έχει ενεργοποιηθεί ακόμα — αυτό
        είναι το επόμενο βήμα. Προς το παρόν το screen capture σου δείχνει live το
        παιχνίδι δίπλα στη στρατηγική, και πρόσθεσε τα χαρτιά χειροκίνητα παρακάτω.
      </p>
    </div>
  );
}
