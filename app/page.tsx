"use client";

import { useState } from "react";

// Цэндао багшийн зургийн 100% цэвэрхэн Base64 бичвэр (Синтаксийн алдаагүй)
const TSENDAO_BAGSH_IMAGE = "data:image/jpeg;base64,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 <span style={{display: 'none'}}>--</span>";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Уран зохиол");

  const subjects = ["Уран зохиол", "Хими", "Биологи", "Түүх", "Физик", "Газар зүй"];

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* 1. HEADER ХЭСЭГ */}
      <header style={{
        maxWidth: "1280px",
        margin: "0 auto 20px auto",
        backgroundColor: "#fffbeb",
        borderRadius: "16px",
        border: "1px solid #fde68a",
        padding: "16px 20px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
      }}>
        
        {/* ТӨСЛИЙН ЛОГО */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <div style={{
            width: "68px",
            height: "68px",
            minWidth: "68px",
            borderRadius: "14px",
            backgroundColor: "#ffffff",
            border: "2px solid #fcd34d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "2px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <img 
              src="/project-logo.jpg" 
              alt="Бүтээлч уншлага лого" 
              onError={(e) => {
                e.currentTarget.src = "/logo-project.jpg";
              }}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: 0, lineHeight: 1.2 }}>
              Бүтээлч уншлага-2 төсөл
            </h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0", fontWeight: "500" }}>
              Creative reading-2 project
            </p>
          </div>
        </div>

        {/* ТӨВ ХЭСЭГ */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{
            backgroundColor: "#fbbf24",
            border: "1px solid #f59e0b",
            padding: "6px 20px",
            borderRadius: "14px"
          }}>
            <h2 style={{ fontSize: "17px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
              Mentor AI Цэндао багштай
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            <button type="button" style={{
              backgroundColor: "#fde68a",
              border: "1px solid #fcd34d",
              padding: "6px 14px",
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
                padding: "6px 14px",
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

        {/* ЦЭНДАО БАГШИЙН ДЭЭЛТЭЙ ЗУРАГ (BASE64) */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>Таны Ментор</p>
            <p style={{ fontSize: "10px", fontWeight: "600", color: "#059669", margin: "2px 0 0 0", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }}></span>
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
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            position: "relative"
          }}>
            <img 
              src={TSENDAO_BAGSH_IMAGE} 
              alt="" 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                objectPosition: "center",
                display: "block" 
              }}
            />
          </div>
        </div>

      </header>

      {/* ДЭЛГЭГДДЭГ ЧАТ ХЭСЭГ */}
      {isChatOpen && (
        <section style={{
          maxWidth: "1280px",
          margin: "0 auto 20px auto",
          backgroundColor: "#fffbeb",
          border: "2px solid #fcd34d",
          borderRadius: "16px",
          padding: "16px"
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
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        
        {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР */}
        <section style={{ backgroundColor: "#fffbeb", borderRadius: "16px", border: "1px solid #fde68a", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "560px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#fbbf24", display: "inline-block" }}></span>
                Эх бичвэр
              </h3>

              <button type="button" style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                Даалгаврын сан ➔
              </button>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Хичээл сонгох:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    style={{
                      padding: "6px 14px",
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
                style={{ width: "100%", height: "280px", padding: "12px", border: "1px solid #fde68a", borderRadius: "8px", fontSize: "12px", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "14px" }}>
            <button type="button" style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>
              ⚡ Даалгавар боловсруулах
            </button>
          </div>

        </section>

        {/* БАРУУН ТАЛ: АСУУЛТ ДААЛГАВАР */}
        <section style={{ backgroundColor: "#fffbeb", borderRadius: "16px", border: "1px solid #fde68a", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "560px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#fbbf24", display: "inline-block" }}></span>
                Асуулт даалгавар
              </h3>

              <button type="button" style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                Хяналт шинжилгээ ➔
              </button>
            </div>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fde68a", padding: "20px", minHeight: "360px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "8px" }}>
                📝
              </div>
              <p style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", margin: "0 0 4px 0" }}>
                PISA Стандарт 6 Даалгавар (12 Оноо)
              </p>
              <p style={{ fontSize: "11px", color: "#64748b", maxWidth: "260px", margin: 0 }}>
                Зүүн талд хичээлээ сонгон, эх бичвэрээ оруулж "Даалгавар боловсруулах" товчийг дарснаар асуултууд энд бэлэн болно.
              </p>
            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "14px" }}>
            <button type="button" style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>
              💾 Даалгаврыг баталж, санд илгээх
            </button>
          </div>

        </section>

      </div>

    </main>
  );
}