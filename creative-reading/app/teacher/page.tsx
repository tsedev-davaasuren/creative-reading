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

export default function TeacherRoom() {
  const [showChat, setShowChat] = useState(false);
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [showTaskBank, setShowTaskBank] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // ГҮЙЦЭТГЭЖ ДУУСАХ ХУГАЦАА СУУРИЛУУЛАХ MODAL-ИЙН СТЭЙТҮҮД
  const [sendingBundle, setSendingBundle] = useState<TaskBundle | null>(null);
  const [dueDate, setDueDate] = useState('');

  // ДААЛГАВРЫН САНД СОНГОСОН ХАРИУЛТЫГ ХАДГАЛАХ СТЭЙТ
  const [bankSelectedAnswers, setBankSelectedAnswers] = useState<Record<string, string>>({});

  const [selectedSubject, setSelectedSubject] = useState('Уран зохиол');
  const [bankFilterSubject, setBankFilterSubject] = useState('Бүх хичээл');

  const subjects = ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'];

  const initialSubjectData: Record<string, { title: string; text: string }> = {
    'Уран зохиол': {
      title: '10. Ж.Лхагва "Арван долоотой байхад" өгүүлэг',
      text: `Ж.Лхагва "Арван долоотой байхад" өгүүлэг
Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.
Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор тэмээ малдаа өөрөө л явна. Хааяа унагаа юулүүлэх гэж адуугаа тууж ирэхэд нь би уургынхаа хээрийг барьж мордоод хорь хүрэхгүй адууг нь хураан хөндөлцүүлж явсаар барих морио тэгхээс тэгж адуунаас нь гарган элдээд сүүл дэрлэн дагах хэвтээ дэмтэй сайхан хээрийнхээ дөрөө зуран эргэх яг л тэр агшинд бөхийн цацаж, сүүлэндээ салхи татуулан зугатах морины нарийн хоншоороор уургалан эргүүлээд урган давхисан адууныхаа хойноос янцгаан тэмүүлэх түүнийг эмнэг уургалсан мэт цухалзуураар нь эргүүлж Бөөдэйг хүлээж зогсоно.
Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн, мориныхоо нурууг нар харвахаас болгоомжлон салхи оруулж хэсэг сүүдэрлэн зогссоноо хазаараа мулталж инээсээр ирнэ.`,
    },
    'Хими': {
      title: 'Хими: "Усны бүтэц ба химийн холбоос"',
      text: 'Усны молекул (H2O) нь хоёр водород ба нэг кислородын атомоос тогтоно.',
    },
    'Биологи': {
      title: 'Биологи: "Фотосинтезийн үзэгдэл"',
      text: 'Ургамал нарны гэрлийн энергийг ашиглан нүүрсхүчлийн хий болон уснаас органик бодис синтезлэн хлоропластдаа глюкоз үйлдвэрлэдэг.',
    },
    'Түүх': {
      title: 'Түүх: "1921 оны Ардын хувьсгал"',
      text: '1921 оны Ардын хувьсгалын гол зорилго нь Гадаад дарлалаас чөлөөлөх, тусгаар тогтнолоо сэргээн мандуулах явдал байв.',
    },
    'Физик': {
      title: 'Физик: "10. Механик энергийн хувирал ба хадгалагдах хууль"',
      text: 'Биед үйлчлэх хүч нь түүний масс болон хурдасгалын үржвэртэй тэнцүү (F=ma).',
    },
    'Газар зүй': {
      title: 'Газар зүй: "Монгол орны ландшафт"',
      text: 'Монгол орны нутаг дэвсгэр нь эрс тэс уур амьсгалтай, хангай говь хосолсон өвөрмөц тогтоцтой.',
    },
  };

  const blueprintTasks: Task[] = [
    {
      no: 1,
      cognitive: 'Мэдээлэл олох сэргээн санах',
      type: 'Сонгох тест',
      score: '0-1',
      action: 'ABCD сонголтоос зөв нэг хариултыг сонгох',
      question: 'Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор ямар амьтан малдаа өөрөө л явна?',
      options: ['А. Адуу', 'Б. Тэмээ', 'В. Үхэр', 'Г. Морь'],
      answer: 'Б. Тэмээ',
      rubric: 'Зөв сонгосон бол 1 оноо, буруу сонгосон бол 0 оноо.'
    },
    {
      no: 2,
      cognitive: 'Мэдээлэл олох сэргээн санах',
      type: 'Задгай даалгавар',
      score: '0-1',
      action: 'Эхээс холбогдох нэг өгүүлбэр олж бичих',
      question: 'Бөөдийн бэлчээрт байсан адууг Цээлийн нуурт хөөн ирснийхээ шалтгааныг би баатар юу гэж тайлбарласан байна вэ?',
      answer: 'Маргааш нь Бөөдэйг ирнэ гэж итгэсэн учраас, нуурын баруун овоон дээр харуулдан суусан.',
      rubric: 'Зөв олсон бол 1 оноо, огт бичээгүй бол 0 оноо.'
    },
    {
      no: 3,
      cognitive: 'Задлан шинжлэх',
      type: 'Задгай даалгавар',
      score: '0-2',
      action: '1-2 өгүүлбэрээр тайлбарлан бичих',
      question: 'Номын эх бүтцэд Ойдовын сайн сайхныг тодорхойлогч үзүүлэлтүүдийг өгүүлбэрээр тайлбарлан бичээрэй.',
      answer: 'Хархан мөр, тэгш цагаан шүд, шооч байрын хүрээн нүд болон хороомон гутал өмссөн нь түүний сайхныг харуулж байна.',
      rubric: 'Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, тайлбар дутуу бол 1 оноо.'
    },
    {
      no: 4,
      cognitive: 'Задлан шинжлэх',
      type: 'Задгай даалгавар',
      score: '0-2',
      action: '1-2 өгүүлбэрээр тайлбарлан бичих',
      question: 'Номын эх бүтцэд Бөөдэйтэй уулзаж байхдаа ямар агшин нь арван долоон насанд хамгийн жаргалтай мөч байсныг тайлбарлана уу.',
      answer: 'Адуугаа тууж ирээд уургалан эргүүлж Бөөдэйг хүлээж зогсох тэр мөч хамгийн жаргалтай байсан.',
      rubric: 'Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, тайлбар дутуу бол 1 оноо.'
    },
    {
      no: 5,
      cognitive: 'Эргэцүүлэн дүгнэх',
      type: 'Задгай даалгавар',
      score: '0-3',
      action: '2-3 өгүүлбэр бичих',
      question: 'Ж.Лхагва "Арван долоотой байхад" өгүүлэгт эхээс Харьцаа, холбоо хэлбэрээр ямар агуулга илэрхийлэгдэж байгаа вэ?',
      answer: 'Дүрүүдийн сэтгэлийн хөдөлгөөн, бие биедээ тэмүүлэх далд сэтгэл ба эх орны цэргийн албаны үнэ цэнийг харуулсан.',
      rubric: '2-3 өгүүлбэрээр шинэ санаа гарган дүгнэсэн бол 3 оноо, шинэ санаагүй бол 2 оноо, дутуу бол 1 оноо.'
    },
    {
      no: 6,
      cognitive: 'Эргэцүүлэн дүгнэх',
      type: 'Задгай даалгавар',
      score: '0-3',
      action: '2-3 өгүүлбэр бичих',
      question: 'Ж.Лхагва "Арван долоотой байхад" өгүүлэгийн гол санаа, зориулго ямар? Таны бодлоор энэ өгүүлэг агуулагдаж буй санаа нь хүмүүст ямар ач холбогдолтой байх вэ?',
      answer: 'Залуу насны гэгээн дурсгал, баатарлаг сэтгэл болон цэргийн албаар дамжин төлөвших ухамсарыг залууст харуулах зорилготой.',
      rubric: '2-3 өгүүлбэрээр шинэ санаа гарган дүгнэсэн бол 3 оноо, шинэ санаагүй бол 2 оноо, дутуу бол 1 оноо.'
    }
  ];

  const [subjectTexts, setSubjectTexts] = useState(initialSubjectData);
  const [currentTasks, setCurrentTasks] = useState<Task[]>(blueprintTasks);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [savedBundles, setSavedBundles] = useState<TaskBundle[]>([]);
  const [expandedBundleId, setExpandedBundleId] = useState<string | null>('TASK-001');

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Сайн байна уу! Би Цэндао багш байна. PISA даалгавар боловсруулахад туслахад бэлэн.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const loaded = localStorage.getItem('creative_reading_task_bank_v12');
    if (loaded) {
      try {
        const parsed = JSON.parse(loaded);
        setSavedBundles(parsed);
        if (parsed.length > 0) setExpandedBundleId(parsed[0].id);
      } catch (e) {
        initDefaultBundle();
      }
    } else {
      initDefaultBundle();
    }
  }, []);

  const initDefaultBundle = () => {
    const defaultBundle: TaskBundle = {
      id: 'TASK-001',
      subject: 'Уран зохиол',
      title: initialSubjectData['Уран зохиол'].title,
      text: initialSubjectData['Уран зохиол'].text,
      tasks: blueprintTasks,
      createdAt: new Date().toLocaleDateString('mn-MN'),
    };
    setSavedBundles([defaultBundle]);
    setExpandedBundleId('TASK-001');
    localStorage.setItem('creative_reading_task_bank_v12', JSON.stringify([defaultBundle]));
  };

  const saveBundlesToStorage = (newBundles: TaskBundle[]) => {
    setSavedBundles(newBundles);
    localStorage.setItem('creative_reading_task_bank_v12', JSON.stringify(newBundles));
  };

  const handleGenerateTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_tasks',
          subject: selectedSubject,
          textContent: subjectTexts[selectedSubject]?.text || '',
        }),
      });

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCurrentTasks(data);
      } else {
        setCurrentTasks(blueprintTasks);
      }
    } catch {
      setCurrentTasks(blueprintTasks);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleSaveToBank = () => {
    const tasksToSave = currentTasks.length > 0 ? currentTasks : blueprintTasks;

    const newBundle: TaskBundle = {
      id: 'TASK-' + Date.now().toString().slice(-4),
      subject: selectedSubject,
      title: subjectTexts[selectedSubject]?.title || selectedSubject + ' хичээлийн даалгавар',
      text: subjectTexts[selectedSubject]?.text || '',
      tasks: tasksToSave,
      createdAt: new Date().toLocaleDateString('mn-MN'),
    };

    const updated = [newBundle, ...savedBundles];
    saveBundlesToStorage(updated);
    setExpandedBundleId(newBundle.id);
    alert('Баталж, даалгаврын санд амжилттай илгээлээ!');
  };

  const handleDeleteBundle = (id: string) => {
    if (confirm('Энэ даалгаврын багцыг сангаас устгахдаа итгэлтэй байна уу?')) {
      const updated = savedBundles.filter((b) => b.id !== id);
      saveBundlesToStorage(updated);
    }
  };

  const handleLoadBundle = (bundle: TaskBundle) => {
    setSelectedSubject(bundle.subject);
    if (bundle.text) {
      setSubjectTexts(prev => ({
        ...prev,
        [bundle.subject]: { title: bundle.title, text: bundle.text }
      }));
    }
    setCurrentTasks(bundle.tasks);
    setShowTaskBank(false);
    alert(`"${bundle.title}" даалгаврыг үндсэн ажилд ачааллаа.`);
  };

  const openSendModal = (bundle: TaskBundle) => {
    setSendingBundle(bundle);
    const now = new Date();
    now.setDate(now.getDate() + 2);
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T18:00`;
    setDueDate(formatted);
  };

  const confirmSendToClass = () => {
    if (!sendingBundle || !dueDate) return;
    const formattedDate = dueDate.replace('T', ' ');
    alert(`"${sendingBundle.title}" даалгаврыг 9Е анги руу амжилттай илгээлээ!\n\n📅 Гүйцэтгэж дуусах хугацаа: ${formattedDate}`);
    setSendingBundle(null);
  };

  const handleUpdateTaskQuestion = (index: number, val: string) => {
    const updated = [...currentTasks];
    updated[index].question = val;
    setCurrentTasks(updated);
  };

  const handleUpdateTaskOption = (taskIndex: number, optIndex: number, val: string) => {
    const updated = [...currentTasks];
    if (updated[taskIndex].options) {
      const opts = [...(updated[taskIndex].options || [])];
      opts[optIndex] = val;
      updated[taskIndex].options = opts;
      setCurrentTasks(updated);
    }
  };

  const handleUpdateTaskAnswer = (index: number, val: string) => {
    const updated = [...currentTasks];
    updated[index].answer = val;
    setCurrentTasks(updated);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsgs = [...messages, { role: 'user', content: userText }];
    setMessages(newMsgs);
    setChatInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, subject: selectedSubject }),
      });

      const rawReply = await res.text();
      let displayContent = rawReply;

      try {
        const jsonObj = JSON.parse(rawReply);
        displayContent = typeof jsonObj === 'string' ? jsonObj : (jsonObj.reply || jsonObj.message || JSON.stringify(jsonObj));
      } catch {
        displayContent = rawReply;
      }

      setMessages([...newMsgs, { role: 'assistant', content: displayContent }]);
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Холболтонд алдаа гарлаа.' }]);
    }
  };

  const getSubjectCount = (subj: string) => {
    if (subj === 'Бүх хичээл') return savedBundles.length;
    return savedBundles.filter((b) => b.subject === subj).length;
  };

  const filteredBundles = bankFilterSubject === 'Бүх хичээл' 
    ? savedBundles 
    : savedBundles.filter((b) => b.subject === bankFilterSubject);

  // ХЯНАЛТ ШИНЖИЛГЭЭНИЙ ХУУДАС РУУ ШУУД НЭВТРЭХ ФУНКЦ
  const handleOpenAnalytics = () => {
    window.location.href = 'https://creative-reading.vercel.app/analytics';
  };

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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ backgroundColor: '#f59e0b', color: '#000', fontWeight: 'bold', padding: '6px 20px', borderRadius: '20px', fontSize: '12px' }}>
            Mentor AI Цэндао багштай
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowBlueprint(!showBlueprint)} style={{ padding: '6px 14px', borderRadius: '12px', border: 'none', backgroundColor: '#fef08a', color: '#000', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              📋 Блюпринт харах {showBlueprint ? '▲' : '▼'}
            </button>
            <button onClick={() => setShowChat(!showChat)} style={{ padding: '6px 14px', borderRadius: '12px', border: 'none', backgroundColor: '#fef08a', color: '#000', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              💬 Цэндао багштай ярилцах
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '4px 10px', backgroundColor: '#fef9c3', borderRadius: '12px', border: '1px solid #fde047' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Таны Ментор</div>
            <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}>Онлайн</div>
          </div>
          <img src="/tsendao.jpg" alt="Цэндао багш" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid #f59e0b', objectFit: 'cover' }} />
        </div>
      </header>

      {/* BLUEPRINT POPUP */}
      {showBlueprint && (
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '12px', padding: '16px', marginBottom: '16px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#854d0e', margin: '0 0 10px 0' }}>📋 Даалгаврын блюпринт ба онооны рубрик (6 даалгавар / 12 оноо)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#fef08a', color: '#854d0e' }}>
                <th style={{ padding: '6px', border: '1px solid #fde047' }}>№</th>
                <th style={{ padding: '6px', border: '1px solid #fde047' }}>Хэлбэр</th>
                <th style={{ padding: '6px', border: '1px solid #fde047' }}>Танин мэдэхүйн түвшин</th>
                <th style={{ padding: '6px', border: '1px solid #fde047' }}>Гүйцэтгэх ажил</th>
                <th style={{ padding: '6px', border: '1px solid #fde047' }}>Оноо</th>
                <th style={{ padding: '6px', border: '1px solid #fde047' }}>Онооны задаргаа (Рубрик)</th>
              </tr>
            </thead>
            <tbody>
              {blueprintTasks.map((t) => (
                <tr key={t.no}>
                  <td style={{ padding: '6px', border: '1px solid #fde047' }}>{t.no}</td>
                  <td style={{ padding: '6px', border: '1px solid #fde047' }}>{t.type}</td>
                  <td style={{ padding: '6px', border: '1px solid #fde047' }}>{t.cognitive}</td>
                  <td style={{ padding: '6px', border: '1px solid #fde047' }}>{t.action}</td>
                  <td style={{ padding: '6px', border: '1px solid #fde047', fontWeight: 'bold' }}>{t.score}</td>
                  <td style={{ padding: '6px', border: '1px solid #fde047' }}>{t.rubric}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CHAT POPUP */}
      {showChat && (
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#854d0e' }}>💬 Цэндао багштай ярилцах</div>
            <button onClick={() => setShowChat(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          </div>
          <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '12px', backgroundColor: m.role === 'user' ? '#dcfce7' : '#fef08a', color: m.role === 'user' ? '#14532d' : '#713f12', maxWidth: '85%' }}>
                  {m.role === 'assistant' && <strong>👨‍🏫 Цэндао багш: </strong>}
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <textarea
              rows={3}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Асуултаа энд бүтнээр нь бичиж хянаад илгээгээрэй..."
              style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #fde047', fontSize: '12px', resize: 'vertical', minHeight: '60px', outline: 'none', backgroundColor: '#fffbe8' }}
            />
            <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
              Илгээх
            </button>
          </form>
        </div>
      )}

      {/* ГҮЙЦЭТГЭЖ ДУУСАХ САР ӨДӨР, ЦАГ МИНУТ СОНГОХ MODAL */}
      {sendingBundle && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '460px', borderRadius: '16px', padding: '24px', border: '1px solid #fbbf24', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>
              🚀 9Е анги руу даалгавар илгээх
            </h3>
            <p style={{ fontSize: '12px', color: '#475569', marginBottom: '16px' }}>
              Багц: <strong>{sendingBundle.title}</strong>
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                📅 Гүйцэтгэж дуусах сар, өдөр, цаг, минут:
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSendingBundle(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Цуцлах
              </button>
              <button
                onClick={confirmSendToClass}
                style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Илгээх ✅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ДААЛГАВРЫН САН */}
      {showTaskBank && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffdf0', width: '100%', maxWidth: '1400px', borderRadius: '20px', border: '1px solid #fde047', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '92vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📁 Даалгаврын сан
                </h2>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                  Нийт хадгалагдсан: <strong>{savedBundles.length}</strong> багц даалгавар
                </p>
              </div>
              <button onClick={() => setShowTaskBank(false)} style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                Хаах ✕
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Хичээлээр ангилах (Тоо ширхэгтэй):</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Бүх хичээл', ...subjects].map((subj) => {
                  const count = getSubjectCount(subj);
                  const isSelected = bankFilterSubject === subj;
                  return (
                    <button
                      key={subj}
                      onClick={() => setBankFilterSubject(subj)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                        backgroundColor: isSelected ? '#e0f2fe' : '#fff',
                        color: isSelected ? '#0369a1' : '#334155',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {subj} <span style={{ backgroundColor: isSelected ? '#0284c7' : '#94a3b8', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '10px' }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredBundles.length > 0 ? (
                filteredBundles.map((bundle) => {
                  const isExpanded = expandedBundleId === bundle.id;
                  return (
                    <div key={bundle.id} style={{ border: '1px solid #fde047', borderRadius: '16px', padding: '16px', backgroundColor: '#fffbe8' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '6px' }}>
                            {bundle.subject}
                          </span>
                          <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>
                            {bundle.title}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => openSendModal(bundle)}
                            style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            🚀 9Е ангид илгээх
                          </button>
                          <button
                            onClick={() => handleLoadBundle(bundle)}
                            style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            📥 Үндсэн ажилд ачаалах
                          </button>
                          <button
                            onClick={() => handleDeleteBundle(bundle.id)}
                            style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            🗑️ Устгах
                          </button>
                          <button
                            onClick={() => setExpandedBundleId(isExpanded ? null : bundle.id)}
                            style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '7px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            {isExpanded ? '▲ Хумих' : '▼ Дэлгэрэнгүй'}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '16px', alignItems: 'start', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #fde047' }}>
                          
                          {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР */}
                          <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>
                              📖 Эх бичвэр
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Эх бичвэрийн гарчиг:</label>
                              <input
                                type="text"
                                readOnly
                                value={bundle.title}
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '11px', backgroundColor: '#fffbe8', fontWeight: 'bold', boxSizing: 'border-box' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Агуулга:</label>
                              <div style={{ fontSize: '11px', color: '#1e293b', backgroundColor: '#fffbe8', padding: '12px', borderRadius: '8px', border: '1px solid #fde047', maxHeight: '220px', overflowY: 'auto', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                {bundle.text}
                              </div>
                            </div>
                          </div>

                          {/* БАРУУН ТАЛ: ДААЛГАВРУУД */}
                          <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>
                              ✏️ Багч даалгаврууд ({bundle.tasks.length})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                              {bundle.tasks.map((task, idx) => (
                                <div key={idx} style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '8px', padding: '10px' }}>
                                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '4px' }}>
                                    📌 Даалгавар {task.no} ({task.cognitive}) - Оноо: {task.score}
                                  </div>
                                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>
                                    {task.question}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>Сонгосон хичээл дээр даалгавар одоогоор хадгалагдаагүй байна.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '20px', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* LEFT COLUMN: TEXT EDITOR */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', margin: 0, color: '#0f172a' }}>📖 Эх бичвэр</h2>
              <button
                onClick={() => setShowTaskBank(true)}
                style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                📁 Даалгаврын сан ({savedBundles.length}) ➔
              </button>
            </div>

            {/* SUBJECT BUTTONS */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>Хичээл сонгох:</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '16px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: selectedSubject === sub ? '#0284c7' : '#38bdf8',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* TITLE */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Эх бичвэрийн гарчиг</label>
              <input
                type="text"
                value={subjectTexts[selectedSubject]?.title || ''}
                onChange={(e) => setSubjectTexts({ ...subjectTexts, [selectedSubject]: { ...subjectTexts[selectedSubject], title: e.target.value } })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #fde047', fontSize: '12px', backgroundColor: '#fff', fontWeight: 'bold', color: '#0f172a', boxSizing: 'border-box' }}
              />
            </div>

            {/* TEXTAREA */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Унших эх бичвэр (Бүрэн эхээр)</label>
              <textarea
                value={subjectTexts[selectedSubject]?.text || ''}
                onChange={(e) => setSubjectTexts({ ...subjectTexts, [selectedSubject]: { ...subjectTexts[selectedSubject], text: e.target.value } })}
                style={{ width: '100%', height: '320px', padding: '14px', backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '10px', fontSize: '12px', color: '#1e293b', lineHeight: '1.7', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          </div>

          {/* GREEN GENERATE BUTTON */}
          <button
            onClick={handleGenerateTasks}
            style={{ width: '100%', padding: '14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
          >
            {loadingTasks ? '⏳ Боловсруулж байна...' : `⚡ ${selectedSubject} хичээлийн даалгавар боловсруулах`}
          </button>
        </div>

        {/* RIGHT COLUMN: TASKS & LINK */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', margin: 0, color: '#0f172a' }}>✏️ Асуулт даалгавар</h2>
              
              {/* ЗУРАГ-1 ДЭЭРХ ХЯНАЛТ ШИНЖИЛГЭЭ ТОВЧЛУУР (https://creative-reading.vercel.app/analytics РҮҮ ШУУД НЭВТРЭХ) */}
              <button
                type="button"
                onClick={handleOpenAnalytics}
                style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-block' }}
              >
                📊 Хяналт шинжилгээ ➔
              </button>
            </div>

            {currentTasks.length === 0 ? (
              <div style={{ backgroundColor: '#fff', border: '1px solid #fde047', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', margin: '40px 0' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>
                  Даалгавар боловсруулаагүй байна.
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  "⚡ Даалгавар боловсруулах" товчийг дараарай.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '420px', overflowY: 'auto' }}>
                {currentTasks.map((t, idx) => (
                  <div key={idx} style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '10px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#3730a3', marginBottom: '4px' }}>📌 {t.cognitive} | Оноо: {t.score}</div>
                    <input
                      type="text"
                      value={t.question}
                      onChange={(e) => handleUpdateTaskQuestion(idx, e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: 'bold', color: '#0f172a', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GREEN SAVE BUTTON */}
          <button
            onClick={handleSaveToBank}
            style={{ width: '100%', padding: '14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: '12px' }}
          >
            💾 Даалгаврыг баталж, санд илгээх
          </button>
        </div>

      </div>

    </div>
  );
}