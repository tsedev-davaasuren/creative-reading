"use client";

import React, { useState, useEffect } from "react";

export default function StudentPage() {
  // 1. ӨДРИЙН ЛИМИТИЙГ БҮРЭН ЦУЦЛАХ (Туршилтын горим)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hasCompletedToday");
      localStorage.removeItem("dailyExamLimit");
    }
  }, []);

  const [messages, setMessages] = useState([
    {
      sender: "tsendao",
      text: "Сайн байна уу, хүү минь! Өвөө нь байна. Даалгавраа хэрхэн сайжруулах талаар өвөөгөөсөө асуугаарай.",
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");

  // Чатбот хариулах логик
  const handleSendMessage = () => {
    if (!inputQuestion.trim()) return;

    const userMsg = { sender: "student", text: inputQuestion };
    const q = inputQuestion.toLowerCase();
    let replyText = "";

    if (q.includes("1") || q.includes("буруу")) {
      replyText =
        'Цэндао өвөө: Даалгавар 1 дээр та "В. Эх бичвэрт дурдагдаагүй өөр сэдэв агуулсан" гэж сонгосон нь буруу байна. Зөв хариулт нь "А. Лхагва - Арван долоотой байхад" байсан юм.';
    } else if (q.includes("3") || q.includes("4") || q.includes("5") || q.includes("6") || q.includes("0")) {
      replyText =
        "Цэндао өвөө: Задгай даалгавар дээр эх бичвэрийг шууд хуулж бичвэл 0 оноо авна. Асуултын дагуу өөрийн үгээр задлан тайлбарлах нь чухал шүү.";
    } else {
      replyText = `Цэндао өвөө: "${inputQuestion}" гэсэн асуултад хэлэхэд, PISA даалгаварт эх бичвэрийн агуулгыг өөрийн үгээр эргэцүүлэн бичих нь хамгийн чухал шүү, хүү минь.`;
    }

    setMessages((prev) => [...prev, userMsg, { sender: "tsendao", text: replyText }]);
    setInputQuestion("");
  };

  // 2. БҮХ 6 ДААЛГАВРЫН ИЖ БҮРЭН ӨГӨГДӨЛ (Жагсаалтад 6-уулаа харагдана)
  const examResults = [
    {
      id: 1,
      title: 'Даалгавар 1: "5. Ж.Лхагва "Арван долоотой байхад" өгүүлэг" эх бичвэрийн агуулгатай тохирч буй гол баримтыг сонгоно уу.',
      score: "0 / 1",
      userAnswer: "В. Эх бичвэрт дурдагдаагүй өөр сэдэв агуулсан.",
      correctAnswer: 'А. Лхагва "Арван долоотой байхад" өгүүлэг...',
      feedback: "Сонголт буруу байна. Зөв хариулт нь А. Лхагва өгүүлэг...",
      isCorrect: false,
    },
    {
      id: 2,
      title: "Даалгавар 2: Эх бичвэрээс залуу насны сэтгэл зүйн онцлогийг харуулсан 1 гол баримтыг олно уу.",
      score: "1 / 1",
      userAnswer: "Өгүүлэгч залуу насандаа хүсэл тэмүүлэлтэй байсан тухай дурдсан.",
      correctAnswer: "Өгүүлэгч залуу насандаа хүсэл тэмүүлэлтэй байсан тухай...",
      feedback: "Онц сайн! Баримтыг эх бичвэрээс оновчтой олж бичжээ.",
      isCorrect: true,
    },
    {
      id: 3,
      title: 'Даалгавар 3: "5. Ж.Лхагва "Арван долоотой байхад" өгүүлэг" эх бичвэрт гарч буй үйл явдал, онцлогийг 1-2 өгүүлбэрт багтаан задлан тайлбарлана уу.',
      score: "0 / 2",
      userAnswer: "Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн, мориныхоо нурууг нар харвахаас болгоомжлон салхи оруулж хэсэг сүүдэрлэн зогссоноо хазаараа мулталж инээсээр ирнэ.",
      correctAnswer: "Би ч түүнийг үзэхийн хүслэн болж байтал ашгүй нэг ирлээ... гэдэг нь тухайн агуулгын онцлогийг задлан тодорхойлж байна.",
      feedback: "Эх бичвэрийн өгүүлбэрийг шууд хуулж бичсэн тул асуултад хариулаагүй гэж үзэн 0 оноо өглөө. Өөрийн үгээр задлан тайлбарлана уу.",
      isCorrect: false,
    },
    {
      id: 4,
      title: "Даалгавар 4: Эх бичвэрийн агуулга болон гол дүр/хууль/үзэгдлийн харилцан хамаарлыг 1-2 өгүүлбэрээр задлан тайлбарлаарай.",
      score: "0 / 2",
      userAnswer: "Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн...",
      correctAnswer: "Эх бичвэрт дурдсан баримтууд нь бие биенээ баталгаажуулж байна.",
      feedback: "Эх бичвэрийг шууд хуулж бичсэн тул 0 оноо.",
      isCorrect: false,
    },
    {
      id: 5,
      title: "Даалгавар 5: Эх бичвэрийн гол санааг ө өрийн амьдралын туршлагатай холбон 2-3 өгүүлбэрт эргэцүүлэн дүгнэж бичнэ үү.",
      score: "3 / 3",
      userAnswer: "Хүн залуу насандаа мөрөөдөлтэй байж, түүнийхээ төлөө хичээх нь амьдралын хамгийн нандин үе байдаг гэж бодож байна.",
      correctAnswer: "Өөрийн бодол ба амьдралын туршлагатай холбон эргэцүүлсэн байдал.",
      feedback: "Онц сайн! Асуултын агуулгыг гүнзгий эргэцүүлэн оновчтой бичжээ.",
      isCorrect: true,
    },
    {
      id: 6,
      title: "Даалгавар 6: Зохиогчийн ашигласан уран дүрслэлийн арга болон түүний утга санаанд гүйцэтгэх үүргийг дүгнэн бичнэ үү.",
      score: "3 / 3",
      userAnswer: "Зохиолч адилтгал болон амьджуулах ур урлалыг ашиглан дүрүүдийн сэтгэлийн хөдөлгөөнийг тод томруун харуулсан байна.",
      correctAnswer: "Уран дүрслэлийн аргыг тайлбарлан дүгнэсэн байдал.",
      feedback: "Гүнзгий эргэцүүлэн оновчтой дүгнэсэн байна.",
      isCorrect: true,
    },
  ];

  return (
    <div style={{ backgroundColor: "#fefaf0", minHeight: "100vh", padding: "16px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* HEADER - 7:1 Layout */}
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
          }}
        >
          <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>🎓 Сурагчийн танхим (9Е анги)</h1>
          <p style={{ fontSize: "11px", color: "#e3fcef", margin: "2px 0 0 0" }}>PISA Бүтээлч уншлага-2 төслийн даалгавар гүйцэтгэх талбар</p>
        </header>

        {/* ОНООНЫ МЭДЭЭЛЭЛ */}
        <section style={{ backgroundColor: "#ffffff", border: "1px solid #d3f5e5", borderRadius: "12px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#006644", margin: 0 }}>Нийт нийтлэг дүн: 7 / 12 оноо (Гүйцэтгэл: 58%)</h2>
            <span style={{ backgroundColor: "#fef2f2", color: "#991b1b", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
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

        {/* MAIN LAYOUT - 7:3 Ratio */}
        <div style={{ display: "grid", gridTemplateColumns: "7fr 3fr", gap: "16px", alignItems: "start" }}>
          
          {/* ДААЛГАВРУУД БҮТНЭЭРЭЭ (Бүх 6 даалгавар) */}
          <main style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ backgroundColor: "#fffdf6", border: "1px solid #fef08a", borderRadius: "12px", padding: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e293b", marginTop: 0, marginBottom: "12px" }}>
                📋 Шалгалтын дэлгэрэнгүй хариулт ба Зөвлөмж (Нийт 6 даалгавар)
              </h3>

              {examResults.map((item) => (
                <div key={item.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <p style={{ fontSize: "13px", fontWeight: "bold", color: "#0284c7", margin: 0 }}>{item.title}</p>
                    <span style={{ fontSize: "13px", fontWeight: "bold", color: item.isCorrect ? "#166534" : "#dc2626", marginLeft: "12px", whiteSpace: "nowrap" }}>
                      {item.score} оноо
                    </span>
                  </div>
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#334155", marginBottom: "6px" }}>
                    ✍️ <strong>Таны хариулт:</strong> {item.userAnswer}
                  </div>
                  <div style={{ backgroundColor: "#f0fdf4", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: "#166534", marginBottom: "6px" }}>
                    💡 <strong>Жишиг зөв хариулт:</strong> {item.correctAnswer}
                  </div>
                  <div style={{ backgroundColor: item.isCorrect ? "#dcfce7" : "#fee2e2", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", color: item.isCorrect ? "#14532d" : "#991b1b" }}>
                    👨‍🏫 <strong>Цэндао өвөө:</strong> {item.feedback}
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* ЧАТБОТ SIDEBAR */}
          <aside style={{ backgroundColor: "#fffdf6", border: "1px solid #fef08a", borderRadius: "12px", padding: "16px", position: "sticky", top: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlignment: "center", borderBottom: "1px solid #fef08a", paddingBottom: "12px" }}>
              <img src="/tsendao.jpg" alt="Цэндао өвөө" style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #f59e0b", objectFit: "cover", marginBottom: "8px" }} />
              <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>Цэндао өвөө-багштайгаа ярилцаарай</h4>
              <p style={{ fontSize: "12px", color: "#b45309", fontWeight: "bold", margin: "4px 0 0 0" }}>⏱️ Үлдсэн цаг: 18:38</p>
            </div>

            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "350px", overflowY: "auto" }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ backgroundColor: msg.sender === "student" ? "#dcfce7" : "#ffffff", color: msg.sender === "student" ? "#14532d" : "#1e293b", border: msg.sender === "student" ? "none" : "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", alignSelf: msg.sender === "student" ? "flex-end" : "flex-start", maxWidth: "90%" }}>
                  {msg.sender === "tsendao" && <strong>👨‍🏫 Цэндао өвөө: </strong>}
                  {msg.text}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "12px", display: "flex", gap: "6px" }}>
              <input type="text" placeholder="Асуултаа энд бичнэ үү..." value={inputQuestion} onChange={(e) => setInputQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", outline: "none" }} />
              <button onClick={handleSendMessage} style={{ backgroundColor: "#00875a", color: "#ffffff", border: "none", borderRadius: "6px", padding: "8px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Илгээх</button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}