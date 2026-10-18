'use client';

import React, { useState, useEffect } from 'react';

export default function TeacherRoom() {
  const [activeModal, setActiveModal] = useState<'none' | 'bank' | 'analytics'>('none');
  const [selectedSubject, setSelectedSubject] = useState('Уран зохиол');

  const subjectsList = ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'];

  const subjectTexts: Record<string, string> = {
    'Уран зохиол': 'Ж.Лхагва "Арван долоотой байхад" өгүүлэг...\n\nМанайх Цээлд, Бөөдэйнх Улаандэлд зусч байлаа.',
    'Хими': 'Атом болон молийн тухай үндсэн ойлголт...',
    'Биологи': 'Эс ба амьд организмын удамшил...',
    'Түүх': 'Монголын Их Улс ба Их Засаг хууль...',
    'Физик': 'Ньютоны хөдөлгөөний хуулиуд...',
    'Газар зүй': 'Дэлхийн уур амьсгалын бүсүүд...'
  };

  const handleGoToAnalyticsPage = () => {
    window.location.href = '/analytics';
  };

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '16px 24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Бүтээлч уншлага-2 төсөл (Багшийн танхим)</h1>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleGoToAnalyticsPage}
            style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📊 Хяналт шинжилгээний хуудас руу очих ➔
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '20px' }}>
        
        {/* LEFT */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', margin: 0 }}>📖 Эх бичвэр</h2>
          </div>

          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
            {subjectsList.map((sub) => (
              <button
                key={sub}
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

          <textarea
            value={subjectTexts[selectedSubject] || ''}
            readOnly
            style={{ width: '100%', height: '400px', padding: '14px', backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '10px', fontSize: '12px', color: '#1e293b', lineHeight: '1.7' }}
          />
        </div>

        {/* RIGHT */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', margin: 0 }}>✏️ Асуулт даалгавар</h2>
            <button
              onClick={handleGoToAnalyticsPage}
              style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              📊 Хяналт шинжилгээ ➔
            </button>
          </div>

          <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1d4ed8' }}>Даалгавар 1: Бөөдэй ямар амьтан малдаа явна вэ?</div>
          </div>
          <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', borderRadius: '12px', padding: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1d4ed8' }}>Даалгавар 2: Адуугаа тууж ирсэн шалтгаан?</div>
          </div>
        </div>

      </div>

    </div>
  );
}