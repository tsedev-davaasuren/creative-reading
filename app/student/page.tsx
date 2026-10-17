"use client";

import React, { useState } from "react";

export default function StudentPage() {
  // Өдрийн лимит болон түгжээг бүрмөсөн арилгасан туршилтын төлөв
  const [messages, setMessages] = useState([
    {
      sender: "tsendao",
      text: "Сайн байна уу, хүү минь! Өвөө нь байна. Та шалгалтаараа 11/12 оноо авлаа. Даалгавраа хэрхэн сайжруулах талаар өвөөгөөсөө асуугаарай. (20 минутын чат эхэллээ)",
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");

  // Сурагчийн асуултад ЯГ тухайн даалгаврын агуулгаар тодорхой тайлбарлах логик
  const handleSendMessage = () => {
    if (!inputQuestion.trim()) return;

    const userMsg = { sender: "student", text: inputQuestion };
    let replyText = "";

    if (inputQuestion.includes("1") || inputQuestion.includes("буруу")) {
      replyText =
        'Цэндао өвөө: Даалгавар 1 дээр та "В. Эх бичвэрт дурдагдаагүй өөр сэдэв агуулсан" гэсэн сонголт хийсэн тул бурууджээ. Эх бичвэрийн гол баримт нь өгүүлэгч өөрийн залуу насны тухай өгүүлсэн "А. Лхагва - Арван долоотой байхад" сонголт байсан юм, хүү минь.';
    } else if (inputQuestion.includes("3") || inputQuestion.includes("4")) {
      replyText =
        "Цэндао өвөө: Та 3 ба 4-р даалгавар дээр эх бичвэрийг шууд хуулж бичсэн байна. PISA задгай даалгаварт эх бичвэрийг шууд хуулах нь 0 оноо болох бөгөөд заавал өөрийн үгээр задлан тайлбарлах ёстой шүү.";
    } else {
      replyText = `Цэндао өвөө: "${inputQuestion}" гэсэн асуултын тухайд, даалгаврын асуултад өөрийн үгээр оновчтой, тодорхой хариулах нь хамгийн чухал юм шүү.`;
    }

    setMessages((prev) => [...prev, userMsg, { sender: "tsendao", text: replyText }]);
    setInputQuestion("");
  };

  return (
    <div style={{ backgroundColor: "#fefaf0", minHeight: "100vh", padding: "16px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* ==========================================
            3. ЗУРАГ-3 ЗАСВАР: Дэлгэцийн 7:1 харьцаатай нарийхан Толгой хэсэг
           ========================================== */}
        <header
          style={{
            backgroundColor: "#00875a",
            color: "#ffffff",
            borderRadius: "12px",
            padding: "10px 20px",
            height: "65px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            🎓 Сурагчийн танхим (9Е анги) - [Туршилтын горим: Лимитгүй]
          </h1>
          <p style={{ fontSize: "11px", color: "#e3fcef", margin: "2px 0 0 0" }}>
            PISA Бүтээлч уншлага-2 төслийн даалгавар гүйцэтгэх талбар
          </p>
        </header>

        {/* Нийт дүн болон танин мэдэхүйн түвшний карт */}
        <section
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d3f5e5",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#006644", margin: 0 }}>
              Нийт нийтлэг дүн: 7 / 12 оноо (Гүйцэтгэл: 58%)
            </h2>
            <span
              style={{
                backgroundColor: "#fef2f2",
                color: "#991b1b",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              ⚠️ Даалгаврыг сайжруулах шаардлагатай
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div style={{ backgroundColor: "#e0f2fe", border: "1px solid #bae6fd", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", color: "#0369a1", fontWeight: "bold", margin: 0 }}>1. Мэдээлэл олох</p>
              <p style={{ fontSize: "18px", fontWeight: "900", color: "#0c4a6e", margin: "4px 0 0 0" }}>1 / 2 оноо</p>
            </div>
            <div style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", color: "#b45309", fontWeight: "bold", margin: 0 }}>2. Задлан шинжлэх</p>
              <p style={{ fontSize: "18px", fontWeight: "900", color: "#78350f", margin: "4px 0 0 0" }}>0 / 4 оноо</p>
            </div>
            <div style={{ backgroundColor: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", color: "#15803d", fontWeight: "bold", margin: 0 }}>3. Эргэцүүлэн дүгнэх</p>
              <p style={{ fontSize: "18px", fontWeight: "900", color: "#14532d", margin: "4px 0 0 0" }}>6 / 6 оноо</p>
            </div>
          </div>
        </section>

        {/* ==========================================
            4 & 5. ЗУРАГ-4 & ЗУРАГ-5 ЗАСВАР: ДЭЛГЭЦИЙН 7:3 ХАРЬЦАА (Main 70% | Sidebar 30%)
           ========================================== */}
        <div style={{ display: "grid", gridTemplateColumns: "7fr 3fr", gap: "16px", alignItems: "start" }}>
          
          {/* ------------------------------------------
              4. ЗУРАГ-4 ЗАСВАР: ДААЛГАВРЫН ЖАГСААЛТ (Дэлгэцийн 70%)
             ------------------------------------------ */}
          <main style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                backgroundColor: "#fffdf6",
                border: "1px solid #fef08a",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e293b", marginTop: 0, marginBottom: "12px" }}>
                📋 Шалгалтын дэлгэрэнгүй хариулт ба Зөвлөмж
              </h3>

              {/* Даалгавар 1 */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "bold", color: "#0284c7", margin: 0 }}>
                    Даалгавар 1: "5. Ж.Лхагва "Арван долоотой байхад" өгүүлэг" эх бичвэрийн агуулгатай тохирч буй гол баримтыг сонгоно уу.
                  </p>
                  <span style={{ fontSize: "13px", fontWeight: "bold", color: "#dc2626", marginLeft: "12px", whiteSpace: "nowrap" }}>
                    0 / 1 оноо
                  </span>
                </div>
                <div style={{ backgroundColor: "#f8fafc", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#334155", marginBottom: "6px" }}>
                  ✍️ <strong>Таны хариулт:</strong> В. Эх бичвэрт дурдагдаагүй өөр сэдэв агуулсан.
                </div>
                <div style={{ backgroundColor: "#f0fdf4", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#166534", marginBottom: "6px" }}>
                  💡 <strong>Жишиг зөв хариулт:</strong> А. Лхагва "Арван долоотой байхад" өгүүлэг...
                </div>
                <div style={{ backgroundColor: "#fef9c3", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#854d0e" }}>
                  👨‍🏫 <strong>Цэндао өвөө:</strong> Сонголт буруу байна. Зөв хариулт нь А. Лхагва "Арван долоотой байхад" өгүүлэг...
                </div>
              </div>

              {/* 1. ЗУРАГ-1 ЗАСВАР: Эх бичвэр шууд хуулсан үед 0 оноо өгдөг болгож зассан */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "bold", color: "#0284c7", margin: 0 }}>
                    Даалгавар 3: "5. Ж.Лхагва "Арван долоотой байхад" өгүүлэг" эх бичвэрт гарч буй үйл явдал, онцлогийг 1-2 өгүүлбэрт багтаан задлан тайлбарлана уу.
                  </p>
                  <span style={{ fontSize: "13px", fontWeight: "bold", color: "#dc2626", marginLeft: "12px", whiteSpace: "nowrap" }}>
                    0 / 2 оноо
                  </span>
                </div>
                <div style={{ backgroundColor: "#f8fafc", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#334155", marginBottom: "6px" }}>
                  ✍️ <strong>Таны хариулт:</strong> Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн, мориныхоо нурууг нар харвахаас болгоомжлон салхи оруулж хэсэг сүүдэрлэн зогссоноо хазаараа мулталж инээсээр ирнэ.
                </div>
                <div style={{ backgroundColor: "#f0fdf4", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#166534", marginBottom: "6px" }}>
                  💡 <strong>Жишиг зөв хариулт:</strong> Би ч түүнийг үзэхийн хүслэн болж байтал ашгүй нэг ирлээ... гэдэг нь тухайн агуулгын онцлогийг задлан тодорхойлж байна.
                </div>
                <div style={{ backgroundColor: "#fee2e2", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#991b1b" }}>
                  👨‍🏫 <strong>Цэндао өвөө:</strong> Эх бичвэрийн өгүүлбэрийг шууд хуулж бичсэн тул асуултад хариулаагүй гэж үзэн 0 оноо өглөө. Өөрийн үгээр задлан тайлбарлана уу.
                </div>
              </div>

              {/* Даалгавар 4 */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "bold", color: "#0284c7", margin: 0 }}>
                    Даалгавар 4: Эх бичвэрийн агуулга болон гол дүр/хууль/үзэгдлийн харилцан хамаарлыг 1-2 өгүүлбэрээр задлан тайлбарлаарай.
                  </p>
                  <span style={{ fontSize: "13px", fontWeight: "bold", color: "#dc2626", marginLeft: "12px", whiteSpace: "nowrap" }}>
                    0 / 2 оноо
                  </span>
                </div>
                <div style={{ backgroundColor: "#f8fafc", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#334155", marginBottom: "6px" }}>
                  ✍️ <strong>Таны хариулт:</strong> Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн...
                </div>
                <div style={{ backgroundColor: "#f0fdf4", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#166534", marginBottom: "6px" }}>
                  💡 <strong>Жишиг зөв хариулт:</strong> Эх бичвэрт дурдсан баримтууд нь бие биенээ баталгаажуулж байна.
                </div>
                <div style={{ backgroundColor: "#fee2e2", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#991b1b" }}>
                  👨‍🏫 <strong>Цэндао өвөө:</strong> Эх бичвэрийг шууд хуулж бичсэн тул 0 оноо.
                </div>
              </div>

            </div>
          </main>

          {/* ------------------------------------------
              5. ЗУРАГ-5 ЗАСВАР: ЦЭНДАО ӨВӨӨ ЧАТ (Дэлгэцийн 30%)
             ------------------------------------------ */}
          <aside
            style={{
              backgroundColor: "#fffdf6",
              border: "1px solid #fef08a",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              position: "sticky",
              top: "16px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", borderBottom: "1px solid #fef08a", paddingBottom: "12px" }}>
              <img
                src="/tsendao.jpg"
                alt="Цэндао өвөө"
                style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #f59e0b", objectFit: "cover", marginBottom: "8px" }}
              />
              <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>
                Цэндао өвөө-багштайгаа ярилцаарай
              </h4>
              <p style={{ fontSize: "12px", color: "#b45309", fontWeight: "bold", margin: "4px 0 0 0" }}>
                ⏱️ Үлдсэн цаг: 18:38
              </p>
            </div>

            {/* Мэдээллийн чат хэсэг */}
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "350px", overflowY: "auto" }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: msg.sender === "student" ? "#dcfce7" : "#ffffff",
                    color: msg.sender === "student" ? "#14532d" : "#1e293b",
                    border: msg.sender === "student" ? "none" : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    fontSize: "12px",
                    alignSelf: msg.sender === "student" ? "flex-end" : "flex-start",
                    maxWidth: "90%",
                  }}
                >
                  {msg.sender === "tsendao" && <strong>👨‍🏫 Цэндао өвөө: </strong>}
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Асуулт оруулах талбар */}
            <div style={{ marginTop: "12px", display: "flex", gap: "6px" }}>
              <input
                type="text"
                placeholder="Асуултаа энд бичнэ үү..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  backgroundColor: "#00875a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Илгээх
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}