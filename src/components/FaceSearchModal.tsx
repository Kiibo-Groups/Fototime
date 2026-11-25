'use client';

import React, { useState } from 'react';
import { X, Upload, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface FaceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindMatch: (faceId: string) => void;
}

export default function FaceSearchModal({ isOpen, onClose, onFindMatch }: FaceSearchModalProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateSelfieUpload = () => {
    // Demo selfie match
    setPreview('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      onFindMatch('face-user-1');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#11131a] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-gray-400 hover:bg-white/[0.08] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-white">Búsqueda Facial Inteligente</h3>
          <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
            Sube una selfie o foto de tu rostro. Nuestro motor de IA analizará los ángulos y encontrará todas tus fotos en segundos aunque tu dorsal esté tapado.
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onClick={handleSimulateSelfieUpload}
          className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-500/30 bg-amber-500/5 p-6 text-center cursor-pointer hover:border-amber-500/60 hover:bg-amber-500/10 transition"
        >
          {analyzing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              <p className="text-xs font-semibold text-amber-300">Escaneando rasgos biométricos y emparejando con 4.200 fotos...</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-amber-400 mb-2" />
              <p className="text-sm font-semibold text-gray-200">
                Haz clic para subir o tomar una selfie
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                PNG, JPG o WEBP (máx. 10MB). Procesamiento privado y seguro.
              </p>
            </>
          )}
        </div>

        {/* Demo trigger helper */}
        <div className="mt-4 rounded-lg bg-white/[0.03] p-3 text-center">
          <button
            onClick={handleSimulateSelfieUpload}
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            ⚡ Probar demo instantánea con selfie de muestra
          </button>
        </div>
      </div>
    </div>
  );
}
