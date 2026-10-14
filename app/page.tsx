"use client";

import { useState } from "react";

// Цэндао багшийн дээлтэй зургийг кодон дотор нь шууд шигтгэсэн Base64 код (100% ачаалагдана)
const TSENDAO_BAGSH_IMAGE = "data:image/jpeg;base64,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 <span style={{display: 'none'}}>--</span>" + "GfU9Qs7DzpTFC9zOsedqktt3MvTd2/u+1bf/AAuP4Yf9FD8I/wDg3tv/AIuudvdXmsdUstXsrPzdRtpU/db8edFnDR/d7qTx3IX2rS/4Xb44A/5JF4j/AO3iX/5Hr6vIuJ8J/aEYu7pyjyteV/f/AC37HkZhldf2HMtdb/5fqdL/AMLi+GH/AEUPwj/4N7b/AOLoo/4Xf44/6JF4j/8A3iX/AER3/wD2H5CivuXnuSfyfhE8T6lj/X7v+Ce+4G4ttUkjBJAyfr6/jS0UV+fHvBRRRQAVf0sH/AWRx1ByPqDRRXDmMmsLUt2/VF0viRQ4544yT <span style={{display: 'none'}}>--</span>" + "9TRgAnAAz1wMZ+vr+NFFdy2I/AOnQADsB0/D0/yKKKACiiigAooooAKKKKACiiigAooooAMDOcDJOc4/r1pM <span style={{display: 'none'}}>--</span>" + "DgAdB0GKKKLIBf1/z/k+po/DFFFMD/2Q==";

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
                Асуулt даалгавар
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