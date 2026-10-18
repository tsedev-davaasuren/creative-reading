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
}

interface EvaluationResult {
  studentName: string;
  totalScore: number;
  maxScore: number;
  recallScore: number;
  analyzeScore: number;
  evalScore: number;
  teacherApproved: boolean;
  taskScores: Record<number, number>;
  feedback: string;
}

export default function TeacherRoom() {
  // MODAL / POPUP STATES
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showTaskBankModal, setShowTaskBankModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showStudentReviewModal, setShowStudentReviewModal] = useState(false);

  // SUBJECT & CONTENT STATES
  const [selectedSubject, setSelectedSubject] = useState('Уран зохиол');

  const subjectsList = ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'];

  const initialSubjectData: Record<string, { title: string; text: string }> = {
    'Уран зохиол': {
      title: 'Ж.Лхагва "Арван долоотой байхад" өгүүлэг',
      text: `Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.\n\nЭэж цээжиндээ улаан эрээн хороомтой гутал өмсчихөөд явж байдаг Бөөдэйг: "Энэ золиг хэний амьтнаас ийм хариугүй шалбуур амьтан төрдөг байна аа" гэж ярихыг сонсоод: "Манайх гэдэг айл дахиад ганц хүүтэйсэн бол энэ хариугүй амьтнаас чинь үнэрлэж ч үзэхгүй байсан юм. Хонь ч хариулж чадахгүй амьтан" гэж бодохоос ээжийгээ барьж идэхээс бусдыг хийж явахдаа "Наадах чинь ч тийм дээ" гэсэн царай гаргаад дуугүй өнгөрч билээ.`,
    },
    'Хими': {
      title: 'Атом болон молийн тухай үндсэн ойлголт',
      text: `Атом нь химийн элементийн хамгийн жижиг, цааш химийн аргаар задардаггүй жижиг хэсэг юм. Атом нь эерэг цэнэгтэй цөм болон түүнийг тойрон эргэх сөрөг цэнэгтэй электронтой. Бодисын тоо хэмжээг молиор хэмжих ба 1 моль бодис нь Avogadro-гийн тогтмолтой (6.022 x 10^23) тэнцүү хэсэгцээрийг агуулдаг.`,
    },
    'Биологи': {
      title: 'Эс ба амьд организмын удамшил',
      text: `ДНХ-ийн молекул нь эрчлэгдсэн давхар шаталсан шат шиг хэлбэртэй байх ба түүний од шиг хэсгүүдийг ген гэж нэрлэдэг. Ген нь амьд биеийн тодорхой нэг шинж тэмдгийг тодорхойлдог кодолсон мэдээлэл юм. Жишээлбэл, хүний нүдний өнгө, үсний хэлбэр, өндрийн хэмжээ, бүр зарим төрлийн өвчинд өртөмтгий байдал хүртэл генийн түвшинд шийдэгддэг.\n\nАмьд биес бэлгийн замаар үржих үед эцэг, эхийн бэлгийн эсүүд нийлж, хоёр талын удамшлын мэдээлэл хослон шинэ бие махбод үүсдэг. Тиймээс хүүхэд аав, ээжийнхээ алиных нь ч шинжийг тодорхой хэмжээгээр агуулсан байдаг. Хэдий бэлгийн бус үржлийн үед эх биеийн генийн мэдээлэл яг хэвээрээ адилхан байдаг.`,
    },
    'Түүх': {
      title: 'Монголын Их Улс ба Их Засаг хууль',
      text: `1206 онд Чингис хаан Их Монгол Улсыг байгуулж, улс орны төрийг захирах "Их Засаг" хуулийг баталжээ. Энэхүү хууль нь цэрэг, засаг захиргаа, иргэний харилцааг зохицуулах гол баримт бичиг байв. Зам харилцааны өртөө улааг байгуулж, худалдаа иргэншлийг дэмжсэн нь дэлхийн түүхэнд чухал нөлөө үзүүлсэн юм.`,
    },
    'Физик': {
      title: 'Ньютоны хөдөлгөөний хуулиуд',
      text: `Ньютоны нэгдүгээр хууль нь инерцийн хууль бөгөөд биед гаднын хүч үйлчлэхгүй бол тайван эсвэл шулуун замын хөдөлгөөнд хэвээр байна. Хоёрдугаар хууль F=ma нь хүч ба хурдасгалын хамаарлыг илэрхийлнэ. Гуравдугаар хууль нь үйлчлэл ба эсрэг үйлчлэл тэнцүү байдгийг тайлбарладаг.`,
    },
    'Газар зүй': {
      title: 'Дэлхийн уур амьсгалын бүсүүд',
      text: `Дэлхийн гадаргуугийн нарнаас авах дулааны хэмжээнээс хамаарч уур амьсгалыг тропик, субтропик, сэрүүн, туйлын бүс гэж хуваадаг. Уур амьсгалын өөрчлөлт нь дэлхийн дулаарал, байгалийн гамшигт үзэгдлийг дагуулж байгаа тул экосистемийг хамгаалах шаардлагатай байна.`,
    }
  };

  const blueprintTasks: Task[] = [
    { no: 1, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Сонгох тест', score: '0-1', action: 'ABCD сонголтоос зөв нэг хариултыг сонгох', question: 'Бөөдэй ээгтэйгээ хоёрулхаа суудаг болохоор ямар амьтан малдаа өөрөө л явна?', options: ['А. Адуу', 'Б. Тэмээ', 'В. Үхэр', 'Г. Хони'], answer: 'А. Адуу', rubric: 'Зөв сонгосон бол 1 оноо, буруу бол 0 оноо.' },
    { no: 2, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Задгай даалгавар', score: '0-1', action: 'Эхээс холбогдох нэг өгүүлбэр олж бичих', question: 'Бөөдийн бэлчээрт байсан адууг Цээлийн нуурт хөөн ирснийхээ шалтгааныг би баатар юу гэж тайлбарласан бэ?', answer: 'Маргааш нь Бөөдэйг ирнэ гэж итгэсэн учраас, нуурын овоон дээр харуулдан суусан.', rubric: 'Зөв олсон бол 1 оноо, огт бичээгүй бол 0 оноо.' },
    { no: 3, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: '1-2 өгүүлбэрээр тайлбарлан бичих', question: 'Ойдовын сайн сайхныг тодорхойлогч үзүүлэлтүүдийг өгүүлбэрээр тайлбарлан бичээрэй.', answer: 'Хархан мөр, тэгш цагаан шүд, шооч байрын хүрээн нүд болон хороомон гутал өмссөн нь түүний сайхныг харуулж байна.', rubric: 'Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, дутуу бол 1 оноо.' },
    { no: 4, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: '1-2 өгүүлбэрээр тайлбарлан бичих', question: 'Бөөдэйтэй уулзаж байхдаа ямар агшин нь арван долоон насанд хамгийн жаргалтай мөч байсныг тайлбарлана уу.', answer: 'Адуугаа тууж ирээд уургалан эргүүлж Бөөдэйг хүлээж зогсох тэр мөч хамгийн жаргалтай байсан.', rubric: 'Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, дутуу бол 1 оноо.' },
    { no: 5, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: '2-3 өгүүлбэр бичих', question: 'Эхээс Харьцаа, холбоо хэлбэрээр ямар агуулга илэрхийлэгдэж байгаа вэ?', answer: 'Дүрүүдийн сэтгэлийн хөдөлгөөн, бие биедээ тэмүүлэх далд сэтгэл ба эх орны цэргийн албаны үнэ цэнийг харуулсан.', rubric: '2-3 өгүүлбэрээр шинэ санаа гарган дүгнэсэн бол 3 оноо.' },
    { no: 6, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: '2-3 өгүүлбэр бичих', question: 'Өгүүлэгийн гол санаа, зориулго ямар? Таны бодлоор энэ өгүүлэг ямар ач холбогдолтой вэ?', answer: 'Залуу насны гэгээн дурсгал, баатарлаг сэтгэл болон цэргийн албаар дамжин төлөвших ухамсарыг залууст харуулах зорилготой.', rubric: '2-3 өгүүлбэрээр шинэ санаа гарган дүгнэсэн бол 3 оноо.' }
  ];

  const [subjectTexts, setSubjectTexts] = useState(initialSubjectData);
  const [currentTasks, setCurrentTasks] = useState<Task[]>(blueprintTasks);
  const [savedBundles, setSavedBundles] = useState<TaskBundle[]>([]);

  // СУРАГЧИЙН ҮНЭЛГЭЭНИЙ СТЭЙТ (LOCALSTORAGE-ООС СҮҮЛИЙН ҮНЭЛГЭЭГ УНШИНА)
  const [studentEval, setStudentEval] = useState<EvaluationResult>({
    studentName: 'Болд-Эрдэнэ (9Е анги)',
    totalScore: 9,
    maxScore: 12,
    recallScore: 2,
    analyzeScore: 3,
    evalScore: 4,
    teacherApproved: true,
    taskScores: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 2, 6: 2 },
    feedback: 'Цэндао өвөө-багшийн болон багшийн нэгдсэн дүгнэлт: Сурагч даалгавар 5, 6 дээр өгүүлбэрийн тоо дутуу бичсэн тул рубрикийн дагуу оноо хасаж үнэлэв.'
  });

  // MENTOR TSENDAO CHAT STATES
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Сайн байна уу, багш аа! Би "Цэндао өвөө-багш" байна. Танд өнөөдрийн уншлагын даалгавар, Блюпринт болон асуулт боловсруулахад хэрхэн туслах вэ?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const loadedBank = localStorage.getItem('creative_reading_task_bank_v12');
    if (loadedBank) {
      try {
        setSavedBundles(JSON.parse(loadedBank));
      } catch (e) {
        console.error('Даалгаврын сан уншихад алдаа гарлаа', e);
      }
    }

    const loadedEval = localStorage.getItem('student_approved_analytics_data');
    if (loadedEval) {
      try {
        const parsed = JSON.parse(loadedEval);
        setStudentEval(prev => ({
          ...prev,
          recallScore: parsed.recall ?? prev.recallScore,
          analyzeScore: parsed.analyze ?? prev.analyzeScore,
          evalScore: parsed.eval ?? prev.evalScore,
          totalScore: parsed.total ?? (parsed.recall + parsed.analyze + parsed.eval),
          feedback: parsed.feedback ?? prev.feedback
        }));
      } catch (e) {
        console.error('Аналитик ачаалахад алдаа гарлаа', e);
      }
    }
  }, [showAnalyticsModal]);

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleSaveToBank = () => {
    const newBundle: TaskBundle = {
      id: 'TASK-' + Date.now().toString().slice(-4),
      subject: selectedSubject,
      title: subjectTexts[selectedSubject]?.title || selectedSubject + ' хичээлийн даалгавар',
      text: subjectTexts[selectedSubject]?.text || '',
      tasks: currentTasks,
      createdAt: new Date().toLocaleDateString('mn-MN'),
    };
    const updated = [newBundle, ...savedBundles];
    setSavedBundles(updated);
    localStorage.setItem('creative_reading_task_bank_v12', JSON.stringify(updated));
    alert('Баталж, даалгаврын санд амжилттай илгээлээ!');
  };

  const handleApproveAndSendToAnalytics = () => {
    const updatedEval = { ...studentEval, teacherApproved: true, totalScore: studentEval.recallScore + studentEval.analyzeScore + studentEval.evalScore };
    setStudentEval(updatedEval);
    localStorage.setItem('student_approved_analytics_data', JSON.stringify({
      recall: studentEval.recallScore,
      analyze: studentEval.analyzeScore,
      eval: studentEval.evalScore,
      total: studentEval.recallScore + studentEval.analyzeScore + studentEval.evalScore,
      feedback: studentEval.feedback,
      approvedAt: new Date().toLocaleString('mn-MN')
    }));
    setShowStudentReviewModal(false);
    alert('Үнэлгээг амжилттай баталж, Хяналт шинжилгээ (Analytics) рүү илгээлээ!');
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userMsg = chatInput.trim();
    const newMsgs = [...chatMessages, { role: 'user', content: userMsg }];
    setChatMessages(newMsgs);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, subject: selectedSubject }),
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
    } finally {
      setIsAiLoading(false);
    }
  };

  const calculatedTotal = studentEval.recallScore + studentEval.analyzeScore + studentEval.evalScore;
  const totalPercent = Math.round((calculatedTotal / studentEval.maxScore) * 100);

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '16px 24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/project-logo.jpg" alt="Logo" style={{ width: '52px', height: '52px', borderRadius: '10px', border: '1px solid #fbbf24', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Бүтээлч уншлага-2 төсөл (Багшийн танхим)</h1>
            <p style={{ fontSize: '12px', color: '#0284c7', margin: '2px 0 0 0', fontWeight: 'bold' }}>Creative reading-2 project</p>
          </div>
        </div>

        {/* TOP ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowBlueprintModal(true)}
            style={{ backgroundColor: '#fef08a', border: '1px solid #fde047', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#854d0e', cursor: 'pointer' }}
          >
            📋 Блюпринт харах ▼
          </button>

          <button
            onClick={() => setShowChatModal(true)}
            style={{ backgroundColor: '#fef08a', border: '1px solid #fde047', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#854d0e', cursor: 'pointer' }}
          >
            💬 Цэндао багштай ярилцах
          </button>

          <button
            onClick={() => setShowStudentReviewModal(true)}
            style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📝 Сурагчийн хариулт & Цэндао багшийн үнэлгээг засах
          </button>

          {/* MENTOR AI PROFILE */}
          <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde047', borderRadius: '16px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Таны Ментор</div>
              <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold' }}>Онлайн</div>
            </div>
            <img src="/tsendao.jpg" alt="Mentor" style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #f59e0b', objectFit: 'cover' }} />
          </div>
        </div>
      </header>

      {/* 1. БЛЮПРИНТ MODAL */}
      {showBlueprintModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '850px', borderRadius: '16px', padding: '24px', border: '1px solid #cbd5e1', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>📋 Унших чадварын Блюпринт загвар</h3>
              <button onClick={() => setShowBlueprintModal(false)} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>№</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Танин мэдэхүйн түвшин</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Төрөл</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Оноо</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Гүйцэтгэх ажил</th>
                </tr>
              </thead>
              <tbody>
                {blueprintTasks.map((t) => (
                  <tr key={t.no}>
                    <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{t.no}</td>
                    <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{t.cognitive}</td>
                    <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{t.type}</td>
                    <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#166534' }}>{t.score}</td>
                    <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{t.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ЦЭНДАО БАГШТАЙ ЯРИЛЦАХ CHAT MODAL */}
      {showChatModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffbe8', width: '100%', maxWidth: '600px', borderRadius: '20px', padding: '20px', border: '2px solid #fde047', height: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #fde047', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/tsendao.jpg" alt="Mentor" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #f59e0b' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Цэндао өвөө-багш</div>
                  <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>Онлайн</div>
                </div>
              </div>
              <button onClick={() => setShowChatModal(false)} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '12px', backgroundColor: m.role === 'user' ? '#dcfce7' : '#fff', color: '#0f172a', maxWidth: '85%', border: '1px solid #e2e8f0' }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isAiLoading && <div style={{ fontSize: '11px', color: '#64748b' }}>Цэндао багш бичиж байна...</div>}
            </div>

            <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Цэндао багшаас асуулт асуух..."
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #fde047', fontSize: '12px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                Илгээх
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. ДААЛГАВРЫН САН MODAL */}
      {showTaskBankModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '750px', borderRadius: '16px', padding: '24px', border: '1px solid #cbd5e1', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>📁 Даалгаврын сан ({savedBundles.length})</h3>
              <button onClick={() => setShowTaskBankModal(false)} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            {savedBundles.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748b' }}>Одоогоор хадгалсан даалгавар байхгүй байна.</p>
            ) : (
              savedBundles.map((bundle) => (
                <div key={bundle.id} style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{bundle.title}</div>
                  <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '2px' }}>{bundle.subject} | Үүсгэсэн: {bundle.createdAt}</div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px' }}>Даалгаврын тоо: {bundle.tasks.length} асуулт</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. СУРАГЧИЙН ҮНЭЛГЭЭ ЗАСАХ MODAL */}
      {showStudentReviewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffdf0', width: '100%', maxWidth: '750px', borderRadius: '16px', padding: '24px', border: '1px solid #fbbf24', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #fde047', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>
                  📝 Сурагч {studentEval.studentName}-ий үнэлгээг засах & Батлах
                </h3>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>Цэндао өвөө-багшийн болон сурагчийн оноог засах боломжтой.</p>
              </div>
              <button onClick={() => setShowStudentReviewModal(false)} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <div style={{ backgroundColor: '#fffbe8', padding: '14px', borderRadius: '12px', border: '1px solid #fde047', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#854d0e', marginBottom: '10px' }}>📊 3 Танин мэдэхүйн түвшний оноог засах:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#3730a3' }}>📌 Сэргээн санах (Макс 2):</label>
                  <input
                    type="number"
                    max={2}
                    min={0}
                    value={studentEval.recallScore}
                    onChange={(e) => setStudentEval({ ...studentEval, recallScore: Number(e.target.value) })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginTop: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b21a8' }}>📝 Задлан шинжлэх (Макс 4):</label>
                  <input
                    type="number"
                    max={4}
                    min={0}
                    value={studentEval.analyzeScore}
                    onChange={(e) => setStudentEval({ ...studentEval, analyzeScore: Number(e.target.value) })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginTop: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#854d0e' }}>💡 Эргэцүүлэн дүгнэх (Макс 6):</label>
                  <input
                    type="number"
                    max={6}
                    min={0}
                    value={studentEval.evalScore}
                    onChange={(e) => setStudentEval({ ...studentEval, evalScore: Number(e.target.value) })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginTop: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                💬 Багшийн нэгдсэн тайлбар дүгнэлт:
              </label>
              <textarea
                value={studentEval.feedback}
                onChange={(e) => setStudentEval({ ...studentEval, feedback: e.target.value })}
                style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #fde047', fontSize: '12px', backgroundColor: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowStudentReviewModal(false)} style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }}>
                Цуцлах
              </button>
              <button onClick={handleApproveAndSendToAnalytics} style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                ✅ Үнэлгээг баталж Хяналт шинжилгээ рүү илгээх
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. ХЯНАЛТ ШИНЖИЛГЭЭ БА PISA ЧАДВАРЫН АНАЛИТИК MODAL */}
      {showAnalyticsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '900px', borderRadius: '20px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📊 Хяналт шинжилгээ ба PISA чадварын аналитик
                </h2>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                  Сурагч: {studentEval.studentName} | Хичээл: {selectedSubject}
                </p>
              </div>
              <button onClick={() => setShowAnalyticsModal(false)} style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                Хаах ✕
              </button>
            </div>

            {/* НИЙТ ОНООНЫ ХАРАГДАЦ */}
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#166534' }}>🎉 Нэгдсэн гүйцэтгэлийн дүн:</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#14532d', marginTop: '4px' }}>
                  Нийт оноо: {calculatedTotal} / {studentEval.maxScore} оноо ({totalPercent}%)
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: '#15803d', color: '#fff', padding: '6px 14px', borderRadius: '20px' }}>
                {totalPercent >= 80 ? '🌟 Хангалттай Сайн' : totalPercent >= 60 ? '👍 Дундж түвшин' : '⚠️ Сайжруулах шаардлагатай'}
              </span>
            </div>

            {/* 3 ТҮВШНИЙ ПРОГРЕСС БАР GRAPH */}
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px' }}>
                📈 Когнитив 3 түвшний гүйцэтгэлийн график:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* 1. Сэргээн санах */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    <span style={{ color: '#3730a3' }}>📌 Сэргээн санах түвшин (Макс 2):</span>
                    <span style={{ color: '#3730a3' }}>{studentEval.recallScore} / 2 оноо ({Math.round((studentEval.recallScore / 2) * 100)}%)</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#e0e7ff', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${(studentEval.recallScore / 2) * 100}%`, backgroundColor: '#4f46e5', height: '100%', borderRadius: '5px' }} />
                  </div>
                </div>

                {/* 2. Задлан шинжлэх */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    <span style={{ color: '#6b21a8' }}>📝 Задлан шинжлэх түвшин (Макс 4):</span>
                    <span style={{ color: '#6b21a8' }}>{studentEval.analyzeScore} / 4 оноо ({Math.round((studentEval.analyzeScore / 4) * 100)}%)</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#f3e8ff', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${(studentEval.analyzeScore / 4) * 100}%`, backgroundColor: '#9333ea', height: '100%', borderRadius: '5px' }} />
                  </div>
                </div>

                {/* 3. Эргэцүүлэн дүгнэх */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    <span style={{ color: '#854d0e' }}>💡 Эргэцүүлэн дүгнэх түвшин (Макс 6):</span>
                    <span style={{ color: '#854d0e' }}>{studentEval.evalScore} / 6 оноо ({Math.round((studentEval.evalScore / 6) * 100)}%)</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#fef3c7', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${(studentEval.evalScore / 6) * 100}%`, backgroundColor: '#d97706', height: '100%', borderRadius: '5px' }} />
                  </div>
                </div>

              </div>
            </div>

            {/* НЭГДСЭН ТАЙЛБАР ДҮГНЭЛТ */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>💬 Баталгаажуулсан нэгдсэн дүгнэлт:</div>
              <p style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic', margin: 0, lineHeight: '1.6' }}>
                "{studentEval.feedback}"
              </p>
            </div>

          </div>
        </div>
      )}

      {/* MAIN WORKSPACE LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '20px', alignItems: 'start', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* LEFT COLUMN: ЭХ БИЧВЭР & ХИЧЭЭЛ СОНГОХ */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px', minHeight: '700px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📖 Эх бичвэр
            </div>
            <button
              onClick={() => setShowTaskBankModal(true)}
              style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              📁 Даалгаврын сан ({savedBundles.length}) ➔
            </button>
          </div>

          {/* ХИЧЭЭЛ СОНГОХ ТОВЧНУУД (ЗУРАГ-2 ДИЗАЙН) */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '8px' }}>Хичээл сонгох:</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {subjectsList.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubjectChange(sub)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: selectedSubject === sub ? '#0284c7' : '#38bdf8',
                    color: '#fff',
                    boxShadow: selectedSubject === sub ? '0 2px 4px rgba(0,0,0,0.15)' : 'none'
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Эх бичвэрийн гарчиг</label>
            <input
              type="text"
              value={subjectTexts[selectedSubject]?.title || ''}
              onChange={(e) => setSubjectTexts({ ...subjectTexts, [selectedSubject]: { ...subjectTexts[selectedSubject], title: e.target.value } })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #fde047', fontSize: '12px', backgroundColor: '#fff', fontWeight: 'bold', color: '#0f172a', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Унших эх бичвэр (Бүрэн эхээр)</label>
            <textarea
              value={subjectTexts[selectedSubject]?.text || ''}
              onChange={(e) => setSubjectTexts({ ...subjectTexts, [selectedSubject]: { ...subjectTexts[selectedSubject], text: e.target.value } })}
              style={{ width: '100%', height: '480px', padding: '14px', backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '10px', fontSize: '12px', color: '#1e293b', lineHeight: '1.7', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

        </div>

        {/* RIGHT COLUMN: АСУУЛТ ДААЛГАВАР & ХЯНАЛТ ШИНЖИЛГЭЭ ТОВЧ */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '700px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✏️ Асуулт даалгавар
              </div>
              <button
                onClick={() => setShowAnalyticsModal(true)}
                style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                📊 Хяналт шинжилгээ ➔
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '560px', overflowY: 'auto', paddingRight: '4px' }}>
              {currentTasks.map((t, idx) => (
                <div key={idx} style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '14px', padding: '12px', marginBottom: '12px' }}>
                  
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>
                      📌 {t.cognitive}
                    </span>
                    <span style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>
                      📝 {t.type}
                    </span>
                    <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', marginLeft: 'auto' }}>
                      🏆 Оноо: {t.score}
                    </span>
                  </div>

                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
                    ⚡ Гүйцэтгэх ажил: <span style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 'normal' }}>{t.action}</span>
                  </div>

                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '4px' }}>
                    Даалгавар {t.no}:
                  </div>

                  <textarea
                    value={t.question}
                    onChange={(e) => {
                      const updated = [...currentTasks];
                      updated[idx].question = e.target.value;
                      setCurrentTasks(updated);
                    }}
                    style={{ width: '100%', height: '50px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  />

                  {/* ТЕСТИЙН СОНГОЛТУУД (ДААЛГАВАР 1 СУРАГЧИЙН ХЭСЭГТ) */}
                  {idx === 0 && t.options && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '4px' }}>Сонголтууд (Засах боломжтой):</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        {t.options.map((opt, oIdx) => (
                          <input
                            key={oIdx}
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...currentTasks];
                              if (updated[0].options) {
                                updated[0].options[oIdx] = e.target.value;
                                setCurrentTasks(updated);
                              }
                            }}
                            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '10px', backgroundColor: '#fff' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveToBank}
            style={{ width: '100%', padding: '14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: '12px' }}
          >
            ✅ Баталж, даалгаврын санд илгээх
          </button>
        </div>

      </div>

    </div>
  );
}