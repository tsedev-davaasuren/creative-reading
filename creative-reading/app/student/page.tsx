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

  // СУРАГЧИЙН МЭДЭЭЛЭЛ
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

  // ҮНЭЛГЭЭНИЙ 3 ТҮВШИН БА ХАРИУЛТУУД
  const [editRecall, setEditRecall] = useState(0); // Мэдээлэл олох / Сэргээн санах
  const [editAnalyze, setEditAnalyze] = useState(0); // Задлан шинжлэх
  const [editEval, setEditEval] = useState(0); // Эргэцүүлэн дүгнэх

  const [taskScores, setTaskScores] = useState<Record<number, { earned: number; max: number; feedback: string }>>({});
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});

  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Миний хүү өнөөдрийн даалгавраа амжилттай хийж дуусгалаа. Доорх 3 түвшний үнэлгээ, жишиг зөв хариулттай танилцаад асуух зүйл байвал өвөөгөөсөө асуугаарай!' }
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
            parsed.forEach((item: any) => {
              if (item && (item.title || item.subject)) {
                const formattedBundle: TaskBundle = {
                  id: item.id || 'TASK-' + Math.random().toString(36).substr(2, 9),
                  subject: item.subject || 'Нийтлэг хичээл',
                  title: item.title || item.name || 'Багшийн даалгавар',
                  text: item.text || item.content || item.story || '',
                  tasks: Array.isArray(item.tasks) ? item.tasks : Array.isArray(item.questions) ? item.questions : [],
                  createdAt: item.createdAt || new Date().toLocaleDateString('mn-MN')
                };

                if (!loadedBundles.some((b) => b.id === formattedBundle.id || b.title === formattedBundle.title)) {
                  loadedBundles.push(formattedBundle);
                }
              }
            });
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

  // 🎯 АГУУЛГА БА РУБРИКИЙГ НЭГТГЭЖ ШАЛГАХ БОДИТ ЛОГИК
  const evaluateTask = (t: any, studentAns: string) => {
    const ans = (studentAns || '').trim();
    const correctAns = (t.answer || '').trim();
    const options = t.options || t.choices;
    const isMultipleChoice = Array.isArray(options) && options.length > 0;

    let maxScore = 2;
    if (t.score) {
      const parts = t.score.split('-');
      maxScore = parseInt(parts[parts.length - 1]) || 2;
    }

    if (!ans) {
      return { earned: 0, max: maxScore, feedback: 'Хариулт бичээгүй/сонгоогүй байна.' };
    }

    // 1. СОНГОХ ДААЛГАВАР БОЛ
    if (isMultipleChoice) {
      if (correctAns && ans.toLowerCase() === correctAns.toLowerCase()) {
        return { earned: maxScore, max: maxScore, feedback: 'Зөв сонголт хийсэн байна.' };
      } else if (correctAns) {
        return { earned: 0, max: maxScore, feedback: `Буруу сонголт. Зөв сонголт: ${correctAns}` };
      } else {
        return { earned: maxScore, max: maxScore, feedback: 'Сонголтыг бүртгэсэн.' };
      }
    }

    // 2. ЗАДГАЙ ДААЛГАВАР БОЛ (Агуулга + Рубрикийн шалгалт)
    // Өгүүлбэрийн тоог тоолох (Цэг, асуултын тэмдэг, анхаарлын тэмдгээр салгана)
    const sentences = ans.split(/[.!?]+/).filter((s) => s.trim().length > 3);
    const sentenceCount = sentences.length;

    // Агуулгын түлхүүр үгсийг шалгах
    const keywords = correctAns ? correctAns.toLowerCase().split(/\s+/).filter((k: string) => k.length > 3) : [];
    let matchedKeywords = 0;
    keywords.forEach((kw: string) => {
      if (ans.toLowerCase().includes(kw)) {
        matchedKeywords++;
      }
    });

    const isContentMatching = keywords.length === 0 || matchedKeywords > 0;

    // ШАЛГУУР 1: Агуулга нь буруу эсвэл хамааралгүй бол 2 өгүүлбэр бичсэн байсан ч 0 оноо
    if (!isContentMatching) {
      return {
        earned: 0,
        max: maxScore,
        feedback: 'Агуулга буруу байна! Жишиг зөв хариулттай тохирохгүй байгаа тул өгүүлбэрийн тооноос үл хамааран оноо олгох боломжгүй.'
      };
    }

    // ШАЛГУУР 2: Агуулга дөхсөн/зөв боловч өгүүлбэрийн тоо ба рубрик шалгах
    if (sentenceCount >= 2) {
      return {
        earned: maxScore,
        max: maxScore,
        feedback: 'Агуулга оновчтой бөгөөд шаардлагатай өгүүлбэрийн тоог (2 ба түүнээс дээш) бүрэн ханган хариулсан байна.'
      };
    } else if (sentenceCount === 1) {
      return {
        earned: Math.ceil(maxScore / 2),
        max: maxScore,
        feedback: 'Агуулга зөв боловч рубрикийн шалгуур буюу 2 ба түүнээс дээш өгүүлбэрээр дэлгэрэнгүй бичээгүй (1 өгүүлбэр бичсэн) тул хагас оноо авлаа.'
      };
    } else {
      return {
        earned: 0,
        max: maxScore,
        feedback: 'Хариулт хэт товч эсвэл хангалтгүй байна. Дэлгэрэнгүй өгүүлбэрээр хариулна уу.'
      };
    }
  };

  const handleSubmit = (auto = false) => {
    if (auto || confirm('Даалгавраа багш руу илгээхдээ итгэлтэй байна уу?')) {
      setIsSubmitted(true);
      if (activeBundle) {
        setCompletedBundles((prev) => ({ ...prev, [activeBundle.id]: true }));

        let recallEarned = 0;
        let analyzeEarned = 0;
        let evalEarned = 0;
        const newScores: Record<number, { earned: number; max: number; feedback: string }> = {};

        activeBundle.tasks.forEach((t: any, idx: number) => {
          const taskNo = t.no || idx + 1;
          const userAns = studentAnswers[taskNo] || '';
          const result = evaluateTask(t, userAns);

          newScores[taskNo] = result;

          const cog = (t.cognitive || '').toLowerCase();
          if (cog.includes('олох') || cog.includes('санах') || taskNo <= 2) {
            recallEarned += result.earned;
          } else if (cog.includes('задлан') || cog.includes('шинжлэх') || taskNo <= 4) {
            analyzeEarned += result.earned;
          } else {
            evalEarned += result.earned;
          }
        });

        setTaskScores(newScores);
        setEditRecall(recallEarned);
        setEditAnalyze(analyzeEarned);
        setEditEval(evalEarned);
      }
      alert('Даалгаврыг агуулга болон рубрикийн дагуу чанд шалгаж амжилттай илгээлээ!');
    }
  };

  // ЦЭНДАО ӨВӨӨ БАГШИЙН СҮРҮҮН, ОЙЛГОМЖТОЙ ЧАТ
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatTimeLeft <= 0) return;

    const userText = chatInput.trim();
    const newMsgs = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(newMsgs);
    setChatInput('');

    const taskDetailsPrompt = activeBundle?.tasks?.map((t: any, idx: number) => {
      const taskNo = t.no || idx + 1;
      const stAns = studentAnswers[taskNo] || 'Бичээгүй';
      const evalInfo = taskScores[taskNo] || { earned: 0, max: 2, feedback: '' };
      return `Даалгавар ${taskNo}:
- Асуулт: "${t.question}"
- Сурагчийн хариулт: "${stAns}"
- Жишиг зөв хариулт: "${t.answer || 'Байхгүй'}"
- Өгсөн оноо: ${evalInfo.earned}/${evalInfo.max}
- Дүгнэлт: "${evalInfo.feedback}"`;
    }).join('\n\n');

    try {
      const promptText = `Чи бол СУРАГЧИЙН ДААЛГАВАРТ ДҮҮН НЭГ БҮРЧЛЭН ТАЙЛБАРЛАХ "Цэндао өвөө-багш" юм.

ОДОГООР АЖИЛЛАСАН ДААЛГАВРЫН МЭДЭЭЛЭЛ:
Хичээл: ${activeBundle?.subject || 'Ерөнхий'}
Сэдэв: ${activeBundle?.title || 'Даалгавар'}
Эх бичвэр: "${activeBundle?.text || ''}"

СУРАГЧИЙН АЖИЛЛАСАН БОДИТ БАЙДАЛ:
${taskDetailsPrompt}

ДҮРЭМ:
1. Дээрх бодит датанд үндэслэж сурагчийн асуултад ДУЛААН, ОЙЛГОМЖТОЙ Монгол хэлээр хариул.
2. Сурагч "Яагаад хагас/буруу оноо авсан?" гэж асуувал зөвхөн "Өгүүлбэрийн тоо" биш, АГУУЛГА нь жишиг хариултаас зөрсөн эсвэл ямар түлхүүр үг дутсаныг тодорхой тайлбарла.
3. Монгол хэлний зөв бичих дүрмийн дагуу тодорхой хариул.

Сурагчийн асуулт: ${userText}`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptText, subject: activeBundle?.subject || 'Ерөнхий' }),
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
            
            {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР */}
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

            {/* БАРУУН ТАЛ: ДААЛГАВАР */}
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
                  {activeBundle?.tasks?.map((t: any, index: number) => {
                    const taskNo = t.no || index + 1;
                    const questionText = t.question || t.title || t.text || `Даалгавар ${taskNo}`;
                    const optionsList = t.options || t.choices || t.answers;
                    const hasOptions = Array.isArray(optionsList) && optionsList.length > 0;

                    return (
                      <div key={taskNo} style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '8px' }}>
                          Даалгавар {taskNo}: {questionText}
                        </div>

                        {hasOptions ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {optionsList.map((opt: string, optIdx: number) => (
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
                🚀 Даалгавраа багш руу илгээх
              </button>
            </div>

          </div>
        ) : (
          /* ДААЛГАВАР ИЛГЭЭСНИЙ ДАРААХ ХАРАГДАЦ */
          <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '20px', maxWidth: '1440px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* 1. ҮНЭЛГЭЭНИЙ 3 ТҮВШИНИЙ ХАРАГДАЦ */}
              <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '18px', padding: '18px 24px' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#15803d', marginBottom: '12px' }}>
                  📊 Үнэлгээний 3 түвшний гүйцэтгэл (Нийт: {totalCalculated} / 12 оноо - {totalPercent}%)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: 'bold' }}>1. Мэдээлэл олох / Сэргээн санах</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#15803d', marginTop: '4px' }}>{editRecall} / 2 оноо</div>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: 'bold' }}>2. Задлан шинжлэх</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#15803d', marginTop: '4px' }}>{editAnalyze} / 4 оноо</div>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: 'bold' }}>3. Эргэцүүлэн дүгнэх</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#15803d', marginTop: '4px' }}>{editEval} / 6 оноо</div>
                  </div>
                </div>
              </div>

              {/* 2. СУРАГЧИЙН ХАРИУЛТ БА ЖИШИГ ЗӨВ ХАРИУЛТ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto' }}>
                {activeBundle?.tasks?.map((t: any, index: number) => {
                  const taskNo = t.no || index + 1;
                  const questionText = t.question || t.title || t.text || `Даалгавар ${taskNo}`;
                  const userAns = studentAnswers[taskNo] || 'Хариулт бичээгүй';
                  const modelAns = t.answer || t.correctAnswer || 'Жишиг хариулт бэлэн бус байна';
                  const evalRes = taskScores[taskNo] || { earned: 0, max: 2, feedback: 'Шалгаж байна' };

                  return (
                    <div key={taskNo} style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>
                          Даалгавар {taskNo}: {questionText}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px', backgroundColor: evalRes.earned > 0 ? '#dcfce7' : '#fee2e2', color: evalRes.earned > 0 ? '#15803d' : '#991b1b' }}>
                          Оноо: {evalRes.earned} / {evalRes.max}
                        </span>
                      </div>

                      {/* СУРАГЧИЙН ХАРИУЛТ */}
                      <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', marginBottom: '8px', borderLeft: '4px solid #3b82f6' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e40af' }}>💬 Сурагчийн ажилласан хариулт:</div>
                        <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>{userAns}</div>
                      </div>

                      {/* ЖИШИГ ЗӨВ ХАРИУЛТ */}
                      <div style={{ backgroundColor: '#f0fdf4', padding: '10px 12px', borderRadius: '8px', marginBottom: '8px', borderLeft: '4px solid #22c55e' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#166534' }}>✅ Жишиг зөв хариулт:</div>
                        <div style={{ fontSize: '12px', color: '#14532d', marginTop: '2px', fontWeight: '500' }}>{modelAns}</div>
                      </div>

                      {/* ЦЭНДАО БАГШИЙН ДҮГНЭЛТ */}
                      <div style={{ backgroundColor: '#fffbe8', padding: '10px 12px', borderRadius: '8px', borderLeft: '4px solid #eab308' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#854d0e' }}>👴 Цэндао багшийн дүгнэлт:</div>
                        <div style={{ fontSize: '12px', color: '#713f12', marginTop: '2px' }}>{evalRes.feedback}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* 3. ЦЭНДАО ӨВӨӨ БАГШТАЙ ЧАТЛАХ ХЭСЭГ */}
            <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>💬 Цэндао өвөө-багштай ярилцах</div>
                <div style={{ maxHeight: '380px', overflowY: 'auto', marginBottom: '10px' }}>
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{ fontSize: '11px', padding: '8px', borderRadius: '8px', marginBottom: '6px', backgroundColor: m.role === 'user' ? '#dcfce7' : '#fef08a' }}>
                      {m.content}
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px' }}>
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Эх бичвэр болон онооны талаар асуух..." style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
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