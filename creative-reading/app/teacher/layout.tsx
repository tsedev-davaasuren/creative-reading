// src/app/teacher/layout.tsx
import Link from 'next/link';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Багшийн дээд навигацийн цэс */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <span className="text-xl font-bold text-indigo-600">ЦэндАО LMS</span>
            
            <nav className="flex space-x-4">
              {/* 1. Даалгаврын сан */}
              <Link 
                href="/teacher" 
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                📚 Даалгаврын сан
              </Link>

              {/* 2. Хяналт шинжилгээ */}
              <Link 
                href="/teacher/analytics" 
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                📊 Хяналт шинжилгээ
              </Link>
            </nav>
          </div>

          {/* 3. Сурагчийн хэсэг рүү Багш урьдчилан харах байдлаар орох */}
          <div className="flex items-center space-x-3">
            <Link
              href="/student-exam?email=tsendao.teacher@moes.edu.mn"
              target="_blank"
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center gap-1"
            >
              👁️ Сурагчийн хэсэг харах
            </Link>
          </div>
        </div>
      </header>

      {/* Үндсэн агуулга гарах хэсэг */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}