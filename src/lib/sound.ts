/**
 * ============================================================
 *  TABRIK OVOZLARI
 *
 *  Anketa yakunida o'quvchi tanlagan kasb yo'nalishiga mos ovoz
 *  chalinadi: militsiya tanlasa — sirena, shifokor tanlasa —
 *  yurak urishi, dasturchi tanlasa — raqamli signal.
 *
 *  Ovozlar brauzerning o'zida (Web Audio API) generatsiya qilinadi.
 *  Sabab: internet kerak emas, saytga bir kilobayt ham qo'shmaydi,
 *  eski kompyuterlarda ham darhol chalinadi.
 *
 *  LEKIN: agar `public/tabrik.mp3` fayli qo'yilgan bo'lsa, yakuniy
 *  ekranda O'SHA musiqa chalinadi va generatsiya qilingan ovozlar
 *  umuman ishlatilmaydi. Fayl bo'lmasa yoki chalinmasa — generatsiya
 *  qilingan tabrikka qaytadi, ya'ni ekran hech qachon jim qolmaydi.
 *
 *  Kompyuter sinfida shovqin bo'lmasligi uchun ovozni o'chirib
 *  qo'yish mumkin — tanlov brauzerda saqlanadi.
 * ============================================================
 */
import type { SoundName } from './constants';

const MUTE_KEY = 'kelajak_egasi_muted';

/** Ovoz o'chirilganmi? */
export function isMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Ovozni yoqish/o'chirish */
export function setMuted(muted: boolean): void {
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    // Xotira ishlamasa — ovoz shu seans uchun yoqiq qoladi
  }
}

/** AudioContext'ni faqat kerak bo'lganda yaratamiz */
let ctx: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    // Brauzer kontekstni to'xtatib qo'ygan bo'lsa qayta yoqamiz
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface ToneOptions {
  /** Chastota (Gs) yoki chastota o'zgarishi [boshi, oxiri] */
  freq: number | [number, number];
  /** Boshlanish vaqti (soniya, hozirdan) */
  at: number;
  /** Davomiyligi (soniya) */
  dur: number;
  /** Balandligi 0..1 */
  gain?: number;
  type?: OscillatorType;
}

/** Bitta ohang chaladi */
function tone(ac: AudioContext, o: ToneOptions): void {
  const t0 = ac.currentTime + o.at;
  const osc = ac.createOscillator();
  const amp = ac.createGain();

  osc.type = o.type ?? 'sine';

  if (Array.isArray(o.freq)) {
    osc.frequency.setValueAtTime(o.freq[0], t0);
    osc.frequency.linearRampToValueAtTime(o.freq[1], t0 + o.dur);
  } else {
    osc.frequency.setValueAtTime(o.freq, t0);
  }

  // Yumshoq kirish va chiqish — "chirt" etgan ovoz bo'lmasligi uchun
  const peak = o.gain ?? 0.16;
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(peak, t0 + Math.min(0.04, o.dur / 3));
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);

  osc.connect(amp);
  amp.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + o.dur + 0.05);
}

/** Nota chastotalari (A4 = 440 Gs) */
const NOTE = {
  C3: 130.81, G3: 196.0,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99,
  C6: 1046.5, E6: 1318.5, G6: 1568.0, C7: 2093.0,
};

/**
 * Har bir yo'nalish uchun ovoz retsepti.
 *
 * `t0` — boshlanish vaqti. Retsept fanfaradan keyin chalinishi kerak,
 * aks holda ikkalasi bir vaqtda yangrab, ikkalasi ham eshitilmay qoladi.
 */
