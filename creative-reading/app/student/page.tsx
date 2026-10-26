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
  const [testStarted, setTestStarted] = useState(true);
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
  const [teacherFeedback, setTeacherFeedback] = useState('Цэндао өвөө-багшийн дүгнэлт: Рубрикийн дагуу үнэлгээг тооцов.');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});

  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Миний хүү өнөөдрийн даалгавраа амжилттай хийж дуусгалаа. Эх бичвэрийн агуулга болон рубрикийн дагуу авагдсан үнэлгээнийхээ талаар өвөөгөөсөө асууж ярилцаарай!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Багшийн оруулсан Уран зохиолын 1 даалгаврыг баталгаажуулах дефолт сан
  const defaultLiteratureBundle: TaskBundle = {
    id: 'TASK-UZ-01',
    subject: 'Уран зохиол',
    title: '10. Ж.Лхагва "Арван долоотой байхад" өгүүлэг',
    text: `Ж.Лхагва "Арван долоотой байхад" өгүүлэг
Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.
Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор тэмээ малдаа өөрөө л явна. Хааяа унагаа юулүүлэх гэж адуугаа тууж ирэхэд нь би уургынхаа хээрийг барьж мордоод хорь хүрэхгүй адууг нь хураан хөндөлцүүлж явсаар барих морио тэгхээс тэгж адуунаас нь гарган элдээд сүүл дэрлэн дагах хэвтээ дэмтэй сайхан хээрийнхээ дөрөө зуран эргэх яг л тэр агшинд бөхийн цацаж, сүүлэндээ салхи татуулан зугатах морины нарийн хоншоороор уургалан эргүүлээд урган давхисан адууныхаа хойноос янцгаан тэмүүлэх түүнийг эмнэг уургалсан мэт цухалзуураар нь эргүүлж Бөөдэйг хүлээж зогсоно.
Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн, мориныхоо нурууг нар харвахаас болгоомжлон салхи оруулж хэсэг сүүдэрлэн зогссоноо хазаараа мулталж инээсээр ирнэ.`,
    createdAt: new Date().toLocaleDateString('mn-MN'),
    tasks: [
      { no: 1, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Задгай даалгавар', score: '0-1', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 1: Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор ямар амьтан малдаа өөрөө л явна? (1 оноо)', answer: 'Тэмээ', rubric: 'Зөв хариулсан бол 1 оноо.' },
      { no: 2, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Задгай даалгавар', score: '0-1', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 2: Бөөдийн бэлчээрт байсан адууг Цээлийн нуурт хөөн ирснийхээ шалтгааныг би баатар юу гэж тайлбарласан бэ? (1 оноо)', answer: 'Маргааш нь Бөөдэйг ирнэ гэж итгэсэн учраас', rubric: 'Зөв тайлбарласан бол 1 оноо.' },
      { no: 3, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 3: Ойдовын сайн сайхныг тодорхойлогч үзүүлэлтүүдийг өгүүлбэрээр тайлбарлан бичээрэй. (2 оноо)', answer: 'Тэгш цагаан шүд, шооч нүд, хороомон гутал өмссөн нь түүний сайхныг харуулна.', rubric: '1-2 өгүүлбэрээр бичсэн бол 2 оноо.' },
      { no: 4, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 4: Бөөдэйтэй уулзаж байхдаа ямар агшин нь арван долоон насанд хамгийн жаргалтай мөч байсныг тайлбарлана уу. (2 оноо)', answer: 'Адуугаа тууж ирээд уургалан эргүүлж Бөөдэйг хүлээж зогсох тэр мөч.', rubric: 'Зөв тайлбарласан бол 2 оноо.' },
      { no: 5, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 5: Ж.Лхагва "Арван долоотой байхад" өгүүлэгт эхээс Харьцаа, холбоо хэлбэрээр ямар агуулга илэрхийлэгдэж байна вэ? (3 оноо)', answer: 'Дүрүүдийн сэтгэлийн хөдөлгөөн ба бие биедээ тэмүүлэх далд сэтгэлийг харуулсан.', rubric: '2-3 өгүүлбэрээр бичсэн бол 3 оноо.' },
      { no: 6, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 6: Энэ өгүүлэгийн гол санаа, зориулго ямар? Таны бодлоор ач холбогдол нь юу вэ? (3 оноо)', answer: 'Залуу насны гэгээн дурсгал, баатарлаг сэтгэлийг залууст харуулах зорилготой.', rubric: '2-3 өгүүлбэрээр бичсэн бол 3 оноо.' }
    ]
  };

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

    // БАГШИЙН ТАНХИМААС ИЛГЭЭСЭН БҮХ ДААЛГАВРЫГ ДИНАМИКААР УНШИХ
    let allBundles: TaskBundle[] = [defaultLiteratureBundle];

    const storageKeys = [
      'creative_reading_task_bank_v12',
      'teacher_created_task_bundles',
      'teacher_assigned_tasks'
    ];

    storageKeys.forEach((key) => {
      const loaded = localStorage.getItem(key);
      if (loaded) {
        try {
          const parsed = JSON.parse(loaded);
          if (Array.isArray(parsed)) {
            parsed.forEach((localItem: TaskBundle) => {
              if (localItem && localItem.id && !allBundles.some((b) => b.id === localItem.id)) {
                allBundles.push(localItem);
              }
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });

    setAssignedBundles(allBundles);

    const selectedTask = allBundles.find((b: TaskBundle) => b.id === taskIdParam) || allBundles[0];
    setActiveBundle(selectedTask);
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
      alert('Энэ даалгаврыг та хэдийнэ гүйцэтгээд илгээсэн байна. Нэг л удаа нээх боломжтой!');
      return;
    }
    setActiveBundle(bundle);
    setTestStarted(true);
    setIsSubmitted(false);
    setTimeLeft(40 * 60);
    setStudentAnswers({});
    setShowBundleList(false);
  };

  const handleTextAnswerChange = (taskNo: number, text: string) => {
    if (isSubmitted) return;
    setStudentAnswers((prev) => ({ ...prev, [taskNo]: text }));
  };

  const getTaskScore = (t: Task) => {
    const stAns = (studentAnswers[t.no] || '').trim();
    const sentenceCount = stAns ? stAns.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;

    if (t.no === 1) {
      if (!stAns) return { earned: 0, max: 1, isCorrect: false, reason: 'Хариулт бичээгүй' };
      return { earned: 1, max: 1, isCorrect: true, reason: 'Хариултыг бичсэн' };
    } else if (t.no === 2) {
      const isGood = stAns.length > 3;
      return { earned: isGood ? 1 : 0, max: 1, isCorrect: isGood, reason: isGood ? 'Зөв бичсэн' : 'Бичээгүй' };
    } else if (t.no === 3 || t.no === 4) {
      if (!stAns) return { earned: 0, max: 2, isCorrect: false, reason: 'Бичээгүй' };
      if (sentenceCount >= 1 && stAns.length > 10) {
        return { earned: 2, max: 2, isCorrect: true, reason: 'Бүрэн тайлбарласан' };
      } else {
        return { earned: 1, max: 2, isCorrect: false, reason: 'Тайлбар дутуу' };
      }
    } else {
      if (!stAns) return { earned: 0, max: 3, isCorrect: false, reason: 'Бичээгүй' };
      if (sentenceCount >= 2 && stAns.length > 20) {
        return { earned: 3, max: 3, isCorrect: true, reason: 'Бүрэн бичсэн' };
      } else {
        return { earned: 1, max: 3, isCorrect: false, reason: 'Өгүүлбэрийн тоо дутуу' };
      }
    }
  };

  const handleSubmit = (auto = false) => {
    if (auto || confirm('Даалгавраа багш руу илгээхдээ итгэлтэй байна уу?')) {
      setIsSubmitted(true);
      if (activeBundle) {
        setCompletedBundles((prev) => ({ ...prev, [activeBundle.id]: true }));
        const r1 = getTaskScore(activeBundle.tasks[0]).earned + getTaskScore(activeBundle.tasks[1]).earned;
        const r2 = getTaskScore(activeBundle.tasks[2]).earned + getTaskScore(activeBundle.tasks[3]).earned;
        const r3 = getTaskScore(activeBundle.tasks[4]).earned + getTaskScore(activeBundle.tasks[5]).earned;
        setEditRecall(r1);
        setEditAnalyze(r2);
        setEditEval(r3);
      }
      alert('Даалгаврыг рубрикийн дагуу засаж багш руу илгээлээ!');
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
Монгол хэлний зөв бичих дүрмийг чанд баримталж, цэгцтэй хариулна уу.

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
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Нийт даалгаврын сан:</div>
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
            
            <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                  📖 [{activeBundle?.subject}] {activeBundle?.title}
                </h2>
              </div>
              <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '18px', fontSize: '13px', color: '#1e293b', lineHeight: '1.8', whiteSpace: 'pre-wrap', maxHeight: '560px', overflowY: 'auto' }}>
                {activeBundle?.text}
              </div>
            </div>

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
                  {activeBundle?.tasks.map((t) => (
                    <div key={t.no} style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '6px' }}>
                        {t.question}
                      </div>
                      <textarea
                        rows={3}
                        value={studentAnswers[t.no] || ''}
                        onChange={(e) => handleTextAnswerChange(t.no, e.target.value)}
                        placeholder="Хариултаа бичнэ үү..."
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', resize: 'vertical', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff' }}
                      />
                    </div>
                  ))}
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
                <button onClick={() => setShowApprovalModal(true)} style={{ width: '100%', padding: '12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
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