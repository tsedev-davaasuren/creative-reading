"use client";

import { useState } from "react";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Уран зохиол");

  const subjects = ["Уран зохиол", "Хими", "Биологи", "Түүх", "Физик", "Газар зүй"];

  return (
    <main className="min-h-screen bg-slate-100/80 p-4 md:p-6 space-y-6">
      
      {/* 1. HEADER ХЭСЭГ (Цайвар шаргал суурьтай) */}
      <header className="max-w-7xl mx-auto bg-amber-50/60 rounded-2xl shadow-sm border border-amber-200/80 p-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Лого хэсэг */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center overflow-hidden shadow-inner p-1 relative">
            <img 
              src="/project-logo.jpg" 
              alt="Лого" 
              className="w-full h-full object-contain relative z-10"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.includes('project-logo.jpg')) {
                  target.src = '/logo.jpg';
                } else {
                  target.style.display = 'none';
                }
              }}
            />
            <span className="text-xl absolute inset-0 flex items-center justify-center z-0 font-bold text-amber-700">📚</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
              Бүтээлч уншлага-2 төсөл
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              Creative reading-2 project
            </p>
          </div>
        </div>

        {/* Төв хэсэг: Гарчиг ба Товчлуурууд */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-amber-400/90 border border-amber-500/30 px-6 py-2 rounded-2xl shadow-sm">
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-wide text-center">
              Mentor AI Цэндао багштай
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button type="button" className="bg-amber-200/90 hover:bg-amber-300/90 border border-amber-300 px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold text-slate-900 transition shadow-sm">
              PISA шалгалтын жишиг даалгавар боловсруулах
            </button>
            <button 
              type="button"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="bg-amber-200/90 hover:bg-amber-300/90 border border-amber-300 px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold text-slate-900 transition shadow-sm flex items-center gap-1.5"
            >
              <span>мэргэжил, арга зүйн яриа өрнүүлэх</span>
              <span className="text-xs">{isChatOpen ? "▲" : "▼"}</span>
            </button>
          </div>
        </div>

        {/* Цэндао багшийн зураг & Төлөв */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">Таны Ментор</p>
            <p className="text-[10px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Онлайн
            </p>
          </div>
          <div className="relative w-12 h-12 rounded-full ring-2 ring-amber-400 ring-offset-2 overflow-hidden bg-amber-100 shadow-md flex items-center justify-center">
            <img 
              src="/tsendao-bagsh.jpg" 
              alt="Цэндао багш" 
              className="w-full h-full object-cover relative z-10"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.includes('tsendao-bagsh.jpg')) {
                  target.src = '/tsendao.jpg';
                } else {
                  target.style.display = 'none';
                }
              }}
            />
            <span className="text-2xl absolute inset-0 flex items-center justify-center z-0">👨‍🏫</span>
          </div>
        </div>
      </header>

      {/* Дэлгэгддэг Арга зүйн чат цонх */}
      {isChatOpen && (
        <section className="max-w-7xl mx-auto bg-amber-50/95 border-2 border-amber-300 rounded-2xl p-4 shadow-md transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              💬 Цэндао багштай арга зүйн яриа өрнүүлэх
            </h3>
            <button 
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-200"
            >
              Хураах ✕
            </button>
          </div>
          <div className="h-40 bg-white rounded-xl border border-amber-200 p-3 overflow-y-auto text-xs space-y-2 text-slate-700">
            <div className="bg-amber-100/80 p-2.5 rounded-lg max-w-md font-medium">
              👨‍🏫 <strong>Цэндао багш:</strong> Сайн байна уу! PISA даалгавар боловсруулах эсвэл хичээлийн арга зүйн талаар юу асуухыг хүсэж байна вэ?
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Асуултаа энд бичнэ үү..." 
              className="flex-1 px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button type="button" className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs shadow-sm">
              Илгээх
            </button>
          </div>
        </section>
      )}

      {/* ҮНДСЭН АЖЛЫН ХЭСЭГ */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Зүүн тал: ЭХ БИЧВЭР ЦОНХ */}
        <section className="lg:col-span-7 bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                Эх бичвэр
              </h3>

              <button type="button" className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1 transition">
                <span>Даалгаврын сан</span>
                <span>➔</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Хичээл сонгох:</label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                      selectedSubject === sub
                        ? "bg-sky-600 text-white shadow-md ring-2 ring-sky-300"
                        : "bg-sky-500/80 hover:bg-sky-600 text-white"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Эх бичвэрийн гарчиг</label>
              <input 
                type="text" 
                placeholder="Эх бичвэрийн гарчгийг оруулна уу..." 
                className="w-full px-3 py-2 bg-white/90 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1 flex-1 flex flex-col">
              <label className="text-xs font-bold text-slate-700">Унших эх бичвэр (Эх сурвалж)</label>
              <textarea 
                placeholder="Эх бичвэрээ оруулаарай." 
                className="w-full p-3.5 bg-white/90 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[480px] resize-y leading-relaxed placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* ДООД ТОБЧЛУУР (bg-emerald-600) */}
          <div className="pt-3 border-t border-amber-200/60 mt-auto">
            <button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md text-xs md:text-sm transition flex items-center justify-center gap-2">
              <span>⚡</span>
              <span>Даалгавар боловсруулах</span>
            </button>
          </div>

        </section>

        {/* Баруун тал: АСУУЛТ ДААЛГАВАР ЦОНХ */}
        <section className="lg:col-span-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                Асуулт даалгавар
              </h3>

              <button type="button" className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1 transition">
                <span>Хяналт шинжилгээ</span>
                <span>➔</span>
              </button>
            </div>

            <div className="bg-white/90 rounded-xl border border-amber-200 p-4 min-h-[580px] flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl text-amber-600">
                📝
              </div>
              <p className="text-xs font-bold text-slate-700">
                PISA Стандарт 6 Даалгавар (12 Оноо)
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Зүүн талд хичээлээ сонгон, эх бичвэрээ оруулж "Даалгавар боловсруулах" товчийг дарснаар асуултууд энд бэлэн болно.
              </p>
            </div>
          </div>

          {/* ДООД ТОБЧЛУУР (bg-emerald-600) */}
          <div className="pt-3 border-t border-amber-200/60 mt-auto">
            <button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md text-xs md:text-sm transition flex items-center justify-center gap-2">
              <span>💾</span>
              <span>Даалгаврыг баталж, санд илгээх</span>
            </button>
          </div>

        </section>

      </div>

    </main>
  );
}