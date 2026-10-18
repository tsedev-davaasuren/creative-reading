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
    // LocalStorage-оос баталгаажуулсан дүнгийн өгөгдлийг унших
    const loaded = localStorage.getItem('student_approved_analytics_data');
    if (loaded) {
      try {
        setData(JSON.parse(loaded));
      } catch (e) {
        console.error('Аналитик өгөгдөл ачаалахад алдаа гарлаа', e);
      }
    } else {
      // Хэрэв даалгавар ажиллаагүй байсан ч шууд идэвхжиж харагдах жишээ өгөгдөл
      setData({
        recall: 2,
        analyze: 3,
        eval: 4,
        total: 9,
        feedback: 'Цэндао өвөө-багшийн багтсан нэгдсэн дүгнэлт: Сурагч даалгавар 5, 6 дээр өгүүлбэрийн тоо дутуу бичсэн тул рубрикийн дагуу оноо хасаж үнэлэв. Аналитик мэдээлэл бэлэн байна.',
        approvedAt: new Date().toLocaleString('mn-MN'),
      });
    }
  }, []);

  const totalMax = 12;
  const totalPercent = data ? Math.round((data.total / totalMax) * 100) : 0;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#0284c7', color: '#fff', padding: '10px 14px', borderRadius: '12px', fontSize: '20px' }}>📊</div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Хяналт Шинжилгээ & PISA аналитик</h1>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Бүтээлч уншлага-2 төсөл | 9Е Анги - Болд-Эрдэнэ</p>
          </div>
        </div>

        {data && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>
            ✅ Идэвхтэй баталгаажсан огноо: {data.approvedAt}
          </div>
        )}
      </header>

      {/* MAIN CARDS CONTAINER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* НИЙТ ОНОО БА ХУВЬ (CIRCULAR CHART) */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b', marginBottom: '16px' }}>🏆 Нэгдсэн Гүйцэтгэл</div>
          
          <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', background: `conic-gradient(#059669 ${totalPercent}%, #e2e8f0 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ width: '120px', height: '120px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a' }}>{totalPercent}%</span>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>{data?.total} / 12 оноо</span>
            </div>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 'bold', color: totalPercent >= 80 ? '#15803d' : totalPercent >= 60 ? '#b45309' : '#dc2626', backgroundColor: totalPercent >= 80 ? '#dcfce7' : totalPercent >= 60 ? '#fef9c3' : '#fef2f2', padding: '6px 16px', borderRadius: '20px' }}>
            {totalPercent >= 80 ? '🌟 Хангалттай Сайн' : totalPercent >= 60 ? '👍 Дундж түвшин' : '⚠️ Сайжруулах шаардлагатай'}
          </div>
        </div>

        {/* 3 ТҮВШНИЙ ПРОГРЕСС БАР GRAPH */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>
            📈 Когнитив түвшин бүрийн онооны шинжилгээ
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 1. СЭРГЭЭН САНАХ */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                <span style={{ color: '#3730a3' }}>📌 Сэргээн санах түвшин</span>
                <span style={{ color: '#3730a3' }}>{data?.recall} / 2 оноо ({Math.round(((data?.recall || 0) / 2) * 100)}%)</span>
              </div>
              <div style={{ height: '12px', backgroundColor: '#e0e7ff', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${((data?.recall || 0) / 2) * 100}%`, backgroundColor: '#4f46e5', height: '100%', borderRadius: '6px', transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* 2. ЗАДЛАН ШИНЖЛЭХ */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                <span style={{ color: '#6b21a8' }}>📝 Задлан шинжлэх түвшин</span>
                <span style={{ color: '#6b21a8' }}>{data?.analyze} / 4 оноо ({Math.round(((data?.analyze || 0) / 4) * 100)}%)</span>
              </div>
              <div style={{ height: '12px', backgroundColor: '#f3e8ff', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${((data?.analyze || 0) / 4) * 100}%`, backgroundColor: '#9333ea', height: '100%', borderRadius: '6px', transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* 3. ЭРГЭЦҮҮЛЭН ДҮГНЭХ */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                <span style={{ color: '#854d0e' }}>💡 Эргэцүүлэн дүгнэх түвшин</span>
                <span style={{ color: '#854d0e' }}>{data?.eval} / 6 оноо ({Math.round(((data?.eval || 0) / 6) * 100)}%)</span>
              </div>
              <div style={{ height: '12px', backgroundColor: '#fef3c7', borderRadius: '6px', overflow: 'hidden