"use client";

import { useState, useEffect } from "react";

export default function StudentPage() {
  const [inputCode, setInputCode] = useState("");
  const [assignedList, setAssignedList] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<any | null>(null);

  // Сурагчийн хариултууд
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("creative_reading_assigned_tasks");
    if (data) {
      try { setAssignedList(JSON.parse(data)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleOpenByCode = (codeToSearch?: string) => {
    const code = (codeToSearch || inputCode).trim();
    if (!code) return alert("Даалгаврын кодоо оруулна уу!");

    const found = assignedList.find((item) => item.assignmentCode.toLowerCase() === code.toLowerCase());
    if (found) {
      setActiveTask(found);
      setAnswers({});
      setSubmittedResult(null);
    } else {
      alert("Даалгаврын код олдсонгүй. Кодоо шалгана уу.");
    }
  };

  const handleSubmitExam = () => {
    if (!activeTask) return;
    let totalScore = 0;
    const taskDetails = activeTask.taskData.tasks;

    taskDetails.forEach((t: any) => {
      const userAns = answers[t.num] || "";
      if (t.num === 1 || t.form === "Сонгох тест") {
        if (userAns.trim().toLowerCase() === t.correctAnswer.trim().toLowerCase()) {
          totalScore += t.points;
        }
      } else {
        if (userAns.trim().length > 5) {
          totalScore += t.points; // Автомат үнэлгээний жишээ
        }
      }
    });

    setSubmittedResult({
      totalScore,
      maxScore: 12,
      percentage: Math.round((totalScore / 12) * 100)
    });
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f0fdf4", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* 🔒 БАГШИЙН ХЭСЭГ РҮҮ БУЦАХ ТОВЧИЙГ БҮРМӨСӨН АВСАН СУРАГЧИЙН HEADER */}
      <header style={{ maxWidth: "1000px", margin: "0 auto 20px auto", backgroundColor: "#059669", borderRadius: "16px", padding: "16px 24px", color: "#ffffff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>👨‍🎓 Сурагчийн танхим (9Е анги)</h1>
        <p style={{ fontSize: "13px", margin: "4px 0 0 0", opacity: 0.9 }}>PISA Бүтээлч уншлага-2 төслийн даалгавар гүйцэтгэх талбар</p>
      </header>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {!activeTask ? (
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "30px", border: "1.5px solid #a7f3d0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
            <div style={{ textAlign: "center", maxWidth: "500px", margin: "0 auto 24px auto" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔑</div>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#065f46", margin: "0 0 6px 0" }}>Даалгаврын кодоо оруулна уу</h2>
              <p style={{ fontSize: "13px", color: "#4b5563", margin: 0 }}>Багшаас өгсөн тусгай кодыг оруулж даалгавраа ачаална уу.</p>
              
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="ЖИШЭЭ: 9E-LIT-4821"
                  style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "2px solid #059669", fontSize: "14px", fontWeight: "bold", textAlign: "center", textTransform: "uppercase" }}
                />
                <button type="button" onClick={() => handleOpenByCode()} style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "0 24px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>Нээх</button>
              </div>
            </div>

            {assignedList.length > 0 && (
              <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "20px" }}>
                <p style={{ fontSize: "13px", fontWeight: "bold", color: "#374151", margin: "0 0 12px 0" }}>🏫 Сүүлд 9Е ангид ирсэн даалгаврууд:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {assignedList.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f0fdf4", padding: "12px 16px", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
                      <div>
                        <span style={{ fontWeight: "bold", fontSize: "14px", color: "#065f46" }}>[{item.taskData.subject}] {item.taskData.title}</span>
                        <p style={{ fontSize: "12px", color: "#047857", margin: "2px 0 0 0" }}>Код: <strong>{item.assignmentCode}</strong> • Хугацаа: {item.deadline || "Заагаагүй"}</p>
                      </div>
                      <button type="button" onClick={() => handleOpenByCode(item.assignmentCode)} style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Ажиллах ➔</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ДААЛГАВАР АЖИЛЛАХ / ДҮН ХАРАХ ХЭСЭГ */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
            {/* ЭХ БИЧВЭР */}
            <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", border: "1.5px solid #a7f3d0", height: "650px", overflowY: "auto" }}>
              <span style={{ backgroundColor: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>{activeTask.taskData.subject}</span>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#065f46", margin: "10px 0" }}>{activeTask.taskData.title}</h2>
              <div style={{ fontSize: "14px", lineHeight: "1.8", color: "#1f2937", whiteSpace: "pre-wrap" }}>{activeTask.taskData.storyText}</div>
            </div>

            {/* АСУУЛТУУД */}
            <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", border: "1.5px solid #a7f3d0", height: "650px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ overflowY: "auto", paddingRight: "6px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#065f46", margin: "0 0 14px 0", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>📝 Даалгаврууд</h3>

                {submittedResult ? (
                  /* 📊 ДҮН ОНОО ВЬЮ */
                  <div style={{ backgroundColor: "#f0fdf4", padding: "20px", borderRadius: "12px", border: "2px solid #10b981", textAlign: "center" }}>
                    <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎯</div>
                    <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#065f46", margin: 0 }}>Амжилттай дуусгалаа!</h2>
                    <p style={{ fontSize: "14px", color: "#047857", margin: "6px 0 16px 0" }}>Таны авсан оноо:</p>
                    
                    <div style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #a7f3d0", display: "inline-block", width: "80%" }}>
                      <span style={{ fontSize: "36px", fontWeight: "900", color: "#059669" }}>{submittedResult.totalScore}</span>
                      <span style={{ fontSize: "20px", color: "#6b7280" }}> / {submittedResult.maxScore} оноо</span>
                      <p style={{ fontSize: "14px", fontWeight: "bold", color: "#047857", margin: "6px 0 0 0" }}>Гүйцэтгэл: {submittedResult.percentage}%</p>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <button type="button" onClick={() => setActiveTask(null)} style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Буцах / Код дахин оруулж турших</button>
                    </div>
                  </div>
                ) : (
                  /* АСУУЛТАНД ХАРИУЛАХ */
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {activeTask.taskData.tasks.map((t: any) => (
                      <div key={t.num} style={{ border: "1px solid #cbd5e1", padding: "12px", borderRadius: "10px", backgroundColor: "#f9fafb" }}>
                        <p style={{ fontSize: "13.5px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>{t.num}. {t.question} ({t.points} оноо)</p>
                        
                        {t.options ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {t.options.map((opt: string) => (
                              <label key={opt} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", cursor: "pointer", backgroundColor: "#fff", padding: "6px 10px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                                <input
                                  type="radio"
                                  name={`task-${t.num}`}
                                  value={opt}
                                  onChange={(e) => setAnswers({ ...answers, [t.num]: e.target.value })}
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <textarea
                            rows={3}
                            placeholder="Хариултаа бичээрэй..."
                            value={answers[t.num] || ""}
                            onChange={(e) => setAnswers({ ...answers, [t.num]: e.target.value })}
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px", boxSizing: "border-box" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!submittedResult && (
                <div style={{ paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
                  <button type="button" onClick={handleSubmitExam} style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
                    ✅ Даалгаврыг дуусгаж, дүн харах
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </main>
  );
}