'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

  const [sendingBundle, setSendingBundle] = useState<TaskBundle | null>(null);
  const [dueDate, setDueDate] = useState('');

  const [selectedSubject, setSelectedSubject] = useState('Уран зохиол');
  const [bankFilterSubject, setBankFilterSubject] = useState('Бүх хичээл');

  const subjects = ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'];

  const initialSubjectData: Record<string, { title: string; text: string }> = {
    'Уран зохиол': {
      title: 'Ж.Лхагва "Арван долоотой байхад" өгүүлэг',
      text: `Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.

Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор тэмээ малдаа өөрөө л явна. Хааяа унагаа үлдээнэ гэж адуугаа тууж ирэхэд нь би уургынхаа хээрийг барьж мордоод хорь хүрэхгүй адууг нь хураан хөндөлцүүлж явахаар барих морио тэгэхээс тэгж адуунаас нь гарган элдээд сүүл дэрлэн дагах хэвтээ дэмтэй сайхан хээрийнхээ дөрөө зуран эргэх яг л тэр агшинд бөхийн цацаж, сүүлэндээ салхи татуулан зугатах морины нарийн хоншоороор уургалан эргүүлээд урган давхисан адууныхаа хойноос янцгаан тэмүүлэх түүнийг эмнэг уургалсан мэт цухалзуураар нь эргүүлж Бөөдэйг хүлээж зогсоно.

Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн, мориныхоо нурууг нар харвахаас болгоомжлон салхи оруулж хэсэг сүүдэрлэн зогссоноо хазаараа мулталж инээсээр ирнэ.`,
    },
    'Хими': {
      title: 'Хими: "Усны бүтэц ба химийн холбоос"',
      text: 'Усны молекул (H2O) нь хоёр водород ба нэг кислородын атомоос тогтоно.',
    },
    'Биологи': {
      title: 'Биологи: "Эс ба амьд организмын удамшил"',
      text: 'Амьд өртөнцийн хамгийн бага бөгөөд суурь нэгж нь эс юм.',
    },
    'Түүх': {
      title: 'Түүх: "1921 оны Ардын хувьсгал"',
      text: '1921 оны Ардын хувьсгалын гол зорилго нь Гадаад дарлалаас чөлөөлөх, тусгаар тогтнолоо сэргээн мандуулах явдал байв.',
    },
    'Физик': {
      title: 'Физик: "Механик энергийн хувирал"',
      text: 'Биед үйлчлэх хүч нь түүний масс болон хурдасгалын үржвэртэй тэнцүү (F=ma).',
    },
    'Газар зүй': {
      title: 'Газар зүй: "Монгол орны ландшафт"',
      text: 'Монгол орны нутаг дэвсгэр нь эрс тэс уур амьсгалтай, хангай говь хосолсон өвөрмөц тогтоцтой.',
    },
  };

  const blueprintTasks: Task[] = [
    { no: 1, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Сонгох тест', score: '0-1', action: 'ABCD сонголтоос зөв нэг хариултыг сонгох', question: 'Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор ямар амьтан малдаа өөрөө л явна?', options: ['А. Адуу', 'Б. Тэмээ', 'В. Үхэр', 'Г. Морь'], answer: 'Б. Тэмээ', rubric: 'Зөв сонгосон бол 1 оноо.' },
    { no: 2, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Задгай даалгавар', score: '0-1', action: 'Эхээс холбогдох нэг өгүүлбэр олж бичих', question: 'Бөөдийн бэлчээрт байсан адууг Цээлийн нуурт хөөн ирснийхээ шалтгааныг би баатар юу гэж тайлбарласан байна вэ?', rubric: 'Зөв олсон бол 1 оноо.' },
    { no: 3, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: '1-2 өгүүлбэрээр тайлбарлан бичих', question: 'Ойдовын сайн сайхныг тодорхойлогч үзүүлэлтүүдийг өгүүлбэрээр тайлбарлан бичээрэй.', rubric: 'Зөв тайлбарласан бол 2 оноо.' },
    { no: 4, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: '1-2 өгүүлбэрээр тайлбарлан бичих', question: 'Бөөдэйтэй уулзаж байхдаа ямар агшин нь арван долоон насанд хамгийн жаргалтай мөч байсныг тайлбарлана уу.', rubric: 'Зөв тайлбарласан бол 2 оноо.' },
    { no: 5, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: '2-3 өгүүлбэр бичих', question: 'Ж.Лхагва "Арван долоотой байхад" өгүүлэгт эхээс Харьцаа, холбоо хэлбэрээр ямар агуулга илэрхийлэгдэж байгаа вэ?', rubric: '3 оноо.' },
    { no: 6, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: '2-3 өгүүлбэр бичих', question: 'Өгүүлэгийн гол санаа, зориулго ямар?', rubric: '3 оноо.' }
  ];

  const [subjectTexts, setSubjectTexts] = useState(initialSubjectData);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
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
      } catch {
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

  const handleGenerateTasks = () => {
    setCurrentTasks(blueprintTasks);
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

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '16px 24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SECTION (ЗУРАГ-3 СТИЛЬ) */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/project-logo.jpg" alt="Logo" style={{ width: '52px', height: '52px', borderRadius: '10px', border: '1px solid #fbbf24', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Бүтээлч уншлага-2 төсөл (Багшийн танхим)</h1>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>9Е ангид зориулсан PISA даалгавар боловсруулах орчин</p>
          </div>
        </div>

        {/* MENTOR AI BADGE & BUTTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ backgroundColor: '#f59e0b', color: '#000', fontWeight: 'bold', padding: '4px 16px', borderRadius: '16px', fontSize: '11px' }}>
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

        {/* AVATAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>Таны Ментор</div>
            <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold' }}>• Онлайн</div>
          </div>
          <img src="/tsendao.jpg" alt="Цэндао багш" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #f59e0b', objectFit: 'cover' }} />
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
              {blueprintTasks.map(t => (
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
          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Асуултаа бичээд Илгээх товч дараарай..."
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #fde047', fontSize: '12px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
              Илгээх
            </button>
          </form>
        </div>
      )}

      {/* ГҮЙЦЭТГЭЖ ДУУСАХ САР ӨДӨР, ЦАГ МИНУТ СОНГОХ MODAL */}
      {sendingBundle && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '460px', borderRadius: '16px', padding: '24px', border: '1px solid #fbbf24' }}>
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

      {/* ДААЛГАВРЫН САН POPUP */}
      {showTaskBank && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffdf0', width: '100%', maxWidth: '1200px', borderRadius: '20px', border: '1px solid #fde047', padding: '24px', maxHeight: '92vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
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
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Хичээлээр ангилах:</div>
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
              {filteredBundles.map((bundle) => {
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

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openSendModal(bundle)} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                          🚀 9Е ангид илгээх
                        </button>
                        <button onClick={() => handleLoadBundle(bundle)} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                          📥 Үндсэн ажилд ачаалах
                        </button>
                        <button onClick={() => handleDeleteBundle(bundle.id)} style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                          🗑️ Устгах
                        </button>
                        <button onClick={() => setExpandedBundleId(isExpanded ? null : bundle.id)} style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '7px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                          {isExpanded ? '▲ Хумих' : '▼ Дэлгэрэнгүй'}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #fde047' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>📖 Эх бичвэр:</div>
                        <div style={{ fontSize: '11px', color: '#334155', backgroundColor: '#fffdf0', padding: '10px', borderRadius: '8px', border: '1px solid #fde047', maxHeight: '120px', overflowY: 'auto', lineHeight: '1.6' }}>
                          {bundle.text}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE LAYOUT (ЗУРАГ-3 СТИЛЬ) */}
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
            ⚡ {selectedSubject} хичээлийн даалгавар боловсруулах
          </button>
        </div>

        {/* RIGHT COLUMN: TASKS & LINK */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', margin: 0, color: '#0f172a' }}>✏️ Асуулт даалгавар</h2>
              
              {/* ЗУРАГ-2, 3 ДЭЭРХ ЦЭНХЭР ХЯНАЛТ ШИНЖИЛГЭЭ ТОВЧ */}
              <Link
                href="/analytics"
                style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}
              >
                📊 Хяналт шинжилгээ ➔
              </Link>
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
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>Даалгавар {t.no}: {t.question}</div>
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