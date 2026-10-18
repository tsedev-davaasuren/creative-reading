'use client';

import React, { useState } from 'react';

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
}

export default function TaskBankModule() {
  const [showTaskBank, setShowTaskBank] = useState(true);
  const [bankFilterSubject, setBankFilterSubject] = useState('Бүх хичээл');
  const subjects = ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'];

  const sampleText = `Хараар гурав эмжсэн саарал даавуу дээл хөөргөн өмсөж бор бүрх малгай сагалдаргалаад шажигнасан чимээтэй хороомон гутал өмссөн нь гоёлын дээд бөгөөд өргөн ханхар мөр, тэгш цагаан шүд, шооч байрын хүрээн нүд нь ер сумандаа л би гэж хэлээд байх шиг санагдана.
Ойдовынх бас Улаандэлд, түүнийг манайхаар буугаад мордсоноос хойш Бөөдэйн адуу тэмээ нууранд ирэхээ больчихсон...`;

  const [bundles, setBundles] = useState<TaskBundle[]>([
    {
      id: 'TASK-001',
      subject: 'Уран зохиол',
      title: '2. Ж.Лхагва "Арван долоотой байхад" өгүүлэг',
      text: sampleText,
      tasks: [
        {
          no: 1,
          question: 'Номын эх бүтцэд Бөөдэй ээжтэйгээ хоёулхнаа суудаг болохоор ямар малдаа өөрөө л явдаг вэ?',
          options: ['А. Адуунд', 'Б. Тэмээнд', 'В. Үхэрт', 'Г. Морьонд'],
          answer: 'Б. Тэмээнд',
        },
        {
          no: 2,
          question: 'Номын эх бүтцэд Бөөдэйгийн адуу тэмээ нууранд ирэхээ больчихсон шалтгааныг өгүүлбэрээр хэлээрэй.',
          answer: 'Ойдовынх бас Улаандэлд, түүнийг манайхаар буугаад мордсоноос хойш Бөөдэйн адуу тэмээ нууранд ирэхээ больчихсон.',
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
      ],
    },
  ]);

  const [expandedId, setExpandedId] = useState<string | null>('TASK-001');

  const handleDelete = (id: string) => {
    setBundles(bundles.filter((b) => b.id !== id));
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fffdf0', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {showTaskBank && (
        <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          
          {/* Толгой хэсэг */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 'bold' }}>
              📁 Даалгаврын сан
            </div>
            <button onClick={() => setShowTaskBank(false)} style={{ border: 'none', backgroundColor: '#e2e8f0', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Хаах ✕
            </button>
          </div>

          {/* Хичээлээр ангилах */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Хичээлээр ангилах (Тоо ширхэгтэй):</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Бүх хичээл', ...subjects].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setBankFilterSubject(subj)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: bankFilterSubject === subj ? '#e0f2fe' : '#fff',
                    color: bankFilterSubject === subj ? '#0284c7' : '#334155',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  {subj} <span style={{ backgroundColor: '#0284c7', color: '#fff', padding: '1px 6px', borderRadius: '8px', fontSize: '10px' }}>{subj === 'Бүх хичээл' || subj === 'Уран зохиол' ? bundles.length : 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* БАГЦУУДЫН ЖАГСААЛТ (ЗУРАГ-1 ДАГУУ 8:5 БА 8:3 ЗЭРЭГЦЭЭ РЕНДЕР) */}
          {bundles.map((bundle) => {
            const isOpen = expandedId === bundle.id;
            return (
              <div key={bundle.id} style={{ border: '1px solid #fde047', borderRadius: '14px', padding: '16px', backgroundColor: '#fffbe8', marginBottom: '16px' }}>
                
                {/* Картын дээд бар */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ backgroundColor: '#0284c7', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                      {bundle.subject}
                    </span>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>
                      {bundle.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                      🚀 9Е ангид илгээх
                    </button>
                    <button style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                      📥 Үндсэн ажилд ачаалах
                    </button>
                    <button onClick={() => handleDelete(bundle.id)} style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                      🗑️ Устгах
                    </button>
                    <button onClick={() => setExpandedId(isOpen ? null : bundle.id)} style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {isOpen ? '▲ Хумих' : '▼ Дэлгэрэнгүй'}
                    </button>
                  </div>
                </div>

                {/* ЗУРАГ-1: ЗҮҮН ТАЛД ЭХ БИЧВЭР (8:5) БА БАРУУН ТАЛД АСУУЛТ ДААЛГАВРУУД (8:3) */}
                {isOpen && (
                  <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '16px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #fde047' }}>
                    
                    {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР (8:5) */}
                    <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: '#0f172a' }}>
                        📖 Эх бичвэр (8:5 хэмжээ)
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '2px' }}>Эх бичвэрийн гарчиг:</label>
                        <input type="text" readOnly value={bundle.title} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '11px', fontWeight: 'bold', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '2px' }}>Унших эх бичвэр:</label>
                        <textarea readOnly defaultValue={bundle.text} style={{ width: '100%', height: '480px', padding: '8px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '11px', lineHeight: '1.6', boxSizing: 'border-box' }} />
                      </div>
                    </div>

                    {/* БАРУУН ТАЛ: АСУУЛТ ДААЛГАВРУУД (8:3) */}
                    <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '10px', color: '#0f172a' }}>
                        Нийт даалгаврын жагсаалт:
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {bundle.tasks.map((t, idx) => (
                          <div key={idx} style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '8px', padding: '10px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '4px' }}>
                              Даалгавар {t.no}:
                            </div>
                            <div style={{ fontSize: '11px', color: '#0f172a', marginBottom: '8px', backgroundColor: '#fff', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                              {t.question}
                            </div>

                            {/* ДААЛГАВАР 1: РАДИО ДУГУЙТАЙ СОНГОХ */}
                            {idx === 0 && t.options && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1d4ed8' }}>Сонголтууд (ABCD):</div>
                                {t.options.map((opt, oIdx) => (
                                  <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', backgroundColor: t.answer === opt ? '#e0f2fe' : '#fff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                    <input type="radio" checked={t.answer === opt} readOnly />
                                    {opt}
                                  </label>
                                ))}
                              </div>
                            )}

                            {/* ДААЛГАВАР 2-6: ӨРГӨН БИЧИХ ЦОНХ */}
                            {idx > 0 && (
                              <div>
                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#15803d', marginBottom: '2px' }}>Хариулан бичих цонх:</div>
                                <textarea readOnly value={t.answer || ''} placeholder="Энд хариултаа бичнэ үү..." style={{ width: '100%', height: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #86efac', backgroundColor: '#f0fdf4', fontSize: '11px', boxSizing: 'border-box' }} />
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
      )}

    </div>
  );
}