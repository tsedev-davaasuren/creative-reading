"use client";

import { useState } from "react";

// Цэндао багшийн зургийг кодон дотор шууд шигтгэсэн Base64 код (Сүлжээний холболт, файл хайх шаардлагагүй)
const TSENDAO_BAGSH_IMAGE = "data:image/jpeg;base64,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";

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
              alt="" 
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

        {/* ЦЭНДАО БАГШИЙН ДЭЭЛТЭЙ ЗУРАГ (100% АЧААЛАХ BASE64) */}
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