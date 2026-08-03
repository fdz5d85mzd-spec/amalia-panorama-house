'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export default function CameraPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setSnapshot(null);
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('Ο browser δεν υποστηρίζει πρόσβαση σε κάμερα (χρειάζεται HTTPS ή localhost).');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch {
      setError('Δεν δόθηκε πρόσβαση στην κάμερα. Έλεγξε τα δικαιώματα του browser.');
    }
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

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
          className={`h-full w-full object-cover ${active ? '' : 'hidden'}`}
        />
        {!active && (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-limestone-100/60">
              Άνοιξε την κάμερα του κινητού για να βλέπεις το τραπέζι ζωντανά.
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
              onClick={startCamera}
              className="rounded-lg bg-copper px-4 py-2 text-sm font-semibold text-limestone-50 hover:bg-copper-dark"
            >
              Άνοιγμα κάμερας
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
                onClick={stopCamera}
                className="rounded-lg border border-limestone-100/30 px-4 py-2 text-sm text-limestone-50 hover:bg-felt-800"
              >
                Κλείσιμο
              </button>
            </>
          )}
        </div>
        {snapshot && (
          <img
            src={snapshot}
            alt="Στιγμιότυπο τραπεζιού"
            className="h-12 w-16 rounded object-cover ring-1 ring-limestone-100/30"
          />
        )}
      </div>
      <p className="border-t border-felt-line bg-felt-900/60 px-3 py-2 text-[11px] leading-relaxed text-limestone-100/45">
        Αυτόματη αναγνώριση χαρτιών από την κάμερα δεν έχει ενεργοποιηθεί ακόμα —
        αυτό είναι το επόμενο βήμα. Προς το παρόν χρησιμοποίησε την κάμερα για να
        βλέπεις το τραπέζι και πρόσθεσε τα χαρτιά χειροκίνητα παρακάτω.
      </p>
    </div>
  );
}
