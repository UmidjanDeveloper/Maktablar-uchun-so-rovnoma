'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

/** Bitta konfetti bo'lagining tasodifiy xususiyatlari */
interface Piece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
  size: number;
  shape: 'square' | 'circle';
}

/** Konfetti ranglari — tuman gerbining palitrasidan */
const COLORS = ['#F2B01E', '#2E9B3F', '#17559B', '#C21E7A', '#D89506', '#7A3FBF', '#0E7C86'];

interface ConfettiProps {
  /** Bo'laklar soni — eski kompyuterlarda kamaytirish mumkin */
  count?: number;
}

/**
 * Framer Motion yordamida yasalgan yengil konfetti animatsiyasi.
 * Canvas yoki tashqi kutubxona ishlatilmaydi — eski kompyuterlarda
 * ham ravon ishlashi uchun.
 */
export function Confetti({ count = 60 }: ConfettiProps) {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 2.4 + Math.random() * 1.8,
        rotate: Math.random() * 720 - 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 7 + Math.random() * 8,
        shape: Math.random() > 0.5 ? 'square' : 'circle',
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: '-10vh', x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: '110vh',
            x: [0, piece.rotate > 0 ? 40 : -40, 0],
            opacity: [0, 1, 1, 0],
            rotate: piece.rotate,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
            times: [0, 0.15, 0.85, 1],
          }}
          style={{
            position: 'absolute',
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
