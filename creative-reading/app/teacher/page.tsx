'use client';

import React, { useState } from 'react';

interface Task {
  no?: number;
  cognitive?: string;
  type?: string;
  score?: string;
  action?: string;
  question?: string;
  options?: string[];
  answer?: string;
  rubric?: string;
}

export default function TeacherRoom() {
  const [showChat, setShowChat] = useState(false);
  const [showBlueprint, setShowBlueprint] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState('Уран зохиол');
  const subjects = ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'];

  const initialSubjectData: Record<string, { title: string; text: string }> = {
    'Уран зохиол': {
      title: 'Ж.Лхагва "Арван долоотой байхад" өгүүлэг',
      text: `Ж.Лхагва "Арван долоотой байхад" өгүүлэг
Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.
Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор тэмээ малдаа өөрөө л явна. Хааяа унагаа юулүүлэх гэж адуугаа тууж ирэхэд нь би уургынхаа хээрийг барьж мордоод хорь хүрэхгүй адууг нь хураан хөндөлцүүлж явсаар барих морио тэгхээс тэгж адуунаас нь гарган элдээд сүүл дэрлэн дагах хэвтээ дэмтэй сайхан хээрийнхээ дөрөө зуран эргэх яг л тэр агшинд бөхийн цацаж, сүүлэндээ салхи татуулан зугатах морины нарийн хоншоороор уургалан эргүүлээд урган давхисан адууныхаа хойноос янцгаан тэмүүлэх түүнийг эмнэг уургалсан мэт цухалзуураар нь эргүүлж Бөөдэйг хүлээж зогсоно.
Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн, мориныхоо нурууг нар харвахаас болгоомжлон салхи оруулж хэсэг сүүдэрлэн зогссоноо хазаараа мулталж инээсээр ирнэ.`,
    },
    'Хими': {
      title: 'Хими: "Усны бүтэц ба химийн холбоос"',
      text: 'Усны молекул (H2O) нь хоёр водород ба нэг кислородын атомоос тогтоно. Ковалент туйлшралтай холбоотой тул усны молекулуудын хооронд водородон холбоо үүсдэг.',
    },
    'Биологи': {
      title: 'Биологи: "Фотосинтезийн үзэгдэл"',
      text: 'Ургамал нарны гэрлийн энергийг ашиглан нүүрсхүчлийн хий болон уснаас органик бодис синтезлэн хлоропластдаа глюкоз үйлдвэрлэдэг.',
    },
    'Түүх': {
      title: 'Түүх: "Их Монгол Улсын мандал бадрал"',
      text: '1206 онд Чингис хаан Их Монгол Улсыг байгуулж, Нэгдсэн төрийг цогцлоон Ази, Европыг холбосон худалдаа соёлын зангилааг үүсгэжээ.',
    },
    'Физик': {
      title: 'Физик: "Ньютоны хөдөлгөөний хууль"',
      text: 'Биед үйлчлэх хүч нь түүний масс болон хурдасгалын үржвэртэй тэнцүү (F=ma).',
    },
    'Газар зүй': {
      title: 'Газар зүй: "Монгол орны ландшафт"',
      text: 'Монгол орны нутаг дэвсгэр нь агаар мандлын эрс тэс уур амьсгалтай бөгөөд хангай, говь, хээр хосолсон өвөрмөц тогтоцтой.',
    },
  };

  const [subjectTexts, setSubjectTexts] = useState(initialSubjectData);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Сайн байна уу! Би Цэндао багш байна. PISA даалгавар боловсруулахад туслахад бэлэн.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // ДААЛГАВАР БОЛОВСРУУЛАХ
  const handleGenerateTasks = async () => {
    setLoadingTasks(true);
    setCurrentTasks([]);

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

      if (!res.ok) {
        alert(`Алдааны мэдээлэл: ${data?.error || 'Тодорхойгүй алдаа'}`);
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        setCurrentTasks(data);
      } else {
        alert('Даалгаврын формат таарсангүй. Дахин туршина уу.');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Сүлжээний алдаа';
      alert(`Алдаа гарлаа: ${errorMsg}`);
    } finally {
      setLoadingTasks(false);
    }
  };

  // ДААЛГАВАР ЗАСАХ БОЛОМЖ
  const handleUpdateTaskField = (index: number, field: keyof Task, value: any) => {
    const updated = [...currentTasks];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentTasks(updated);
  };

  // СӨНГӨЛТ (А, Б, В, Г) ЗАСАХ
  const handleUpdateOption = (taskIndex: number, optIndex: number, value: string) => {
    const updated = [...currentTasks];
    if (updated[taskIndex].options) {
      const newOpts = [...(updated[taskIndex].options || [])];
      newOpts[optIndex] = value;
      updated[taskIndex].options = newOpts;
      setCurrentTasks(updated);
    }
  };

  // ЧАТ ИЛГЭЭХ
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
              <tr><td style={{ padding: '6px', border: '1px solid #fde047' }}>1</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Сонгох тест</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Мэдээлэл олох сэргээн санах</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>ABCD сонголтоос нэг хариулт сонгох</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>0-1</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Зөв сонгосон бол 1 оноо, буруу бол 0 оноо</td></tr>
              <tr><td style={{ padding: '6px', border: '1px solid #fde047' }}>2</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Задгай даалгавар</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Мэдээлэл олох сэргээн санах</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Нэг өгүүлбэр олж бичих</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>0-1</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Зөв олсон бол 1 оноо, огт бичээгүй бол 0 оноо</td></tr>
              <tr><td style={{ padding: '6px', border: '1px solid #fde047' }}>3</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Задгай даалгавар</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Задлан шинжлэх</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>1-2 өгүүлбэр бичих</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>0-2</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, тайлбар дутуу бол 1 оноо</td></tr>
              <tr><td style={{ padding: '6px', border: '1px solid #fde047' }}>4</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Задгай даалгавар</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Задлан шинжлэх</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>1-2 өгүүлбэр бичих</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>0-2</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, тайлбар дутуу бол 1 оноо</td></tr>
              <tr><td style={{ padding: '6px', border: '1px solid #fde047' }}>5</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Задгай даалгавар</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Эргэцүүлэн дүгнэх</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>2-3 өгүүлбэр бичих</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>0-3</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>2-3 өгүүлбэрээр шинэ санаа гаргасан бол 3 оноо, шинэ санаагүй 2 оноо</td></tr>
              <tr><td style={{ padding: '6px', border: '1px solid #fde047' }}>6</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Задгай даалгавар</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>Эргэцүүлэн дүгнэх</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>2-3 өгүүлбэр бичих</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>0-3</td><td style={{ padding: '6px', border: '1px solid #fde047' }}>2-3 өгүүлбэрээр шинэ санаа гаргасан бол 3 оноо, шинэ санаагүй 2 оноо</td></tr>
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

      {/* MAIN CONTENT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '16px' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📖 Эх бичвэр
              </div>
              <button style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                📁 Даалгаврын сан (2) ➔
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '6px' }}>Хичээл сонгох:</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {subjects.map((subj) => (
                  <button
                    key={subj}
                    onClick={() => { setSelectedSubject(subj); setCurrentTasks([]); }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '16px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      backgroundColor: selectedSubject === subj ? '#0284c7' : '#38bdf8',
                      color: '#fff',
                    }}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '4px' }}>Эх бичвэрийн гарчиг</label>
              <input
                type="text"
                value={subjectTexts[selectedSubject]?.title || ''}
                onChange={(e) => setSubjectTexts({
                  ...subjectTexts,
                  [selectedSubject]: { ...subjectTexts[selectedSubject], title: e.target.value }
                })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '12px', backgroundColor: '#fffbe8', color: '#0f172a', fontWeight: '500', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '4px' }}>Унших эх бичвэр (Бүрэн эхээр засах/солих боломжтой)</label>
              <textarea
                value={subjectTexts[selectedSubject]?.text || ''}
                onChange={(e) => setSubjectTexts({
                  ...subjectTexts,
                  [selectedSubject]: { ...subjectTexts[selectedSubject], text: e.target.value }
                })}
                style={{ width: '100%', height: '260px', padding: '12px', backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '8px', fontSize: '12px', color: '#1e293b', lineHeight: '1.6', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          </div>

          <button
            onClick={handleGenerateTasks}
            disabled={loadingTasks}
            style={{ width: '100%', padding: '12px', backgroundColor: loadingTasks ? '#9ca3af' : '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            {loadingTasks ? '⏳ Gemini AI 6 даалгавар боловсруулж байна...' : `⚡ ${selectedSubject} хичээлийн даалгавар боловсруулах`}
          </button>
        </div>

        {/* RIGHT COLUMN (ДААЛГАВАР ЗАСАХ БОЛОМЖТОЙ КАРТ) */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✏️ Асуулт даалгавар
              </div>
              <button style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                📊 Хяналт шинжилгээ ➔
              </button>
            </div>

            <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '12px', minHeight: '370px', padding: '12px', boxSizing: 'border-box' }}>
              {currentTasks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
                  {currentTasks.map((task, i) => (
                    <div key={i} style={{ border: '1px solid #fde047', borderRadius: '12px', padding: '12px', backgroundColor: '#fffdf0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      
                      {/* ТАГ БОЛОН ОНОО */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px' }}>
                            📌 {task.cognitive || 'Мэдээлэл олох'}
                          </span>
                          <span style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px' }}>
                            📝 {task.type || 'Даалгавар'}
                          </span>
                        </div>
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px' }}>
                          🏆 Оноо: {task.score || '0-1'}
                        </span>
                      </div>

                      {/* ГҮЙЦЭТГЭХ АЖИЛ */}
                      {task.action && (
                        <div style={{ fontSize: '11px', color: '#854d0e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ⚡ <strong>Гүйцэтгэх ажил:</strong>
                          <span style={{ backgroundColor: '#fff', border: '1px solid #fde047', padding: '2px 6px', borderRadius: '4px' }}>{task.action}</span>
                        </div>
                      )}

                      {/* ДААЛГАВРЫН АСУУЛТ (БАГШ ЗАСАХ БОЛОМЖТОЙ) */}
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '4px' }}>
                          Даалгавар {task.no || i + 1}:
                        </div>
                        <textarea
                          value={task.question || ''}
                          onChange={(e) => handleUpdateTaskField(i, 'question', e.target.value)}
                          style={{ width: '100%', minHeight: '50px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', color: '#0f172a', backgroundColor: '#fff', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                      </div>

                      {/* СОНГОЛТУУД (А, Б, В, Г ЧЕКЛЭХ ДУГУЙ) */}
                      {task.options && Array.isArray(task.options) && task.options.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '4px' }}>Сонголтууд (ABCD):</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {task.options.map((opt, optIdx) => (
                              <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="radio"
                                  name={`correct-ans-${i}`}
                                  checked={task.answer === opt}
                                  onChange={() => handleUpdateTaskField(i, 'answer', opt)}
                                  style={{ cursor: 'pointer', width: '14px', height: '14px' }}
                                />
                                <input
                                  value={opt}
                                  onChange={(e) => handleUpdateOption(i, optIdx, e.target.value)}
                                  style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', backgroundColor: '#fff', boxSizing: 'border-box' }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ЗӨВ ХАРИУЛТ ЭСВЭЛ ЖИШИГ ХАРИУЛТ (БАГШ ЗАСАХ БОЛОМЖТОЙ) */}
                      {task.answer !== undefined && (
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#15803d', marginBottom: '2px' }}>
                            {task.type === 'Сонгох тест' ? 'Зөв хариулт:' : 'Жишиг хариулт:'}
                          </div>
                          <textarea
                            value={task.answer}
                            onChange={(e) => handleUpdateTaskField(i, 'answer', e.target.value)}
                            style={{ width: '100%', minHeight: '36px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '11px', color: '#14532d', backgroundColor: '#f0fdf4', resize: 'vertical', boxSizing: 'border-box' }}
                          />
                        </div>
                      )}

                      {/* РУБРИК ЗАДАРГАА (ТҮГЖЭЭТЭЙ / READONLY - ЗАСАХ БОЛОМЖГҮЙ) */}
                      {task.rubric && (
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#b45309', marginBottom: '2px' }}>📊 Онооны рубрик задаргаа (Тогтмол стандарт):</div>
                          <textarea
                            readOnly
                            value={task.rubric}
                            style={{ width: '100%', minHeight: '36px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', cursor: 'not-allowed', resize: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                    Даалгавар боловсруулаагүй байна.
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    " ⚡ Даалгавар боловсруулах " товчийг дараарай.
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => alert('Даалгавар амжилттай засагдаж, санд баталгаажлаа!')}
            style={{ width: '100%', padding: '12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}
          >
            💾 Даалгаврыг баталж, санд илгээх
          </button>
        </div>

      </div>
    </div>
  );
}