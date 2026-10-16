"use client";

import { useState, useEffect } from "react";

export default function StudentPage() {
  const [assignedList, setAssignedList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);

  // Кодоор шүүх
  const [searchCodeInput, setSearchCodeInput] = useState("");

  const [studentAnswers, setStudentAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  // Багшийн илгээсэн даалгавруудыг localStorage-аас унших
  const loadAssignedTasks = () => {
    const savedAssigned = localStorage.getItem("creative_reading_assigned_tasks");
    const savedBank = localStorage.getItem("creative_reading_task_bank");

    let parsedAssigned: any[] = [];

    if (savedAssigned) {
      try {
        parsedAssigned = JSON.parse(savedAssigned);
      } catch (e) {
        console.error(e);
      }
    }

    // Нийт сангаас 9Е ангид автоматаар харуулах
    if (parsedAssigned.length === 0 && savedBank) {
      try {
        const bank = JSON.parse(savedBank);
        parsedAssigned = bank.map((b: any) => ({
          id: b.id,
          assignmentCode: `9E-${b.id.toString().slice(-4)}`,
          targetClass: "9Е",
          deadline: "Хугацаа хязгааргүй",
          teacherNote: "9Е ангийн сурагчид ажиллах боломжтой даалгавар.",
          assignedDate: b.createdDate,
          taskData: b
        }));
      } catch (e) {
        console.error(e);
      }
    }

    setAssignedList(parsedAssigned);
    setFilteredList(parsedAssigned);

    if (parsedAssigned.length > 0) {
      setSelectedAssignment(parsedAssigned[0]);
    }
  };

  useEffect(() => {
    loadAssignedTasks();
    window.addEventListener("focus", loadAssignedTasks);
    window.addEventListener("storage", loadAssignedTasks);

    return () => {
      window.removeEventListener("focus", loadAssignedTasks);
      window.removeEventListener("storage", loadAssignedTasks);
    };
  }, []);

  // Кодоор шүүх
  useEffect(() => {
    let result = [...assignedList];

    if (searchCodeInput.trim()) {
      const codeUpper = searchCodeInput.trim().toUpperCase();
      result = result.filter((item) => item.assignmentCode.toUpperCase().includes(codeUpper));
    }

    setFilteredList(result);
    if (result.length > 0) {
      setSelectedAssignment(result[0]);
    } else {
      setSelectedAssignment(null);
    }
  }, [searchCodeInput, assignedList]);

  const handleSelectAssignment = (item: any) => {
    setSelectedAssignment(item);
    setStudentAnswers({});
    setIsSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (!selectedAssignment || !selectedAssignment.taskData || !selectedAssignment.taskData.tasks) return;

    let totalGained = 0;
    const evaluated: any[] = [];

    selectedAssignment.taskData.tasks.forEach((t: any) => {
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
        maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#fffdf0", borderRadius: "16px", border: "1px solid #fde68a", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "12px", backgroundColor: "#ffffff", border: "2px solid #fcd34d", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="/project-logo.jpg" alt="Лого" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
              Бүтээлч уншлага-2 (9Е ангийн танхим)
            </h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>
              9Е ангийн даалгавар бие даан ажиллаж, AI үнэлгээ авах
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button type="button" onClick={loadAssignedTasks} style={{ backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
            🔄 Шинэчлэх
          </button>
          <a href="/" style={{ backgroundColor: "#0284c7", color: "#ffffff", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", textDecoration: "none" }}>
            👨‍🏫 Багшийн орчин руу буцах
          </a>
        </div>
      </header>

      {/* 9Е АНГИЙН МЭДЭЭЛЭЛ БА КОДООР ШҮҮХ */}
      <div style={{ maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#ffffff", padding: "12px 18px", borderRadius: "14px", border: "1.5px solid #cbd5e1", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ backgroundColor: "#059669", color: "#ffffff", padding: "4px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold" }}>
            🏫 9Е анги
          </span>
          <span style={{ fontSize: "12.5px", color: "#64748b" }}>
            Төсөлд хамрагдаж буй ангийн идэвхитэй даалгаврууд
          </span>
        </div>

        {/* Кодоор хайх */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: "bold", color: "#334155" }}>🔑 Даалгаврын кодоор хайх:</span>
          <input
            type="text"
            value={searchCodeInput}
            onChange={(e) => setSearchCodeInput(e.target.value)}
            placeholder="Жишээ: 9E-LIT-101"
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13px", outline: "none", fontWeight: "bold", textTransform: "uppercase" }}
          />
        </div>

      </div>

      {/* 9Е АНГИЙН ДААЛГАВРУУДЫН ЦЕС */}
      <div style={{ maxWidth: "1280px", margin: "0 auto 16px auto", display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
        {filteredList.length === 0 ? (
          <div style={{ backgroundColor: "#fef3c7", padding: "10px 16px", borderRadius: "8px", border: "1px solid #fcd34d", fontSize: "13px", color: "#92400e" }}>
            ⚠️ Энэ кодоор 9Е ангид илгээгдсэн даалгавар олдсонгүй.
          </div>
        ) : (
          filteredList.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectAssignment(item)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                backgroundColor: selectedAssignment?.id === item.id ? "#059669" : "#e2e8f0",
                color: selectedAssignment?.id === item.id ? "#ffffff" : "#475569",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>[{item.taskData.subject}]</span>
              <span>{item.taskData.title}</span>
              <span style={{ backgroundColor: "rgba(255,255,255,0.3)", padding: "1px 6px", borderRadius: "6px", fontSize: "10px" }}>{item.assignmentCode}</span>
            </button>
          ))
        )}
      </div>

      {/* ҮНДСЭН АЖЛЫН ТАЛБАР (8:5 БА 8:3 ХАРЬЦАА) */}
      {selectedAssignment && selectedAssignment.taskData ? (
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "5fr 3fr", gap: "16px" }}>
          
          {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР (8:5) */}
          <section style={{ backgroundColor: "#fffdf0", borderRadius: "16px", border: "1.5px solid #fde68a", padding: "20px", display: "flex", flexDirection: "column", minHeight: "580px" }}>
            
            {/* 9Е ANGI & DEADLINE БЛОК */}
            <div style={{ borderBottom: "1.5px solid #fde68a", paddingBottom: "12px", marginBottom: "14px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ backgroundColor: "#059669", color: "#ffffff", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" }}>
                    Анги: 9Е
                  </span>
                  <span style={{ backgroundColor: "#0284c7", color: "#ffffff", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" }}>
                    Код: {selectedAssignment.assignmentCode}
                  </span>
                </div>
                <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
                  📖 {selectedAssignment.taskData.title}
                </h2>
              </div>

              <div style={{ backgroundColor: "#fef3c7", padding: "6px 12px", borderRadius: "8px", border: "1px solid #fcd34d" }}>
                <p style={{ fontSize: "11px", color: "#b45309", margin: 0, fontWeight: "bold" }}>⏰ Дуусах хугацаа (Deadline):</p>
                <p style={{ fontSize: "12.5px", color: "#78350f", margin: "2px 0 0 0", fontWeight: "bold" }}>
                  {selectedAssignment.deadline ? new Date(selectedAssignment.deadline).toLocaleString("mn-MN") : "Хугацаа хязгааргүй"}
                </p>
              </div>
            </div>

            {/* Багшийн санамж */}
            {selectedAssignment.teacherNote && (
              <div style={{ backgroundColor: "#f0fdf4", padding: "10px 14px", borderRadius: "8px", border: "1px solid #bbf7d0", marginBottom: "12px", fontSize: "12.5px", color: "#166534" }}>
                💬 <strong>Багшийн санамж:</strong> {selectedAssignment.teacherNote}
              </div>
            )}

            {/* Эх бичвэр */}
            <div style={{ 
              backgroundColor: "#ffffff",
              padding: "16px 18px",
              borderRadius: "12px",
              border: "1px solid #fde68a",
              fontSize: "15px", 
              color: "#1e293b", 
              lineHeight: "1.8", 
              whiteSpace: "pre-wrap", 
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              maxHeight: "500px",
              overflowY: "auto"
            }}>
              {selectedAssignment.taskData.storyText}
            </div>
          </section>

          {/* БАРУУН ТАЛ: АСУУЛТ ДААЛГАВАР (8:3) */}
          <section style={{ backgroundColor: "#fffdf0", borderRadius: "16px", border: "1.5px solid #fde68a", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "580px" }}>
            <div>
              <div style={{ borderBottom: "1.5px solid #fde68a", paddingBottom: "10px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>✍️ Даалгавар ажиллах</h3>
                <span style={{ fontSize: "11px", color: "#059669", fontWeight: "bold", backgroundColor: "#dcfce7", padding: "2px 8px", borderRadius: "6px" }}>Нийт 12 оноо</span>
              </div>

              <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fde68a", padding: "14px", height: "430px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
                {selectedAssignment.taskData.tasks && selectedAssignment.taskData.tasks.map((t: any) => {
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
      ) : (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#334155" }}>9Е ангид илгээгдсэн даалгавар байхгүй байна.</h3>
          <p style={{ fontSize: "13px" }}>Багшийн орчин дахь Даалгаврын сангаас "🚀 9Е ангид илгээх" товчийг дараарай.</p>
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
                  <p style={{ fontSize: "11.5px", color item.earnedPoints > 0 ? "#15803d" : "#b91c1c", margin: 0 }}>{item.comment}</p>
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