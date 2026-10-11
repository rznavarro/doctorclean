import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Calculator, HelpCircle } from 'lucide-react';
import { BUSINESS } from '../data';

type CarpetType = 'muro-a-muro' | 'decorativa';

const RATES = {
  'muro-a-muro': {
    name: 'muro a muro',
    label: 'Muro a muro',
    pricePerM2: 3500,
    minM2: 15,
  },
  'decorativa': {
    name: 'decorativa',
    label: 'Decorativa',
    pricePerM2: 7500,
    minM2: 8,
  },
};

const ALL_COMMUNES = [
  ...BUSINESS.primaryCommunes,
  'Otra comuna RM',
];

export const PriceCalculator: React.FC = () => {
  const [carpetType, setCarpetType] = useState<CarpetType>('muro-a-muro');
  const [m2, setM2] = useState<number>(20);
  const [selectedCommune, setSelectedCommune] = useState<string>('Las Condes');

  const m2InputId = useId();
  const m2SliderId = useId();

  const currentRate = RATES[carpetType];
  const effectiveM2 = Math.max(m2, currentRate.minM2);
  const totalPrice = effectiveM2 * currentRate.pricePerM2;
  const isBelowMin = m2 < currentRate.minM2;
  const isOtherCommune = selectedCommune === 'Otra comuna RM';

  // Format currency with thousands separator (e.g. 70.000)
  const formattedPrice = totalPrice.toLocaleString('es-CL');

  // WhatsApp message generation according to Section 4
  const buildWhatsAppMessage = () => {
    let communePart = '';
    if (selectedCommune) {
      communePart = ` en ${selectedCommune}`;
    }
    return `Hola, quiero cotizar lavado de alfombra ${currentRate.name}, aprox. ${m2} m²${communePart}. Estimado web: $${formattedPrice} + IVA.`;
  };

  const whatsappHref = `https://wa.me/56945431315?text=${encodeURIComponent(buildWhatsAppMessage())}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left Column: Editorial Price Table */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-3 block">
            LISTA DE PRECIOS BASE
          </span>
          <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111] mb-6">
            Precios claros, sin letra chica.
          </h3>

          <div className="border-t border-gray-300">
            {/* Table Header */}
            <div className="grid grid-cols-12 py-3 border-b border-gray-300 font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500">
              <span className="col-span-6">TIPO</span>
              <span className="col-span-3 text-right">PRECIO</span>
              <span className="col-span-3 text-right">MÍNIMO</span>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-12 py-4 border-b border-gray-200 items-baseline">
              <div className="col-span-6 pr-2">
                <span className="font-medium text-[#111] block text-[15px]">Muro a muro</span>
                <span className="text-xs text-gray-500">Fija, de pared a pared</span>
              </div>
              <div className="col-span-3 text-right font-mono text-sm tabular-nums font-medium text-[#111]">
                $3.500<span className="text-[11px] font-normal text-gray-500 block">/m² + IVA</span>
              </div>
              <div className="col-span-3 text-right font-mono text-sm tabular-nums text-gray-600">
                15 m²
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-12 py-4 border-b border-gray-200 items-baseline">
              <div className="col-span-6 pr-2">
                <span className="font-medium text-[#111] block text-[15px]">Decorativa</span>
                <span className="text-xs text-gray-500">Móvil, sobre piso existente</span>
              </div>
              <div className="col-span-3 text-right font-mono text-sm tabular-nums font-medium text-[#111]">
                $7.500<span className="text-[11px] font-normal text-gray-500 block">/m² + IVA</span>
              </div>
              <div className="col-span-3 text-right font-mono text-sm tabular-nums text-gray-600">
                8 m²
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-md bg-gray-100 border border-gray-200 text-xs text-gray-700 leading-relaxed">
            <span className="font-medium text-[#111] block mb-1">Tapiz, colchones y decapado:</span>
            Te cotizamos rápidamente por WhatsApp enviando una foto o video del estado actual.
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 font-mono text-[11px] text-gray-500 leading-relaxed">
          * La sanitización profunda y desodorización enzimática están incluidas en todos los lavados sin recargo.
        </div>
      </div>

      {/* Right Column: Dark Panel Calculator */}
      <div className="lg:col-span-7 bg-[#0a0a0a] text-white p-6 md:p-8 rounded-md border border-[#222]">
        <div className="flex items-center justify-between pb-6 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span className="font-mono text-xs tracking-[0.15em] uppercase text-gray-300">
              CALCULADORA DE ALFOMBRAS
            </span>
          </div>
          <span className="font-mono text-[11px] text-gray-500">ESTIMADO INMEDIATO</span>
        </div>

        {/* Step 1: Type Segmented Control */}
        <div className="mt-6">
          <label className="block font-mono text-[11px] uppercase tracking-wider text-gray-400 mb-2">
            1. Tipo de alfombra
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#161616] rounded-md border border-[#2a2a2a]">
            <button
              type="button"
              onClick={() => setCarpetType('muro-a-muro')}
              className={`py-2.5 px-4 rounded text-xs md:text-sm font-medium transition-all duration-200 ${
                carpetType === 'muro-a-muro'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Muro a muro
            </button>
            <button
              type="button"
              onClick={() => setCarpetType('decorativa')}
              className={`py-2.5 px-4 rounded text-xs md:text-sm font-medium transition-all duration-200 ${
                carpetType === 'decorativa'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Decorativa
            </button>
          </div>
        </div>

        {/* Step 2: Surface m² Slider & Numeric Input */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor={m2InputId} className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
              2. Superficie aproximada (m²)
            </label>
            <div className="flex items-center gap-1 font-mono text-sm">
              <input
                id={m2InputId}
                type="number"
                min="1"
                max="200"
                value={m2}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setM2(isNaN(val) ? 1 : Math.max(1, Math.min(200, val)));
                }}
                className="w-16 bg-[#161616] border border-[#333] rounded px-2 py-1 text-center font-mono text-white text-sm focus:border-white focus:outline-none"
              />
              <span className="text-gray-400 text-xs">m²</span>
            </div>
          </div>

          <input
            id={m2SliderId}
            type="range"
            min="1"
            max="120"
            value={m2}
            onChange={(e) => setM2(parseInt(e.target.value, 10))}
            aria-label="Superficie en metros cuadrados"
            className="w-full h-1.5 bg-[#222] rounded-lg appearance-none cursor-pointer accent-white"
          />

          <div className="flex items-center gap-1.5 mt-2 text-[12px] text-gray-400">
            <HelpCircle className="w-3.5 h-3.5 text-gray-500 shrink-0" aria-hidden="true" />
            <span>¿No sabes los m²? Cuéntanos cuántas habitaciones y te ayudamos por WhatsApp.</span>
          </div>
        </div>

        {/* Step 3: Commune Selection */}
        <div className="mt-6">
          <label className="block font-mono text-[11px] uppercase tracking-wider text-gray-400 mb-2">
            3. Comuna de atención
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_COMMUNES.map((commune) => {
              const active = selectedCommune === commune;
              return (
                <button
                  key={commune}
                  type="button"
                  onClick={() => setSelectedCommune(commune)}
                  className={`text-[12px] font-mono py-1.5 px-3 rounded-full transition-colors ${
                    active
                      ? 'bg-white text-black font-medium'
                      : 'bg-[#181818] border border-[#2c2c2c] text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {commune}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Area */}
        <div
          className="mt-8 pt-6 border-t border-[#222]"
          aria-live="polite"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-gray-400">
              VALOR ESTIMADO
            </span>
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1 font-mono">
                <span className="text-3xl md:text-4xl lg:text-5xl font-light tabular-nums tracking-tight text-white">
                  ${formattedPrice}
                </span>
                <span className="text-sm font-normal text-gray-400">+ IVA</span>
              </div>
            </div>
          </div>

          {/* Conditional badges/notices */}
          <div className="min-h-[24px] mt-2">
            <AnimatePresence mode="wait">
              {isBelowMin && (
                <motion.p
                  key="min-alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="font-mono text-[11px] text-amber-300"
                >
                  * Se aplica el mínimo de servicio de {currentRate.minM2} m² (${(currentRate.minM2 * currentRate.pricePerM2).toLocaleString('es-CL')} + IVA).
                </motion.p>
              )}
              {isOtherCommune && (
                <motion.p
                  key="commune-alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="font-mono text-[11px] text-gray-300"
                >
                  * Para {selectedCommune} puede aplicar recargo por traslado según la distancia.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* WhatsApp Action Button (Inverted primary button on dark theme) */}
          <div className="mt-6">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="calculadora"
              className="btn-primary-inverted w-full justify-center group"
            >
              <span className="btn-slide-panel" />
              <span className="btn-content">
                <span className="btn-icon-bubble inline-flex items-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="8" cy="14" r="5" />
                    <circle cx="16" cy="14" r="4" opacity="0.8" />
                    <circle cx="12" cy="7" r="3" opacity="0.6" />
                  </svg>
                </span>
                <span>Enviar esta cotización por WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-[11px] text-gray-500 leading-relaxed">
          Valor referencial. Puede variar según nivel de suciedad, tipo de manchas o tratamientos extra (olores, desinfección profunda).
        </p>
      </div>
    </div>
  );
};
