'use client';

import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  recall: number;
  analyze: number;
  eval: number;
  total: number;
  feedback: string;
  approvedAt: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const loaded = localStorage.getItem('student_approved_analytics_data');
    if (loaded) {
      try {
        setData(JSON.parse(loaded));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default demo initial data
      setData({
        recall: 2,
        analyze: 3,
        eval: 4,
        total: 9,
        feedback: 'Цэндао өвөө-багшийн нэгдсэн дүгнэлт: Сурагч даалгаврыг амжилттай ажиллаж, рубрикийн дагуу үнэлэгдэв.',
        approvedAt: new Date().toLocaleString('mn-MN'),
      });
    }
  }, []);

  const totalMax = 12;
  const totalPercent = data ? Math.round((data.total / totalMax) * 100) : 0;

  return (
    <div style={{ backgroundColor: '#fffdf0', minHeight: '100vh', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#0284c7', color: '#fff', padding: '10px 14px', borderRadius: '12px', fontSize: '20px' }}>📊</div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Хяналт Шинжилгээ & PISA чадварын аналитик</h1>
            <p style={{ fontSize: '12px', color: '#0284c7', margin: '2px 0 0 0', fontWeight: 'bold' }}>Бүтээлч уншлага-2 төсөл | Анги: 9Е | Сурагч: Болд-Эрдэнэ</p>
          </div>
        </div>

        {data && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>
            ✅ Баталгаажсан: {data.approvedAt}
          </div>
        )}
      </header>

      {/* CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* CIRCULAR GRAPH */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#854d0e', marginBottom: '16px' }}>🏆 Нэгдсэн Гүйцэтгэл</div>
          
          <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', background: `conic-gradient(#059669 ${totalPercent}%, #fef08a 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ width: '120px', height: '120px', backgroundColor: '#fffdf0', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a' }}>{totalPercent}%</span>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>{data?.total} / 12 оноо</span>
            </div>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 'bold', color: totalPercent >= 80 ? '#15803d' : totalPercent >= 60 ? '#b45309' : '#dc2626', backgroundColor: totalPercent >= 80 ? '#dcfce7' : totalPercent >= 60 ? '#fef9c3' : '#fef2f2', padding: '6px 16px', borderRadius: '20px' }}>
            {totalPercent >= 80 ? '🌟 Хангалттай Сайн' : totalPercent >= 60 ? '👍 Дундж түвшин' : '⚠️ Сайжруулах шаардлагатай'}
          </div>
        </div>

        {/* BARS GRAPH */}
        <div style={{ backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>
            📈 Когнитив 3 түвшний онооны шинжилгээ
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Сэргээн санах */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                <span style={{ color: '#3730a3' }}>📌 Сэргээн санах түвшин (Макс 2)</span>
                <span style={{ color: '#3730a3' }}>{data?.recall} / 2 оноо ({Math.round(((data?.recall || 0) / 2) * 100)}%)</span>
              </div>
              <div style={{ height: '12px', backgroundColor: '#e0e7ff', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${((data?.recall || 0) / 2) * 100}%`, backgroundColor: '#4f46e5', height: '100%', borderRadius: '6px' }} />
              </div>
            </div>

            {/* Задлан шинжлэх */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                <span style={{ color: '#6b21a8' }}>📝 Задлан шинжлэх түвшин (Макс 4)</span>
                <span style={{ color: '#6b21a8' }}>{data?.analyze} / 4 оноо ({Math.round(((data?.analyze || 0) / 4) * 100)}%)</span>
              </div>
              <div style={{ height: '12px', backgroundColor: '#f3e8ff', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${((data?.analyze || 0) / 4) * 100}%`, backgroundColor: '#9333ea', height: '100%', borderRadius: '6px' }} />
              </div>
            </div>

            {/* Эргэцүүлэн дүгнэх */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                <span style={{ color: '#854d0e' }}>💡 Эргэцүүлэн дүгнэх түвшин (Макс 6)</span>
                <span style={{ color: '#854d0e' }}>{data?.eval} / 6 оноо ({Math.round(((data?.eval || 0) / 6) * 100)}%)</span>
              </div>
              <div style={{ height: '12px', backgroundColor: '#fef3c7', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${((data?.eval || 0) / 6) * 100}%`, backgroundColor: '#d97706', height: '100%', borderRadius: '6px' }} />
              </div>
            </div>

          </div>
        </div>

        {/* FEEDBACK */}
        <div style={{ gridColumn: '1 / -1', backgroundColor: '#fffbe8', border: '1px solid #fde047', borderRadius: '18px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>
            💬 Баталгаажуулсан Дүгнэлт
          </h3>
          <div style={{ backgroundColor: '#fffdf0', border: '1px solid #fde047', padding: '16px', borderRadius: '12px', fontSize: '13px', color: '#334155', lineHeight: '1.7', fontStyle: 'italic' }}>
            "{data?.feedback}"
          </div>
        </div>

      </div>

    </div>
  );
}