import React from 'react';
import { Wifi, Clock, Music } from 'lucide-react';

export default function FooterInfo() {
  return (
    <footer className="w-full max-w-4xl mx-auto mt-16 pb-12 px-4 select-none">
      <div className="bg-[#121212] rounded-xl p-6 border border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Horarios */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-300 font-sans text-xs font-semibold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Horarios</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              Martes a Domingo: 18:00 – 03:00
            </p>
            <p className="text-[11px] text-zinc-500 font-sans">
              Lunes cerrado
            </p>
          </div>

          {/* Wifi */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-300 font-sans text-xs font-semibold uppercase tracking-wider">
              <Wifi className="w-3.5 h-3.5 text-zinc-400" />
              <span>Wifi Clientes</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              Red: <span className="text-zinc-200 font-medium">DALI_ROCK_LOUNGE</span>
            </p>
            <p className="text-xs text-zinc-500 font-sans">
              Clave: <span className="text-zinc-300">SURREAL1989</span>
            </p>
          </div>

          {/* Esencia */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-300 font-sans text-xs font-semibold uppercase tracking-wider">
              <Music className="w-3.5 h-3.5 text-zinc-400" />
              <span>Dalí Bar</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans italic">
              "Buen rock and roll, cócteles de autor y cervezas bien frías."
            </p>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-6 pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
          <span>&copy; {new Date().getFullYear()} Dalí Bar</span>
          <span>Carta Digital</span>
        </div>
      </div>
    </footer>
  );
}
