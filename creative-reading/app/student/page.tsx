'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Task {
  no: number;
  cognitive?: string;
  type?: string;
  score?: string;
  action?: string;
  question: string;
  options?: string[];
  answer?: string;
  rubric?: string;
}

interface TaskBundle {
  id: string;
  subject: string;
  title: string;
  text: string;
  tasks: Task[];
  createdAt?: string;
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
  const [testStarted, setTestStarted] = useState(true);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [chatTimeLeft, setChatTimeLeft] = useState(20 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedBundles, setCompletedBundles] = useState<Record<string, boolean>>({});

  // QR ХОЛБОЛТ
  const [showQrModal, setShowQrModal] = useState(false);

  // ҮНЭЛГЭЭ БА ЧАТ
  const [editRecall, setEditRecall] = useState(0);
  const [editAnalyze, setEditAnalyze] = useState(0);
  const [editEval, setEditEval] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});

  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Миний хүү өнөөдрийн даалгавраа амжилттай хийж дуусгалаа. Асуух зүйл байвал өвөөгөөсөө асуугаарай!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    const taskIdParam = searchParams.get('taskId');

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

    // БАГШИЙН САНГААС ЯГ ИЛГЭЭСЭН ДААЛГАВРУУДЫГ УНШИХ
    let loadedBundles: TaskBundle[] = [];

    const possibleKeys = [
      'teacher_assigned_tasks',
      'teacher_created_task_bundles',
      'creative_reading_task_bank_v12',
      'assigned_tasks_9E',
      'sent_tasks_9E'
    ];

    possibleKeys.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: TaskBundle) => {
              if (item && item.title && !loadedBundles.some((b) => b.id === item.id || b.title === item.title)) {
                loadedBundles.push(item);
              }
            });
          } else if (parsed && parsed.title && !loadedBundles.some((b) => b.id === parsed.id)) {
            loadedBundles.push(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    });

    setAssignedBundles(loadedBundles);

    if (loadedBundles.length > 0) {
      const selectedTask = loadedBundles.find((b: TaskBundle) => b.id === taskIdParam) || loadedBundles[0];
      setActiveBundle(selectedTask);
    } else {
      setActiveBundle(null);
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, isSubmitted, timeLeft]);

  useEffect(() => {
    let chatTimer: NodeJS.Timeout;
    if (isSubmitted && chatTimeLeft > 0) {
      chatTimer = setInterval(() => {
        setChatTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(chatTimer);
  }, [isSubmitted, chatTimeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startTest = (bundle: TaskBundle) => {
    if (completedBundles[bundle.id]) {
      alert('Энэ даалгаврыг та хэдийнэ гүйцэтгээд илгээсэн байна.');
      return;
    }
    setActiveBundle(bundle);
    setTestStarted(true);
    setIsSubmitted(false);
    setTimeLeft(40 * 60);
    setStudentAnswers({});
    setShowBundleList(false);
  };

  const handleAnswerSelect = (taskNo: number, value: string) => {
    if (isSubmitted) return;
    setStudentAnswers((prev) => ({ ...prev, [taskNo]: value }));
  };

  const handleSubmit = (auto = false) => {
    if (auto || confirm('Даалгавраа багш руу илгээхдээ итгэлтэй байна уу?')) {
      setIsSubmitted(true);
      if (activeBundle) {
        setCompletedBundles((prev) => ({ ...prev, [activeBundle.id]: true }));
        setEditRecall(4);
        setEditAnalyze(4);
        setEditEval(4);
      }
      alert('Даалгаврыг амжилттай илгээлээ!');
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatTimeLeft <= 0) return;

    const userText = chatInput.trim();
    const newMsgs = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(newMsgs);
    setChatInput('');

    try {
      const promptText = `Чи бол СУРАГЧТАЙ ярилцаж буй "Цэндао өвөө-багш" юм.
Эх бичвэр: "${activeBundle?.text || ''}"
Сурагчийн асуулт: ${userText}`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptText, subject: activeBundle?.subject || 'Уран зохиол' }),
      });

      const rawReply = await res.text();
      let displayContent = rawReply;
      try {
        const jsonObj = JSON.parse(rawReply);
        displayContent = typeof jsonObj === 'string' ? jsonObj : (jsonObj.reply || jsonObj.message || JSON.stringify(jsonObj));
      } catch {
        displayContent = rawReply;
      }

      setChatMessages([...newMsgs, { role: 'assistant', content: displayContent }]);
    } catch {
      setChatMessages([...newMsgs, { role: 'assistant', content: 'Холболтонд алдаа гарлаа.' }]);
    }
  };

  const totalCalculated = editRecall + editAnalyze + editEval;
  const totalPercent = Math.round((totalCalculated / 12) * 100);

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

        {/* ДААЛГАВАР СОНГОХ ЦЭС */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowBundleList(!showBundleList)}
              style={{ backgroundColor: '#059669', color: '#fff', fontWeight: 'bold', padding: '9px 16px', borderRadius: '20px', fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              📚 Багшаас өгсөн даалгаврууд ({assignedBundles.length}) {showBundleList ? '▲' : '▼'}
            </button>

            {showBundleList && (
              <div style={{ position: 'absolute', right: 0, top: '45px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '360px', zIndex: 100, padding: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Илгээгдсэн даалгаврууд:</div>
                {assignedBundles.map((b) => {
                  const isDone = completedBundles[b.id];
                  return (
                    <div
                      key={b.id}
                      onClick={() => startTest(b)}
                      style={{ padding: '10px', borderRadius: '8px', backgroundColor: activeBundle?.id === b.id ? '#dbeafe' : isDone ? '#f1f5f9' : '#f0fdf4', border: '1px solid #cbd5e1', marginBottom: '6px', cursor: isDone ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>{b.title}</div>
                        <div style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>📌 [{b.subject}]</div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px', backgroundColor: isDone ? '#e2e8f0' : '#bbf7d0', color: isDone ? '#64748b' : '#166534' }}>
                        {isDone ? 'Гүйцэтгэсэн' : 'Нээх ➔'}
                      </span>
                    </div>
                  );
                })}
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

      {/* АЖЛЫН ТАНХИМ */}
      {activeBundle ? (
        !isSubmitted ? (
          <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '20px', maxWidth: '1440px', margin: '0 auto' }}>
            
            {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР (БАГШИЙН САНГААС БҮРЭН УНШИНА) */}
            <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                  📖 [{activeBundle?.subject}] {activeBundle?.title}
                </h2>
              </div>
              <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '18px', fontSize: '13px', color: '#1e293b', lineHeight: '1.8', whiteSpace: 'pre-wrap', maxHeight: '560px', overflowY: 'auto' }}>
                {activeBundle?.text || 'Эх бичвэр байхгүй байна.'}
              </div>
            </div>

            {/* БАРУУН ТАЛ: ДААЛГАВАР (БАГШИЙН САНГИЙН БҮТЦЭЭР) */}
            <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                    ✏️ Даалгавар гүйцэтгэх
                  </h2>
                  <span style={{ backgroundColor: '#fef08a', color: '#854d0e', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px', fontSize: '12px' }}>
                    ⏱️ Хугацаа: {formatTime(timeLeft)}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
                  {activeBundle?.tasks?.map((t, index) => {
                    const taskNo = t.no || index + 1;
                    const hasOptions = t.options && Array.isArray(t.options) && t.options.length > 0;

                    return (
                      <div key={taskNo} style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '8px' }}>
                          Даалгавар {taskNo}: {t.question}
                        </div>

                        {hasOptions ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {t.options?.map((opt, optIdx) => (
                              <label key={optIdx} style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: '#fff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                <input
                                  type="radio"
                                  name={`task-${taskNo}`}
                                  value={opt}
                                  checked={studentAnswers[taskNo] === opt}
                                  onChange={(e) => handleAnswerSelect(taskNo, e.target.value)}
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <textarea
                            rows={3}
                            value={studentAnswers[taskNo] || ''}
                            onChange={(e) => handleAnswerSelect(taskNo, e.target.value)}
                            placeholder="Хариултаа бичнэ үү..."
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', resize: 'vertical', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff' }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => handleSubmit(false)}
                style={{ width: '100%', padding: '14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: '14px' }}
              >
                🚀 Даалгаврыг багш руу илгээх
              </button>
            </div>

          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '20px', maxWidth: '1440px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '18px', padding: '18px 24px' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', marginBottom: '10px' }}>
                  Сурагч {studentName}: [{activeBundle?.subject}] Нийт оноо: {totalCalculated} / 12 оноо ({totalPercent}%)
                </div>
                <button style={{ width: '100%', padding: '12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                  ✅ Үнэлгээг баталж Хяналт шинжилгээ рүү илгээх
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>💬 Цэндао өвөө-багштай ярилцах</div>
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ fontSize: '11px', padding: '8px', borderRadius: '8px', marginBottom: '6px', backgroundColor: m.role === 'user' ? '#dcfce7' : '#fef08a' }}>
                    {m.content}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px' }}>
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Асуулт асуух..." style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
                <button type="submit" style={{ padding: '8px 14px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px' }}>Илгээх</button>
              </form>
            </div>
          </div>
        )
      ) : (
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '60px 20px', textAlign: 'center', maxWidth: '800px', margin: '40px auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Одоогоор өгөгдсөн даалгавар байхгүй байна</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Багш даалгавар оруулах үед энэ хэсэгт автоматаар харагдах болно.</p>
        </div>
      )}

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