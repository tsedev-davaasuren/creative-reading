"use client";

import { useState } from "react";

// Цэндао багшийн дээлтэй зургийг кодон дотор нь шууд шигтгэсэн Base64 код
const TSENDAO_BAGSH_IMAGE = "data:image/jpeg;base64,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 <span style={{display: 'none'}}>--</span>" + "8U6P8A6O8iL82CVPp/n/Cus0qIrbRse4Brnx+MhPD8sIqze5pSpunJ1pXbtt0Of1aTzdSdl6A9az5/mgYgdOtaOo/vNQfnoaz5vlt3Hf2rkpRvqdS0sZnh+wWbVo2fOFI/nXpdrb/Z0D44rmPClmXmDFflxk5rr7uXyos4yB6fSuKvP3zsS0sV59fhgfaWxXPa344ggLIHyT/d5rL8Sa1DbyMSCTnhQa881XWZbuU7RsUfwiuyjByMJz5UdPceMJ727eNAUTszH/CpA32khmbPua4bTWlMvOTyeteh6NYO0SFuAe2aqt7iOaEnOV3sRtYF1yBkd6jFg23gcV2llpsXlgNzmmnSoTIFUAn06VxrEHY0ee6jo3mxk4+bsw/ka5q7huLRvnX8O1extpUewrggDtWHqXhy3uFYMuD6iunD4/kdpyOCvgvaazkeWRahLE2VJ+mTWnZa9JvHzfP2BrU1XwkI2fyt3121yk1hcWNxtdcqfx3fSvanToYyNo7nk+0xOCfM1eJ61pesI+o3cTH5YI/mx6sAf8A4mrtz4ls7aAyyzCNF7nv9PWvI9C1i4a6lt2XmUkOfYZP68/nUGt6hNO3lu2QvAHvXzmJw8/run9fl3PYw/s5L3f0PTvDV6da26hIuy3ZiIV9scE/zrpLnUEaRbaPucA14jpfjv7DaxWyrtVBtyAefxrf/wCFjxPtd0/Ssq94yt/TLhTckmup6hIytJkEHAqN4N2XPIHauM0Lx3a6kCsO3cOo6murt9SjdGkZwO/vXPNNbG8YvZlE+Dba3v3lEa5Jyc88+1S6jI2nqEACrjj1PtV698QR28DOOa4zW9Ym1KRvL4J43elddBymryM2lDYpSznUJ3yTt3A0v9jI/zlScnr <span style={{display: 'none'}}>--</span>" + "Wnoekm4kSNAcHlm6Yr2Twb4Gs4bSO4vEEm/mND2HqaxxeP9muWP3mlGjy3nI8a03wo04DrGx3c8iur0rwpNDKrbcAfwnvXs0/hO13b7dVTA6AYFU5dIkhBDJtHcn <span style={{display: 'none'}}>--</span>" + "3GvDqZ3OWm3oX9XvqyfSNPhSyiZ1G8itRLOInKjB9az7a4UosajBAxWrbvujweDXfS1imzX4bWKdzD8rcc1yutxh4nxgHHBFdrMoKE45rkPEa4gbP0rfmSInLQ",

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