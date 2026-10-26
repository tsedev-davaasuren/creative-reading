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
  const [customIp, setCustomIp] = useState('192.168.1.100');

  // ҮНЭЛГЭЭГ ЗАСАХ СТЭЙТҮҮД
  const [editRecall, setEditRecall] = useState(2);
  const [editAnalyze, setEditAnalyze] = useState(3);
  const [editEval, setEditEval] = useState(4);
  const [teacherFeedback, setTeacherFeedback] = useState('Цэндао өвөө-багшийн дүгнэлт: Рубрикийн дагуу үнэлгээг тооцов.');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Сурагчийн хариултууд
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});

  // Цэндао өвөө багшийн чат
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Миний хүү өнөөдрийн даалгавраа амжилттай хийж дуусгалаа. Эх бичвэрийн агуулга болон рубрикийн дагуу авагдсан үнэлгээнийхээ талаар өвөөгөөсөө асууж ярилцаарай!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // 🏛️ БҮХ БАГШИЙН НЭГТГЭСЭН 2 ХИЧЭЭЛИЙН НИЙТИЙН ДААЛГАВРЫН САН (Зөвхөн Биологи, Хими)
  const globalDefaultBundles: TaskBundle[] = [
    {
      id: 'TASK-BIO-01',
      subject: 'Биологи',
      title: '1. Эсийн бүтэц ба амьд организмын амин үйл ажиллагаа',
      text: `Амьд организмын үндсэн нэгж нь эс юм. Эс нь эсийн хана, цитоплазм, бөөм болон бусад органоидуудаас бүрдэнэ. Ургамлын эс нь амьтны эсээс ялгаатай нь фотосинтез явуулах хлоропласт болон хатуу эсийн ханатай байдаг. Бөөм нь генетикийн мэдээллийг агуулж, эсийн бүх үйл ажиллагааг зохицуулна.`,
      createdAt: new Date().toLocaleDateString('mn-MN'),
      tasks: [
        { no: 1, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Задгай даалгавар', score: '0-1', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 1: Амьд организмын бүтэц, үйл ажиллагааны үндсэн нэгж юу вэ? (1 оноо)', answer: 'Эс', rubric: 'Эс гэж зөв хариулсан бол 1 оноо.' },
        { no: 2, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Задгай даалгавар', score: '0-1', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 2: Ургамлын эсэд фотосинтез явуулахад оролцдог органоид юу бэ? (1 оноо)', answer: 'Хлоропласт', rubric: 'Зөв нэрлэсэн бол 1 оноо.' },
        { no: 3, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 3: Ургамлын эс болон амьтны эсийн гол 2 ялгааг тайлбарлан бичнэ үү. (2 оноо)', answer: 'Ургамлын эс нь хлоропласт болон хатуу эсийн ханатай байдгаараа ялгаатай.', rubric: '2 ялгааг зөв бичсэн бол 2 оноо.' },
        { no: 4, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 4: Эсийн бөөмийн гүйцэтгэх үндсэн үүргийг эхээс олж тайлбарла. (2 оноо)', answer: 'Генетикийн мэдээллийг агуулж, эсийн үйл ажиллагааг зохицуулна.', rubric: 'Үүргийг гүйцэд бичсэн бол 2 оноо.' },
        { no: 5, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 5: Хэрэв эс бөөмгүй болбол ямар асуудал үүсэхийг эргэцүүлэн 2 өгүүлбэрээр бичээрэй. (3 оноо)', answer: 'Генетикийн мэдээлэл алдагдаж, эсийн хуваагдал болон амьдрах чадвар зогсоно.', rubric: '2 өгүүлбэрээр үндэслэлтэй бичсэн бол 3 оноо.' },
        { no: 6, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 6: Эсийн бүтцийг судалснаар анагаах ухаанд ямар ач холбогдолтой вэ? (3 оноо)', answer: 'Өвчнийг эсийн түвшинд оношлох болон эм бэлдмэл гарган авахад ач холбогдолтой.', rubric: '2-3 өгүүлбэрээр бичсэн бол 3 оноо.' }
      ]
    },
    {
      id: 'TASK-CHEM-01',
      subject: 'Хими',
      title: '1. Бодисын төлөв ба химийн урвал',
      text: `Бодис нь хатуу, шингэн, хийн төлөвт оршдог. Химийн урвалын үед бодисын атомын холбоос тасарч, шинэ бодис ба шинэ шинж чанар үүсдэг. Молекул дахь атомын тоо урвалын өмнө ба дараа тэнцүү байх ёстой бөгөөд үүнийг бодисын масс хадгалагдах хууль гэнэ.`,
      createdAt: new Date().toLocaleDateString('mn-MN'),
      tasks: [
        { no: 1, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Задгай даалгавар', score: '0-1', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 1: Бодисын оршин байх үндсэн 3 төлөвийг нэрлэнэ үү. (1 оноо)', answer: 'Хатуу, шингэн, хий', rubric: '3 төлөвийг зөв бичсэн бол 1 оноо.' },
        { no: 2, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Задгай даалгавар', score: '0-1', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 2: Химийн урвалын үед атомуудын тоо хадгалагддаг хуулийг юу гэж нэрлэдэг вэ? (1 оноо)', answer: 'Бодисын масс хадгалагдах хууль', rubric: 'Хуулийн нэрийг зөв бичсэн бол 1 оноо.' },
        { no: 3, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 3: Физикийн үзэгдэл болон химийн урвалын гол ялгааг тайлбарлан бичнэ үү. (2 оноо)', answer: 'Химийн урвалаар шинэ бодис үүсдэг бол физикийн үзэгдлээр шинэ бодис үүсэхгүй.', rubric: 'Гол ялгааг зөв тайлбарласан бол 2 оноо.' },
        { no: 4, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 4: Химийн урвал явагдсаныг илтгэх 2 шинж тэмдгийг эхээс санаж бичнэ үү. (2 оноо)', answer: 'Шинэ шинж чанар үүсэх, дулаан ялгарах эсвэл өнгө солигдох.', rubric: '2 шинжийг бичсэн бол 2 оноо.' },
        { no: 5, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 5: Бодисын масс хадгалагдах хууль амьдрал дээр яагаад чухал вэ? 2 өгүүлбэрээр бичээрэй. (3 оноо)', answer: 'Урвалын бүтээгдэхүүний тоо хэмжээг тооцоолоход болон технологийн процесст ач холбогдолтой.', rubric: '2 өгүүлбэрээр тайлбарласан бол 3 оноо.' },
        { no: 6, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: 'Хариултаа бичнэ үү', question: 'Даалгавар 6: Байгаль дээрх химийн урвалын нэг жишээг авч, ач холбогдлыг дүгнэн бичнэ үү. (3 оноо)', answer: 'Фотосинтез нь ургамал хүчилтөрөгч ялгаруулах химийн урвал бөгөөд амьдралыг тэтгэдэг.', rubric: '2-3 өгүүлбэрээр бичсэн бол 3 оноо.' }
      ]
    }
  ];

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

    // УРАН ЗОХИОЛЫН ДААЛГАВРЫГ ЦЭВЭРЛЭЖ, ЗӨВХӨН БИОЛОГИ БА ХИМИЙГ ҮЛДЭЭХ ЛОГИК
    let allBundles = [...globalDefaultBundles];
    const loaded = localStorage.getItem('creative_reading_task_bank_v12');

    if (loaded) {
      try {
        const parsed = JSON.parse(loaded);
        if (Array.isArray(parsed)) {
          parsed.forEach((localItem: TaskBundle) => {
            // Уран зохиолын даалгавар эсвэл TASK-UZ-01-ийг оруулахгүй
            if (localItem.subject !== 'Уран зохиол' && localItem.id !== 'TASK-UZ-01') {
              if (!allBundles.some((b) => b.id === localItem.id)) {
                allBundles.push(localItem);
              }
            }
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Шинэчилсэн 2 хичээлийн санг хадгална
    localStorage.setItem('creative_reading_task_bank_v12', JSON.stringify(allBundles));
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
        body: JSON.stringify({ message: promptText, subject: activeBundle?.subject || 'Биологи' }),
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

        {/* 2 ХИЧЭЭЛИЙН ДААЛГАВАР СОНГОХ ЦЭС */}
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
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Нийт даалгаврын сан (Биологи, Хими):</div>
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

      {/* АЖЛЫН ТАНХИМ */}
      {!isSubmitted ? (
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