const RECIPES: Record<SoundName, (ac: AudioContext, t0: number) => void> = {
  /** Militsiya, harbiy, qutqaruvchi — sirena */
  siren: (ac, t0) => {
    for (let i = 0; i < 3; i++) {
      const at = t0 + i * 0.42;
      tone(ac, { freq: [660, 990], at, dur: 0.2, type: 'sawtooth', gain: 0.1 });
      tone(ac, { freq: [990, 660], at: at + 0.21, dur: 0.2, type: 'sawtooth', gain: 0.1 });
    }
  },

  /** Shifokor, hamshira — yurak urishi va tinch signal */
  heartbeat: (ac, t0) => {
    for (let i = 0; i < 3; i++) {
      const at = t0 + i * 0.62;
      tone(ac, { freq: 62, at, dur: 0.14, type: 'sine', gain: 0.34 });
      tone(ac, { freq: 52, at: at + 0.2, dur: 0.18, type: 'sine', gain: 0.26 });
    }
    tone(ac, { freq: NOTE.E5, at: t0 + 1.85, dur: 0.5, gain: 0.12 });
  },

  /** Dasturchi, sun'iy intellekt — raqamli signallar */
  digital: (ac, t0) => {
    const seq = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6];
    seq.forEach((f, i) =>
      tone(ac, { freq: f, at: t0 + i * 0.1, dur: 0.09, type: 'square', gain: 0.07 })
    );
    tone(ac, { freq: [NOTE.C5, NOTE.C6], at: t0 + 0.46, dur: 0.42, type: 'square', gain: 0.06 });
  },

  /** Muhandis, quruvchi, mexanizator — mexanizm ovozi */
  machine: (ac, t0) => {
    for (let i = 0; i < 4; i++) {
      tone(ac, { freq: 120 + i * 18, at: t0 + i * 0.13, dur: 0.1, type: 'square', gain: 0.09 });
    }
    tone(ac, { freq: [180, 520], at: t0 + 0.56, dur: 0.6, type: 'sawtooth', gain: 0.08 });
  },

  /** Rassom, musiqachi, oshpaz — ko'tarinki ohang */
  melody: (ac, t0) => {
    const seq = [NOTE.C5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.C6];
    seq.forEach((f, i) =>
      tone(ac, { freq: f, at: t0 + i * 0.13, dur: 0.34, type: 'triangle', gain: 0.13 })
    );
  },

  /** O'qituvchi, olim, sudya — maktab qo'ng'irog'i */
  bell: (ac, t0) => {
    [0, 0.34, 0.68].forEach((at) => {
      tone(ac, { freq: NOTE.G5, at: t0 + at, dur: 0.55, type: 'sine', gain: 0.13 });
      tone(ac, { freq: NOTE.C6, at: t0 + at, dur: 0.45, type: 'sine', gain: 0.07 });
    });
  },

  /** Tadbirkor, bank xodimi — tanga jarangi */
  coins: (ac, t0) => {
    [0, 0.09, 0.19, 0.3].forEach((at, i) => {
      tone(ac, { freq: NOTE.C6 + i * 90, at: t0 + at, dur: 0.16, type: 'triangle', gain: 0.1 });
    });
    tone(ac, { freq: NOTE.G5, at: t0 + 0.44, dur: 0.5, type: 'sine', gain: 0.12 });
  },

  /** Uchuvchi, dron uchuvchisi, aviatsiya texnigi — parvoz */
  flight: (ac, t0) => {
    // Pastdan yuqoriga uzun ko'tarilish — samolyot ko'tarilgandek
    tone(ac, { freq: [140, 900], at: t0, dur: 1.1, type: 'sine', gain: 0.1 });
    tone(ac, { freq: [70, 450], at: t0 + 0.05, dur: 1.1, type: 'triangle', gain: 0.07 });
    // Yuqorida ochilib ketadigan nota
    tone(ac, { freq: NOTE.G5, at: t0 + 0.95, dur: 0.7, type: 'sine', gain: 0.1 });
    tone(ac, { freq: NOTE.C6, at: t0 + 1.05, dur: 0.6, type: 'sine', gain: 0.07 });
  },

  /** Sportchi, murabbiy — stadion g'alabasi */
  victory: (ac, t0) => {
    // Hakam hushtagi
    tone(ac, { freq: [2200, 2600], at: t0, dur: 0.1, type: 'square', gain: 0.05 });
    tone(ac, { freq: [2600, 2200], at: t0 + 0.1, dur: 0.12, type: 'square', gain: 0.05 });
    // G'alaba signali — takrorlanuvchi ko'tarinki uchlik
    [0.35, 0.62].forEach((at) => {
      tone(ac, { freq: NOTE.C5, at: t0 + at, dur: 0.14, type: 'square', gain: 0.09 });
      tone(ac, { freq: NOTE.E5, at: t0 + at + 0.08, dur: 0.14, type: 'square', gain: 0.09 });
      tone(ac, { freq: NOTE.G5, at: t0 + at + 0.16, dur: 0.22, type: 'square', gain: 0.1 });
    });
    tone(ac, { freq: NOTE.C6, at: t0 + 0.92, dur: 0.7, type: 'triangle', gain: 0.12 });
  },
};

/**
 * Barcha yo'nalishlar uchun umumiy tantanavor kirish.
 *
 * Uch qatlamdan iborat, chunki bitta akkord "bayram" hissini bermaydi:
 *   1. KO'TARILISH — qisqa yugurik nota, e'tiborni tortadi
 *   2. AKKORD      — bas bilan birga to'liq major akkordi
 *   3. JIMIRLASH   — yuqori notalar sharshara bo'lib tushadi
 *
 * Har bir notaning balandligi ataylab past (0.05-0.13): ular
 * qo'shilganda ovoz to'liq chiqadi, lekin karnayni "yorib" yubormaydi.
 */
