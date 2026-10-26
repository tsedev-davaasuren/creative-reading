'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Task {
  no: number;
  cognitive: string;
  type: string;
  score: string;
  action: string;
  question: string;
  options?: string[];
  answer?: string;
  rubric: string;
}

interface TaskBundle {
  id: string;
  subject: string;
  title: string;
  text: string;
  tasks: Task[];
  createdAt: string;
  dueDate?: string;
}

function StudentRoomContent() {
  const searchParams = useSearchParams();

  const [assignedBundles, setAssignedBundles] = useState<TaskBundle[]>([]);
  const [showBundleList, setShowBundleList] = useState(false);
  const [activeBundle, setActiveBundle] = useState<TaskBundle | null>(null);

  // СУРАГЧИЙН ДИНАМИК МЭДЭЭЛЭЛ
  const [studentName, setStudentName] = useState('Сурагч');
  const [studentEmail, setStudentEmail] = useState('');

  // ТАЙМЕР БА ТӨЛӨВҮҮД
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [chatTimeLeft, setChatTimeLeft] = useState(20 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedBundles, setCompletedBundles] = useState<Record<string, boolean>>({});

  // QR ХОЛБОЛТ
  const [showQrModal, setShowQrModal] = useState(false);
  const [mobileConnected, setMobileConnected] = useState(false);

  // ҮНЭЛГЭЭ БА ЧАТ
  const [editRecall, setEditRecall] = useState(0);
  const [editAnalyze, setEditAnalyze] = useState(0);
  const [editEval, setEditEval] = useState(0);
  const [teacherFeedback, setTeacherFeedback] = useState('Цэндао өвөө-багшийн дүгнэлт: Даалгавар хүлээгдэж байна.');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});

  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Одоогоор идэвхтэй даалгавар байхгүй байна. Багш даалгавар илгээхийг хүлээнэ үү.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');

    let currentName = '';
    let currentEmail = '';

    if (nameParam) {
      currentName = decodeURIComponent(nameParam).trim();
    } else if (emailParam) {
      const decodedEmail = decodeURIComponent(emailParam).toLowerCase().trim();
      currentEmail = decodedEmail;
      const namePart = decodedEmail.split('@')[0].replace(/[0-9]/g, '');
      currentName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    } else {
      currentName = 'Сурагч';
    }

    if (emailParam) {
      currentEmail = decodeURIComponent(emailParam).toLowerCase().trim();
    }

    setStudentName(currentName);
    setStudentEmail(currentEmail);

    // ӨМНӨ НЬ ХАДГАЛАГДСАН БҮХ ДААЛГАВРЫН САНГ БҮРЭН ЦЭВЭРЛЭЖ ХООСОН БОЛГОНО
    localStorage.removeItem('creative_reading_task_bank_v12');
    setAssignedBundles([]);
    setActiveBundle(null);
  }, [searchParams]);

  const qrTargetUrl = `https://creative-reading.vercel.app/student?email=${encodeURIComponent(studentEmail)}&name=${encodeURIComponent(studentName)}`;

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '16px 24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/project-logo.jpg" alt="Logo" style={{ width: '52px', height: '52px', borderRadius: '10px', border: '1px solid #fbbf24', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Бүтээлч уншлага-2 төсөл (Сурагчийн танхим)</h1>
            <p style={{ fontSize: '13px', color: '#0284c7', margin: '2px 0 0 0', fontWeight: 'bold' }}>
              Анги: 9Е | Сурагч: <span style={{ color: '#b91c1c', fontSize: '14px', textDecoration: 'underline' }}>{studentName || 'Сурагч'}</span> {studentEmail && `(${studentEmail})`}
            </p>
          </div>
        </div>

        {/* ДААЛГАВАР СОНГОХ ЦЭС (ХООСОН) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowBundleList(!showBundleList)}
              style={{ backgroundColor: '#64748b', color: '#fff', fontWeight: 'bold', padding: '9px 16px', borderRadius: '20px', fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              📚 Багшаас өгсөн даалгаврууд (0) {showBundleList ? '▲' : '▼'}
            </button>

            {showBundleList && (
              <div style={{ position: 'absolute', right: 0, top: '45px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '300px', zIndex: 100, padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Одоогоор идэвхтэй даалгавар байхгүй байна.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            style={{ backgroundColor: '#7c3aed', color: '#fff', fontWeight: 'bold', padding: '9px 16px', borderRadius: '20px', fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            📱 Гар утаснаас хариулах (QR)
          </button>

          <button
            onClick={() => window.location.href = 'https://creative-reading.vercel.app/analytics'}
            style={{ backgroundColor: '#0284c7', color: '#fff', fontWeight: 'bold', padding: '9px 16px', borderRadius: '20px', fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            📊 Миний Дүн & Аналитик ➔
          </button>
        </div>
      </header>

      {/* 📱 QR MODAL */}
      {showQrModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffdf0', width: '100%', maxWidth: '520px', borderRadius: '20px', padding: '24px', border: '2px solid #7c3aed', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#5b21b6' }}>📱 Гар утаснаас хариулах (QR Холболт)</h3>
              <button onClick={() => setShowQrModal(false)} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', display: 'inline-block', marginBottom: '16px' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrTargetUrl)}`} alt="Mobile QR Code" style={{ width: '180px', height: '180px' }} />
            </div>
            <button onClick={() => { setMobileConnected(true); setShowQrModal(false); alert('Гар утас холбогдлоо!'); }} style={{ width: '100%', padding: '12px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
              ✅ Холбогдсоныг баталгаажуулах
            </button>
          </div>
        </div>
      )}

      {/* АЖЛЫН ТАНХИМ (ХООСОН МЭДЭЭЛЭЛ) */}
      <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '60px 20px', textAlign: 'center', maxWidth: '800px', margin: '40px auto' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Одоогоор өгөгдсөн даалгавар байхгүй байна</h2>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Багш даалгавар оруулах үед энэ хэсэгт автоматаар харагдах болно.</p>
      </div>

    </div>
  );
}

export default function StudentRoom() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Ачаалж байна...</div>}>
      <StudentRoomContent />
    </Suspense>
  );
}