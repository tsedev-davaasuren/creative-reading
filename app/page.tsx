export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6 space-y-6">
      
      {/* 1. Header Хэсэг */}
      <header className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
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

        <div className="bg-amber-400 border border-amber-500/30 px-6 py-2.5 rounded-2xl shadow-sm">
          <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-wide text-center">
            Mentor AI Цэндао багштай
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">Таны Ментор</p>
            <p className="text-[10px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Онлайн
            </p>
          </div>
          <div className="w-12 h-12 rounded-full ring-2 ring-amber-400 ring-offset-2 overflow-hidden bg-slate-200 shadow-md flex items-center justify-center text-xl">
            👨‍🏫
          </div>
        </div>
      </header>

      {/* 2. Төслийн үндсэн ажлын хэсэг (Layout) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* АЛХАМ 3: Зүүн талын цонх (6 Багана) */}
        <section className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <h3 className="font-bold text-slate-800 text-base">
                1. Эх бичвэр ба Тохиргоо
              </h3>
            </div>
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              Багшийн хэсэг
            </span>
          </div>

          {/* Гарчиг оруулах */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Эх бичвэрийн гарчиг</label>
            <input 
              type="text" 
              placeholder="Жишээ нь: Дэлхийн дулаарал ба Байгаль орчин" 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          {/* Эх бичвэр оруулах */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Унших эх бичвэр (Эх сурвалж)</label>
            <textarea 
              rows={6} 
              placeholder="Сурагчдын уншиж даалгавар гүйцэтгэх эх бичвэрийг энд буулгана уу..." 
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
            />
          </div>

          {/* PISA Түвшин ба Асуултын тоо тохируулах */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">PISA Ангилал</label>
              <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option>Мэдээлэл олох (Locate)</option>
                <option>Ойлгон тайлбарлах (Interpret)</option>
                <option>Эргэцүүлэн дүгнэх (Reflect)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Асуултын тоо</label>
              <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option>3 Даалгавар</option>
                <option>5 Даалгавар</option>
                <option>10 Даалгавар</option>
              </select>
            </div>
          </div>

          {/* AI Даалгавар үүсгэх товч */}
          <button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 px-4 rounded-xl shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2 text-sm">
            <span>✨ Mentor AI-аар PISA Даалгавар Боловсруулах</span>
          </button>

        </section>

        {/* Баруун талын түр цонх (Дараагийн алхамд хийгдэнэ) */}
        <section className="lg:col-span-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[400px]">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-2xl text-slate-400">
            📝
          </div>
          <h4 className="font-bold text-slate-600 text-sm">
            2. AI Боловсруулсан Даалгаврын хэсэг
          </h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Алхам 4-т бид энэ баруун талын цонхонд AI-ийн бэлтгэсэн PISA асуултууд болон хариултын картуудыг кодолно.
          </p>
        </section>

      </div>

    </main>
  )
}