function fanfare(ac: AudioContext): void {
  // 1. Ko'tarilish
  [NOTE.G4, NOTE.C5, NOTE.E5].forEach((f, i) =>
    tone(ac, { freq: f, at: i * 0.075, dur: 0.16, type: 'triangle', gain: 0.09 })
  );

  // 2. Katta akkord — bas ostidan ushlab turadi
  const at = 0.24;
  tone(ac, { freq: NOTE.C3, at, dur: 1.7, type: 'sine', gain: 0.13 });
  tone(ac, { freq: NOTE.G3, at: at + 0.02, dur: 1.6, type: 'sine', gain: 0.08 });
  [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.E5].forEach((f, i) =>
    tone(ac, { freq: f, at: at + i * 0.035, dur: 1.5 - i * 0.1, type: 'triangle', gain: 0.075 })
  );

  // 3. Jimirlash — yuqoridan tushuvchi yorug' notalar
  [NOTE.G5, NOTE.C6, NOTE.E6, NOTE.G6, NOTE.C7].forEach((f, i) =>
    tone(ac, { freq: f, at: 0.5 + i * 0.085, dur: 0.5, type: 'sine', gain: 0.055 })
  );
}

/** Generatsiya qilingan tabrik: fanfara + kasbga xos ovoz */
function synthCelebration(sound: SoundName): void {
  const ac = audioContext();
  if (!ac) return;

  try {
    fanfare(ac);
    // Kasbga xos ovoz fanfara cho'qqisidan keyin kiradi
    RECIPES[sound]?.(ac, 1.15);
  } catch {
    // Ovoz chalinmasa ham anketa muvaffaqiyatli yuborilgan — muhimi shu
  }
}

/* ------------------------------------------------------------------
 *  O'z musiqangiz
 *
 *  `public/tabrik.mp3` faylini qo'ysangiz, yakuniy ekranda o'sha
 *  chalinadi. Fayl bo'lmasa — yuqoridagi generatsiya qilingan tabrik
 *  ishlaydi, ya'ni faylni almashtirish uchun kodga tegish shart emas.
 * ------------------------------------------------------------------ */

const TRACK_URL = '/tabrik.mp3';

let track: HTMLAudioElement | null = null;

/**
 * Fayl umuman yo'qmi?
 *
 *   null  — hali tekshirilmagan
 *   false — yo'q yoki brauzer o'qiy olmadi, boshqa urinilmaydi
 *
 * Bu bayroq bir marta hisoblanadi: har safar 404 so'rovini
 * takrorlash kioskda ortiqcha yuk.
 */
let trackYoq = false;

/**
 * Fayldagi musiqani chaladi.
 * `true` — chalindi, `false` — chalinmadi (generatsiyaga qaytish kerak).
 */
function playTrack(): Promise<boolean> {
  if (typeof window === 'undefined' || trackYoq) return Promise.resolve(false);

  try {
    if (!track) {
      track = new Audio(TRACK_URL);
      track.preload = 'auto';
      track.volume = 0.85;
    }
    track.currentTime = 0;

    const started = track.play();
    // Eski brauzerlar `play()` dan Promise qaytarmaydi
    if (!started) return Promise.resolve(true);

    return started.then(
      () => true,
      (xato: unknown) => {
        /*
         * Brauzer avtomatik chalishni taqiqlagan bo'lsa (NotAllowedError)
         * fayl aybdor emas — uni "yo'q" deb belgilamaymiz, aks holda
         * keyingi o'quvchilarga ham chalinmay qoladi.
         */
        const nomi = (xato as { name?: string } | null)?.name;
        if (nomi !== 'NotAllowedError') {
          trackYoq = true;
          track = null;
        }
        return false;
      }
    );
  } catch {
    trackYoq = true;
    return Promise.resolve(false);
  }
}

/**
 * Tabrik ovozini chaladi.
 *
 * Avval `public/tabrik.mp3` sinab ko'riladi; u bo'lmasa generatsiya
 * qilingan tabrik chalinadi. Ovoz o'chirilgan bo'lsa yoki brauzer
 * qo'llab-quvvatlamasa — jimgina o'tkazib yuboriladi.
 */
export function playCelebration(sound: SoundName): void {
  if (isMuted()) return;

  void playTrack().then((chalindi) => {
    if (!chalindi) synthCelebration(sound);
  });
}

/**
 * Chalinayotgan musiqani to'xtatadi.
 *
 * Kerak bo'ladigan joylar: o'quvchi ovozni o'chirsa va ekran
 * yangi anketaga qaytsa — musiqa keyingi bolaning ustidan
 * chalinib turmasligi kerak.
 */
export function stopCelebration(): void {
  if (!track) return;
  try {
    track.pause();
    track.currentTime = 0;
  } catch {
    // e'tiborsiz
  }
}

/** Tugma bosilganda qisqa signal (ovoz yoqilganini bildirish uchun) */
export function playTick(): void {
  const ac = audioContext();
  if (!ac) return;
  try {
    tone(ac, { freq: NOTE.E5, at: 0, dur: 0.12, type: 'triangle', gain: 0.1 });
  } catch {
    // e'tiborsiz
  }
}
