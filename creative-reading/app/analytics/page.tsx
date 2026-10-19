'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface StudentResult {
  id: number;
  name: string;
  recall: number; // Max 2
  analyze: number; // Max 4
  evalScore: number; // Max 6
  total: number; // Max 12
  status: 'Баталгаажсан' | 'Хүлээгдэж буй';
}

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Уран зохиол');
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);

  const subjects = ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'];

  // 20 СУРАГЧИЙН НЭРСИЙН ЖАГСААЛТ
  const studentNames = [
    'Амарболд Б.', 'Анужин Т.', 'Баатар С.', 'Болд-Эрдэнэ Э.', 'Бат-Эрдэнэ Г.',
    'Ганзориг Д.', 'Дулмаа О.', 'Есүй Б.', 'Золбоо М.', 'Индра Т.',
    'Мөнх-Эрдэнэ Б.', 'Номин-Эрдэнэ С.', 'Онон Г.', 'Өлзий Д.', 'Сүхбат Б.',
    'Тэмүүлэн М.', 'Урангоо Б.', 'Хулан А.', 'Цэнгэл Т.', 'Энхжин Н.'
  ];

  // 6 ХИЧЭЭЛ ТУС БҮРТ 20 СУРАГЧИЙН ДҮНГИЙН ӨГӨГДӨЛ ҮҮСГЭХ
  const [subjectData, setSubjectData] = useState<Record<string, StudentResult[]>>({});

  useEffect(() => {
    setIsMounted(true);

    const generatedData: Record<string, StudentResult[]> = {};

    subjects.forEach((subj, subIdx) => {
      generatedData[subj] = studentNames.map((name, idx) => {
        // Хичээл болон сурагч бүрт тохирсон дүнгийн симуляци
        const recall = Math.min(2, Math.floor(((idx + subIdx) % 3) + 1));
        const analyze = Math.min(4, Math.floor(((idx * 2 + subIdx) % 4) + 1));
        const evalScore = Math.min(6, Math.floor(((idx + subIdx * 2) % 5) + 2));
        const total = recall + analyze + evalScore;

        return {
          id: idx + 1,
          name,
          recall,
          analyze,
          evalScore,
          total,
          status: idx % 4 === 0 ? 'Хүлээгдэж буй' : 'Баталгаажсан',
        };
      });
    });

    setSubjectData(generatedData);
    if (generatedData['Уран зохиол'] && generatedData['Уран зохиол'].length > 0) {
      setSelectedStudent(generatedData['Уран зохиол'][0]);
    }
  }, []);

  if (!isMounted) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>Уншиж байна...</div>;

  const currentStudents = subjectData[selectedSubject] || [];
  const avgTotal = currentStudents.length > 0
    ? (currentStudents.reduce((acc, s) => acc + s.total, 0) / currentStudents.length).toFixed(1)
    : '0';
  const avgPercent = Math.round((Number(avgTotal) / 12) * 100);

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '20px 24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#0284c7', color: '#fff', padding: '10px 14px', borderRadius: '12px', fontSize: '20px' }}>📊</div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>
              Хяналт Шинжилгээ & PISA чадварын аналитик (6 Хичээл)
            </h1>
            <p style={{ fontSize: '12px', color: '#0284c7', margin: '2px 0 0 0', fontWeight: 'bold' }}>
              Creative reading-2 project | 9Е Анги - 20 Сурагч
            </p>
          </div>
        </div>

        <Link
          href="/teacher"
          style={{ backgroundColor: '#059669', color: '#fff', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}
        >
          👨‍🏫 Багшийн танхим руу буцах
        </Link>
      </header>

      {/* 6 ХИЧЭЭЛИЙН ТОБИУД (БАГШ ТУС БҮР ӨӨРИЙН ХИЧЭЭЛИЙГ СОНГОНО) */}
      <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#854d0e', marginBottom: '10px' }}>
          📌 Багшийн хичээл сонгох (Тухайн хичээлийн 20 сурагчийн дүн харагдана):
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {subjects.map((subj) => {
            const isSelected = selectedSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => {
                  setSelectedSubject(subj);
                  if (subjectData[subj] && subjectData[subj].length > 0) {
                    setSelectedStudent(subjectData[subj][0]);
                  }
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  backgroundColor: isSelected ? '#0284c7' : '#fff',
                  color: isSelected ? '#fff' : '#334155',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* ХИЧЭЭЛИЙН НЭГДСЭН ДҮНГИЙН СТАТИСТИК */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* ХИЧЭЭЛИЙН ДУНДАЖ ГҮЙЦЭТГЭЛ */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#854d0e', marginBottom: '10px' }}>
            🏆 {selectedSubject} - Ангийн дундаж
          </div>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(#059669 ${avgPercent}%, #e2e8f0 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <div style={{ width: '92px', height: '92px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{avgPercent}%</span>
              <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold' }}>{avgTotal} / 12</span>
            </div>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#166534', backgroundColor: '#dcfce7', padding: '4px 12px', borderRadius: '12px' }}>
            Нийт 20 сурагч суралцаж байна
          </div>
        </div>

        {/* СОНГОГДСОН СУРАГЧИЙН ДЭЛГЭРЭНГҮЙ КОГНИТИВ АНАЛИТИК */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '20px' }}>
          {selectedStudent ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #fde047', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                  👤 Сонгосон сурагч: <span style={{ color: '#0284c7' }}>{selectedStudent.name}</span> ({selectedSubject})
                </h3>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: selectedStudent.status === 'Баталгаажсан' ? '#15803d' : '#b45309', backgroundColor: selectedStudent.status === 'Баталгаажсан' ? '#dcfce7' : '#fef9c3', padding: '4px 10px', borderRadius: '10px' }}>
                  {selectedStudent.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                    <span style={{ color: '#3730a3' }}>📌 Сэргээн санах түвшин:</span>
                    <span style={{ color: '#3730a3' }}>{selectedStudent.recall} / 2 оноо</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e0e7ff', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(selectedStudent.recall / 2) * 100}%`, backgroundColor: '#4f46e5', height: '100%' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                    <span style={{ color: '#6b21a8' }}>📝 Задлан шинжлэх түвшин:</span>
                    <span style={{ color: '#6b21a8' }}>{selectedStudent.analyze} / 4 оноо</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f3e8ff', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(selectedStudent.analyze / 4) * 100}%`, backgroundColor: '#9333ea', height: '100%' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                    <span style={{ color: '#854d0e' }}>💡 Эргэцүүлэн дүгнэх түвшин:</span>
                    <span style={{ color: '#854d0e' }}>{selectedStudent.evalScore} / 6 оноо</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#fef3c7', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(selectedStudent.evalScore / 6) * 100}%`, backgroundColor: '#d97706', height: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Сурагч сонгоно уу.</div>
          )}
        </div>

      </div>

      {/* 20 СУРАГЧИЙН НЭГДСЭН ДҮНГИЙН ХҮСНЭГТ */}
      <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px' }}>
          📋 {selectedSubject} хичээлийн 20 сурагчийн дүнгийн жагсаалт:
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#fef08a', color: '#854d0e', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>№</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Сурагчийн нэр</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Сэргээн санах (2)</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Задлан шинжлэх (4)</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Эргэцүүлэн дүгнэх (6)</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Нийт оноо (12)</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Гүйцэтгэл (%)</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Төлөв</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((st) => {
                const percent = Math.round((st.total / 12) * 100);
                const isSelected = selectedStudent?.id === st.id;

                return (
                  <tr
                    key={st.id}
                    style={{
                      backgroundColor: isSelected ? '#e0f2fe' : '#fffdf0',
                      borderBottom: '1px solid #fde047',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedStudent(st)}
                  >
                    <td style={{ padding: '10px', border: '1px solid #fde047', fontWeight: 'bold' }}>{st.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047', fontWeight: 'bold', color: '#0f172a' }}>{st.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047', color: '#3730a3', fontWeight: 'bold' }}>{st.recall}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047', color: '#6b21a8', fontWeight: 'bold' }}>{st.analyze}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047', color: '#854d0e', fontWeight: 'bold' }}>{st.evalScore}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047', color: '#166534', fontWeight: 'bold' }}>{st.total}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047', fontWeight: 'bold' }}>
                      <span style={{ color: percent >= 75 ? '#15803d' : percent >= 50 ? '#b45309' : '#dc2626' }}>
                        {percent}%
                      </span>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #fde047' }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '8px', color: st.status === 'Баталгаажсан' ? '#15803d' : '#b45309', backgroundColor: st.status === 'Баталгаажсан' ? '#dcfce7' : '#fef9c3' }}>
                        {st.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #fde047' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(st);
                        }}
                        style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Дэлгэрэнгүй 👁️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}