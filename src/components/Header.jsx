import React from 'react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';

export default function Header() {
  return (
    <header className="relative w-full pt-8 pb-4 px-4 flex flex-col items-center justify-center text-center select-none">
      {/* Logo Oficial integrado con mix-blend-screen sin bordes ni resplandores artificiales */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center"
      >
        <img
          src={logoImg}
          alt="Dalí Bar"
          className="h-32 w-32 sm:h-36 sm:w-36 object-contain mx-auto mix-blend-screen select-none pointer-events-none"
        />

        {/* Título de acento sutil en cursiva de neón */}
        <h1 className="font-neon text-2xl sm:text-3xl text-zinc-100 mt-1 drop-shadow-sm">
          Dalí Bar
        </h1>

        <p className="font-sans text-xs tracking-widest text-zinc-400 uppercase font-medium mt-0.5">
          Carta de Bebidas & Cócteles
        </p>
      </motion.div>
    </header>
  );
}
