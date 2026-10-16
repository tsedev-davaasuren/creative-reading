"use client";

import { useState, useEffect } from "react";

export default function StudentPage() {
  const [assignmentCode, setAssignmentCode] = useState("");
  const [activeAssignment, setActiveAssignment] = useState<any | null>(null);
  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradingResult, setGradingResult] = useState<any | null>(null);
  const [assignedList, setAssignedList] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("creative_reading_assigned_tasks");
    if (saved) {
      try { setAssignedList(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleLoadAssignment = (codeToFind?: string) => {
    const code = codeToFind || assignmentCode.trim();
    if (!code) return alert("Даалгаврын кодоо оруулна уу!");

    const found = assignedList.find(
      (a) => a.assignmentCode.toLowerCase() === code.toLowerCase()
    );

    if (found) {
      setActiveAssignment(found);
      setAnswers({});
      setIsSubmitted(false);
      setGradingResult(null);
    } else {
      alert("Ийм кодтой даалгавар олдсонгүй. Кодоо шалгана уу.");
    }
  };

  const handleAnswerChange = (taskNum: number, val: string) => {
    setAnswers((prev) => ({ ...prev, [taskNum]: val }));
  };

  const handleSubmitAnswers = () => {
    if (!studentName.trim()) {
      return alert("Овог нэрээ заавал оруулна уу!");
    }

    if (!activeAssignment) return;

    const tasks = activeAssignment.taskData.tasks;
    let totalScore = 0;
    const taskEvaluations: any[] = [];

    tasks.forEach((t: any) => {
      const studentAns = (answers[t.num] || "").trim();
      let earnedPoints = 0;
      let feedback = "";

      if (t.num === 1 || t.form === "Сонгох тест") {
        if (studentAns && studentAns.slice(0, 1) === t.correctAnswer.slice(0, 1)) {
          earnedPoints = 1;
          feedback = "Зөв хариулсан байна. Мэдээллийг оновчтой олж тодорхойллоо.";
        } else {
          earnedPoints = 0;
          feedback = `Буруу хариулт. Зөв хариулт нь: ${t.correctAnswer}`;
        }
      } else {
        if (studentAns.length >= 8) {
          earnedPoints = t.points;
          feedback = "Даалгаврын шаардлагад тохируулан оновчтой, бүтэн бичсэн байна.";
        } else if (studentAns.length > 0) {
          earnedPoints = Math.max(1, Math.floor(t.points / 2));
          feedback = "Хариулт бичсэн ч тайлбар арай дутуу байна.";
        } else {
          earnedPoints = 0;
          feedback = "Хариулт бичээгүй байна.";
        }
      }

      totalScore += earnedPoints;
      taskEvaluations.push({
        num: t.num,
        question: t.question,
        maxPoints: t.points,
        earnedPoints: earnedPoints,
        studentAns: studentAns || "(Хариулаагүй)",
        correctAnswer: t.correctAnswer,
        feedback: feedback
      });
    });

    setGradingResult({
      studentName,
      totalScore,
      maxPossibleScore: 12,
      taskEvaluations,
      submittedAt: new Date().toLocaleString("mn-MN")
    });

    setIsSubmitted(true);
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px", fontFamily: "sans-serif" }}>
      <header style={{ maxWidth: "1280px", margin: "0 auto 20px auto", backgroundColor: "#059669", color: "#ffffff", borderRadius: "16px", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>👨‍🎓 Сурагчийн танхим (9Е анги)</h1>
          <p style={{ fontSize: "13px", margin: "4px 0 0 0", opacity: 0.9 }}>PISA Бүтээлч уншлага-2 төслийн даалгавар гүйцэтгэх талбар</p>
        </div>
        <a href="/" style={{ backgroundColor: "#ffffff", color: "#059669", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" }}>
          🏠 Нүүр хуудас руу буцах
        </a>
      </header>

      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {!activeAssignment && (
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "32px", border: "1.5px solid #cbd5e1", maxWidth: "600px", margin: "20px auto", width: "100%", boxSizing: "border-box" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: "0 0 12px 0", textAlign: "center" }}>🔑 Даалгаврын кодоо оруулна уу</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px 0", textAlign: "center" }}>Багшаас өгсөн тусгай кодыг оруулж даалгавраа ачаална уу.</p>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                value={assignmentCode}
                onChange={(e) => setAssignmentCode(e.target.value)}
                placeholder="Жишээ: 9E-LIT-4821"
                style={{ flex: 1, padding: "12px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase" }}
              />
              <button
                type="button"
                onClick={() => handleLoadAssignment()}
                style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}
              >
                Нээх
              </button>
            </div>

            {assignedList.length > 0 && (
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
                <p style={{ fontSize: "12.5px", fontWeight: "bold", color: "#475569", margin: "0 0 10px 0" }}>🏫 Сүүлд 9Е ангид ирсэн даалгаврууд:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {assignedList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleLoadAssignment(item.assignmentCode)}
                      style={{ padding: "10px 14px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <div>
                        <span style={{ fontWeight: "bold", fontSize: "13px", color: "#166534" }}>[{item.taskData.subject}] {item.taskData.title}</span>
                        <p style={{ fontSize: "11px", color: "#15803d", margin: "2px 0 0 0" }}>Код: <strong>{item.assignmentCode}</strong> • Хугацаа: {item.deadline || "Заагаагүй"}</p>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: "#059669" }}>Ажиллах ➔</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeAssignment && (
          <div style={{ display: "grid", gridTemplateColumns: "5fr 3fr", gap: "20px" }}>
            
            <div style={{ backgroundColor: "#fffdf0", border: "1.5px solid #fde68a", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "10px" }}>
                <span style={{ backgroundColor: "#0284c7", color: "#fff", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>{activeAssignment.taskData.subject}</span>
                <button type="button" onClick={() => setActiveAssignment(null)} style={{ border: "none", background: "#cbd5e1", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>Солих ✕</button>
              </div>

              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📖 {activeAssignment.taskData.title}</h2>
              
              {activeAssignment.teacherNote && (
                <div style={{ backgroundColor: "#fef3c7", border: "1px solid #fcd34d", padding: "10px 14px", borderRadius: "10px", fontSize: "12.5px", color: "#92400e" }}>
                  <strong>👨‍🏫 Багшийн санамж:</strong> {activeAssignment.teacherNote}
                </div>
              )}

              <div style={{ backgroundColor: "#ffffff", border: "1px solid #fde68a", padding: "16px", borderRadius: "12px", fontSize: "14.5px", lineHeight: "1.8", whiteSpace: "pre-wrap", maxHeight: "550px", overflowY: "auto" }}>
                {activeAssignment.taskData.storyText}
              </div>
            </div>

            <div style={{ backgroundColor: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "600px", overflowY: "auto", paddingRight: "6px" }}>
                
                <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Сурагчийн овог нэр:</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    disabled={isSubmitted}
                    placeholder="Нэрээ бичнэ үү..."
                    style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px", fontSize: "13.5px", boxSizing: "border-box" }}
                  />
                </div>

                {activeAssignment.taskData.tasks.map((t: any) => (
                  <div key={t.num} style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "14px", backgroundColor: "#f8fafc" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontWeight: "bold", fontSize: "13px", color: "#0284c7" }}>Даалгавар {t.num} ({t.form})</span>
                      <span style={{ fontSize: "11px", fontWeight: "bold", backgroundColor: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "4px" }}>{t.points} оноо</span>
                    </div>

                    <p style={{ fontSize: "13px", fontWeight: "bold", color: "#0f172a", margin: "0 0 10px 0" }}>{t.question}</p>

                    {/* 1-р даалгавар Сонгох тест бол радио товчлуурууд гарч ирнэ */}
                    {(t.num === 1 || t.form === "Сонгох тест") && t.options ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {t.options.map((opt: string) => (
                          <label key={opt} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", cursor: "pointer", backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "8px", border: answers[t.num] === opt ? "2px solid #0284c7" : "1px solid #cbd5e1" }}>
                            <input
                              type="radio"
                              name={`task_${t.num}`}
                              disabled={isSubmitted}
                              checked={answers[t.num] === opt}
                              onChange={() => handleAnswerChange(t.num, opt)}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        rows={3}
                        disabled={isSubmitted}
                        value={answers[t.num] || ""}
                        onChange={(e) => handleAnswerChange(t.num, e.target.value)}
                        placeholder="Хариултаа зааврын дагуу тодорхой бичээрэй..."
                        style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "12.5px", boxSizing: "border-box", fontFamily: "inherit" }}
                      />
                    )}
                  </div>
                ))}

              </div>

              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswers}
                  style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", marginTop: "14px" }}
                >
                  🚀 Хариултыг илгээж, AI үнэлгээ авах
                </button>
              ) : (
                <div style={{ backgroundColor: "#f0fdf4", border: "1.5px solid #16a34a", padding: "14px", borderRadius: "10px", marginTop: "14px", textAlign: "center" }}>
                  <p style={{ fontSize: "15px", fontWeight: "bold", color: "#15803d", margin: 0 }}>Амжилттай илгээгдлээ!</p>
                  <p style={{ fontSize: "13px", color: "#166534", margin: "4px 0 0 0" }}>Нийт авсан оноо: <strong>{gradingResult?.totalScore} / 12</strong></p>
                </div>
              )}

            </div>

          </div>
        )}

        {gradingResult && (
          <div style={{ backgroundColor: "#ffffff", border: "2px solid #10b981", borderRadius: "16px", padding: "24px", marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#065f46", margin: 0 }}>📊 AI Үнэлгээний нэгтгэл тайлан</h3>
                <p style={{ fontSize: "12.5px", color: "#64748b", margin: "2px 0 0 0" }}>Сурагч: <strong>{gradingResult.studentName}</strong> • Огноо: {gradingResult.submittedAt}</p>
              </div>
              <div style={{ backgroundColor: "#dcfce7", border: "1px solid #86efac", padding: "8px 16px", borderRadius: "12px", textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "#15803d", fontWeight: "bold" }}>НИЙТ ОНОО</span>
                <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#166534", margin: 0 }}>{gradingResult.totalScore} / 12</h2>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {gradingResult.taskEvaluations.map((ev: any) => (
                <div key={ev.num} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px", backgroundColor: "#f8fafc" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: "bold", color: "#0f172a" }}>Даалгавар {ev.num}: {ev.question}</span>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: ev.earnedPoints > 0 ? "#15803d" : "#b91c1c" }}>
                      {ev.earnedPoints} / {ev.maxPoints} оноо
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#334155", margin: "4px 0" }}><strong>Өгсөн хариулт:</strong> {ev.studentAns}</p>
                  <p style={{ fontSize: "11.5px", color: "#059669", margin: "4px 0", backgroundColor: "#f0fdf4", padding: "4px 8px", borderRadius: "4px" }}>💡 {ev.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}