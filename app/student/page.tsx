"use client";

import React, { useState } from "react";

export default function StudentPage() {
  const [isExamActive, setIsExamActive] = useState(false);
  const [examCode, setExamCode] = useState("");
  const [activeExam, setActiveExam] = useState<any>(null);

  // Чатботын төлөв
  const [messages, setMessages] = useState([
    {
      sender: "tsendao",
      text: "Сайн байна уу, хүү минь! Өвөө нь байна. Даалгавраа хэрхэн сайжруулах талаар өвөөгөөсөө асуугаарай.",
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");

  // ЗУРАГ-1 ДЭЭРХ ТҮҮХИЙН ДААЛГАВРЫН БҮРЭН ӨГӨГДӨЛ (9E-TYY-6087)
  const historyExamData = {
    code: "9E-TYY-6087",
    subject: "Түүх",
    title: "1921 оны Ардын хувьсгал ба Монгол Улсын тусгаар тогтнол",
    text: `ХХ зууны эхэн үе бол Монголын түүхэнд хамгийн ээдрээтэй, шийдвэрлэх үе байлаа. Олон зууны турш Манж Чин уglassын эрхшээлд байж, дараа нь гадаад хүчний түрэмгийлэл, эдийн засгийн хүндрэлтэй тулгарсан Монголын ард түмэн үндэсний тусгаар тогтнолоо сэргээж, шинэ нийгэм байгуулах тэмцлийг эхлүүлсэн юм. Энэхүү тэмцлийн оргил үе нь 1921 оны Ардын хувьсгал байв.

1911 оны Үндэсний эрх чөлөөний хувьсгалаар Монгол Улс тусгаар тогтнолоо зарласан хэдий ч олон улсад хүлээн зөвшөөрөгдөх байдал хүнд байсан бөгөөд 1919 онд гадаад түрэмгийлчид Нийслэл Хүрээг эзэлж, автономит эрхийг устгажээ. Ийм хүнд хэцүү цаг үед эх орноо харийн дарлалаас чөлөөлөхөөр тэмцэх нууц бүлгүүд үүсч эхэлсэн байна. Дажин, Конскийн болон Сухбаатар, Чойбалсан нарын удирдсан нууц бүлгүүд нэгдэж, 1920 онд Монгол Ардын Намыг байгуулжээ. Намын гол зорилго нь гадаад эзлэн түрэмгийлэгчдийг хөөж, ард түмний эрх чөлөөг хангах байв.`,
    questions: [
      {
        id: 1,
        type: "select",
        title: '1. "1921 оны Ардын хувьсгал ба Монгол Улсын тусгаар тогтнол" эх бичвэрийн агуулгатай тохирч буй гол баримтыг сонгоно уу.',
        options: [
          "А. ХХ зууны эхэн үе бол Монголын түүхэнд хамгийн ээдрээтэй, шийдвэрлэх үе байлаа.",
          "В. Эх бичвэрт дурдагдаагүй өөр сэдэв агуулсан.",
          "С. Эх бичвэрийн утга санаа эсрэгээрээ илэрхийлэгдсэн.",
          "D. Дээрх хариултууд бүгд буруу байна."
        ]
      },
      {
        id: 2,
        type: "text",
        title: "2. Эх бичвэрээс тухайн сэдвийн гол утга санааг агуулсан НЭГ өгүүлбэрийг олж бичээрэй."
      },
      {
        id: 3,
        type: "text",
        title: '3. "1921 оны Ардын хувьсгал ба Монгол Улсын тусгаар тогтнол" эх бичвэрт гарч буй үйл явдал, онцлогийг 1-2 өгүүлбэрт багтаан задлан тайлбарлана уу.'
      },
      {
        id: 4,
        type: "text",
        title: "4. Эх бичвэрийн агуулга болон гол дүр/хууль/үзэгдлийн харилцан хамаарлыг 1-2 өгүүлбэрээр задлан тайлбарлаарай."
      },
      {
        id: 5,
        type: "text",
        title: "5. Тухайн түүхэн үйл явдлын ач холбогдлыг өөрийн бодолтой холбон 2-3 өгүүлбэрт эргэцүүлэн дүгнэж бичнэ үү."
      },
      {
        id: 6,
        type: "text",
        title: "6. Зохиогчийн дэвшүүлсэн санаа болон түүхэн баримтын үнэ цэнийг дүгнэн бичнэ үү."
      }
    ]
  };

  // ДААЛГАВРЫН КОД НЭЭХ УХААЛАГ ЛОГИК
  const handleOpenExam = () => {
    let cleanCode = examCode.replace(/['"]/g, "").trim().toUpperCase();

    if (!cleanCode) {
      cleanCode = "9E-TYY-6087";
    } else if (cleanCode.startsWith("E-")) {
      cleanCode = "9" + cleanCode;
    }

    // Түүхийн код оруулахад ЗУРАГ-1-ийн Түүхийн даалгаврыг бүтнээр нь ачаална
    setActiveExam(historyExamData);
    setIsExamActive(true);
  };

  const handleSendMessage = () => {
    if (!inputQuestion.trim()) return;
    const userMsg = { sender: "student", text: inputQuestion };
    const q = inputQuestion.toLowerCase();
    let replyText = "";

    if (q.includes("1") || q.includes("буруу")) {
      replyText = 'Цэндао өвөө: Даалгавар 1 дээр "А. ХХ зууны эхэн үе бол Монголын түүхэнд хамгийн ээдрээтэй, шийдвэрлэх үе байлаа" гэсэн сонголт зөв байсан юм, хүү минь.';
    } else {
      replyText = `Цэндао өвөө: "${inputQuestion}" гэсэн асуултын тухайд, 1921 оны Ардын хувьсгалын баримтыг өөрийн үгээр эргэцүүлэн бичих нь чухал шүү.`;
    }

    setMessages((prev) => [...prev, userMsg, { sender: "tsendao", text: replyText }]);
    setInputQuestion("");
  };

  return (
    <div style={{ backgroundColor: "#fefaf0", minHeight: "100vh", padding: "16px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* HEADER */}
        <header style={{ backgroundColor: "#00875a", color: "#ffffff", borderRadius: "12px", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>🎓 Сурагчийн танхим (9Е анги)</h1>
            <p style={{ fontSize: "11px", color: "#e3fcef", margin: "2px 0 0 0" }}>PISA Бүтээлч уншлага-2 төслийн даалгавар гүйцэтгэх талбар</p>
          </div>
          {isExamActive && (
            <button
              onClick={() => setIsExamActive(false)}
              style={{ backgroundColor: "#dc2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "8px 14px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
            >
              ← Код оруулах хэсэг рүү буцах
            </button>
          )}
        </header>

        {/* ТОХИОЛДОЛ 1: КОД ОРУУЛАХ ДЭЛГЭЦ */}
        {!isExamActive ? (
          <section style={{ backgroundColor: "#ffffff", border: "1px solid #d3f5e5", borderRadius: "12px", padding: "40px 20px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
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
          /* ТОХИОЛДОЛ 2: ЗУРАГ-1 ДЭЭРХ ТҮҮХИЙН ДААЛГАВАР НЭЭГДСЭН ДЭЛГЭЦ (7:3 Layout) */
          <div style={{ display: "grid", gridTemplateColumns: "7fr 3fr", gap: "16px", alignItems: "start" }}>
            
            <main style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* ЭХ БИЧВЭР БА ТҮҮХИЙН СЭДЭВ */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ backgroundColor: "#0284c7", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                    {activeExam.subject}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "bold", color: "#64748b" }}>Код: {activeExam.code}</span>
                </div>

                <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b", marginTop: 0, marginBottom: "12px" }}>
                  📖 {activeExam.title}
                </h2>

                <div style={{ backgroundColor: "#fffdf6", border: "1px solid #fef08a", borderRadius: "8px", padding: "16px", fontSize: "13px", lineHeight: "1.6", color: "#334155", whitespace: "pre-line" }}>
                  {activeExam.text}
                </div>
              </div>

              {/* ЗУРАГ-1 ДЭЭРХ 6 ДААЛГАВАР БҮТНЭЭРЭЭ */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#006644", marginTop: 0, marginBottom: "16px" }}>
                  ✍️ Даалгаврууд (6)
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); alert("Даалгавар амжилттай илгээгдлээ!"); setIsExamActive(false); }}>
                  {activeExam.questions.map((q: any) => (
                    <div key={q.id} style={{ marginBottom: "20px", backgroundColor: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>
                        {q.title}
                      </label>

                      {q.type === "select" ? (
                        <select style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #94a3b8", fontSize: "12px" }}>
                          {q.options.map((opt: string, idx: number) => (
                            <option key={idx}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <textarea
                          rows={3}
                          placeholder="Хариултаа өөрийн үгээр задлан тайлбарлаж бичнэ үү..."
                          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #94a3b8", fontSize: "12px" }}
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#00875a",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 28px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    🚀 Даалгавар илгээх ба Үнэлүүлэх
                  </button>
                </form>
              </div>
            </main>

            {/* SIDEBAR CHAT (Цэндао өвөө-багш) */}
            <aside style={{ backgroundColor: "#fffdf6", border: "1px solid #fef08a", borderRadius: "12px", padding: "16px", position: "sticky", top: "16px" }}>
              <div style={{ textAlign: "center", paddingBottom: "10px", borderBottom: "1px solid #fef08a" }}>
                <img src="/tsendao.jpg" alt="Цэндао өвөө" style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid #f59e0b" }} />
                <h4 style={{ fontSize: "14px", fontWeight: "bold", margin: "6px 0 0 0", color: "#1e293b" }}>Цэндао өвөө-багш</h4>
                <p style={{ fontSize: "11px", color: "#b45309", fontWeight: "bold", margin: "2px 0 0 0" }}>⏱️ Үлдсэн цаг: 18:38</p>
              </div>

              <div style={{ margin: "12px 0", maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ fontSize: "12px", padding: "8px 10px", borderRadius: "8px", backgroundColor: m.sender === "student" ? "#dcfce7" : "#ffffff", border: "1px solid #e2e8f0" }}>
                    {m.sender === "tsendao" && <strong>👨‍🏫 Цэндао өвөө: </strong>}
                    {m.text}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  placeholder="Асуулт асуух..."
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  style={{ flex: 1, padding: "8px", fontSize: "12px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                />
                <button onClick={handleSendMessage} style={{ backgroundColor: "#00875a", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                  Илгээх
                </button>
              </div>
            </aside>

          </div>
        )}

      </div>
    </div>
  );
}