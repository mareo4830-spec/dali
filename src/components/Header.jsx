import React from 'react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';

export default function Header() {
  return (
    <header className="relative w-full pt-6 pb-3 px-2 select-none">
      {/* Logo Oficial más pequeño situado en la esquina superior izquierda */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute top-2 left-2 sm:top-3 sm:left-4 z-20"
      >
        <img
          src={logoImg}
          alt="Dalí Bar"
          className="h-14 w-14 sm:h-16 sm:w-16 object-contain mix-blend-screen select-none pointer-events-none"
        />
      </motion.div>

      {/* Título Principal Centrado */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center text-center pt-2"
      >
        <h1 className="font-neon text-3xl sm:text-4xl text-zinc-100 drop-shadow-sm tracking-wide">
          Dalí Bar
        </h1>

        <p className="font-sans text-[11px] sm:text-xs tracking-[0.25em] text-zinc-400 uppercase font-medium mt-1">
          Carta de Bebidas & Cócteles
        </p>
      </motion.div>
    </header>
  );
}

