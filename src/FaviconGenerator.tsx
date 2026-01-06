import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Zap } from 'lucide-react'; // Nur genutzte Icons!

type GradientType = 'linear' | 'radial';
const PRESETS = {
  'Cyber': ['#00f2fe', '#4facfe', '#7000ff'],
  'Sunset': ['#f83600', '#f9d423'],
  'Deep': ['#434343', '#000000'],
  'Mint': ['#00cdac', '#8ddad5'],
};

export const FaviconGenerator: React.FC = () => {
  const [text, setText] = useState('FC');
  const [type, setType] = useState<GradientType>('linear');
  const [colors, setColors] = useState<string[]>(PRESETS['Cyber']);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { width, height } = canvas;

    const grad = type === 'linear' 
      ? ctx.createLinearGradient(0, 0, width, height)
      : ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.2);

    colors.forEach((col, i) => grad.addColorStop(i / (colors.length - 1), col));

    ctx.fillStyle = grad;
    ctx.font = 'bold 100px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), width / 2, height / 2 + 5);
  };

  useEffect(draw, [text, colors, type]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `favicon-${text.toLowerCase()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 font-sans p-6 flex items-center justify-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid md:grid-cols-2 gap-12 bg-white/[0.01] border border-white/10 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] shadow-2xl relative z-10"
      >
        <div className="flex flex-col gap-10">
          <header className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter">ICON GEN</h1>
            <p className="text-white/40 text-sm font-medium tracking-wide uppercase flex items-center gap-2">
              <Zap size={14} className="text-cyan-400" /> Pro Grade Generator
            </p>
          </header>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Brand Initials</label>
              <input 
                value={text} 
                onChange={e => setText(e.target.value.slice(0, 2))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-3xl font-black focus:border-white/20 transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Gradient Mode</label>
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                  {(['linear', 'radial'] as GradientType[]).map(m => (
                    <button 
                      key={m} 
                      onClick={() => setType(m)}
                      className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${type === m ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Presets</label>
                <div className="flex gap-2 py-1">
                  {Object.entries(PRESETS).map(([name, cols]) => (
                    <button 
                      key={name} 
                      onClick={() => setColors(cols)}
                      className="w-7 h-7 rounded-full border border-white/20 hover:scale-110 transition-transform shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${cols[0]}, ${cols[1]})` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Color Definition</label>
              <div className="flex gap-4">
                {colors.map((c, i) => (
                  <input 
                    key={i} 
                    type="color" 
                    value={c} 
                    onChange={e => {
                      const n = [...colors]; n[i] = e.target.value; setColors(n);
                    }} 
                    className="flex-1 h-14 rounded-2xl cursor-pointer bg-white/5 border border-white/10 p-1"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent)]" />
          
          <div className="relative mb-12 transform group-hover:scale-110 transition-transform duration-700">
             <div className="absolute -inset-12 bg-cyan-500/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
             <canvas 
               ref={canvasRef} 
               width={256} 
               height={256} 
               className="relative w-48 h-48 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
             />
          </div>

          <button 
            onClick={downloadPng}
            className="w-full flex items-center justify-center gap-3 py-5 bg-white text-black rounded-2xl font-black text-sm hover:bg-cyan-400 transition-all active:scale-95 z-10"
          >
            <Download size={18} /> EXPORT PNG
          </button>
        </div>
      </motion.div>
    </div>
  );
};
