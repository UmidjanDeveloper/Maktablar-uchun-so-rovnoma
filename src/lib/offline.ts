/**
 * ============================================================
 *  Oflayn rejim uchun navbat (queue)
 *  Maktab kompyuterlarida internet uzilib qolsa, anketa
 *  localStorage ga saqlanadi va aloqa tiklanganda avtomatik
 *  serverga yuboriladi.
 * ============================================================
 */
import type { StudentInput } from './validation';

const QUEUE_KEY = 'kelajak_egasi_offline_queue';

export interface QueuedSubmission {
  /** Navbatdagi yozuvning lokal identifikatori */
  localId: string;
  payload: StudentInput;
  /** Navbatga qo'shilgan vaqt */
  queuedAt: string;
  /** Nechta marta yuborishga urinilgan */
  attempts: number;
}

/** Brauzer muhitida ekanini tekshiradi */
function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

/** Navbatdagi barcha yozuvlarni o'qiydi */
export function readQueue(): QueuedSubmission[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QueuedSubmission[]) : [];
  } catch {
    return [];
  }
}

/** Navbatni to'liq qayta yozadi */
function writeQueue(items: QueuedSubmission[]): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  } catch {
    // Xotira to'lgan bo'lsa — jimgina o'tkazib yuboramiz
  }
}

/** Anketani navbatga qo'shadi */
export function enqueue(payload: StudentInput): QueuedSubmission {
  const item: QueuedSubmission = {
    localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    payload,
    queuedAt: new Date().toISOString(),
    attempts: 0,
  };
  const queue = readQueue();
  queue.push(item);
  writeQueue(queue);
  return item;
}

/** Navbatdan bitta yozuvni o'chiradi */
export function dequeue(localId: string): void {
  writeQueue(readQueue().filter((i) => i.localId !== localId));
}

/** Yozuvning urinishlar sonini oshiradi */
function bumpAttempts(localId: string): void {
  writeQueue(
    readQueue().map((i) => (i.localId === localId ? { ...i, attempts: i.attempts + 1 } : i))
  );
}

/** Navbatdagi yozuvlar soni */
export function queueSize(): number {
  return readQueue().length;
}

/**
 * Ayni damda ketayotgan sinxronizatsiya.
 * Brauzer `online` hodisasini bir necha marta yuborishi mumkin — himoyasiz
 * qoldirilsa, bitta anketa ikki marta jo'natilib, baza ikkilanib ketardi.
 */
let activeSync: Promise<SyncResult> | null = null;

/** Sinxronizatsiya natijasi */
export interface SyncResult {
  sent: number;
  failed: number;
  remaining: number;
}

/**
 * Navbatdagi barcha anketalarni serverga yuborishga urinadi.
 * Muvaffaqiyatli yuborilganlar (va takror deb rad etilganlar)
 * navbatdan o'chiriladi.
 */
export function syncQueue(): Promise<SyncResult> {
  // Allaqachon ishlayotgan bo'lsa — o'shanga qo'shilamiz, yangisini boshlamaymiz
  if (activeSync) return activeSync;

  activeSync = runSync().finally(() => {
    activeSync = null;
  });
  return activeSync;
}

/** Sinxronizatsiyaning asosiy mantiqi */
async function runSync(): Promise<SyncResult> {
  const queue = readQueue();
  let sent = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
      });

      // 2xx — qabul qilindi; 409 — takroriy anketa; 422 — noto'g'ri ma'lumot.
      // Uchala holatda ham navbatda saqlashning ma'nosi yo'q.
      if (res.ok || res.status === 409 || res.status === 422) {
        dequeue(item.localId);
        sent += 1;
      } else {
        bumpAttempts(item.localId);
        failed += 1;
      }
    } catch {
      bumpAttempts(item.localId);
      failed += 1;
    }
  }

  return { sent, failed, remaining: queueSize() };
}
