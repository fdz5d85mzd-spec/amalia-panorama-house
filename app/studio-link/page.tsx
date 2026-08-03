'use client';

import { useEffect, useRef, useState } from 'react';

type Screen = 'preflight' | 'waiting' | 'live';

interface NetStats {
  up: number | null;
  down: number | null;
  jitter: number | null;
  loss: string | null;
}

export default function StudioLinkPage() {
  const [screen, setScreen] = useState<Screen>('preflight');
  const [testing, setTesting] = useState(true);
  const [net, setNet] = useState<NetStats>({ up: null, down: null, jitter: null, loss: null });
  const [camReady, setCamReady] = useState(false);
  const [camMessage, setCamMessage] = useState('Αναμονή πρόσβασης κάμερας…');
  const [micOff, setMicOff] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (selfVideoRef.current) selfVideoRef.current.srcObject = stream;
        if (pipVideoRef.current) pipVideoRef.current.srcObject = stream;
        setCamReady(true);
      } catch {
        setCamMessage('Δεν δόθηκε πρόσβαση κάμερας — δείχνουμε mock preview.');
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const runNetworkTest = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setTesting(true);
    setNet({ up: null, down: null, jitter: null, loss: null });

    const up = Math.round(8 + Math.random() * 12);
    const down = Math.round(30 + Math.random() * 40);
    const jitter = Math.round(4 + Math.random() * 10);
    const loss = (Math.random() * 0.4).toFixed(2);

    timeoutsRef.current.push(setTimeout(() => setNet((n) => ({ ...n, up })), 300));
    timeoutsRef.current.push(setTimeout(() => setNet((n) => ({ ...n, down })), 700));
    timeoutsRef.current.push(setTimeout(() => setNet((n) => ({ ...n, jitter })), 1100));
    timeoutsRef.current.push(
      setTimeout(() => {
        setNet((n) => ({ ...n, loss }));
        setTesting(false);
      }, 1500)
    );
  };

  useEffect(() => {
    runNetworkTest();
    return () => timeoutsRef.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMic = () => {
    setMicOff((v) => {
      const next = !v;
      streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !next));
      return next;
    });
  };

  const toggleCam = () => {
    setCamOff((v) => {
      const next = !v;
      streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !next));
      return next;
    });
  };

  const leaveStudio = () => {
    setScreen('preflight');
    runNetworkTest();
  };

  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  const timecode = `${h}:${m}:${s}:00`;

  return (
    <div className="sl-scope">
      <div className="device">
        <div className="topbar">
          <div className="brand">
            <div className={`tally-dot${screen === 'live' ? ' live' : ''}`} />
            <span className="brand-label">Studio Link</span>
          </div>
          <span className="timecode mono">{timecode}</span>
        </div>

        <div className={`screen${screen !== 'preflight' ? ' hidden' : ''}`}>
          <h1 className="display">Έλεγχος σύνδεσης</h1>
          <p className="sub">
            Πριν μπεις στο στούντιο, ελέγχουμε κάμερα, μικρόφωνο και σταθερότητα δικτύου.
          </p>

          <div className="cam-preview">
            <video ref={selfVideoRef} autoPlay muted playsInline />
            {!camReady && <div className="cam-placeholder">{camMessage}</div>}
          </div>

          <div className="test-row">
            <span className="test-label">Ταχύτητα ανεβάσματος</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: net.up != null ? `${Math.min(net.up * 4, 100)}%` : '0%' }}
                />
              </div>
              <span className="test-value ok mono">{net.up != null ? `${net.up} Mbps` : '—'}</span>
            </div>
          </div>
          <div className="test-row">
            <span className="test-label">Ταχύτητα λήψης</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: net.down != null ? `${Math.min(net.down, 100)}%` : '0%' }}
                />
              </div>
              <span className="test-value ok mono">{net.down != null ? `${net.down} Mbps` : '—'}</span>
            </div>
          </div>
          <div className="test-row">
            <span className="test-label">Jitter</span>
            <span className="test-value ok mono">{net.jitter != null ? `${net.jitter} ms` : '—'}</span>
          </div>
          <div className="test-row">
            <span className="test-label">Απώλεια πακέτων</span>
            <span className="test-value ok mono">{net.loss != null ? `${net.loss}%` : '—'}</span>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button className="btn-primary" disabled={testing} onClick={() => setScreen('waiting')}>
              {testing ? 'Έλεγχος σε εξέλιξη…' : 'Ζήτησε σύνδεση με το στούντιο'}
            </button>
            <button className="btn-ghost" onClick={runNetworkTest}>
              Επανάληψη ελέγχου
            </button>
          </div>
        </div>

        <div className={`screen${screen !== 'waiting' ? ' hidden' : ''}`}>
          <div className="waiting-wrap">
            <div className="ring" />
            <h1 className="display" style={{ fontSize: '18px' }}>
              Αναμονή έγκρισης από το στούντιο
            </h1>
            <p className="sub" style={{ marginTop: '8px' }}>
              Ο παραγωγός θα σε βάλει on air μόλις είναι έτοιμη η εκπομπή.
            </p>
            <button className="btn-primary" onClick={() => setScreen('live')}>
              Προσομοίωση έγκρισης (demo)
            </button>
          </div>
        </div>

        <div className={`studio${screen !== 'live' ? ' hidden' : ''}`}>
          <div className="return-feed">
            <div className="scanline" />
            <div className="presenter-mock">
              <div className="bars">
                <div style={{ height: '14px' }} />
                <div style={{ height: '28px' }} />
                <div style={{ height: '36px' }} />
                <div style={{ height: '20px' }} />
                <div style={{ height: '10px' }} />
              </div>
              <div className="presenter-label">Return feed — Παρουσιαστής</div>
            </div>
            <div className="live-badge">
              <div className="tally-dot live" style={{ width: '8px', height: '8px' }} /> LIVE
            </div>
            <div className="signal-badge">● ΣΤΑΘΕΡΗ ΣΥΝΔΕΣΗ</div>
            <div className="pip">
              <video ref={pipVideoRef} autoPlay muted playsInline />
              <div className="pip-tag">ΕΣΥ</div>
            </div>
            <div className="controls">
              <div className={`ctrl-btn${micOff ? ' off' : ''}`} onClick={toggleMic}>
                🎙️ Μικρόφωνο
              </div>
              <div className={`ctrl-btn${camOff ? ' off' : ''}`} onClick={toggleCam}>
                📷 Κάμερα
              </div>
              <div className="ctrl-btn leave" onClick={leaveStudio}>
                ✕ Έξοδος
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sl-scope {
          --bg: #0b0e11;
          --panel: #12171c;
          --chrome: #1c232b;
          --line: #262e36;
          --text: #edeff2;
          --text-dim: #8b96a3;
          --tally: #e8384f;
          --tally-glow: rgba(232, 56, 79, 0.45);
          --signal: #35d493;
          --caution: #f2b134;

          background: var(--bg);
          color: var(--text);
          font-family: var(--font-inter), sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .mono {
          font-family: var(--font-jetbrains-mono), monospace;
        }
        .display {
          font-family: var(--font-oswald), sans-serif;
          color: var(--text);
        }

        .device {
          width: 100%;
          max-width: 480px;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        }
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--line);
          background: var(--chrome);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tally-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--text-dim);
        }
        .tally-dot.live {
          background: var(--tally);
          box-shadow: 0 0 0 0 var(--tally-glow);
          animation: sl-pulse 1.4s infinite;
        }
        @keyframes sl-pulse {
          0% {
            box-shadow: 0 0 0 0 var(--tally-glow);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(232, 56, 79, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(232, 56, 79, 0);
          }
        }
        .brand-label {
          font-family: var(--font-oswald), sans-serif;
          letter-spacing: 0.06em;
          font-size: 13px;
          text-transform: uppercase;
          color: var(--text-dim);
        }
        .timecode {
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 13px;
          color: var(--text-dim);
        }

        .screen {
          padding: 22px;
        }
        h1.display {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 0.01em;
          margin-bottom: 6px;
        }
        .sub {
          color: var(--text-dim);
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 22px;
        }

        .test-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--line);
        }
        .test-row:last-child {
          border-bottom: none;
        }
        .test-label {
          font-size: 13px;
          color: var(--text-dim);
        }
        .test-value {
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 13px;
        }
        .test-value.ok {
          color: var(--signal);
        }

        .bar-track {
          width: 120px;
          height: 5px;
          background: var(--line);
          border-radius: 3px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: var(--signal);
          width: 0%;
          transition: width 0.6s ease;
        }

        .cam-preview {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #05070a;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
          border: 1px solid var(--line);
        }
        .cam-preview video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
        .cam-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          font-size: 13px;
          text-align: center;
          padding: 20px;
        }

        button {
          font-family: var(--font-inter), sans-serif;
          font-weight: 600;
          font-size: 14px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          padding: 13px 20px;
          width: 100%;
        }
        .btn-primary {
          background: var(--signal);
          color: #05130d;
        }
        .btn-primary:disabled {
          background: var(--line);
          color: var(--text-dim);
          cursor: not-allowed;
        }
        .btn-ghost {
          background: transparent;
          color: var(--text-dim);
          border: 1px solid var(--line);
          margin-top: 10px;
        }

        .waiting-wrap {
          text-align: center;
          padding: 30px 10px;
        }
        .ring {
          width: 64px;
          height: 64px;
          margin: 0 auto 22px;
          border-radius: 50%;
          border: 3px solid var(--line);
          border-top-color: var(--caution);
          animation: sl-spin 1s linear infinite;
        }
        @keyframes sl-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .studio {
          position: relative;
          background: #000;
        }
        .return-feed {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 13;
          background: radial-gradient(ellipse at 50% 20%, #1a2530 0%, #05070a 70%);
          overflow: hidden;
        }
        .scanline {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.02) 0px,
            rgba(255, 255, 255, 0.02) 1px,
            transparent 1px,
            transparent 3px
          );
        }
        .presenter-mock {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }
        .bars {
          display: flex;
          gap: 4px;
          align-items: flex-end;
          height: 40px;
        }
        .bars div {
          width: 4px;
          background: var(--signal);
          border-radius: 2px;
          animation: sl-wave 1.2s ease-in-out infinite;
        }
        .bars div:nth-child(2) {
          animation-delay: 0.1s;
        }
        .bars div:nth-child(3) {
          animation-delay: 0.2s;
        }
        .bars div:nth-child(4) {
          animation-delay: 0.3s;
        }
        .bars div:nth-child(5) {
          animation-delay: 0.4s;
        }
        @keyframes sl-wave {
          0%,
          100% {
            height: 8px;
          }
          50% {
            height: 36px;
          }
        }
        .presenter-label {
          font-family: var(--font-oswald), sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 12px;
          color: var(--text-dim);
        }

        .live-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(6px);
          padding: 6px 10px;
          border-radius: 8px;
          font-family: var(--font-oswald), sans-serif;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--tally);
        }
        .signal-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(6px);
          padding: 6px 10px;
          border-radius: 8px;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 11px;
          color: var(--signal);
        }
        .pip {
          position: absolute;
          bottom: 76px;
          right: 14px;
          width: 34%;
          aspect-ratio: 3 / 4;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
          background: #0d1319;
        }
        .pip video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
        .pip-tag {
          position: absolute;
          bottom: 4px;
          left: 6px;
          font-size: 9px;
          color: var(--text-dim);
          font-family: var(--font-jetbrains-mono), monospace;
        }

        .controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          gap: 10px;
          padding: 14px;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.85), transparent);
        }
        .ctrl-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--text);
          padding: 10px;
          border-radius: 10px;
          font-size: 10px;
          cursor: pointer;
        }
        .ctrl-btn.off {
          background: var(--tally);
          color: #fff;
        }
        .ctrl-btn.leave {
          background: var(--tally);
          color: #fff;
        }

        .hidden {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
