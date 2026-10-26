'use client';

import React, { useState, useEffect } from 'react';

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

export default function StudentRoom() {
  const [assignedBundles, setAssignedBundles] = useState<TaskBundle[]>([]);
  const [showBundleList, setShowBundleList] = useState(false);
  const [activeBundle, setActiveBundle] = useState<TaskBundle | null>(null);

  // СУРАГЧИЙН ДИНАМИК МЭДЭЭЛЭЛ (URL-аас уншина)
  const [studentName, setStudentName] = useState('Сурагч');
  const [studentEmail, setStudentEmail] = useState('');

  // ТАЙМЕР БА ТӨЛӨВҮҮД
  const [testStarted, setTestStarted] = useState(true);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [chatTimeLeft, setChatTimeLeft] = useState(20 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedBundles, setCompletedBundles] = useState<Record<string, boolean>>({});

  // QR ХОЛБОЛТ БА СҮЛЖЭЭНИЙ IP ХАЯГ
  const [showQrModal, setShowQrModal] = useState(false);
  const [mobileConnected, setMobileConnected] = useState(false);
  const [customIp, setCustomIp] = useState('192.168.1.100');

  // ҮНЭЛГЭЭГ ЗАСАХ СТЭЙТҮҮД
  const [editRecall, setEditRecall] = useState(2);
  const [editAnalyze, setEditAnalyze] = useState(3);
  const [editEval, setEditEval] = useState(4);
  const [teacherFeedback, setTeacherFeedback] = useState('Цэндао өвөө-багшийн дүгнэлт: Сурагч даалгавар 5, 6 дээр өгүүлбэрийн тоо дутуу бичсэн тул рубрикийн дагуу оноо хасаж үнэлэв.');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Сурагчийн хариултууд
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});

  // Цэндао өвөө багшийн чат
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Миний хүү өнөөдрийн даалгавраа амжилттай хийж дуусгалаа. Эх бичвэрийн агуулга болон рубрикийн дагуу авагдсан үнэлгээнийхээ талаар өвөөгөөсөө асууж ярилцаарай!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // ҮНДСЭН ДААЛГАВАР (Хэрэв санд юу ч байхгүй бол харуулах анхны даалгавар)
  const defaultInitialBundle: TaskBundle = {
    id: 'TASK-001',
    subject: 'Уран зохиол',
    title: '10. Ж.Лхагва "Арван долоотой байхад" өгүүлэг',
    text: `Ж.Лхагва "Арван долоотой байхад" өгүүлэг
Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.
Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор тэмээ малдаа өөрөө л явна. Хааяа унагаа юулүүлэх гэж адуугаа тууж ирэхэд нь би уургынхаа хээрийг барьж мордоод хорь хүрэхгүй адууг нь хураан хөндөлцүүлж явсаар барих морио тэгхээс тэгж адуунаас нь гарган элдээд сүүл дэрлэн дагах хэвтээ дэмтэй сайхан хээрийнхээ дөрөө зуран эргэх яг л тэр агшинд бөхийн цацаж, сүүлэндээ салхи татуулан зугатах морины нарийн хоншоороор уургалан эргүүлээд урган давхисан адууныхаа хойноос янцгаан тэмүүлэх түүнийг эмнэг уургалсан мэт цухалзуураар нь эргүүлж Бөөдэйг хүлээж зогсоно.
Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн, мориныхоо нурууг нар харвахаас болгоомжлон салхи оруулж хэсэг сүүдэрлэн зогссоноо хазаараа мулталж инээсээр ирнэ.`,
    createdAt: new Date().toLocaleDateString('mn-MN'),
    tasks: [
      {
        no: 1,
        cognitive: 'Мэдээлэл олох сэргээн санах',
        type: 'Задгай даалгавар',
        score: '0-1',
        action: 'Хариултаа бичнэ үү',
        question: 'Даалгавар 1: Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор ямар амьтан малдаа өөрөө л явна? (1 оноо)',
        answer: 'Тэмээ',
        rubric: 'Зөв хариулсан бол 1 оноо.'
      },
      {
        no: 2,
        cognitive: 'Мэдээлэл олох сэргээн санах',
        type: 'Задгай даалгавар',
        score: '0-1',
        action: 'Хариултаа бичнэ үү',
        question: 'Даалгавар 2: Бөөдийн бэлчээрт байсан адууг Цээлийн нуурт хөөн ирснийхээ шалтгааныг би баатар юу гэж тайлбарласан бэ? (1 оноо)',
        answer: 'Маргааш нь Бөөдэйг ирнэ гэж итгэсэн учраас',
        rubric: 'Зөв тайлбарласан бол 1 оноо.'
      },
      {
        no: 3,
        cognitive: 'Задлан шинжлэх',
        type: 'Задгай даалгавар',
        score: '0-2',
        action: 'Хариултаа бичнэ үү',
        question: 'Даалгавар 3: Ойдовын сайн сайхныг тодорхойлогч үзүүлэлтүүдийг өгүүлбэрээр тайлбарлан бичээрэй. (2 оноо)',
        answer: 'Тэгш цагаан шүд, шооч нүд, хороомон гутал өмссөн нь түүний сайхныг харуулна.',
        rubric: '1-2 өгүүлбэрээр бичсэн бол 2 оноо.'
      },
      {
        no: 4,
        cognitive: 'Задлан шинжлэх',
        type: 'Задгай даалгавар',
        score: '0-2',
        action: 'Хариултаа бичнэ үү',
        question: 'Даалгавар 4: Бөөдэйтэй уулзаж байхдаа ямар агшин нь арван долоон насанд хамгийн жаргалтай мөч байсныг тайлбарлана уу. (2 оноо)',
        answer: 'Адуугаа тууж ирээд уургалан эргүүлж Бөөдэйг хүлээж зогсох тэр мөч.',
        rubric: 'Зөв тайлбарласан бол 2 оноо.'
      },
      {
        no: 5,
        cognitive: 'Эргэцүүлэн дүгнэх',
        type: 'Задгай даалгавар',
        score: '0-3',
        action: 'Хариултаа бичнэ үү',
        question: 'Даалгавар 5: Ж.Лхагва "Арван долоотой байхад" өгүүлэгт эхээс Харьцаа, холбоо хэлбэрээр ямар агуулга илэрхийлэгдэж байна вэ? (3 оноо)',
        answer: 'Дүрүүдийн сэтгэлийн хөдөлгөөн ба бие биедээ тэмүүлэх далд сэтгэлийг харуулсан.',
        rubric: '2-3 өгүүлбэрээр бичсэн бол 3 оноо.'
      },
      {
        no: 6,
        cognitive: 'Эргэцүүлэн дүгнэх',
        type: 'Задгай даалгавар',
        score: '0-3',
        action: 'Хариултаа бичнэ үү',
        question: 'Даалгавар 6: Энэ өгүүлэгийн гол санаа, зориулго ямар? Таны бодлоор ач холбогдол нь юу вэ? (3 оноо)',
        answer: 'Залуу насны гэгээн дурсгал, баатарлаг сэтгэлийг залууст харуулах зорилготой.',
        rubric: '2-3 өгүүлбэрээр бичсэн бол 3 оноо.'
      }
    ]
  };

  useEffect(() => {
    // 1. URL-ААС СУРАГЧИЙН ИМЭЙЛ БА ХИЧЭЭЛИЙН СӨНГОЛТЫГ УНШИХ
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get('email');
    const taskIdParam = searchParams.get('taskId');

    if (emailParam) {
      const decodedEmail = decodeURIComponent(emailParam).toLowerCase().trim();
      setStudentEmail(decodedEmail);
      
      // Имэйлээс сурагчийн нэрийг тодорхойлж тохируулах
      const namePart = decodedEmail.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      setStudentName(formattedName);
    } else {
      setStudentName('Анужин Т.');
    }

    // 2. БАГШИЙН САНААС БҮХ ДААЛГАВАРУУДЫГ УНШИХ
    const loaded = localStorage.getItem('creative_reading_task_bank_v12');
    if (loaded) {
      try {
        const parsed = JSON.parse(loaded);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAssignedBundles(parsed);
          
          // Хэрэв URL дээр тусгай даалгавар заасан бол түүнийг, үгүй бол эхнийхийг ачаална
          const selectedTask = parsed.find((b: TaskBundle) => b.id === taskIdParam) || parsed[0];
          setActiveBundle(selectedTask);
        } else {
          setAssignedBundles([defaultInitialBundle]);
          setActiveBundle(defaultInitialBundle);
        }
      } catch (e) {
        setAssignedBundles([defaultInitialBundle]);
        setActiveBundle(defaultInitialBundle);
      }
    } else {
      setAssignedBundles([defaultInitialBundle]);
      setActiveBundle(defaultInitialBundle);
    }
  }, []);

  // 40 МИНУТЫН ДААЛГАВАР ГҮЙЦЭТГЭХ ТАЙМЕР
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

  // 20 МИНУТЫН ЧАТНЫ ТАЙМЕР
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
    const correctAns = (t.answer || '').trim();
    const sentenceCount = stAns ? stAns.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;

    if (t.no === 1) {
      if (!stAns) return { earned: 0, max: 1, isCorrect: false, reason: 'Хариулт бичээгүй' };
      const isCorrect = stAns.toLowerCase().includes('тэмээ');
      return { earned: isCorrect ? 1 : 0, max: 1, isCorrect, reason: isCorrect ? 'Зөв бичсэн' : 'Буруу бичсэн' };
    } else if (t.no === 2) {
      const isGood = stAns.length > 5;
      return { earned: isGood ? 1 : 0, max: 1, isCorrect: isGood, reason: isGood ? 'Эхээс зөв олж бичсэн' : 'Дутуу эсвэл бичээгүй' };
    } else if (t.no === 3 || t.no === 4) {
      if (!stAns) return { earned: 0, max: 2, isCorrect: false, reason: 'Бичээгүй' };
      if (sentenceCount >= 1 && stAns.length > 15) {
        return { earned: 2, max: 2, isCorrect: true, reason: '1-2 өгүүлбэрээр бүрэн тайлбарласан' };
      } else {
        return { earned: 1, max: 2, isCorrect: false, reason: 'Тайлбар дутуу' };
      }
    } else {
      if (!stAns) return { earned: 0, max: 3, isCorrect: false, reason: 'Бичээгүй' };
      if (sentenceCount >= 2 && stAns.length > 30) {
        return { earned: 3, max: 3, isCorrect: true, reason: '2-3 өгүүлбэрээр шинэ санаа гарган бүрэн бичсэн' };
      } else if (sentenceCount === 1) {
        return { earned: 1, max: 3, isCorrect: false, reason: 'Рубрик хангаагүй (Зөвхөн 1 өгүүлбэр бичсэн)' };
      } else {
        return { earned: 2, max: 3, isCorrect: false, reason: 'Өгүүлбэрийн тоо дутуу' };
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

    const answersSummary = activeBundle?.tasks.map(t => {
      const score = getTaskScore(t);
      return `Даалгавар ${t.no} ("${t.question}"): Рубрик шаардлага: "${t.rubric}". Сурагчийн хариулт: "${studentAnswers[t.no] || 'Хариулаагүй'}", Авсан оноо: ${score.earned}/${score.max} (${score.reason})`;
    }).join('\n') || '';

    try {
      const promptText = `Чи бол 9Е ангийн СУРАГЧТАЙ ярилцаж буй ачлалт "Цэндао өвөө-багш" юм.

ТУХАЙН ӨДРИЙН ДААЛГАВАР БА РУБРИКИЙН МЭДЭЭЛЭЛ:
- Эх бичвэр: "
${activeBundle?.text || ''}"
- Сурагчийн хариултууд ба Рубрикийн засалт:
${answersSummary}

ЧАТНЫ ХАТУУ ДҮРЭМ:
1. Даалгаврын РУБРИК шаардлагыг чанд барь!
2. ЗӨВХӨН ӨНӨӨДРИЙН ДААЛГАВАР, ЭХ БИЧВЭР БА ҮНЭЛГЭЭНИЙ РУБРИКИЙН ХҮРЭЭНД ЯРИЛЦ.
3. Ярианы эхэнд "Сайн байна уу?", "Мэндээ" гэж ДАХИН ДАХИН МЭНДЧИЛЖ БОЛОХГҮЙ! Шууд хариулна уу.

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

  const handleApproveAndSendToAnalytics = () => {
    const finalData = {
      id: 'STU-' + Date.now().toString().slice(-4),
      name: studentName,
      class: '9Е',
      recall: editRecall,
      analyze: editAnalyze,
      eval: editEval,
      total: editRecall + editAnalyze + editEval,
      feedback: teacherFeedback,
      approvedAt: new Date().toLocaleString('mn-MN'),
    };

    const existing = localStorage.getItem('student_approved_analytics_data');
    let updatedList = [];
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        updatedList = Array.isArray(parsed) ? [finalData, ...parsed] : [finalData, parsed];
      } catch {
        updatedList = [finalData];
      }
    } else {
      updatedList = [finalData];
    }

    localStorage.setItem('student_approved_analytics_data', JSON.stringify(updatedList));
    setShowApprovalModal(false);
    alert(`${studentName} сурагчийн үнэлгээг баталж, Хяналт шинжилгээ рүү амжилттай илгээлээ!`);
  };

  const totalCalculated = editRecall + editAnalyze + editEval;
  const totalPercent = Math.round((totalCalculated / 12) * 100);

  // МИНИЙ ДҮН БА АНАЛИТИК ХУУДАС РУУ ШУУД НЭВТРЭХ ФУНКЦ
  const handleOpenAnalytics = () => {
    window.location.href = 'https://creative-reading.vercel.app/analytics';
  };

  const qrTargetUrl = `http://${customIp}:3000/student?email=${encodeURIComponent(studentEmail)}`;

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '16px 24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SECTION (ДИНАМИК СУРАГЧИЙН НЭР БА ХИЧЭЭЛИЙН СОНГОЛТ) */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/project-logo.jpg" alt="Logo" style={{ width: '52px', height: '52px', borderRadius: '10px', border: '1px solid #fbbf24', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Бүтээлч уншлага-2 төсөл (Сурагчийн танхим)</h1>
            <p style={{ fontSize: '12px', color: '#0284c7', margin: '2px 0 0 0', fontWeight: 'bold' }}>
              Анги: 9Е | Сурагч: {studentName} {studentEmail && `(${studentEmail})`}
            </p>
          </div>
        </div>

        {/* ЗУРАГ-1 ДЭЭРХ 2 ЦЭНХЭР БА БАННИР ТОВЧНУУД */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* БАГШААС ИЛГЭЭСЭН ДААЛГАВРУУДЫГ СОНГОХ ЦЭС */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowBundleList(!showBundleList)}
              style={{ backgroundColor: '#059669', color: '#fff', fontWeight: 'bold', padding: '9px 16px', borderRadius: '20px', fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              📚 Багшийн даалгаврууд ({assignedBundles.length}) {showBundleList ? '▲' : '▼'}
            </button>

            {showBundleList && (
              <div style={{ position: 'absolute', right: 0, top: '45px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '320px', zIndex: 100, padding: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Боломжит даалгаврын жагсаалт:</div>
                {assignedBundles.map((b) => {
                  const isDone = completedBundles[b.id];
                  return (
                    <div
                      key={b.id}
                      onClick={() => startTest(b)}
                      style={{ padding: '10px', borderRadius: '8px', backgroundColor: isDone ? '#f1f5f9' : '#f0fdf4', border: '1px solid #cbd5e1', marginBottom: '6px', cursor: isDone ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>{b.title}</div>
                        <div style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>{b.subject}</div>
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
            onClick={handleOpenAnalytics}
            style={{ backgroundColor: '#0284c7', color: '#fff', fontWeight: 'bold', padding: '9px 16px', borderRadius: '20px', fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            📊 Миний Дүн & Аналитик ➔
          </button>
        </div>
      </header>

      {/* 📱 QR КОД МЕДИАТОР MODAL */}
      {showQrModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffdf0', width: '100%', maxWidth: '520px', borderRadius: '20px', padding: '24px', border: '2px solid #7c3aed', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #fef08a', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#5b21b6' }}>📱 Гар утаснаас хариулах (QR Холболт)</h3>
              <button onClick={() => setShowQrModal(false)} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe', padding: '12px', borderRadius: '12px', marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#5b21b6', display: 'block', marginBottom: '4px' }}>⚙️ Компьютерийн Wi-Fi IP хаяг:</label>
              <input type="text" value={customIp} onChange={(e) => setCustomIp(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 'bold' }} />
            </div>
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e9d5ff', display: 'inline-block', marginBottom: '16px' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrTargetUrl)}`} alt="Mobile QR Code" style={{ width: '180px', height: '180px' }} />
              <div style={{ fontSize: '11px', color: '#6b21a8', fontWeight: 'bold', marginTop: '8px' }}>Утасныхаа Камераар уншуулна уу</div>
            </div>
            <button onClick={() => { setMobileConnected(true); setShowQrModal(false); alert('Гар утас холбогдлоо!'); }} style={{ width: '100%', padding: '12px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              ✅ Холбогдсоныг баталгаажуулах
            </button>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ҮНЭЛГЭЭ БАТЛАХ */}
      {showApprovalModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffdf0', width: '100%', maxWidth: '650px', borderRadius: '16px', padding: '24px', border: '2px solid #22c55e', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #bbf7d0', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#14532d' }}>
                📋 {studentName} сурагчийн үнэлгээг Хяналт шинжилгээ рүү илгээх
              </h3>
              <button onClick={() => setShowApprovalModal(false)} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#15803d', marginBottom: '10px' }}>
                Нийт зассан оноо: {totalCalculated} / 12 оноо ({totalPercent}%)
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#3730a3', fontWeight: 'bold' }}>📌 Сэргээн санах: {editRecall}/2</div>
                <div style={{ fontSize: '11px', color: '#6b21a8', fontWeight: 'bold' }}>📝 Задлан шинжлэх: {editAnalyze}/4</div>
                <div style={{ fontSize: '11px', color: '#854d0e', fontWeight: 'bold' }}>💡 Эргэцүүлэн дүгнэх: {editEval}/6</div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Нэгдсэн тайлбар дүгнэлт:</label>
                <textarea
                  value={teacherFeedback}
                  onChange={(e) => setTeacherFeedback(e.target.value)}
                  style={{ width: '100%', height: '70px', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowApprovalModal(false)} style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                Цуцлах
              </button>
              <button onClick={handleApproveAndSendToAnalytics} style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                🚀 Баталж, Хяналт шинжилгээ рүү илгээх
              </button>
            </div>

          </div>
        </div>
      )}

      {/* АЖЛЫН ТАНХИМ: ЗҮҮН ТАЛ НЬ ЭХ БИЧВЭР, БАРУУН ТАЛ НЬ ДААЛГАВАР ГҮЙЦЭТГЭХ */}
      {!isSubmitted ? (
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '20px', maxWidth: '1440px', margin: '0 auto' }}>
          
          {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР */}
          <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                📖 [{activeBundle?.subject}] {activeBundle?.title}
              </h2>
            </div>
            <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '18px', fontSize: '13px', color: '#1e293b', lineHeight: '1.8', whiteSpace: 'pre-wrap', maxHeight: '560px', overflowY: 'auto' }}>
              {activeBundle?.text}
            </div>
          </div>

          {/* БАРУУН ТАЛ: ДААЛГАВАР ГҮЙЦЭТГЭХ */}
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
        /* ДҮНГИЙН ХЭСЭГ (ИЛГЭЭСНИЙ ДАРААХ) */
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '20px', maxWidth: '1440px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '18px', padding: '18px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ backgroundColor: '#16a34a', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px' }}>🎉 РУБРИКИЙН ДАГУУ ҮНЭЛЭГДСЭН</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#15803d' }}>{totalPercent}%</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#14532d', marginBottom: '12px' }}>
                Сурагч {studentName}: Нийт оноо: {totalCalculated} / 12 оноо
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