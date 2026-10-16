"use client";

import { useState, useEffect } from "react";

export default function StudentPage() {
  const [taskBank, setTaskBank] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [imgError, setImgError] = useState(false);

  // Багшийн хадгалсан даалгаврын санг localStorage-аас унших
  useEffect(() => {
    const saved = localStorage.getItem("creative_reading_task_bank");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTaskBank(parsed);
        if (parsed.length > 0) {
          setSelectedTask(parsed[0]); // Хамгийн сүүлийн эх бичвэрийг сонгох
        }
      } catch (e) {
        console.error("Task bank load error:", e);
      }
    }
  }, []);

  const handleSelectSubjectTask = (item: any) => {
    setSelectedTask(item);
    setStudentAnswers({});
    setIsSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (!selectedTask) return;

    let totalGained = 0;
    const evaluated: any[] = [];

    selectedTask.tasks.forEach((t: any) => {
      const userAns = (studentAnswers[t.num] || "").trim();
      let earned = 0;
      let comment = "";

      if (t.options) {
        if (userAns === t.correctAnswer) {
          earned = t.points;
          comment = "✅ Зөв сонгосон байна! (+1 оноо)";
        } else if (userAns.length > 0) {
          earned = 0;
          comment = `❌ Буруу сонгосон. Зөв хариулт: ${t.correctAnswer}`;
        } else {
          earned = 0;
          comment = "⚪ Хариулаагүй байна.";
        }
      } else {
        if (userAns.length >= 25) {
          earned = t.points;
          comment = `🌟 Маш сайн! 2-3 өгүүлбэрээр өөрийн бодлоор шинэ санаа гарган бүрэн бичсэн байна. (+${t.points} оноо)`;
        } else if (userAns.length >= 10) {
          earned = Math.max(1, t.points - 1);
          comment = `👍 Тайлбар боломжийн боловч арай дутуу байна. (+${earned} оноо)`;
        } else {
          earned = 0;
          comment = "⚪ Хариулт дутуу эсвэл бичээгүй байна.";
        }
      }

      totalGained += earned;
      evaluated.push({
        num: t.num,
        question: t.question,
        userAnswer: userAns || "Хариулаагүй",
        earnedPoints: earned,
        maxPoints: t.points,
        comment: comment
      });
    });

    setScore(totalGained);
    setFeedbackList(evaluated);
    setIsSubmitted(true);
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* HEADER ХЭСЭГ */}
      <header style={{
        maxWidth: "1280px",
        margin: "0 auto 16px auto",
        backgroundColor: "#fffdf0",
        borderRadius: "16px",
        border: "1px solid #fde68a",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "12px", backgroundColor: "#ffffff", border: "2px solid #fcd34d", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="/project-logo.jpg" alt="Лого" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Бүтээлч уншлага-2 (Сурагчийн танхим)</h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>Даалгавар бие даан ажиллаж, AI үнэлгээ авах</p>
          </div>
        </div>

        {/* БАГШИЙН ХЭСЭГ РҮҮ БУЦАХ ТОВЧ */}
        <a 
          href="/" 
          style={{
            backgroundColor: "#0284c7",
            color: "#ffffff",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "bold",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          👨‍🏫 Багшийн орчин руу буцах
        </a>
      </header>

      {/* ХИЧЭЭЛ СӨНГӨХ СЕКЦИ */}
      <div style={{ maxWidth: "1280px", margin: "0 auto 16px auto", display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
        {taskBank.length === 0 ? (
          <div style={{ backgroundColor: "#fef3c7", padding: "10px 16px", borderRadius: "8px", border: "1px solid #fcd34d", fontSize: "13px", color: "#92400e" }}>
            ⚠️ Одоогоор багшаас хадгалсан даалгавар байхгүй байна. Багшийн орчинд даалгавраа баталж санд хадгална уу.
          </div>
        ) : (
          taskBank.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectSubjectTask(item)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                backgroundColor: selectedTask?.id === item.id ? "#059669" : "#e2e8f0",
                color: selectedTask?.id === item.id ? "#ffffff" : "#475569",
                whiteSpace: "nowrap"
              }}
            >
              [{item.subject}] {item.title}
            </button>
          ))
        )}
      </div>

      {/* ҮНДСЭН АЖЛЫН ТАЛБАР (8:5 БА 8:3 ХАРЬЦААТАЙ, БҮДЭГ ШАРГАЛ ФОН) */}
      {selectedTask && (
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "5fr 3fr", gap: "16px" }}>
          
          {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР (8:5 ХАРЬЦАА) */}
          <section style={{ backgroundColor: "#fffdf0", borderRadius: "16px", border: "1.5px solid #fde68a", padding: "20px", display: "flex", flexDirection: "column", minHeight: "580px" }}>
            <div style={{ borderBottom: "1.5px solid #fde68a", paddingBottom: "10px", marginBottom: "14px" }}>
              <span style={{ backgroundColor: "#0284c7", color: "#ffffff", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" }}>
                {selectedTask.subject}
              </span>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: "6px 0 0 0" }}>
                📖 {selectedTask.title}
              </h2>
            </div>

            <div style={{ fontSize: "15px", color: "#1e293b", lineHeight: "1.8", whiteSpace: "pre-wrap", flex: 1, overflowY: "auto" }}>
              {selectedTask.storyText}
            </div>
          </section>

          {/* БАРУУН ТАЛ: АСУУЛТ ДААЛГАВАР (8:3 ХАРЬЦАА) */}
          <section style={{ backgroundColor: "#fffdf0", borderRadius: "16px", border: "1.5px solid #fde68a", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "580px" }}>
            <div>
              <div style={{ borderBottom: "1.5px solid #fde68a", paddingBottom: "10px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>✍️ Даалгавар ажиллах</h3>
                <span style={{ fontSize: "11px", color: "#059669", fontWeight: "bold", backgroundColor: "#dcfce7", padding: "2px 8px", borderRadius: "6px" }}>Нийт 12 оноо</span>
              </div>

              <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fde68a", padding: "14px", height: "430px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
                {selectedTask.tasks.map((t: any) => {
                  const ans = studentAnswers[t.num] || "";
                  return (
                    <div key={t.num} style={{ border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "12px", backgroundColor: "#ffffff" }}>
                      <p style={{ fontWeight: "bold", fontSize: "13px", color: "#0f172a", margin: "0 0 8px 0" }}>
                        {t.num}. {t.question} <span style={{ color: "#0284c7" }}>({t.points} оноо)</span>
                      </p>

                      {t.options ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {t.options.map((opt: string, optIdx: number) => (
                            <label key={optIdx} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px", borderRadius: "6px", border: ans === opt ? "1.5px solid #059669" : "1px solid #cbd5e1", backgroundColor: ans === opt ? "#f0fdf4" : "#f8fafc", cursor: "pointer", fontSize: "12.5px" }}>
                              <input type="radio" name={`student-q-${t.num}`} checked={ans === opt} onChange={() => setStudentAnswers((prev) => ({ ...prev, [t.num]: opt }))} style={{ accentColor: "#059669" }} />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          value={ans}
                          onChange={(e) => setStudentAnswers((prev) => ({ ...prev, [t.num]: e.target.value }))}
                          placeholder="✍️ Хариултаа бичнэ үү..."
                          rows={3}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1.5px solid #cbd5e1", fontSize: "12.5px", fontFamily: "inherit", boxSizing: "border-box" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "14px" }}>
              <button
                type="button"
                onClick={handleQuizSubmit}
                style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}
              >
                🚀 Хариулт илгээх & Дүн харах
              </button>
            </div>
          </section>

        </div>
      )}

      {/* ШАЛГАСАН ДҮНГИЙН MODAL */}
      {isSubmitted && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "18px", width: "100%", maxWidth: "650px", maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ backgroundColor: "#fffdf0", padding: "20px", borderBottom: "1.5px solid #fde68a", textAlign: "center" }}>
              <div style={{ fontSize: "36px" }}>🎉</div>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#065f46", margin: "4px 0" }}>Сорил шалгагдаж дууслаа!</h2>
              <div style={{ display: "inline-block", backgroundColor: "#dcfce7", border: "1.5px solid #86efac", padding: "6px 20px", borderRadius: "20px", marginTop: "8px" }}>
                <span style={{ fontSize: "18px", fontWeight: "900", color: "#15803d" }}>Нийт: {score} / 12 оноо</span>
              </div>
            </div>

            <div style={{ padding: "16px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#f8fafc" }}>
              {feedbackList.map((item) => (
                <div key={item.num} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>Асуулт {item.num}: {item.question}</span>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: item.earnedPoints > 0 ? "#16a34a" : "#dc2626" }}>{item.earnedPoints}/{item.maxPoints} оноо</span>
                  </div>
                  <p style={{ fontSize: "11.5px", color: "#475569", margin: "4px 0", backgroundColor: "#f1f5f9", padding: "4px 6px", borderRadius: "4px" }}>✍️ Хариулт: {item.userAnswer}</p>
                  <p style={{ fontSize: "11.5px", color: item.earnedPoints > 0 ? "#15803d" : "#b91c1c", margin: 0 }}>{item.comment}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: "12px", backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", textAlign: "right" }}>
              <button type="button" onClick={() => setIsSubmitted(false)} style={{ backgroundColor: "#0284c7", color: "#ffffff", border: "none", padding: "8px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}