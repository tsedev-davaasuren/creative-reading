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
      setData({
        recall: 2,
        analyze: 3,
        eval: 4,
        total: 9,
        feedback: 'Цэндао өвөө-багшийн багтсан нэгдсэн дүгнэлт: Сурагч даалгаврыг амжилттай ажиллаж, рубрикийн дагуу үнэлэгдэв.',
        approvedAt: new Date().toLocaleString('mn-MN'),
      });
    }
  }, []);

  const totalMax = 12;
  const totalPercent = data ? Math.round((data.total / totalMax) * 100) : 0;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#0284c7', color: '#fff', padding: '10px 14px', borderRadius: '12px', fontSize: '20px' }}>📊</div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Хяналт Шинжилгээ & PISA аналитик</h1>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Бүтээлч уншлага-2 төсөл | 9Е Анги - Болд-Эрдэнэ</p>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b', marginBottom: '16px' }}>🏆 Нэгдсэн Гүйцэтгэл</div>
          <div style={{ position: 'relative', width: '140px', height: '140px', borderRadius: '50%', background: `conic-gradient(#059669 ${totalPercent}%, #e2e8f0 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ width: '110px', height: '110px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{totalPercent}%</span>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>{data?.total} / 12 оноо</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>📈 Когнитив 3 түвшний онооны шинжилгээ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                <span>📌 Сэргээн санах түвшин</span>
                <span>{data?.recall} / 2 оноо</span>
              </div>
              <div style={{ height: '10px', backgroundColor: '#e0e7ff', borderRadius: '5px' }}>
                <div style={{ width: `${((data?.recall || 0) / 2) * 100}%`, backgroundColor: '#4f46e5', height: '100%', borderRadius: '5px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                <span>📝 Задлан шинжлэх түвшин</span>
                <span>{data?.analyze} / 4 оноо</span>
              </div>
              <div style={{ height: '10px', backgroundColor: '#f3e8ff', borderRadius: '5px' }}>
                <div style={{ width: `${((data?.analyze || 0) / 4) * 100}%`, backgroundColor: '#9333ea', height: '100%', borderRadius: '5px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                <span>💡 Эргэцүүлэн дүгнэх түвшин</span>
                <span>{data?.eval} / 6 оноо</span>
              </div>
              <div style={{ height: '10px', backgroundColor: '#fef3c7', borderRadius: '5px' }}>
                <div style={{ width: `${((data?.eval || 0) / 6) * 100}%`, backgroundColor: '#d97706', height: '100%', borderRadius: '5px' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>💬 Баталгаажуулсан нэгдсэн дүгнэлт:</h3>
          <p style={{ fontSize: '13px', color: '#334155', fontStyle: 'italic', margin: 0 }}>"{data?.feedback}"</p>
        </div>
      </div>
    </div>
  );
}