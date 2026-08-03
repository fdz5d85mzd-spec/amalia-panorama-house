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
        // SINGLE_LINE (7): περιμένει μία μικρή γραμμή κειμένου (π.χ. "10", "A")
        // αντί για SINGLE_CHAR που απαιτούσε ΑΚΡΙΒΩΣ έναν χαρακτήρα και
        // απέτυχε σχεδόν πάντα σε ranks με 2 ψηφία ή δίπλα σε σύμβολο φιγούρας.
        tessedit_pageseg_mode: '7' as PSM,
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

// Ασπρόμαυρο + τέντωμα αντίθεσης πάνω στο ίδιο canvas — βοηθά σημαντικά το
// OCR σε πλάνα με έγχρωμο φόντο (πράσινο τσόχα) ή χαμηλή αντίθεση, χωρίς τον
// κίνδυνο ενός λάθος-κατεύθυνσης binarize threshold.
function boostContrast(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;
  if (width === 0 || height === 0) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const gray = new Uint8ClampedArray(width * height);
  let min = 255;
  let max = 0;
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    gray[p] = g;
    if (g < min) min = g;
    if (g > max) max = g;
  }
  const range = Math.max(max - min, 1);
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const stretched = ((gray[p] - min) / range) * 255;
    data[i] = stretched;
    data[i + 1] = stretched;
    data[i + 2] = stretched;
  }
  ctx.putImageData(imageData, 0, 0);
}

export async function recognizeRankFromCanvas(canvas: HTMLCanvasElement): Promise<RecognitionResult> {
  boostContrast(canvas);
  const worker = await getWorker();
  const { data } = await worker.recognize(canvas);
  const raw = data.text.trim();
  return {
    rank: normalizeToRank(raw),
    raw,
    confidence: data.confidence,
  };
}
