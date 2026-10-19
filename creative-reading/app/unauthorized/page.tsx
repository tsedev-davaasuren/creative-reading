export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-slate-200">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          🚫
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Нэвтрэх боломжгүй!</h1>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Та зөвшөөрөгдсөн <strong>@moes.edu.mn</strong> цахим хаягтаа ирсэн тусгай линкээр нэвтрэнэ үү.
        </p>
      </div>
    </div>
  );
}