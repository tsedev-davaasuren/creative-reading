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
  const [editRecall, setEditRecall] = useState(0);
  const [editAnalyze, setEditAnalyze] = useState(0);
  const [editEval, setEditEval] = useState(0);

  const [taskScores, setTaskScores] = useState<Record<number, { earned: number; max: number; feedback: string }>>({});
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});

  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Миний хүү өнөөдрийн даалгавраа амжилттай хийж дуусгалаа. Доорх 3 түвшний үнэлгээ болон жишиг зөв хариулттай танилцаад асуух зүйл байвал өвөөгөөсөө асуугаарай!' }
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

  // АГУУЛГА БА РУБРИКИЙГ ЧАНД ШАЛГАХ ЛОГИК
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

    if (isMultipleChoice) {
      if (correctAns && ans.toLowerCase() === correctAns.toLowerCase()) {
        return { earned: maxScore, max: maxScore, feedback: 'Зөв сонголт хийсэн байна.' };
      } else if (correctAns) {
        return { earned: 0, max: maxScore, feedback: `Буруу сонголт. Зөв сонголт: ${correctAns}` };
      } else {
        return { earned: maxScore, max: maxScore, feedback: 'Сонголтыг бүртгэсэн.' };
      }
    }

    // Задгай хариултад Агуулга + Рубрик шалгах
    const sentences = ans.split(/[.!?]+/).filter((s) => s.trim().length > 3);
    const sentenceCount = sentences.length;

    const keywords = correctAns ? correctAns.toLowerCase().split(/\s+/).filter((k: string) => k.length > 3) : [];
    let matchedKeywords = 0;
    keywords.forEach((kw: string) => {
      if (ans.toLowerCase().includes(kw)) {
        matchedKeywords++;
      }
    });

    const isContentMatching = keywords.length === 0 || matchedKeywords > 0;

    if (!isContentMatching) {
      return {
        earned: 0,
        max: maxScore,
        feedback: 'Агуулга буруу байна! Жишиг хариулттай тохирохгүй байгаа тул өгүүлбэрийн тооноос үл хамааран оноо олгох боломжгүй.'
      };
    }

    if (sentenceCount >= 2) {
      return {
        earned: maxScore,
        max: maxScore,
        feedback: 'Агуулга оновчтой бөгөөд шаардлагатай өгүүлбэрийн тоог бүрэн ханган хариулсан.'
      };
    } else if (sentenceCount === 1) {
      return {
        earned: Math.ceil(maxScore / 2),
        max: maxScore,
        feedback: 'Агуулга зөв боловч рубрикийн шалгуур буюу 2 өгүүлбэрээр дэлгэрэнгүй бичээгүй (1 өгүүлбэр бичсэн) тул хагас оноо авлаа.'
      };
    } else {
      return {
        earned: 0,
        max: maxScore,
        feedback: 'Хариулт хэт товч эсвэл хангалтгүй байна.'
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
      alert('Даалгаврыг чанд шалгаж амжилттай илгээлээ!');
    }
  };

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
1. Зөвхөн Монгол хэлний зөв бичих дүрмээр, тодорхой дулаан дуу хоолойгоор хариул.
2. Сурагчийн хариултад ямар агуулга дутсан, яагаад оноо хасагдсаныг бодитоор тайлбарла.

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