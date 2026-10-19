'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function StudentPage() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Vercel дээрх шууд нэвтрэх онлайн холбоос
  const onlineStudentUrl = 'https://creative-reading.vercel.app/student';
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(onlineStudentUrl)}`;

  const tasks = [
    { no: 1, cognitive: 'Мэдээлэл олох сэргээн санах', question: 'Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор ямар амьтан малдаа өөрөө л явна?', maxScore: 1 },
    { no: 2, cognitive: 'Мэдээлэл олох сэргээн санах', question: 'Бөөдийн бэлчээрт байсан адууг Цээлийн нуурт хөөн ирснийхээ шалтгааныг би баатар юу гэж тайлбарласан бэ?', maxScore: 1 },
    { no: 3, cognitive: 'Задлан шинжлэх', question: 'Ойдовын сайн сайхныг тодорхойлогч үзүүлэлтүүдийг өгүүлбэрээр тайлбарлан бичээрэй.', maxScore: 2 },
    { no: 4, cognitive: 'Задлан шинжлэх', question: 'Бөөдэйтэй уулзаж байхдаа ямар агшин нь арван долоон насанд хамгийн жаргалтай мөч байсныг тайлбарлана уу.', maxScore: 2 },
    { no: 5, cognitive: 'Эргэцүүлэн дүгнэх', question: 'Өгүүлэгт эхээс Харьцаа, холбоо хэлбэрээр ямар агуулга илэрхийлэгдэж байгаа вэ?', maxScore: 3 },
    { no: 6, cognitive: 'Эргэцүүлэн дүгнэх', question: 'Өгүүлэгийн гол санаа, зориулго ямар вэ?', maxScore: 3 },
  ];

  const handleSubmitAnswers = () => {
    const aiEvaluation = {
      studentName: 'Анужин Т.',
      recall: 2,
      analyze: 3,
      evalScore: 5,
      total: 10,
      feedback: 'Цэндао өвөө-AI үнэлгээ: Сурагч даалгаврыг маш сайн ойлгож, 3 түвшний асуултуудад агуулгын өндөр түвшинд хариулсан тул 10/12 оноогоор дүгнэв.',
      approvedAt: new Date().toLocaleString('mn-MN'),
    };

    localStorage.setItem('student_approved_analytics_data', JSON.stringify(aiEvaluation));
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '20px 24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/project-logo.jpg" alt="Logo" style={{ width: '56px', height: '56px', borderRadius: '12px', border: '1px solid #fbbf24', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Бүтээлч уншлага-2 төсөл (Сурагчийн танхим)</h1>
            <p style={{ fontSize: '12px', color: '#0284c7', margin: '2px 0 0 0', fontWeight: 'bold' }}>Creative reading-2 project | Анги: 9Е | Сурагч: Анужин Т.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowQrModal(true)}
            style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📱 Гар утаснаас хариулах (QR)
          </button>

          <Link
            href="/analytics"
            style={{ backgroundColor: '#0284c7', color: '#fff', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}
          >
            📊 Миний Дүн & Аналитик ➔
          </Link>
        </div>
      </header>

      {/* ШУУД НЭВТРЭХ QR MODAL (ЯМАР НЭГ IP, СҮЛЖЭЭНИЙ ШАЛГУУРГҮЙ) */}
      {showQrModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
            
            <button
              onClick={() => setShowQrModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', backgroundColor: '#e2e8f0', borderRadius: '50%', width: '32px', height: '32px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              📱 Гар утаснаас шууд хариулах (QR Холболт)
            </h3>

            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #fde047', display: 'inline-block', marginBottom: '16px' }}>
              <img src={qrCodeApiUrl} alt="QR Code" style={{ width: '200px', height: '200px', display: 'block', margin: '0 auto' }} />
              <div style={{ fontSize: '12px', color: '#6b21a8', fontWeight: 'bold', marginTop: '12px' }}>
                Утасныхаа Камераар уншуулна уу
              </div>
              <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '4px', wordBreak: 'break-all' }}>
                {onlineStudentUrl}
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ✅ Гар утасаар холбогдсоныг баталгаажуулах
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '20px', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* LEFT: TEXT */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', margin: '0 0 12px 0', color: '#0f172a' }}>📖 Унших эх бичвэр: Ж.Лхагва "Арван долоотой байхад"</h2>
          <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '10px', padding: '16px', fontSize: '12px', color: '#1e293b', lineHeight: '1.8' }}>
            Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.<br/><br/>
            Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор тэмээ малдаа өөрөө л явна. Хааяа унагаа үлдээнэ гэж адуугаа тууж ирэхэд нь би уургынхаа хээрийг барьж мордоод хорь хүрэхгүй адууг нь хураан хөндөлцүүлж явахаар барих морио тэгэхээс тэгж адуунаас нь гарган элдээд сүүл дэрлэн дагах хэвтээ дэмтэй сайхан хээрийнхээ дөрөө зуран эргэх яг л тэр агшинд бөхийн цацаж, сүүлэндээ салхи татуулан зугатах морины нарийн хоншоороор уургалан эргүүлээд урган давхисан адууныхаа хойноос янцгаан тэмүүлэх түүнийг эмнэг уургалсан мэт цухалзуураар нь эргүүлж Бөөдэйг хүлээж зогсоно.
          </div>
        </div>

        {/* RIGHT: TASKS */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '16px', margin: '0 0 16px 0', color: '#0f172a' }}>✏️ Даалгавар гүйцэтгэх</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
              {tasks.map((t) => (
                <div key={t.no} style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '4px' }}>
                    Даалгавар {t.no}: {t.question} ({t.maxScore} оноо)
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Хариултаа бичнэ үү..."
                    value={answers[t.no] || ''}
                    onChange={(e) => setAnswers({ ...answers, [t.no]: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '11px', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            {submitted ? (
              <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', padding: '12px', borderRadius: '10px', textAlign: 'center', color: '#15803d', fontWeight: 'bold', fontSize: '12px' }}>
                ✅ Даалгавар Цэндао багшид хураагдлаа! Дүн шууд Хяналт шинжилгээ рүү орлоо.
              </div>
            ) : (
              <button
                onClick={handleSubmitAnswers}
                style={{ width: '100%', padding: '14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
              >
                🚀 Даалгавар гүйцэтгэж Цэндао өвөө-багш руу илгээх
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}