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

  // ТАЙМЕР БА ТӨЛӨВҮҮД
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [chatTimeLeft, setChatTimeLeft] = useState(20 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedBundles, setCompletedBundles] = useState<Record<string, boolean>>({});

  // QR ХОЛБОЛТ БА СҮЛЖЭЭНИЙ IP ХАЯГ
  const [showQrModal, setShowQrModal] = useState(false);
  const [mobileConnected, setMobileConnected] = useState(false);
  const [customIp, setCustomIp] = useState('192.168.1.100'); // Таны Wi-Fi IP хаяг

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

  useEffect(() => {
    const loaded = localStorage.getItem('creative_reading_task_bank_v12');
    if (loaded) {
      try {
        const parsed = JSON.parse(loaded);
        setAssignedBundles(parsed);
        if (parsed.length > 0) {
          setActiveBundle(parsed[0]);
        }
      } catch (e) {
        console.error('Даалгавар ачаалахад алдаа гарлаа', e);
      }
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

  const handleOptionSelect = (taskNo: number, option: string) => {
    if (isSubmitted) return;
    setStudentAnswers((prev) => ({ ...prev, [taskNo]: option }));
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
      if (!stAns) return { earned: 0, max: 1, isCorrect: false, reason: 'Хариулт сонгоогүй' };
      const isCorrect = stAns === correctAns || stAns.startsWith(correctAns) || correctAns.startsWith(stAns);
      return { earned: isCorrect ? 1 : 0, max: 1, isCorrect, reason: isCorrect ? 'Зөв сонгосон' : 'Буруу сонгосон' };
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
        return { earned: 1, max: 3, isCorrect: false, reason: 'Рубрик хангаагүй (Зөвхөн 1 өгүүлбэр бичсэн тул 1 оноо)' };
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
- Эх бичвэр: "${activeBundle?.text || ''}"
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
      recall: editRecall,
      analyze: editAnalyze,
      eval: editEval,
      total: editRecall + editAnalyze + editEval,
      feedback: teacherFeedback,
      approvedAt: new Date().toLocaleString('mn-MN'),
    };
    localStorage.setItem('student_approved_analytics_data', JSON.stringify(finalData));
    setShowApprovalModal(false);
    alert('Үнэлгээг засаж батлан Хяналт шинжилгээ рүү амжилттай илгээлээ!');
  };

  const totalCalculated = editRecall + editAnalyze + editEval;
  const totalPercent = Math.round((totalCalculated / 12) * 100);

  // QR КОДОНД ОРОХ IP УРЛ
  const qrTargetUrl = `http://${customIp}:3000/student`;

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '16px 24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fef08a', borderRadius: '16px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/project-logo.jpg" alt="Logo" style={{ width: '52px', height: '52px', borderRadius: '10px', border: '1px solid #fde047', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Бүтээлч уншлага-2 төсөл (Сурагчийн танхим)</h1>
            <p style={{ fontSize: '12px', color: '#0284c7', margin: '2px 0 0 0', fontWeight: 'bold' }}>Анги: 9Е | Сурагч: Болд-Эрдэнэ</p>
          </div>
        </div>

        {/* ДЭЭД ТОЛГОЙД ОЛОН ТӨХӨӨРӨМЖ / QR КОД ТОВЧ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowQrModal(true)}
            style={{
              backgroundColor: mobileConnected ? '#0284c7' : '#7c3aed',
              color: '#fff',
              fontWeight: 'bold',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            📱 {mobileConnected ? 'Гар утас холбогдсон ✅' : 'Гар утаснаас хариулах (QR код)'}
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowBundleList(!showBundleList)}
              style={{ backgroundColor: '#059669', color: '#fff', fontWeight: 'bold', padding: '8px 18px', borderRadius: '20px', fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              📚 Багшаас өгсөн даалгаврууд ({assignedBundles.length}) {showBundleList ? '▲' : '▼'}
            </button>

            {showBundleList && (
              <div style={{ position: 'absolute', right: 0, top: '45px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '320px', zIndex: 100, padding: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Илгээгдсэн даалгаврын жагсаалт:</div>
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
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{b.subject}</div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px', backgroundColor: isDone ? '#e2e8f0' : '#bbf7d0', color: isDone ? '#64748b' : '#166534' }}>
                        {isDone ? 'Гүйцэтгэсэн' : 'Эхлүүлэх ➔'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 📱 QR КОД МЕДИАТОР MODAL */}
      {showQrModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffdf0', width: '100%', maxWidth: '520px', borderRadius: '20px', padding: '24px', border: '2px solid #7c3aed', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #fef08a', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#5b21b6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📱 Гар утаснаас хариулах (QR Холболт)
              </h3>
              <button onClick={() => setShowQrModal(false)} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            {/* КОМПЬЮТЕРИЙН IP ХАЯГИЙГ ТОХИРУУЛАХ ХЭСЭГ */}
            <div style={{ backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe', padding: '12px', borderRadius: '12px', marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#5b21b6', display: 'block', marginBottom: '4px' }}>
                ⚙️ Компьютерийнхээ Wi-Fi IP хаягийг оруулна уу (cmd -&gt; ipconfig):
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={customIp}
                  onChange={(e) => setCustomIp(e.target.value)}
                  placeholder="Жишээ: 192.168.1.100"
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 'bold' }}
                />
              </div>
              <p style={{ fontSize: '10px', color: '#6b21a8', margin: '6px 0 0 0' }}>
                *Утас болон компьютер хоёр НЭГ Wi-Fi сүлжээнд холбогдсон байх шаардлагатай.
              </p>
            </div>

            {/* QR КОД АРГА */}
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e9d5ff', display: 'inline-block', marginBottom: '16px' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrTargetUrl)}`}
                alt="Mobile QR Code"
                style={{ width: '180px', height: '180px', borderRadius: '8px' }}
              />
              <div style={{ fontSize: '11px', color: '#6b21a8', fontWeight: 'bold', marginTop: '8px' }}>
                Утасныхаа Камераар уншуулна уу
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                {qrTargetUrl}
              </div>
            </div>

            <button
              onClick={() => {
                setMobileConnected(true);
                setShowQrModal(false);
                alert('Гар утас холбогдсоноор тохируулагдлаа! Одоо хариултаа утсаараа бичих боломжтой.');
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              ✅ Гар утсаар холбогдсоныг баталгаажуулах
            </button>

          </div>
        </div>
      )}

      {/* POPUP MODAL: ҮНЭЛГЭЭ БАТЛАХ */}
      {showApprovalModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffdf0', width: '100%', maxWidth: '650px', borderRadius: '16px', padding: '24px', border: '2px solid #22c55e', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #bbf7d0', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#14532d', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📋 Үнэлгээг засаж батлан Хяналт шинжилгээ рүү илгээх
              </h3>
              <button onClick={() => setShowApprovalModal(false)} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <p style={{ fontSize: '12px', color: '#334155', marginBottom: '16px' }}>
              Та Цэндао өвөө-багшийн болон сурагчийн гүйцэтгэлийн үнэлгээг эцэслэн хянаж, Хяналт шинжилгээ (Analytics) рүү илгээх гэж байна.
            </p>

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

      {!testStarted ? (
        <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#fffbe8', borderRadius: '18px', border: '1px solid #fef08a', maxWidth: '800px', margin: '40px auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>
            📖 {activeBundle ? activeBundle.title : 'Даалгавар сонгоно уу'}
          </h2>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '20px', lineHeight: '1.6' }}>
            Энэхүү даалгаврыг гүйцэтгэх хугацаа <strong>40 минут</strong> байна.<br />
            Даалгаврыг <strong>нэг л удаа нээж</strong> гүйцэтгэх боломжтойг анхаарна уу!
          </p>
          {activeBundle && (
            <button
              onClick={() => startTest(activeBundle)}
              style={{ padding: '12px 30px', backgroundColor: '#0284c7', color: '#fff', fontSize: '14px', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            >
              🚀 Даалгаврыг эхлүүлэх (40 минут)
            </button>
          )}
        </div>
      ) : isSubmitted ? (
        
        /* ДҮНГИЙН ХЭСЭГ (7:3 ХАРЬЦААТАЙ) */
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '20px', alignItems: 'start', maxWidth: '1440px', margin: '0 auto' }}>
          
          {/* ЗҮҮН ТАЛ (7 ХЭСЭГ) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '18px', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ backgroundColor: '#16a34a', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px' }}>
                  🎉 РУБРИКИЙН ДАГУУ ҮНЭЛЭГДСЭН
                </span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#15803d' }}>
                  {totalPercent}%
                </span>
              </div>

              <div style={{ fontSize: '24px', fontWeight: '800', color: '#14532d', borderBottom: '1px solid #bbf7d0', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Нийт оноо: {totalCalculated} / 12 оноо</span>
                <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#166534', fontStyle: 'italic' }}>✏️ Оноо хэсгийг шууд засаж болно</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#fff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#3730a3' }}>📌 Сэргээн санах (макс 2):</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      min={0}
                      max={2}
                      value={editRecall}
                      onChange={(e) => setEditRecall(Number(e.target.value))}
                      style={{ width: '50px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e1b4b' }}>/ 2 оноо</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b21a8' }}>📝 Задлан шинжлэх (макс 4):</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={editAnalyze}
                      onChange={(e) => setEditAnalyze(Number(e.target.value))}
                      style={{ width: '50px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#3b0764' }}>/ 4 оноо</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#854d0e' }}>💡 Эргэцүүлэн дүгнэх (макс 6):</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={editEval}
                      onChange={(e) => setEditEval(Number(e.target.value))}
                      style={{ width: '50px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#713f12' }}>/ 6 оноо</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowApprovalModal(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#059669',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}
              >
                ✅ Үнэлгээг засаж батлан Хяналт шинжилгээ рүү илгээх
              </button>

            </div>

            <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fef08a', borderRadius: '18px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>
                📋 Сурагчийн хариулт ба Рубрикийн дагуух үнэлгээ
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activeBundle?.tasks.map((t, idx) => {
                  const scoreInfo = getTaskScore(t);
                  return (
                    <div key={idx} style={{ backgroundColor: '#fffdf0', border: '1px solid #fef08a', borderRadius: '12px', padding: '14px' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1d4ed8' }}>
                          Даалгавар {t.no}: {t.question}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: scoreInfo.earned === scoreInfo.max ? '#dcfce7' : scoreInfo.earned > 0 ? '#fef9c3' : '#fef2f2',
                          color: scoreInfo.earned === scoreInfo.max ? '#15803d' : scoreInfo.earned > 0 ? '#a16207' : '#dc2626',
                          border: '1px solid #cbd5e1'
                        }}>
                          Оноо: {scoreInfo.earned} / {scoreInfo.max} ({scoreInfo.reason})
                        </div>
                      </div>

                      <div style={{ fontSize: '10px', color: '#b45309', fontWeight: 'bold', marginBottom: '6px' }}>
                        📊 Үнэлэх рубрик: <span style={{ fontWeight: 'normal', color: '#78350f' }}>{t.rubric}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                        <div style={{ backgroundColor: scoreInfo.isCorrect ? '#f0fdf4' : '#fef2f2', border: !scoreInfo.isCorrect ? '1px solid #fca5a5' : '1px solid #86efac', borderRadius: '8px', padding: '8px 10px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 'bold', color: scoreInfo.isCorrect ? '#166534' : '#991b1b' }}>👤 Таны хариулт:</div>
                          <div style={{ fontSize: '11px', color: scoreInfo.isCorrect ? '#14532d' : '#7f1d1d', marginTop: '4px', fontWeight: 'bold' }}>{studentAnswers[t.no] || 'Хариулаагүй'}</div>
                        </div>
                        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef08a', borderRadius: '8px', padding: '8px 10px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#854d0e' }}>✨ Жишиг зөв хариулт:</div>
                          <div style={{ fontSize: '11px', color: '#713f12', marginTop: '4px' }}>{t.answer || 'А. Бөөдэйтэй уулзах мөч'}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* БАРУУН ТАЛ (3 ХЭСЭГ): ЦЭНДАО ӨВӨӨ-БАГШИЙН ЧАТАН ЯРИА */}
          <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fef08a', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', height: '680px', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #fef08a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="/tsendao.jpg" alt="Цэндао өвөө-багш" style={{ width: '54px', height: '54px', borderRadius: '50%', border: '3px solid #f59e0b', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Цэндао өвөө-багш</div>
                    <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>Онлайн {mobileConnected && '📱 (Утастай холбоотой)'}</div>
                  </div>
                </div>
                <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', border: '1px solid #fecaca' }}>
                  ⏳ {formatTime(chatTimeLeft)}
                </div>
              </div>

              <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '11px', backgroundColor: m.role === 'user' ? '#dcfce7' : '#fffbe8', color: m.role === 'user' ? '#14532d' : '#713f12', border: m.role === 'assistant' ? '1px solid #fef08a' : 'none', maxWidth: '90%' }}>
                      {m.role === 'assistant' && <strong>👴 Цэндао өвөө-багш: </strong>}
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <input
                type="text"
                disabled={chatTimeLeft <= 0}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={mobileConnected ? "📱 Утаснаасаа эсвэл энд бичээрэй..." : "Өнөөдрийн эх бичвэр, үнэлгээний тухай асуугаарай..."}
                style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #fef08a', fontSize: '11px', outline: 'none', backgroundColor: '#fffdf0' }}
              />
              <button
                type="submit"
                disabled={chatTimeLeft <= 0}
                style={{ padding: '8px 14px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Илгээх
              </button>
            </form>
          </div>

        </div>

      ) : (

        /* ДААЛГАВАР ГҮЙЦЭТГЭХ ҮНДСЭН ХЭСЭГ (40 МИНУТЫН ТАЙМЕРТАЙ) */
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '20px', alignItems: 'start', maxWidth: '1440px', margin: '0 auto' }}>
          
          {/* LEFT COLUMN: ЭХ БИЧВЭР */}
          <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fef08a', borderRadius: '18px', padding: '20px', minHeight: '700px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>
              📖 Эх бичвэр
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <span style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '6px' }}>
                {activeBundle?.subject}
              </span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Эх бичвэрийн гарчиг:</label>
              <input
                type="text"
                readOnly
                value={activeBundle?.title}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #fef08a', fontSize: '12px', backgroundColor: '#fffdf0', fontWeight: 'bold', color: '#0f172a', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Унших эх бичвэр:</label>
              <textarea
                readOnly
                value={activeBundle?.text}
                style={{ width: '100%', height: '520px', padding: '14px', backgroundColor: '#fffdf0', border: '1px solid #fef08a', borderRadius: '10px', fontSize: '12px', color: '#1e293b', lineHeight: '1.7', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: АСУУЛТ ДААЛГАВРУУД БА 40 МИНУТЫН ТАЙМЕР */}
          <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fef08a', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '700px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>
                  ✏️ Асуулт даалгавар
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#dc2626', backgroundColor: '#fef2f2', padding: '6px 14px', borderRadius: '8px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⏳ Үлдсэн хугацаа: {formatTime(timeLeft)}
                </div>
              </div>

              {mobileConnected && (
                <div style={{ backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe', padding: '10px', borderRadius: '10px', fontSize: '11px', color: '#6b21a8', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📱 Гар утас холбогдсон: Та хариултаа гар утаснаасаа шивж оруулж болно.
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '560px', overflowY: 'auto', paddingRight: '4px' }}>
                {activeBundle?.tasks.map((t, idx) => (
                  <div key={idx} style={{ backgroundColor: '#fffdf0', border: '1px solid #fef08a', borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                        📌 {t.cognitive}
                      </span>
                      <span style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                        📝 {t.type}
                      </span>
                      <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', marginLeft: 'auto' }}>
                        🏆 Оноо: {t.score}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>
                      ⚡ Гүйцэтгэх ажил: <span style={{ backgroundColor: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'normal' }}>{t.action}</span>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '6px' }}>
                      Даалгавар {t.no}:
                    </div>

                    <div style={{ fontSize: '12px', color: '#0f172a', marginBottom: '10px', lineHeight: '1.5', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '500' }}>
                      {t.question}
                    </div>

                    {/* ДААЛГАВАР 1: СОНГОХ ТЕСТ */}
                    {idx === 0 && (
                      <div style={{ marginBottom: '6px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '6px' }}>Хариултаа сонгоно уу:</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {(t.options || ['А. Ойдовтой уулзах мөч', 'Б. Бөөдэйтэй уулзах мөч', 'В. Цэрэгт явах мөч', 'Г. Сумын наадамд оролцох мөч']).map((opt, oIdx) => {
                            const isSelected = studentAnswers[t.no] === opt;
                            return (
                              <label
                                key={oIdx}
                                onClick={() => handleOptionSelect(t.no, opt)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                                  backgroundColor: isSelected ? '#e0f2fe' : '#fff',
                                  fontSize: '12px',
                                  color: isSelected ? '#0369a1' : '#334155',
                                  fontWeight: isSelected ? 'bold' : 'normal',
                                  cursor: 'pointer',
                                }}
                              >
                                <input
                                  type="radio"
                                  name={`student-task-${t.no}`}
                                  checked={isSelected}
                                  onChange={() => handleOptionSelect(t.no, opt)}
                                  style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                                />
                                {opt}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ДААЛГАВАР 2-6: ХАРИУЛАН БИЧИХ ЦОНХ */}
                    {idx > 0 && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#15803d', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Хариултаа энд бичнэ үү:</span>
                          {mobileConnected && <span style={{ color: '#7c3aed' }}>📱 Утаснаас бичихийг зөвшөөрсөн</span>}
                        </div>
                        <textarea
                          value={studentAnswers[t.no] || ''}
                          onChange={(e) => handleTextAnswerChange(t.no, e.target.value)}
                          placeholder={mobileConnected ? "📱 Утаснаасаа эсвэл энд хариултаа бичээрэй..." : "Хариултаа энд тодорхой бичээрэй..."}
                          style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '10px',
                            borderRadius: '8px',
                            border: mobileConnected ? '2px solid #a855f7' : '1px solid #86efac',
                            fontSize: '12px',
                            color: '#14532d',
                            backgroundColor: '#f0fdf4',
                            lineHeight: '1.6',
                            resize: 'vertical',
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                        />
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>

            {/* ИЛГЭЭХ ТОПЧ */}
            <button
              onClick={() => handleSubmit(false)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#059669',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px',
              }}
            >
              🚀 Даалгавар гүйцэтгэж багш руу илгээх
            </button>
          </div>

        </div>
      )}

    </div>
  );
}