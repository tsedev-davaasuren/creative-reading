'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AssignmentAttempt {
  taskNo: number; // 1-ээс 5 даалгавар
  title: string;
  recall: number; // Max 2
  analyze: number; // Max 4
  evalScore: number; // Max 6
  total: number; // Max 12
  date: string;
}

interface StudentResult {
  id: number;
  name: string;
  attempts: AssignmentAttempt[]; // 5 удаагийн даалгаврын түүх
  avgTotal: number;
  status: 'Баталгаажсан' | 'Хүлээгдэж буй';
}

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Газар зүй');
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);

  const subjects = ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'];

  const studentNames = [
    'Амарболд Б.', 'Анужин Т.', 'Баатар С.', 'Болд-Эрдэнэ Э.', 'Бат-Эрдэнэ Г.',
    'Ганзориг Д.', 'Дулмаа О.', 'Есүй Б.', 'Золбоо М.', 'Индра Т.',
    'Мөнх-Эрдэнэ Б.', 'Номин-Эрдэнэ С.', 'Онон Г.', 'Өлзий Д.', 'Сүхбат Б.',
    'Тэмүүлэн М.', 'Урангоо Б.', 'Хулан А.', 'Цэнгэл Т.', 'Энхжин Н.'
  ];

  const [subjectData, setSubjectData] = useState<Record<string, StudentResult[]>>({});

  useEffect(() => {
    setIsMounted(true);

    const generatedData: Record<string, StudentResult[]> = {};

    subjects.forEach((subj, subIdx) => {
      generatedData[subj] = studentNames.map((name, stIdx) => {
        // Сурагч бүрт 5 удаагийн даалгавар ажилласан түүх үүсгэх
        const attempts: AssignmentAttempt[] = [1, 2, 3, 4, 5].map((taskNo) => {
          const recall = Math.min(2, Math.floor(((stIdx + subIdx + taskNo) % 3) + 1));
          const analyze = Math.min(4, Math.floor(((stIdx + taskNo) % 4) + 1));
          const evalScore = Math.min(6, Math.floor(((stIdx + subIdx + taskNo) % 5) + 2));
          return {
            taskNo,
            title: `${subj} - Даалгавар ${taskNo}`,
            recall,
            analyze,
            evalScore,
            total: recall + analyze + evalScore,
            date: `2026.10.${10 + taskNo}`,
          };
        });

        const sumTotal = attempts.reduce((acc, a) => acc + a.total, 0);
        const avgTotal = Number((sumTotal / 5).toFixed(1));

        return {
          id: stIdx + 1,
          name,
          attempts,
          avgTotal,
          status: stIdx % 4 === 0 ? 'Хүлээгдэж буй' : 'Баталгаажсан',
        };
      });
    });

    setSubjectData(generatedData);
    // Анужин Т. (2 дахь сурагч)-ийг анхнаас нь сонгох
    if (generatedData['Газар зүй'] && generatedData['Газар зүй'].length > 1) {
      setSelectedStudent(generatedData['Газар зүй'][1]);
    }
  }, []);

  if (!isMounted) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>Уншиж байна...</div>;

  const currentStudents = subjectData[selectedSubject] || [];
  const classAvg = currentStudents.length > 0
    ? (currentStudents.reduce((acc, s) => acc + s.avgTotal, 0) / currentStudents.length).toFixed(1)
    : '0';
  const classAvgPercent = Math.round((Number(classAvg) / 12) * 100);

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '20px 24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#0284c7', color: '#fff', padding: '10px 14px', borderRadius: '12px', fontSize: '20px' }}>📊</div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>
              Хяналт Шинжилгээ & 5 Удаагийн Даалгаврын Аналитик
            </h1>
            <p style={{ fontSize: '12px', color: '#0284c7', margin: '2px 0 0 0', fontWeight: 'bold' }}>
              Creative reading-2 project | 6 Хичээл × 5 Даалгавар (Нийт 30 Даалгавар)
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

      {/* 6 ХИЧЭЭЛИЙН СОНГОЛТ */}
      <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#854d0e', marginBottom: '10px' }}>
          📌 Хичээл сонгох (Тухайн хичээлийн 20 сурагч тус бүрийн 5 удаагийн дүн харагдана):
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
                }}
              >
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* СУРАГЧИЙН 5 УДААГИЙН ДААЛГАВРЫН ДЭЛГЭРЭНГҮЙ СТАТИСТИК */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* АНГИЙН ДУНДАЖ */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#854d0e', marginBottom: '10px' }}>
            🏆 {selectedSubject} - Нийт дундаж
          </div>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(#059669 ${classAvgPercent}%, #e2e8f0 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <div style={{ width: '92px', height: '92px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{classAvgPercent}%</span>
              <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold' }}>{classAvg} / 12 оноо</span>
            </div>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#166534', backgroundColor: '#dcfce7', padding: '4px 12px', borderRadius: '12px' }}>
            20 Сурагч × 5 Даалгавар
          </div>
        </div>

        {/* СОНГОСОН СУРАГЧИЙН (Ж: АНУЖИН Т.) 5 УДААГИЙН ДААЛГАВРЫН ТҮҮХ */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '20px' }}>
          {selectedStudent ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #fde047', paddingBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                    👤 {selectedStudent.name} (<span style={{ color: '#0284c7' }}>{selectedSubject} - 5 даалгаврын түүх</span>)
                  </h3>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                    Дундаж оноо: <strong>{selectedStudent.avgTotal} / 12</strong> ({Math.round((selectedStudent.avgTotal / 12) * 100)}%)
                  </p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: selectedStudent.status === 'Баталгаажсан' ? '#15803d' : '#b45309', backgroundColor: selectedStudent.status === 'Баталгаажсан' ? '#dcfce7' : '#fef9c3', padding: '4px 10px', borderRadius: '10px' }}>
                  {selectedStudent.status}
                </span>
              </div>

              {/* 5 УДААГИЙН ДААЛГАВРЫН ЖАГСААЛТ БА ПРОГРЕСС БАР */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedStudent.attempts.map((att) => {
                  const percent = Math.round((att.total / 12) * 100);
                  return (
                    <div key={att.taskNo} style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', padding: '10px 14px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                        <span style={{ color: '#0f172a' }}>📝 Даалгавар {att.taskNo} ({att.date})</span>
                        <span style={{ color: percent >= 75 ? '#15803d' : percent >= 50 ? '#b45309' : '#dc2626' }}>
                          {att.total} / 12 оноо ({percent}%)
                        </span>
                      </div>

                      {/* 3 ТҮВШНИЙ ОНООНЫ ЗАДАРГАА */}
                      <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#475569', marginBottom: '6px' }}>
                        <span>📌 Сэргээн санах: <strong style={{ color: '#3730a3' }}>{att.recall}/2</strong></span>
                        <span>📝 Задлан шинжлэх: <strong style={{ color: '#6b21a8' }}>{att.analyze}/4</strong></span>
                        <span>💡 Эргэцүүлэн дүгнэх: <strong style={{ color: '#854d0e' }}>{att.evalScore}/6</strong></span>
                      </div>

                      <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, backgroundColor: percent >= 75 ? '#059669' : percent >= 50 ? '#d97706' : '#dc2626', height: '100%' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Сурагч сонгоно уу.</div>
          )}
        </div>

      </div>

      {/* 20 СУРАГЧИЙН ДҮНГИЙН НЭГДСЭН ХҮСНЭГТ */}
      <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px' }}>
          📋 {selectedSubject} хичээлийн 20 сурагчийн 5 удаагийн дундаж дүнгүүд:
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#fef08a', color: '#854d0e', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>№</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Сурагчийн нэр</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Д-1</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Д-2</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Д-3</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Д-4</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Д-5</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>5 Даалгаврын дундаж</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Гүйцэтгэл (%)</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((st) => {
                const percent = Math.round((st.avgTotal / 12) * 100);
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
                    <td style={{ padding: '10px', border: '1px solid #fde047' }}>{st.attempts[0]?.total}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047' }}>{st.attempts[1]?.total}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047' }}>{st.attempts[2]?.total}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047' }}>{st.attempts[3]?.total}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047' }}>{st.attempts[4]?.total}</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047', color: '#166534', fontWeight: 'bold' }}>{st.avgTotal} / 12</td>
                    <td style={{ padding: '10px', border: '1px solid #fde047', fontWeight: 'bold' }}>
                      <span style={{ color: percent >= 75 ? '#15803d' : percent >= 50 ? '#b45309' : '#dc2626' }}>
                        {percent}%
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
                        5 Даалгаврын түүх 👁️
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