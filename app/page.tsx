import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8 space-y-6">
      
      {/* 1. Header Хэсэг (Дээд навигаци ба Ментор хэсэг) */}
      <header className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Зүүн тал: Төслийн Лого ба Нэр */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner">
            📚
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

        {/* Дунд хэсэг: Шар дэвсгэртэй Ментор AI Гарчиг */}
        <div className="bg-amber-400/90 border border-amber-500/30 px-6 py-2.5 rounded-2xl shadow-sm">
          <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-wide text-center">
            Mentor AI Цэндао багштай
          </h2>
        </div>

        {/* Баруун тал: Цэндао Багшийн Профайл ба Төлөв */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">Таны Ментор</p>
            <p className="text-[10px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Онлайн
            </p>
          </div>
          <div className="relative w-12 h-12 rounded-full ring-2 ring-amber-400 ring-offset-2 overflow-hidden bg-slate-200 shadow-md flex items-center justify-center text-xl">
            👨‍🏫
          </div>
        </div>

      </header>

      {/* Шалгалтын Заавар Карточка */}
      <section className="max-w-7xl mx-auto bg-amber-50/60 border border-amber-200 rounded-2xl p-6 text-center space-y-3">
        <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
          ✅ Алхам 2 Бэлэн
        </span>
        <h3 className="text-lg font-bold text-slate-800">Дээд Header хэсэг ажиллаж байна</h3>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Одоо энэ өөрчлөлтийг Vercel рүү шахаж, гар утас болон компьютер дээр Лого, Шар гарчиг, Багшийн профайл хэсэг зөв харагдаж байгааг шалгана.
        </p>
      </section>

    </main>
  )
}