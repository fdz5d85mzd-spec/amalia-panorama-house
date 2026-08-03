import type { CardDestination } from './types';

export interface Roi {
  id: string;
  xPct: number; // top-left, 0..1 σχετικά με το container
  yPct: number;
  wPct: number;
  hPct: number;
  role: CardDestination;
}

export const ROI_SIZE_PRESETS: Record<'S' | 'M' | 'L', { w: number; h: number }> = {
  S: { w: 0.06, h: 0.09 },
  M: { w: 0.09, h: 0.13 },
  L: { w: 0.13, h: 0.19 },
};

// Μετατρέπει ένα ROI (ποσοστά πάνω στο container) σε πηγαίο ορθογώνιο πάνω
// στο πραγματικό frame του video, λαμβάνοντας υπόψη το letterboxing που
// δημιουργεί το object-contain (το video δεν γεμίζει πάντα όλο το container).
export function roiToSourceRect(
  roi: Roi,
  container: { width: number; height: number },
  video: { videoWidth: number; videoHeight: number }
): { sx: number; sy: number; sw: number; sh: number } | null {
  const { width: cw, height: ch } = container;
  const { videoWidth: vw, videoHeight: vh } = video;
  if (!cw || !ch || !vw || !vh) return null;

  const scale = Math.min(cw / vw, ch / vh);
  const displayedW = vw * scale;
  const displayedH = vh * scale;
  const offsetX = (cw - displayedW) / 2;
  const offsetY = (ch - displayedH) / 2;

  const roiXpx = roi.xPct * cw;
  const roiYpx = roi.yPct * ch;
  const roiWpx = roi.wPct * cw;
  const roiHpx = roi.hPct * ch;

  const dx = roiXpx - offsetX;
  const dy = roiYpx - offsetY;

  const sx = dx / scale;
  const sy = dy / scale;
  const sw = roiWpx / scale;
  const sh = roiHpx / scale;

  // clamp μέσα στα όρια του πηγαίου frame
  const clampedSx = Math.max(0, Math.min(sx, vw));
  const clampedSy = Math.max(0, Math.min(sy, vh));
  const clampedSw = Math.max(0, Math.min(sw, vw - clampedSx));
  const clampedSh = Math.max(0, Math.min(sh, vh - clampedSy));
  if (clampedSw < 2 || clampedSh < 2) return null;

  return { sx: clampedSx, sy: clampedSy, sw: clampedSw, sh: clampedSh };
}
