'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface StudentResult {
  id: string;
  name: string;
  class: string;
  recall: number; // Мэдээлэл олох сэргээн санах (макс 2)
  analyze: number; // Задлан шинжлэх (макс 4)
  eval: number; // Эргэцүүлэн дүгнэх (макс 6)
  total: number; // Нийт (макс 12)
  feedback: string;
  approvedAt: string;
}

export default function AnalyticsPage() {
  const [results, setResults] = useState<StudentResult[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    // LocalStorage-оос баталгаажсан дүнгүүдийг унших
    const saved = localStorage.getItem('student_approved_analytics_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setResults(parsed);
        } else {
          setResults([{ id: 'STU-001', name: 'Анужин Т.', class: '9Е', ...parsed }]);
        }
      } catch (e) {
        setResults([]);
      }
    } else {
      // Анхдагч дээж туршилтын дата (Хэрэв байхгүй бол)
      setResults([
        {
          id: 'STU-001',
          name: 'Анужин Т.',
          class: '9Е',
          recall: 2,
          analyze: 3,
          eval: 4,
          total: 9,
          feedback: 'Цэндао өвөө-багшийн дүгнэлт: Даалгавар 5, 6 дээр өгүүлбэрийн тоо дутуу бичсэн тул рубрикийн дагуу оноо хасаж үнэлэв.',
          approvedAt: new Date().toLocaleString('mn-MN'),
        },
      ]);
    }
  };

  // НЭГ СУРАГЧИЙН ҮНЭЛГЭЭГ УСТГАХ
  const handleDeleteSingle = (id: string) => {
    if (confirm('Энэ сурагчийн үнэлгээг устгахдаа итгэлтэй байна уу?')) {
      const updated = results.filter((item) => item.id !== id);
      setResults(updated);
      localStorage.setItem('student_approved_analytics_data', JSON.stringify(updated));
    }
  };

  // БҮХ ТУРШИЛТЫН ҮНЭЛГЭЭГ АРИЛГАЖ ЦЭВЭРЛЭХ
  const handleClearAll = () => {
    if (confirm('🚨 Анхаар: Бүх туршилтын үнэлгээ болон сурагчдын дүнг сангаас бүрэн арилгах уу?')) {
      setResults([]);
      localStorage.removeItem('student_approved_analytics_data');
      alert('Туршилтын үнэлгээ, дүнгүүд амжилттай арилгагдлаа!');
    }
  };

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '20px 30px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/project-logo.jpg" alt="Logo" style={{ width: '56px', height: '56px', borderRadius: '12px', border: '1px solid #fbbf24', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>📊 Хяналт шинжилгээ & Аналитик танчим</h1>
            <p style={{ fontSize: '12px', color: '#0284c7', margin: '4px 0 0 0', fontWeight: 'bold' }}>Бүтээлч уншлага-2 төсөл | Анги: 9Е</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* БҮХ ТУРШИЛТЫН ДҮНГ АРИЛГАХ ТОВЧ */}
          <button
            onClick={handleClearAll}
            style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '10px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            🗑️ Туршилтын үнэлгээг арилгах
          </button>

          <Link
            href="/teacher"
            style={{ backgroundColor: '#0284c7', color: '#fff', padding: '10px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}
          >
            👨‍🏫 Багшийн танхим руу буцах
          </Link>
        </div>
      </header>

      {/* АНАЛИТИК НЭГДСЭН САТАСТИК КАРТУУД */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', padding: '16px', borderRadius: '14px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Нийт шалгуулсан сурагч</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{results.length} сурагч</div>
        </div>

        <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', padding: '16px', borderRadius: '14px' }}>
          <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: 'bold' }}>1. Сэргээн санах (Дундаж)</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0284c7', marginTop: '4px' }}>
            {results.length > 0 ? (results.reduce((acc, r) => acc + r.recall, 0) / results.length).toFixed(1) : 0} / 2 оноо
          </div>
        </div>

        <div style={{ backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe', padding: '16px', borderRadius: '14px' }}>
          <div style={{ fontSize: '12px', color: '#6b21a8', fontWeight: 'bold' }}>2. Задлан шинжлэх (Дундаж)</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#7c3aed', marginTop: '4px' }}>
            {results.length > 0 ? (results.reduce((acc, r) => acc + r.analyze, 0) / results.length).toFixed(1) : 0} / 4 оноо
          </div>
        </div>

        <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', padding: '16px', borderRadius: '14px' }}>
          <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 'bold' }}>3. Эргэцүүлэн дүгнэх (Дундаж)</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706', marginTop: '4px' }}>
            {results.length > 0 ? (results.reduce((acc, r) => acc + r.eval, 0) / results.length).toFixed(1) : 0} / 6 оноо
          </div>
        </div>
      </div>

      {/* ДҮНГИЙН ХҮСНЭГТ */}
      <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px 0' }}>
          📋 Сурагчдын гүйцэтгэл ба Рубрикийн үнэлгээний жагсаалт
        </h3>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>
            Одоогоор хадгалагдсан үнэлгээ, дүн байхгүй байна.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#fef08a', color: '#854d0e', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Анги / Сурагч</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Сэргээн санах (2)</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Задлан шинжлэх (4)</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Эргэцүүлэн дүгнэх (6)</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Нийт оноо (12)</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Тайлан ба санал</th>
                <th style={{ padding: '10px', border: '1px solid #fde047' }}>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} style={{ backgroundColor: '#fffdf0' }}>
                  <td style={{ padding: '10px', border: '1px solid #fde047', fontWeight: 'bold' }}>
                    {r.class} - {r.name}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #fde047', color: '#0284c7', fontWeight: 'bold' }}>
                    {r.recall} / 2
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #fde047', color: '#7c3aed', fontWeight: 'bold' }}>
                    {r.analyze} / 4
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #fde047', color: '#d97706', fontWeight: 'bold' }}>
                    {r.eval} / 6
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #fde047', fontWeight: '800', color: '#15803d', fontSize: '13px' }}>
                    {r.total} ({Math.round((r.total / 12) * 100)}%)
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #fde047', color: '#334155', maxWidth: '300px' }}>
                    {r.feedback}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #fde047' }}>
                    <button
                      onClick={() => handleDeleteSingle(r.id)}
                      style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      🗑️ Устгах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}