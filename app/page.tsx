"use client";

import { useState } from "react";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Уран зохиол");
  const [imgError, setImgError] = useState(false);

  // Чатын төлөв болон мессежүүд
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bagsh",
      text: "Сайн байна уу! PISA даалгавар боловсруулах эсвэл хичээлийн арга зүйн талаар юу асуухыг хүсэж байна вэ?"
    }
  ]);
  const [inputText, setInputText] = useState("");

  const subjects = ["Уран зохиол", "Хими", "Биологи", "Түүх", "Физик", "Газар зүй"];

  // 3. Мессеж илгээх функц
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "user",
      text: inputText
    };

    setMessages((prev) => [...prev, newMsg]);
    const currentInput = inputText;
    setInputText("");

    // Цэндао багшийн хариултыг дуурайх
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bagsh",
          text: `Баярлалаа. Таны асуусан "${currentInput.slice(0, 30)}..." сэдвийн дагуу арга зүйн зөвлөмжийг бэлтгэж байна.`
        }
      ]);
    }, 800);
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* 1. HEADER ХЭСЭГ */}
      <header style={{
        maxWidth: "1280px",
        margin: "0 auto 16px auto",
        backgroundColor: "#fffdf0",
        borderRadius: "16px",
        border: "1px solid #fde68a",
        padding: "12px 20px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        
        {/* ТӨСЛИЙН ЛОГО */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <div style={{
            width: "64px",
            height: "64px",
            minWidth: "64px",
            borderRadius: "14px",
            backgroundColor: "#ffffff",
            border: "2px solid #fcd34d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "2px"
          }}>
            <img 
              src="/project-logo.jpg" 
              alt="Бүтээлч уншлага лого" 
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
          <div>
            <h1 style={{ fontSize: "17px", fontWeight: "bold", color: "#0f172a", margin: 0, lineHeight: 1.2 }}>
              Бүтээлч уншлага-2 төсөл
            </h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0", fontWeight: "500" }}>
              Creative reading-2 project
            </p>
          </div>
        </div>

        {/* ТӨВ ХЭСЭГ */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{
            backgroundColor: "#fbbf24",
            border: "1px solid #f59e0b",
            padding: "4px 18px",
            borderRadius: "12px"
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
              Mentor AI Цэндао багштай
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            <button type="button" style={{
              backgroundColor: "#fde68a",
              border: "1px solid #fcd34d",
              padding: "5px 12px",
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
                padding: "5px 12px",
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

        {/* ТАНЫ МЕНТОР ХЭСЭГ */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>Таны Ментор</p>
            <p style={{ fontSize: "10px", fontWeight: "600", color: "#059669", margin: "2px 0 0 0", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }}></span>
              Онлайн
            </p>
          </div>
          
          <div style={{
            width: "72px",
            height: "72px",
            minWidth: "72px",
            borderRadius: "50%",
            border: "3px solid #f59e0b",
            overflow: "hidden",
            backgroundColor: "#fef3c7",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {!imgError ? (
              <img 
                src="/tsendao.jpg" 
                alt="Цэндао багш"
                onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <span style={{ fontSize: "32px" }}>👨‍🏫</span>
            )}
          </div>
        </div>

      </header>

      {/* 2. ЧАТ ХЭСЭГ (1-3 ӨӨРЧЛӨЛТҮҮД) */}
      {isChatOpen && (
        <section style={{
          maxWidth: "1280px",
          margin: "0 auto 16px auto",
          backgroundColor: "#fffdf0",
          border: "1.5px solid #fcd34d",
          borderRadius: "14px",
          padding: "10px 14px", // 1. НАРИЙХАН БОЛГОСОН
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
        }}>
          {/* Нарийхан дээд хэсэг */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "6px", marginBottom: "8px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
              <span>💬</span> Цэндао багштай арга зүйн яриа өрнүүлэх
            </h3>
            <button 
              type="button"
              onClick={() => setIsChatOpen(false)}
              style={{ fontSize: "11px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px 8px", cursor: "pointer", fontWeight: "600" }}
            >
              Хураах ✕
            </button>
          </div>

          {/* Чатын харилцах цонх */}
          <div style={{ height: "140px", backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid #fde68a", padding: "10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#dcfce7" : "#fef3c7",
                  color: "#0f172a",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  maxWidth: "75%",
                  fontSize: "13px",
                  lineHeight: "1.4",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                }}
              >
                {msg.sender === "bagsh" && <strong>👨‍🏫 Цэндао багш: </strong>}
                {msg.text}
              </div>
            ))}
          </div>

          {/* 2 & 3. ӨРГӨН ТЕКСТ ТАЛБАР БА ИЛГЭЭХ ФУНКЦ */}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px", alignItems: "flex-end" }}>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Багш та асуултаа энд бичээд бүрэн нягтлан хараарай... (Shift + Enter-ээр шинэ мөр авна)"
              rows={2} // Өргөн, олон мөр харах боломжтой
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1.5px solid #fcd34d",
                borderRadius: "8px",
                fontSize: "13px",
                outline: "none",
                resize: "vertical",
                minHeight: "48px",
                fontFamily: "inherit"
              }}
            />
            <button 
              type="button" 
              onClick={handleSendMessage}
              style={{ 
                backgroundColor: "#fbbf24", 
                border: "none", 
                color: "#0f172a", 
                fontWeight: "bold", 
                padding: "12px 20px", 
                borderRadius: "8px", 
                fontSize: "13px", 
                cursor: "pointer",
                height: "48px",
                flexShrink: 0
              }}
            >
              Илгээх
            </button>
          </div>
        </section>
      )}

      {/* 3. ҮНДСЭН АЖЛЫН ХЭСЭГ (4: 8:5 ба 8:3 ХАРЬЦАА, 5: ЦАЙВАР ШАРГАЛ ФОН, 6: ҮСЭГ ТОМРУУЛАВ) */}
      <div style={{ 
        maxWidth: "1280px", 
        margin: "0 auto", 
        display: "grid", 
        gridTemplateColumns: "5fr 3fr", // 4. ДЭЛГЭЦИЙН 8:5 БА 8:3 ХАРЬЦАА
        gap: "16px" 
      }}>
        
        {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР (8-аас 5 хэсэг) */}
        <section style={{ 
          backgroundColor: "#fffdf0", // 5. ЦАЙВАР ШАРГАЛ ФОН
          borderRadius: "16px", 
          border: "1.5px solid #fde68a", 
          padding: "18px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between", 
          minHeight: "580px" 
        }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#fbbf24", display: "inline-block" }}></span>
                Эх бичвэр
              </h3>

              <button type="button" style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                Даалгаврын сан ➔
              </button>
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Хичээл сонгох:</label>
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
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Эх бичвэрийн гарчиг</label>
              <input 
                type="text" 
                placeholder="Эх бичвэрийн гарчгийг оруулна уу..." 
                defaultValue='Ж.Лхагва "Арван долоотой байхад" өгүүлэг'
                style={{ 
                  width: "100%", 
                  padding: "10px 12px", 
                  border: "1.5px solid #fde68a", 
                  borderRadius: "8px", 
                  fontSize: "14px", // 6. ҮСГИЙН ХЭМЖЭЭГ ТОМРУУЛАВ
                  fontWeight: "500",
                  boxSizing: "border-box" 
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Унших эх бичвэр (Эх сурвалж)</label>
              <textarea 
                placeholder="Эх бичвэрээ оруулаарай." 
                defaultValue={`Манайх Цээлд, Бөөдэйн Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.
Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор тэмээ малдаа өөрөө л явна. Хааяа унагаа үлдээнэ гэж адуугаа тууж ирэхэд нь би уургынхаа хээрийг барьж мордоод хорь хүрэхгүй адууг нь хураан хөндөлсүүлж явахаар барих морио тэгэхээс тэгж адуунаас нь гарган элдээд сүүл дэрлэн дагах хэвтээ дэмтэй сайхан хээрийнхээ дөрөө зуран эргэх яг л тэр агшинд бөхийн цацаж, сүүлэндээ салхи татуулан зугатаах морины нарийн хоншоороор уургалан эргүүлээд үргэн давхисан адууныхаа хойноос янцгаан тэмүүлэх түүнийг эмнэг уургалсан мэт цухалзуураар нь эргэ Бөөдэйг хүлээж зогсоно.
Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн, мориныхуу нурууг нар харвахаас болгоомжлон салхи оруулж хэсэг сүүдэрлэн зогссоноо хазаараа мулталж инээсээр ирнэ.
Энэ бол миний арван долоон насанд хамгийн жаргалтай мөч байлаа. Гэвч энэ маань өглөөдөө үзэгдэх хөвчийн манан шиг байжээ.`}
                style={{ 
                  width: "100%", 
                  height: "280px", 
                  padding: "12px", 
                  border: "1.5px solid #fde68a", 
                  borderRadius: "8px", 
                  fontSize: "14.5px", // 6. ЭХ БИЧВЭРИЙН ҮСГИЙН ХЭМЖЭЭГ ТОМРУУЛАВ
                  lineHeight: "1.6",
                  resize: "vertical", 
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }}
              />
            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "14px" }}>
            <button type="button" style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
              ⚡ Даалгавар боловсруулах
            </button>
          </div>

        </section>

        {/* БАРУУН ТАЛ: АСУУЛТ ДААЛГАВАР (8-аас 3 хэсэг) */}
        <section style={{ 
          backgroundColor: "#fffdf0", // 5. ЦАЙВАР ШАРГАЛ ФОН
          borderRadius: "16px", 
          border: "1.5px solid #fde68a", 
          padding: "18px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between", 
          minHeight: "580px" 
        }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#fbbf24", display: "inline-block" }}></span>
                Асуулт даалгавар
              </h3>

              <button type="button" style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                Хяналт шинжилгээ ➔
              </button>
            </div>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fde68a", padding: "20px", minHeight: "360px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "10px" }}>
                📝
              </div>
              <p style={{ fontSize: "14px", fontWeight: "bold", color: "#334155", margin: "0 0 6px 0" }}>
                PISA Стандарт 6 Даалгавар (12 Оноо)
              </p>
              <p style={{ fontSize: "12px", color: "#64748b", maxWidth: "240px", margin: 0, lineHeight: "1.5" }}>
                Зүүн талд хичээлээ сонгон, эх бичвэрээ оруулж "Даалгавар боловсруулах" товчийг дарснаар асуултууд энд бэлэн болно.
              </p>
            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "14px" }}>
            <button type="button" style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
              💾 Даалгаврыг баталж, санд илгээх
            </button>
          </div>

        </section>

      </div>

    </main>
  );
}