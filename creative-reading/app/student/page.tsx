'use client';

import React, { useState } from 'react';

export default function StudentPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Багш ба хяналт шинжилгээний хэсэг рүү илгээх өгөгдөл
    const evalData = {
      recall: answers.q1 ? 2 : 0,
      analyze: answers.q2 ? 3 : 1,
      eval: answers.q3 ? 4 : 2,
      total: (answers.q1 ? 2 : 0) + (answers.q2 ? 3 : 1) + (answers.q3 ? 4 : 2),
      feedback: 'Сурагч даалгаврыг утаснаасаа амжилттай ажиллаж илгээлээ.',
      approvedAt: new Date().toLocaleString('mn-MN')
    };
    localStorage.setItem('student_approved_analytics_data', JSON.stringify(evalData));
  };

  return (
    <div style={{ backgroundColor: '#f0fdf4', minHeight: '100vh', padding: '16px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#fff', padding: '14px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #bbf7d0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '16px', margin: 0, color: '#166534' }}>📱 Сурагчийн танхим - Бүтээлч уншлага-2</h1>
        <p style={{ fontSize: '11px', color: '#15803d', margin: '4px 0 0 0' }}>9Е анги - Даалгавар гүйцэтгэх</p>
      </header>

      {!isSubmitted ? (
        <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <h2 style={{ fontSize: '14px', color: '#0f172a' }}>📖 Эх бичвэр: Ж.Лхагва "Арван долоотой байхад"</h2>
          <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.6', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
            Манайх Цээлд, Бөөдэйнх Уلاандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм...
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>1. Бөөдэй ээжтэйгээ ямар амьтнаа хариулдаг вэ?</label>
            <input
              type="text"
              value={answers.q1}
              onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
              placeholder="Хариултаа бичих..."
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>2. Адуугаа хөөн ирсэн шалтгаанаа юу гэж тайлбарласан бэ?</label>
            <textarea
              value={answers.q2}
              onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
              placeholder="Хариултаа бичих..."
              style={{ width: '100%', height: '60px', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{ width: '100%', backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            🚀 Даалгавар гүйцэтгэж багш руу илгээх
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '40px' }}>✅</div>
          <h2 style={{ fontSize: '16px', color: '#166534' }}>Даалгавар амжилттай илгээгдлээ!</h2>
          <p style={{ fontSize: '12px', color: '#475569' }}>Багш болон Цэндао өвөө-багш таны хариултыг хянаж Хяналт шинжилгээ рүү шилжүүллээ.</p>
        </div>
      )}
    </div>
  );
}