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
  const [isMounted, setIsMounted] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'blueprint' | 'chat' | 'bank' | 'review' | 'analytics'>('none');

  // SUBJECT STATES
  const [selectedSubject, setSelectedSubject] = useState<string>('Уран зохиол');
  const subjectsList = ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'];

  const initialSubjectData: Record<string, { title: string; text: string }> = {
    'Уран зохиол': {
      title: 'Ж.Лхагва "Арван долоотой байхад" өгүүлэг',
      text: `Манайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.\n\nЭэж цээжиндээ улаан эрээн хороомтой гутал өмсчихөөд явж байдаг Бөөдэйг: "Энэ золиг хэний амьтнаас ийм хариугүй шалбуур амьтан төрдөг байна аа" гэж ярихыг сонсоод: "Манайх гэдэг айл дахиад ганц хүүтэйсэн бол энэ хариугүй амьтнаас чинь үнэрлэж ч үзэхгүй байсан юм. Хонь ч хариулж чадахгүй амьтан" гэж бодохоос ээжийгээ барьж идэхээс бусдыг хийж явахдаа "Наадах чинь ч тийм дээ" гэсэн царай гаргаад дуугүй өнгөрч билээ.`,
    },
    'Хими': {
      title: 'Атом болон молийн тухай үндсэн ойлголт',
      text: `Атом нь химийн элементийн хамгийн жижиг, цааш химийн аргаар задардаггүй жижиг хэсэг юм. Атом нь эерэг цэнэгтэй цөм болон түүнийг тойрон эргэх сөрөг цэнэгтэй электронтой.`,
    },
    'Биологи': {
      title: 'Эс ба амьд организмын удамшил',
      text: `ДНХ-ийн молекул нь эрчлэгдсэн давхар шаталсан шат шиг хэлбэртэй байх ба түүний од шиг хэсгүүдийг ген гэж нэрлэдэг. Ген нь амьд биеийн тодорхой нэг шинж тэмдгийг тодорхойлдог кодолсон мэдээлэл юм.`,
    },
    'Түүх': {
      title: 'Монголын Их Улс ба Их Засаг хууль',
      text: `1206 онд Чингис хаан Их Монгол Улсыг байгуулж, улс орны төрийг захирах "Их Засаг" хуулийг баталжээ.`,
    },
    'Физик': {
      title: 'Ньютоны хөдөлгөөний хуулиуд',
      text: `Ньютоны нэгдүгээр хууль нь инерцийн хууль бөгөөд биед гаднын хүч үйлчлэхгүй бол тайван байна.`,
    },
    'Газар зүй': {
      title: 'Дэлхийн уур амьсгалын бүсүүд',
      text: `Дэлхийн гадаргуугийн нарнаас авах дулааны хэмжээнээс хамаарч уур амьсгалыг ангилдаг.`,
    }
  };

  const blueprintTasks: Task[] = [
    { no: 1, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Сонгох тест', score: '0-1', action: 'ABCD сонголтоос зөв нэг хариултыг сонгох', question: 'Бөөдэй ээгтэйгээ хоёрулхаа суудаг болохоор ямар амьтан малдаа өөрөө л явна?', options: ['А. Адуу', 'Б. Тэмээ', 'В. Үхэр', 'Г. Хони'], answer: 'А. Адуу', rubric: 'Зөв сонгосон бол 1 оноо, буруу бол 0 оноо.' },
    { no: 2, cognitive: 'Мэдээлэл олох сэргээн санах', type: 'Задгай даалгавар', score: '0-1', action: 'Эхээс холбогдох нэг өгүүлбэр олж бичих', question: 'Бөөдийн бэлчээрт байсан адууг Цээлийн нуурт хөөн ирснийхээ шалтгааныг би баатар юу гэж тайлбарласан бэ?', answer: 'Маргааш нь Бөөдэйг ирнэ гэж итгэсэн учраас.', rubric: 'Зөв олсон бол 1 оноо.' },
    { no: 3, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: '1-2 өгүүлбэрээр тайлбарлан бичих', question: 'Ойдовын сайн сайхныг тодорхойлогч үзүүлэлтүүдийг өгүүлбэрээр тайлбарлан бичээрэй.', answer: 'Хархан мөр, тэгш цагаан шүд, хороомон гутал.', rubric: 'Зөв тайлбарласан бол 2 оноо.' },
    { no: 4, cognitive: 'Задлан шинжлэх', type: 'Задгай даалгавар', score: '0-2', action: '1-2 өгүүлбэрээр тайлбарлан бичих', question: 'Бөөдэйтэй уулзаж байхдаа ямар агшин нь арван долоон насанд хамгийн жаргалтай мөч байсныг тайлбарлана уу.', rubric: 'Зөв тайлбарласан бол 2 оноо.' },
    { no: 5, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: '2-3 өгүүлбэр бичих', question: 'Эхээс Харьцаа, холбоо хэлбэрээр ямар агуулга илэрхийлэгдэж байгаа вэ?', rubric: '3 оноо.' },
    { no: 6, cognitive: 'Эргэцүүлэн дүгнэх', type: 'Задгай даалгавар', score: '0-3', action: '2-3 өгүүлбэр бичих', question: 'Өгүүлэгийн гол санаа, зориулго ямар?', rubric: '3 оноо.' }
  ];

  const [subjectTexts, setSubjectTexts] = useState(initialSubjectData);
  const [currentTasks, setCurrentTasks] = useState<Task[]>(blueprintTasks);
  const [savedBundles, setSavedBundles] = useState<TaskBundle[]>([]);

  // СУРАГЧИЙН ҮНЭЛГЭЭ БА АНАЛИТИК СТЭЙТ
  const [studentEval, setStudentEval] = useState({
    studentName: 'Болд-Эрдэнэ (9Е анги)',
    maxScore: 12,
    recallScore: 0,
    analyzeScore: 1,
    evalScore: 2,
    feedback: 'Цэндао өвөө-багшийн дүгнэлт: Сурагч даалгавар 5, 6 дээр өгүүлбэрийн тоо дутуу бичсэн тул рубрикийн дагуу оноо хасаж үнэлэв.'
  });

  // MENTOR CHAT
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Сайн байна уу, багш аа! Би "Цэндао өвөө-багш" байна. Танд туслахад бэлэн байна.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    setIsMounted(true);

    const initialBank: TaskBundle[] = [
      { id: 'TASK-1001', subject: 'Уран зохиол', title: 'Ж.Лхагва "Арван долоотой байхад" өгүүлэг', text: initialSubjectData['Уран зохиол'].text, tasks: blueprintTasks, createdAt: '2026.10.18' },
      { id: 'TASK-1002', subject: 'Биологи', title: 'Эс ба амьд организмын удамшил', text: initialSubjectData['Биологи'].text, tasks: blueprintTasks, createdAt: '2026.10.18' }
    ];

    const loadedBank = localStorage.getItem('creative_reading_task_bank_v12');
    if (loadedBank) {
      try {
        const parsed = JSON.parse(loadedBank);
        if (Array.isArray(parsed) && parsed.length > 0) setSavedBundles(parsed);
        else setSavedBundles(initialBank);
      } catch {
        setSavedBundles(initialBank);
      }
    } else {
      setSavedBundles(initialBank);
    }

    // СУРАГЧИЙН ИЛГЭЭСЭН ОНООГ УНШИЖ АНАЛИТИК ТАМГАЛАХ
    const loadedEval = localStorage.getItem('student_approved_analytics_data');
    if (loadedEval) {
      try {
        const parsed = JSON.parse(loadedEval);
        setStudentEval(prev => ({
          ...prev,
          recallScore: parsed.recall ?? prev.recallScore,
          analyzeScore: parsed.analyze ?? prev.analyzeScore,
          evalScore: parsed.eval ?? prev.evalScore,
          feedback: parsed.feedback ?? prev.feedback
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, [activeModal]);

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

  const calculatedTotal = studentEval.recallScore + studentEval.analyzeScore + studentEval.evalScore;
  const totalPercent = Math.round((calculatedTotal / studentEval.maxScore) * 100);

  if (!isMounted) return <div style={{ padding: '40px', textAlign: 'center' }}>Ачаалж байна...</div>;

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

        {/* TOP BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveModal('blueprint')}
            style={{ backgroundColor: '#fef08a', border: '1px solid #fde047', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#854d0e', cursor: 'pointer' }}
          >
            📋 Блюпринт харах ▼
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('chat')}
            style={{ backgroundColor: '#fef08a', border: '1px solid #fde047', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#854d0e', cursor: 'pointer' }}
          >
            💬 Цэндао багштай ярилцах
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('review')}
            style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📝 Сурагчийн хариулт & Үнэлгээ засах
          </button>

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
      {activeModal === 'blueprint' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '850px', borderRadius: '16px', padding: '24px', border: '1px solid #cbd5e1', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>📋 Унших чадварын Блюпринт загвар</h3>
              <button type="button" onClick={() => setActiveModal('none')} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>№</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Танин мэдэхүйн түвшин</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Төрөл</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Оноо</th>
                </tr>
              </thead>
              <tbody>
                {blueprintTasks.map((t) => (
                  <tr key={t.no}>
                    <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{t.no}</td>
                    <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{t.cognitive}</td>
                    <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{t.type}</td>
                    <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#166534' }}>{t.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ДААЛГАВРЫН САН MODAL */}
      {activeModal === 'bank' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '750px', borderRadius: '16px', padding: '24px', border: '1px solid #cbd5e1', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>📁 Даалгаврын сан ({savedBundles.length})</h3>
              <button type="button" onClick={() => setActiveModal('none')} style={{ border: 'none', background: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            {savedBundles.map((bundle) => (
              <div key={bundle.id} style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{bundle.title}</div>
                <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '2px' }}>{bundle.subject} | Үүсгэсэн: {bundle.createdAt}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ХЯНАЛТ ШИНЖИЛГЭЭ БА PISA ЧАДВАРЫН АНАЛИТИК MODAL (ЗУРАГ-1 ГРАФИКУУДТАЙ) */}
      {activeModal === 'analytics' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '20px' }}>
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
              <button type="button" onClick={() => setActiveModal('none')} style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                Хаах ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
              {/* CIRCULAR PROGRESS CHART */}
              <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#854d0e', marginBottom: '12px' }}>🏆 Нэгдсэн Гүйцэтгэл</div>
                <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: `conic-gradient(#059669 ${totalPercent}%, #e2e8f0 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '100px', height: '100px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{totalPercent}%</span>
                    <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold' }}>{calculatedTotal} / 12 оноо</span>
                  </div>
                </div>
              </div>

              {/* 3 COGNITIVE PROGRESS BARS */}
              <div style={{ backgroundColor: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px' }}>
                  📈 Когнитив 3 түвшний онооны шинжилгээ:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                      <span style={{ color: '#3730a3' }}>📌 Сэргээн санах түвшин:</span>
                      <span style={{ color: '#3730a3' }}>{studentEval.recallScore} / 2 оноо</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#e0e7ff', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(studentEval.recallScore / 2) * 100}%`, backgroundColor: '#4f46e5', height: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                      <span style={{ color: '#6b21a8' }}>📝 Задлан шинжлэх түвшин:</span>
                      <span style={{ color: '#6b21a8' }}>{studentEval.analyzeScore} / 4 оноо</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f3e8ff', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(studentEval.analyzeScore / 4) * 100}%`, backgroundColor: '#9333ea', height: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                      <span style={{ color: '#854d0e' }}>💡 Эргэцүүлэн дүгнэх түвшин:</span>
                      <span style={{ color: '#854d0e' }}>{studentEval.evalScore} / 6 оноо</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#fef3c7', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(studentEval.evalScore / 6) * 100}%`, backgroundColor: '#d97706', height: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>💬 Баталгаажуулсан нэгдсэн дүгнэлт:</div>
              <p style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic', margin: 0 }}>
                "{studentEval.feedback}"
              </p>
            </div>

          </div>
        </div>
      )}

      {/* MAIN WORKSPACE LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '20px', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>📖 Эх бичвэр</div>
            <button
              type="button"
              onClick={() => setActiveModal('bank')}
              style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              📁 Даалгаврын сан ({savedBundles.length}) ➔
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '8px' }}>Хичээл сонгох:</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {subjectsList.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: selectedSubject === sub ? '#0284c7' : '#38bdf8',
                    color: '#fff',
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              value={subjectTexts[selectedSubject]?.text || ''}
              onChange={(e) => setSubjectTexts({ ...subjectTexts, [selectedSubject]: { ...subjectTexts[selectedSubject], text: e.target.value } })}
              style={{ width: '100%', height: '420px', padding: '14px', backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '10px', fontSize: '12px', color: '#1e293b', lineHeight: '1.7', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>✏️ Асуулт даалгавар</div>
              <button
                type="button"
                onClick={() => setActiveModal('analytics')}
                style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                📊 Хяналт шинжилгээ ➔
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '520px', overflowY: 'auto' }}>
              {currentTasks.map((t, idx) => (
                <div key={idx} style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '14px', padding: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8' }}>Даалгавар {t.no}: {t.question}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
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