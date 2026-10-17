"use client";

import React, { useState } from "react";

export default function StudentPage() {
  const [isExamActive, setIsExamActive] = useState(false);
  const [examCode, setExamCode] = useState("");
  const [activeCode, setActiveCode] = useState("");

  // Чатбот харилцах төлөв
  const [messages, setMessages] = useState([
    {
      sender: "tsendao",
      text: "Сайн байна уу, хүү минь! Өвөө нь байна. Даалгавраа хэрхэн сайжруулах талаар өвөөгөөсөө асуугаарай.",
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");

  // ШИНЭ ДААЛГАВРЫН КОД НЭЭХ УХААЛАГ ЛОГИК (Хашилт эсвэл ямар ч код байсан нээнэ)
  const handleOpenExam = () => {
    // 1. Кодон доторх хашилт (" эсвэл ') болон илүүдэл зайг арилгах
    const cleanCode = examCode.replace(/['"]/g, "").trim();

    if (!cleanCode) {
      alert("Даалгаврын кодоо оруулна уу.");
      return;
    }

    // 2. Код оруулахад шууд даалгавар руу нэвтрэх
    setActiveCode(cleanCode);
    setIsExamActive(true);
  };

  const handleSendMessage = () => {
    if (!inputQuestion.trim()) return;
    const userMsg = { sender: "student", text: inputQuestion };
    const q = inputQuestion.toLowerCase();
    let replyText = "";

    if (q.includes("1") || q.includes("буруу")) {
      replyText = 'Цэндао өвөө: Даалгавар 1 дээр та буруу сонголт хийсэн байна. Эх бичвэрийг анхааралтай уншаарай.';
    } else {
      replyText = `Цэндао өвөө: "${inputQuestion}" гэсэн асуултын тухайд, даалгавраа өөрийн үгээр эргэцүүлэн бичих нь чухал шүү.`;
    }

    setMessages((prev) => [...prev, userMsg, { sender: "tsendao", text: replyText }]);
    setInputQuestion("");
  };

  return (
    <div style={{ backgroundColor: "#fefaf0", minHeight: "100vh", padding: "16px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* HEADER */}
        <header style={{ backgroundColor: "#00875a", color: "#ffffff", borderRadius: "12px", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>🎓 Сурагчийн танхим (9Е анги)</h1>
            <p style={{ fontSize: "11px", color: "#e3fcef", margin: "2px 0 0 0" }}>PISA Бүтээлч уншлага-2 төслийн даалгавар гүйцэтгэх талбар</p>
          </div>
          {isExamActive && (
            <button
              onClick={() => setIsExamActive(false)}
              style={{ backgroundColor: "#dc2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
            >
              ← Буцах
            </button>
          )}
        </header>

        {/* ТОХИОЛДОЛ 1: КОД ОРУУЛАХ ДЭЛГЭЦ */}
        {!isExamActive ? (
          <section style={{ backgroundColor: "#ffffff", border: "1px solid #d3f5e5", borderRadius: "12px", padding: "32px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔑</div>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#006644", marginTop: 0, marginBottom: "8px" }}>
              Даалгаврын кодоо оруулна уу
            </h2>
            <p style={{ fontSize: "12px", color: "#64748b", marginTop: 0, marginBottom: "20px" }}>
              Багшаас өгсөн тусгай кодыг оруулж даалгавраа ачаална уу.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", maxWidth: "450px", margin: "0 auto" }}>
              <input
                type="text"
                placeholder="ЖИШЭЭ: 9E-TYY-6087"
                value={examCode}
                onChange={(e) => setExamCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleOpenExam()}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #00875a",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textAlign: "center",
                  outline: "none",
                }}
              />
              <button
                onClick={handleOpenExam}
                style={{
                  backgroundColor: "#00875a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Нээх
              </button>
            </div>
          </section>
        ) : (
          /* ТОХИОЛДОЛ 2: ДААЛГАВАР АЖИЛЛАХ / ХАРАХ ДЭЛГЭЦ (7:3 Layout) */
          <div style={{ display: "grid", gridTemplateColumns: "7fr 3fr", gap: "16px", alignItems: "start" }}>
            <main style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#006644", marginTop: 0, marginBottom: "16px" }}>
                📝 Идэвхтэй даалгавар: {activeCode}
              </h3>

              <form onSubmit={(e) => { e.preventDefault(); alert("Даалгавар амжилттай илгээгдлээ!"); setIsExamActive(false); }}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>
                    Даалгавар 1: Эх бичвэрийн агуулгатай тохирч буй гол баримтыг сонгоно уу.
                  </label>
                  <select style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}>
                    <option>А. Өгүүлэгчийн залуу насны тухай баримт</option>
                    <option>В. Эх бичвэрт дурдагдаагүй баримт</option>
                  </select>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>
                    Даалгавар 2: Эх бичвэрийн онцлогийг өөрийн үгээр задлан тайлбарлана уу.
                  </label>
                  <textarea rows={3} placeholder="Хариултаа өөрийн үгээр бичнэ үү..." style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }} />
                </div>

                <button type="submit" style={{ backgroundColor: "#00875a", color: "#ffffff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>
                  🚀 Даалгавар илгээх ба Үнэлүүлэх
                </button>
              </form>
            </main>

            {/* SIDEBAR CHAT */}
            <aside style={{ backgroundColor: "#fffdf6", border: "1px solid #fef08a", borderRadius: "12px", padding: "16px" }}>
              <div style={{ textAlign: "center", paddingBottom: "10px", borderBottom: "1px solid #fef08a" }}>
                <img src="/tsendao.jpg" alt="Цэндао өвөө" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} />
                <h4 style={{ fontSize: "13px", fontWeight: "bold", margin: "4px 0 0 0" }}>Цэндао өвөө-багш</h4>
              </div>
              <div style={{ margin: "12px 0", maxHeight: "250px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ fontSize: "12px", padding: "6px 8px", borderRadius: "6px", backgroundColor: m.sender === "student" ? "#dcfce7" : "#ffffff", border: "1px solid #e2e8f0" }}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <input type="text" placeholder="Асуулт..." value={inputQuestion} onChange={(e) => setInputQuestion(e.target.value)} style={{ flex: 1, padding: "6px", fontSize: "12px", border: "1px solid #cbd5e1", borderRadius: "4px" }} />
                <button onClick={handleSendMessage} style={{ backgroundColor: "#00875a", color: "#fff", border: "none", borderRadius: "4px", padding: "6px 10px", fontSize: "12px", fontWeight: "bold" }}>Илгээх</button>
              </div>
            </aside>
          </div>
        )}

      </div>
    </div>
  );
}