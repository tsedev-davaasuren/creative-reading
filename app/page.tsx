export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 shadow-xl text-center space-y-6">
        
        {/* Төлөвийн тэмдэг */}
        <div className="inline-block bg-amber-200 border border-amber-300 text-amber-900 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
          ⚙️ Алхам 1: Vercel CSS Тохиргоо Шалгах
        </div>
        
        {/* Гарчиг */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">
          Бүтээлч уншлага-2 төсөл
        </h1>
        
        <p className="text-slate-700 text-sm leading-relaxed font-medium">
          Энэхүү цайвар шаргал фон, шар хүрээ, сүүдэр болон товчлууруудын өнгө Vercel дээр яг энэ хэвээрээ гарвал дизайн дахин хэзээ ч унахгүй!
        </p>

        {/* Шалгах картууд */}
        <div className="p-4 bg-white rounded-2xl border border-amber-200 text-left text-xs text-slate-700 space-y-2 shadow-sm">
          <p className="font-bold text-slate-900">✅ Баталгаажуулах элементүүд:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Цайвар шаргал дэвсгэр фон (Amber-50)</li>
            <li>Дугуйруулсан булан ба сүүдэр (Shadow-xl)</li>
            <li>Тод цэнхэр болон ногоон товчлуурууд</li>
          </ul>
        </div>

        {/* Интерактив Товчлуурууд */}
        <div className="flex justify-center gap-3 pt-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition active:scale-95">
            Багшийн цонх (Алхам 2-т хийгдэнэ)
          </button>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition active:scale-95">
            Vercel Шалгалт Бэлэн
          </button>
        </div>

      </div>
    </main>
  )
}