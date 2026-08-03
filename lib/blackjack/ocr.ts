import type { Worker as TesseractWorker, PSM } from 'tesseract.js';
import type { Rank } from './types';

// OCR engine (tesseract.js) φορτώνεται δυναμικά μόνο όταν χρειαστεί —
// είναι βαριά βιβλιοθήκη (WASM + language data) και τρέχει μόνο στον browser.
let workerPromise: Promise<TesseractWorker> | null = null;

async function getWorker(): Promise<TesseractWorker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');
      await worker.setParameters({
        tessedit_char_whitelist: 'AJQK0123456789',
        tessedit_pageseg_mode: '10' as PSM, // SINGLE_CHAR-ish σάρωση μικρής περιοχής
      });
      return worker;
    })();
  }
  return workerPromise;
}

export async function terminateOcr(): Promise<void> {
  if (!workerPromise) return;
  const worker = await workerPromise;
  workerPromise = null;
  await worker.terminate();
}

export interface RecognitionResult {
  rank: Rank | null;
  raw: string;
  confidence: number;
}

export function normalizeToRank(rawInput: string): Rank | null {
  const raw = rawInput.replace(/[^0-9AJQK]/gi, '').toUpperCase();
  if (!raw) return null;
  if (raw.includes('10')) return '10';
  if (raw.startsWith('A')) return 'A';
  if (raw.startsWith('J') || raw.startsWith('Q') || raw.startsWith('K')) return '10';
  const digitMatch = raw.match(/[2-9]/);
  if (digitMatch) return digitMatch[0] as Rank;
  return null;
}

export async function recognizeRankFromCanvas(canvas: HTMLCanvasElement): Promise<RecognitionResult> {
  const worker = await getWorker();
  const { data } = await worker.recognize(canvas);
  const raw = data.text.trim();
  return {
    rank: normalizeToRank(raw),
    raw,
    confidence: data.confidence,
  };
}
