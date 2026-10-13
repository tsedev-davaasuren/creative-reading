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

      {/* 2. Төслийн үндсэн ажлын хэсэг */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* АЛХАМ 3: Зүүн талын цонх (Блюпринт тохиргоотой) */}
        <section className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <h3 className="font-bold text-slate-800 text-base">
                1. Эх бичвэр ба Блюпринт тохиргоо
              </h3>
            </div>
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              PISA Стандарт (12 оноо)
            </span>
          </div>

          {/* Хичээл сонгох */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Хичээл сонгох (6 хичээл)</label>
            <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option>Уран зохиол (Дан бичвэртэй 5 эх)</option>
              <option>Монгол хэл</option>
              <option>Түүх / Нийгэм</option>
              <option>Байгалийн ухаан (Физик/Хими/Биологи)</option>
              <option>Математик</option>
              <option>Газар зүй / Бусад</option>
            </select>
          </div>

          {/* Гарчиг оруулах */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Эх бичвэрийн гарчиг</label>
            <input 
              type="text" 
              placeholder="Жишээ нь: Дэлхийн дулаарал ба График мэдээлэл" 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          {/* Эх бичвэр оруулах */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Унших эх бичвэр (Эх сурвалж)</label>
            <textarea 
              rows={5} 
              placeholder="Эх бичвэр болон диаграмм, хүснэгтийн тайлбарыг энд оруулна уу..." 
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
            />
          </div>

          {/* Блюпринтийн хураангуй мэдээлэл */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
            <p className="font-bold text-slate-700 flex items-center justify-between">
              <span>📌 Автомат Блюпринт бүтэц:</span>
              <span className="text-amber-600">6 Даалгавар / 12 Оноо</span>
            </p>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 text-center font-medium">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                1-2: Мэдээлэл олох<br/><strong className="text-slate-800">(0-1 оноо)</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                3-4: Задлан шинжлэх<br/><strong className="text-slate-800">(0-2 оноо)</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                5-6: Эргэцүүлэн дүгнэх<br/><strong className="text-slate-800">(0-3 оноо)</strong>
              </div>
            </div>
          </div>

          {/* AI Даалгавар үүсгэх товч */}
          <button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 px-4 rounded-xl shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2 text-sm">
            <span>✨ Цэндао багшаар 6 Даалгавар Бүрэн Боловсруулах</span>
          </button>

        </section>

        {/* Баруун талын цонх (Алхам 4-т кодолно) */}
        <section className="lg:col-span-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[420px]">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-2xl text-slate-400">
            📝
          </div>
          <h4 className="font-bold text-slate-600 text-sm">
            2. AI Боловсруулсан 6 Даалгавар (Рубрикийн дагуу)
          </h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Алхам 4-т бид блюпринтийн дагуу 12 онооны 6 даалгавар, зөв хариулт болон онооны балл өгөх рубрикийг харуулах цонхыг кодолно.
          </p>
        </section>

      </div>

    </main>
  )
}