"use client";

import { useState } from "react";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Уран зохиол");
  const [imgError, setImgError] = useState(false);

  const subjects = ["Уран зохиол", "Хими", "Биологи", "Түүх", "Физик", "Газар зүй"];

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", padding: "24px", fontFamily: "sans-serif" }}>
      
      {/* 1. HEADER ХЭСЭГ */}
      <header style={{
        maxWidth: "1280px",
        margin: "0 auto 24px auto",
        backgroundColor: "#fffbeb",
        borderRadius: "16px",
        border: "1px solid #fde68a",
        padding: "16px 24px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        
        {/* 1. БАГАСГАЖ БАЛАНСЖУУЛСАН ЛОГО */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            minWidth: "80px",
            borderRadius: "14px",
            backgroundColor: "#ffffff",
            border: "2px solid #fcd34d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0,0,0,0.06)",
            padding: "4px"
          }}>
            <img 
              src="/project-logo.jpg" 
              alt="Бүтээлч уншлага лого" 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "contain", 
                display: "block" 
              }}
            />
          </div>
          <div>
            <h1 style={{ fontSize: "19px", fontWeight: "bold", color: "#0f172a", margin: 0, lineHeight: 1.2 }}>
              Бүтээлч уншлага-2 төсөл
            </h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0", fontWeight: "500" }}>
              Creative reading-2 project
            </p>
          </div>
        </div>

        {/* Төв хэсэг */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{
            backgroundColor: "#fbbf24",
            border: "1px solid #f59e0b",
            padding: "8px 24px",
            borderRadius: "16px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
              Mentor AI Цэндао багштай
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            <button type="button" style={{
              backgroundColor: "#fde68a",
              border: "1px solid #fcd34d",
              padding: "6px 16px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#0f172a",
              cursor: "pointer"
            }}>
              PISA шалгалтын жишиг даалгавар боловсруулах
            </button>
            <button 
              type="button"
              onClick={() => setIsChatOpen(!isChatOpen)}
              style={{
                backgroundColor: "#fde68a",
                border: "1px solid #fcd34d",
                padding: "6px 16px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#0f172a",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>мэргэжил, арга зүйн яриа өрнүүлэх</span>
              <span style={{ fontSize: "10px" }}>{isChatOpen ? "▲" : "▼"}</span>
            </button>
          </div>
        </div>

        {/* 2. ЦЭНДАО БАГШИЙН ЗУРАГ БОЛОН АВАТАР */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>Таны Ментор</p>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#059669", margin: "2px 0 0 0", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }}></span>
              Онлайн
            </p>
          </div>
          <div style={{
            width: "80px",
            height: "80px",
            minWidth: "80px",
            borderRadius: "50%",
            border: "3px solid #f59e0b",
            overflow: "hidden",
            backgroundColor: "#fef3c7",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "2px"
          }}>
            {!imgError ? (
              <img 
                src="/tsendao-bagsh.jpg" 
                alt="Цэндао багш" 
                onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "4px" }}>
                <span style={{ fontSize: "28px", lineHeight: 1, display: "block" }}>👨‍🏫</span>
                <span style={{ fontSize: "9px", fontWeight: "bold", color: "#b45309", display: "block", marginTop: "2px" }}>
                  Цэндао багш
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Дэлгэгддэг Чат цонх */}
      {isChatOpen && (
        <section style={{
          maxWidth: "1280px",
          margin: "0 auto 24px auto",
          backgroundColor: "#fffbeb",
          border: "2px solid #fcd34d",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>
              💬 Цэндао багштай арга зүйн яриа өрнүүлэх
            </h3>
            <button 
              type="button"
              onClick={() => setIsChatOpen(false)}
              style={{ fontSize: "12px", background: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 8px", cursor: "pointer" }}
            >
              Хураах ✕
            </button>
          </div>
          <div style={{ height: "140px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #fde68a", padding: "12px", overflowY: "auto", fontSize: "12px" }}>
            <div style={{ backgroundColor: "#fef3c7", padding: "10px", borderRadius: "8px", maxWidth: "400px" }}>
              👨‍🏫 <strong>Цэндао багш:</strong> Сайн байна уу! PISA даалгавар боловсруулах эсвэл хичээлийн арга зүйн талаар юу асуухыг хүсэж байна вэ?
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <input 
              type="text" 
              placeholder="Асуултаа энд бичнэ үү..." 
              style={{ flex: 1, padding: "8px 12px", border: "1px solid #fcd34d", borderRadius: "8px", fontSize: "12px", outline: "none" }}
            />
            <button type="button" style={{ backgroundColor: "#fbbf24", border: "none", color: "#0f172a", fontWeight: "bold", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>
              Илгээх
            </button>
          </div>
        </section>
      )}

      {/* ҮНДСЭН АЖЛЫН ХЭСЭГ */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        
        {/* Зүүн тал: ЭХ БИЧВЭР ЦОНХ */}
        <section style={{ backgroundColor: "#fffbeb", borderRadius: "16px", border: "1px solid #fde68a", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "600px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#fbbf24", display: "inline-block" }}></span>
                Эх бичвэр
              </h3>

              <button type="button" style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                Даалгаврын сан ➔
              </button>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Хичээл сонгох:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: selectedSubject === sub ? "#0284c7" : "#38bdf8",
                      color: "#ffffff"
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Эх бичвэрийн гарчиг</label>
              <input 
                type="text" 
                placeholder="Эх бичвэрийн гарчгийг оруулна уу..." 
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #fde68a", borderRadius: "8px", fontSize: "12px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Унших эх бичвэр (Эх сурвалж)</label>
              <textarea 
                placeholder="Эх бичвэрээ оруулаарай." 
                style={{ width: "100%", height: "320px", padding: "12px", border: "1px solid #fde68a", borderRadius: "8px", fontSize: "12px", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "16px" }}>
            <button type="button" style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
              ⚡ Даалгавар боловсруулах
            </button>
          </div>

        </section>

        {/* Баруун тал: АСУУЛТ ДААЛГАВАР ЦОНХ */}
        <section style={{ backgroundColor: "#fffbeb", borderRadius: "16px", border: "1px solid #fde68a", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "600px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#fbbf24", display: "inline-block" }}></span>
                Асуулт даалгавар
              </h3>

              <button type="button" style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                Хяналт шинжилгээ ➔
              </button>
            </div>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fde68a", padding: "24px", minHeight: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "8px" }}>
                📝
              </div>
              <p style={{ fontSize: "14px", fontWeight: "bold", color: "#334155", margin: "0 0 4px 0" }}>
                PISA Стандарт 6 Даалгавар (12 Оноо)
              </p>
              <p style={{ fontSize: "12px", color: "#64748b", maxWidth: "280px", margin: 0 }}>
                Зүүн талд хичээлээ сонгон, эх бичвэрээ оруулж "Даалгавар боловсруулах" товчийг дарснаар асуултууд энд бэлэн болно.
              </p>
            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "16px" }}>
            <button type="button" style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
              💾 Даалгаврыг баталж, санд илгээх
            </button>
          </div>

        </section>

      </div>

    </main>
  );
}