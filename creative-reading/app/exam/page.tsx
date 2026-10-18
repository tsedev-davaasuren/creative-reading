'use client';

import React, { useState, useEffect } from 'react';

interface Task {
  no: number;
  question: string;
  options?: string[];
  answer?: string;
}

interface TaskBundle {
  id: string;
  subject: string;
  title: string;
  tasks: Task[];
  text: string;
  createdAt: string;
}

export default function ExamPage() {
  const [showTaskBank, setShowTaskBank] = useState(false);
  const [bankFilterSubject, setBankFilterSubject] = useState('Бүх хичээл');
  const [selectedSubject, setSelectedSubject] = useState('Уран зохиол');
  const [expandedBundleId, setExpandedBundleId] = useState<string | null>(null);

  const subjects = ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'];

  const [initialText, setInitialText] = useState(`Хараар гурав эмжсэн саарал даавуу дээл хөөргөн өмсөж бор бүрх малгай сагалдаргалаад шажигнасан чимээтэй хороомон гутал өмссөн нь гоёлын дээд бөгөөд өргөн ханхар мөр, тэгш цагаан шүд, шооч байрын хүрээн нүд нь ер сумандаа л би гэж хэлээд байх шиг санагдана.
Ойдовынх бас Улаандэлд, түүнийг манайхаар буугаад мордсоноос хойш Бөөдэйн адуу тэмээ нууранд ирэхээ больчихсон. Нэг өдөр айлын адуунд байсан даагатай гүү авчрах далимаар Улаандэл орж хэргээр орой болгоод Бөөдэйн адууг бэлчээрээс нь хөөж Цээлийн нууранд авчирчихаад маргааш нь Бөөдэйг ирнэ гэж нуурын баруун овоон дээр харуулдан суутал Ойдов хархүү алаг морьтой давхиж ирээд хөөгөөд явчихлаа. Тэдний мал удтал нууранд ирээгүй учрыг би сая л нэг гадарлаж чичигнэн инээдэг хөөрхөн Бөөдэйг минь хулгайлан хөөгөөд явчихаж байгаа юм шиг хойноос нь удтал ширтэн зогсохдоо Ойдовын эрдэм чадал, сайн сайханд хязгааргүй атаархаж байгаагаа мэдэв.
Ойдовын энэ сайхан бүхэн цэргийн алба хаасны л ач гэж өөрөө өөртөө батлаад, насаа нэмж байгаад ч хамаагүй энэ жил л цэрэгт явчихъя гэж хатуу шийдэж билээ. Тэгээд сумын наадам дээр Ойдовыг хаячихаад урт түрүүтэй хороомон гутлаа шажигнуулан дэлж Бөөдэйн хажуугаар харалгүй өнгөрнө дөө гэж бодоход сэтгэлийн тээг сэмрэн, ярс ярс алхлан яваа цэрэг эрчүүдийн жагсаалд орчихсон юм шиг хөгжилтэй сэргэлэн болов оо.`);

  const [tasks, setTasks] = useState<Task[]>([
    {
      no: 1,
      question: 'Номын эх бүтцэд Бөөдэй ээжтэйгээ хоёулхнаа суудаг болохоор ямар малдаа өөрөө л явдаг вэ?',
      options: ['А. Адуунд', 'Б. Тэмээнд', 'В. Үхэрт', 'Г. Морьонд'],
      answer: 'Б. Тэмээнд',
    },
    {
      no: 2,
      question: 'Номын эх бүтцэд Бөөдэйгийн адуу тэмээ нууранд ирэхээ больчихсон шалтгааныг өгүүлбэрээр хэлээрэй.',
      answer: '',
    },
    {
      no: 3,
      question: 'Номын эх бүтцэд Ойдовын сайн сайхныг тодорхойлогч үзүүлэлтүүдийг өгүүлбэрээр хэлээрэй.',
      answer: '',
    },
    {
      no: 4,
      question: 'Номын эх бүтцэд Бөөдэйтэй уулзаж байхдаа ямар агшин нь арван долоон насанд хамгийн жаргалтай мөч байсныг өгүүлбэрээр хэлээрэй.',
      answer: '',
    },
    {
      no: 5,
      question: 'Номын эх бүтцэд Ойдовын цэргээс ирснийг сонссондоо Бөөдэй хэрхэн хандсныг өгүүлбэрээр хэлээрэй.',
      answer: '',
    },
    {
      no: 6,
      question: 'Номын эх бүтцэд Бөөдэйтэй харьцаж байхдаа тэр хэрхэн сэтгэлийн тээг сэмрэн, хөгжилтэй сэргэлэн боловч эцэст нь хэрхэн хандсныг өгүүлбэрээр хэлээрэй.',
      answer: '',
    },
  ]);

  const [savedBundles, setSavedBundles] = useState<TaskBundle[]>([]);

  // Анх ачаалахад localStorage-ийг унших эсвэл анхны багцыг үүсгэх
  useEffect(() => {
    const loaded = localStorage.getItem('creative_reading_task_bank_v2');
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
      title: '2. Ж.Лхагва "Арван долоотой байхад" өгүүлэг',
      tasks: tasks,
      text: initialText,
      createdAt: '2026-10-18',
    };
    setSavedBundles([defaultBundle]);
    setExpandedBundleId('TASK-001');
    localStorage.setItem('creative_reading_task_bank_v2', JSON.stringify([defaultBundle]));
  };

  const saveBundlesToStorage = (newBundles: TaskBundle[]) => {
    setSavedBundles(newBundles);
    localStorage.setItem('creative_reading_task_bank_v2', JSON.stringify(newBundles));
  };

  const handleSaveToBank = () => {
    const bundleCount = savedBundles.length + 1;
    const newBundle: TaskBundle = {
      id: 'TASK-' + Date.now().toString().slice(-4),
      subject: selectedSubject,
      title: `${bundleCount}. Ж.Лхагва "Арван долоотой байхад" өгүүлэг`,
      tasks: JSON.parse(JSON.stringify(tasks)),
      text: initialText,
      createdAt: new Date().toLocaleDateString('mn-MN'),
    };

    const updated = [newBundle, ...savedBundles];
    saveBundlesToStorage(updated);
    setExpandedBundleId(newBundle.id);
    alert('Шинэ даалгаврын багц санд амжилттай хадгалагдлаа!');
  };

  const handleDeleteBundle = (id: string) => {
    if (confirm('Энэ багц даалгаврыг сангаас устгах уу?')) {
      const updated = savedBundles.filter((b) => b.id !== id);
      saveBundlesToStorage(updated);
    }
  };

  const handleOptionSelect = (optVal: string) => {
    const updated = [...tasks];
    updated[0].answer = optVal;
    setTasks(updated);
  };

  const handleTextChange = (idx: number, val: string) => {
    const updated = [...tasks];
    updated[idx].answer = val;
    setTasks(updated);
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
      
      {/* 1. ДААЛГАВРЫН САН МОДАЛ ЦОНХ */}
      {showTaskBank && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: '#fffdf0', width: '100%', maxWidth: '1400px', borderRadius: '20px', border: '1px solid #fde047', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)', maxHeight: '92vh', overflowY: 'auto' }}>
            
            <div style={{ backgroundColor: '#fffbe8', padding: '16px 24px', borderBottom: '1px solid #fde047', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>📁</span>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Даалгаврын сан</h2>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>Нийт хадгалагдсан: <strong>{savedBundles.length}</strong> багц даалгавар</p>
                </div>
              </div>
              <button onClick={() => setShowTaskBank(false)} style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                Хаах ✕
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>Хичээлээр ангилах (Тоо ширхэгтэй):</div>
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
                          color: isSelected ? '#0284c7' : '#334155',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {subj} <span style={{ backgroundColor: isSelected ? '#0284c7' : '#94a3b8', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ДААЛГАВРЫН САН ДАХЬ БАГЦУУД (ҮҮНД ХУУЧИН ТЕКСТЭН ЖАГСААЛТ ОГТ БАЙХГҮЙ) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredBundles.map((bundle) => {
                  const isOpen = expandedBundleId === bundle.id;
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
                          <button onClick={() => alert(`"${bundle.title}" даалгаврыг 9Е анги руу амжилттай илгээлээ!`)} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                            🚀 9Е ангид илгээх
                          </button>
                          <button onClick={() => alert('Үндсэн ажилд ачаалагдлаа')} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                            📥 Үндсэн ажилд ачаалах
                          </button>
                          <button onClick={() => handleDeleteBundle(bundle.id)} style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                            🗑️ Устгах
                          </button>
                          <button onClick={() => setExpandedBundleId(isOpen ? null : bundle.id)} style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '7px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                            {isOpen ? '▲ Хумих' : '▼ Дэлгэрэнгүй'}
                          </button>
                        </div>
                      </div>

                      {/* САН ДАХЬ БАГЦЫН ДЭЛГЭРЭНГҮЙ МАКЕТ: 8:5 ЭХ БИЧВЭР + 8:3 АСУУЛТУУД (ЗУРАГ-1) */}
                      {isOpen && (
                        <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '16px', alignItems: 'start', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #fde047' }}>
                          
                          {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР (8:5 ХЭМЖЭЭ) */}
                          <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>
                              📖 Эх бичвэр (8:5 хэмжээ)
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Эх бичвэрийн гарчиг:</label>
                              <input
                                type="text"
                                readOnly
                                value={bundle.title}
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '11px', backgroundColor: '#fff', fontWeight: 'bold', boxSizing: 'border-box' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Унших эх бичвэр:</label>
                              <textarea
                                readOnly
                                defaultValue={bundle.text || initialText}
                                style={{ width: '100%', height: '520px', padding: '10px', backgroundColor: '#fff', border: '1px solid #fde047', borderRadius: '8px', fontSize: '11px', color: '#1e293b', lineHeight: '1.6', boxSizing: 'border-box', resize: 'vertical' }}
                              />
                            </div>
                          </div>

                          {/* БАРУУН ТАЛ: АСУУЛТ ДААЛГАВРУУД (8:3 ХЭМЖЭЭ, ЦАЙВАР ШАРГАЛ) */}
                          <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>
                              Нийт даалгаврын жагсаалт:
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              {bundle.tasks.map((t, i) => (
                                <div key={i} style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '10px', padding: '12px' }}>
                                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '6px' }}>
                                    Даалгавар {t.no}:
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#0f172a', marginBottom: '10px', lineHeight: '1.5', backgroundColor: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                    {t.question}
                                  </div>

                                  {/* ДААЛГАВАР 1: РАДИО ДУГУЙТАЙ СОНГОХ ХЭЛБЭР */}
                                  {i === 0 && (
                                    <div style={{ marginBottom: '8px' }}>
                                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '6px' }}>Сонголтууд (ABCD):</div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {(t.options || ['А. Адуунд', 'Б. Тэмээнд', 'В. Үхэрт', 'Г. Морьонд']).map((opt, optIdx) => (
                                          <label
                                            key={optIdx}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '8px',
                                              padding: '8px 12px',
                                              borderRadius: '8px',
                                              border: '1px solid #cbd5e1',
                                              backgroundColor: t.answer === opt ? '#e0f2fe' : '#fff',
                                              fontSize: '11px',
                                              color: '#334155',
                                            }}
                                          >
                                            <input
                                              type="radio"
                                              checked={t.answer === opt}
                                              readOnly
                                              style={{ width: '15px', height: '15px' }}
                                            />
                                            {opt}
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* ДААЛГАВАР 2-6: ӨРГӨН БИЧИХ ЦОНХ */}
                                  {i > 0 && (
                                    <div>
                                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#15803d', marginBottom: '4px' }}>Хариулан бичих цонх:</div>
                                      <textarea
                                        readOnly
                                        value={t.answer || ''}
                                        placeholder="Хариултын өргөн цонх..."
                                        style={{
                                          width: '100%',
                                          minHeight: '80px',
                                          padding: '8px 10px',
                                          borderRadius: '6px',
                                          border: '1px solid #86efac',
                                          fontSize: '11px',
                                          color: '#14532d',
                                          backgroundColor: '#f0fdf4',
                                          lineHeight: '1.6',
                                          resize: 'vertical',
                                          boxSizing: 'border-box',
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 2. ҮНДСЭН ДЭЛГЭЦ */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '20px', alignItems: 'start', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР (8:5) */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📖 Эх бичвэр
            </div>
            <button
              onClick={() => setShowTaskBank(true)}
              style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              📁 Даалгаврын сан ({savedBundles.length}) ➔
            </button>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>Хичээл сонгох:</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  style={{
                    padding: '6px 16px',
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

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Эх бичвэрийн гарчиг</label>
            <input
              type="text"
              readOnly
              value={`2. Ж.Лхагва "Арван долоотой байхад" өгүүлэг`}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde047', fontSize: '12px', backgroundColor: '#fffdf0', color: '#0f172a', fontWeight: 'bold', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Унших эх бичвэр</label>
            <textarea
              value={initialText}
              onChange={(e) => setInitialText(e.target.value)}
              style={{ width: '100%', height: '540px', padding: '14px', backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '10px', fontSize: '12px', color: '#1e293b', lineHeight: '1.7', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
        </div>

        {/* БАРУУН ТАЛ: АСУУЛТ ДААЛГАВАР (8:3) */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✏️ Асуулт даалгавар
              </div>
              <button style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                📊 Хяналт шинжилгээ ➔
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '680px', overflowY: 'auto', paddingRight: '4px' }}>
              {tasks.map((t, i) => (
                <div key={i} style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '6px' }}>
                    Даалгавар {t.no}:
                  </div>
                  <div style={{ fontSize: '11px', color: '#0f172a', marginBottom: '10px', lineHeight: '1.5', backgroundColor: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    {t.question}
                  </div>

                  {i === 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '6px' }}>Сонголтууд (ABCD):</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(t.options || ['А. Адуунд', 'Б. Тэмээнд', 'В. Үхэрт', 'Г. Морьонд']).map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: t.answer === opt ? '#e0f2fe' : '#fff',
                              cursor: 'pointer',
                              fontSize: '11px',
                              color: '#334155',
                            }}
                          >
                            <input
                              type="radio"
                              name="main_page_task1_option"
                              checked={t.answer === opt}
                              onChange={() => handleOptionSelect(opt)}
                              style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {i > 0 && (
                    <div style={{ marginBottom: '4px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#15803d', marginBottom: '4px' }}>Хариулан бичих цонх:</div>
                      <textarea
                        value={t.answer}
                        onChange={(e) => handleTextChange(i, e.target.value)}
                        placeholder="Энд хариултаа өргөн цонхонд бичнэ үү..."
                        style={{
                          width: '100%',
                          minHeight: '85px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #86efac',
                          fontSize: '11px',
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

          <button
            onClick={handleSaveToBank}
            style={{ width: '100%', padding: '12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px' }}
          >
            💾 Даалгаврыг баталж, санд илгээх
          </button>
        </div>

      </div>

    </div>
  );
}