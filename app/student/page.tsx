"use client";

import { useState, useEffect } from "react";

export default function StudentPage() {
  const [inputCode, setInputCode] = useState("");
  const [assignedList, setAssignedList] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<any | null>(null);

  // Сурагчийн хариултууд
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  // ⏳ ТАЙМЕР STATE-ҮҮД (40 мин даалгавар, 20 мин чат)
  const [examTimeLeft, setExamTimeLeft] = useState<number>(40 * 60);
  const [chatTimeLeft, setChatTimeLeft] = useState<number>(20 * 60);
  const [isExamTimerRunning, setIsExamTimerRunning] = useState<boolean>(false);
  const [isChatTimerRunning, setIsChatTimerRunning] = useState<boolean>(false);

  // 💬 ЦЭНДАО ӨВӨӨТЭЙ ЧАТЛАХ STATE-ҮҮД
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const bankData = localStorage.getItem("creative_reading_task_bank");
    const assignedData = localStorage.getItem("creative_reading_assigned_tasks");

    let validBankTitles: string[] = [];
    if (bankData) {
      try {
        const bank = JSON.parse(bankData);
        validBankTitles = bank.map((b: any) => b.title);
      } catch (e) { console.error(e); }
    }

    if (assignedData) {
      try {
        const rawList = JSON.parse(assignedData);
        const filtered = rawList.filter((item: any) => 
          validBankTitles.length === 0 || validBankTitles.includes(item.taskData?.title)
        );
        const uniqueList = filtered.filter((v: any, i: number, a: any[]) => 
          a.findIndex((t: any) => t.assignmentCode === v.assignmentCode) === i
        );
        setAssignedList(uniqueList);
      } catch (e) { console.error(e); }
    }
  }, []);

  // 40 МИНУТЫН ДААЛГАВАР ГҮЙЦЭТГЭХ ТАЙМЕР
  useEffect(() => {
    let interval: any = null;
    if (isExamTimerRunning && examTimeLeft > 0) {
      interval = setInterval(() => {
        setExamTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (examTimeLeft === 0 && isExamTimerRunning) {
      setIsExamTimerRunning(false);
      alert("⏰ Даалгаврын 40 минутын хугацаа дууслаа! Даалгавар автоматаар хураагдлаа.");
      handleSubmitExam();
    }
    return () => clearInterval(interval);
  }, [isExamTimerRunning, examTimeLeft]);

  // 20 МИНУТЫН ЧАТЛАХ ТАЙМЕР
  useEffect(() => {
    let interval: any = null;
    if (isChatTimerRunning && chatTimeLeft > 0) {
      interval = setInterval(() => {
        setChatTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (chatTimeLeft === 0 && isChatTimerRunning) {
      setIsChatTimerRunning(false);
      alert("⏰ Цэндао өвөө-багштай ярилцах 20 минутын хугацаа дууслаа.");
    }
    return () => clearInterval(interval);
  }, [isChatTimerRunning, chatTimeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOpenByCode = (codeToSearch?: string) => {
    const code = (codeToSearch || inputCode).trim();
    if (!code) return alert("Даалгаврын кодоо оруулна уу!");

    const found = assignedList.find((item) => item.assignmentCode.toLowerCase() === code.toLowerCase());
    if (found) {
      setActiveTask(found);
      setAnswers({});
      setSubmittedResult(null);
      setExamTimeLeft(40 * 60);
      setIsExamTimerRunning(true);
      setIsChatOpen(false);
      setIsChatTimerRunning(false);
    } else {
      alert("Даалгаврын код олдсонгүй. Кодоо шалгана уу.");
    }
  };

  // 🎯 ЧАНГА УНЭЛГЭЭНИЙ ЛОГИК (ШУДАРАГА ОНООЖУУЛАЛТ)
  const handleSubmitExam = () => {
    if (!activeTask) return;
    setIsExamTimerRunning(false);

    let totalScore = 0;
    const taskDetails = activeTask.taskData.tasks;
    const feedbackList: any[] = [];

    // Дэвсгэр шалгах: асуулт бүрд ижил текст давтан хуулж тавьсан уу?
    const userAnswersList = Object.values(answers).map(a => a.trim().toLowerCase()).filter(a => a.length > 0);
    const hasDuplicateSpam = userAnswersList.length > 1 && new Set(userAnswersList).size === 1 && userAnswersList[0].length > 10;

    taskDetails.forEach((t: any) => {
      const userAns = (answers[t.num] || "").trim();
      let scoreEarned = 0;
      let advice = "";

      if (hasDuplicateSpam && t.num !== 1) {
        // Нэг бичвэрийг олон асуултад хуулж тавсан бол 0 оноо
        scoreEarned = 0;
        advice = "👴 Цэндао өвөө: Бичвэрийг асуулт бүрд хувилан тавьж болохгүй. Асуултын агуулгад тохирсон бие даасан хариулт бичнэ үү.";
      } else if (t.num === 1 || t.form === "Сонгох тест") {
        if (userAns.toLowerCase() === t.correctAnswer.trim().toLowerCase() || userAns.startsWith(t.correctAnswer.slice(0, 2))) {
          scoreEarned = t.points;
          advice = "👴 Цэндао өвөө: Маш сайн! Эх бичвэрийн баримтыг оновчтой зөв сонгож чадлаа.";
        } else {
          scoreEarned = 0;
          advice = `👴 Цэндао өвөө: Буруу байна. Эх бичвэрийг дахин сайн анхаарч уншаарай. Зөв хариулт нь: ${t.correctAnswer}`;
        }
      } else {
        // Задгай даалгаврын агуулгын чанарыг шалгах
        const minLen = t.num === 2 ? 10 : t.num <= 4 ? 25 : 40;
        if (userAns.length >= minLen) {
          scoreEarned = t.points;
          advice = "👴 Цэндао өвөө: Онц сайн! Асуултын утга санааг бүрэн гаргаж, эргэцүүлэн бичиж чадлаа.";
        } else if (userAns.length > 5) {
          scoreEarned = Math.floor(t.points / 2);
          advice = "👴 Цэндао өвөө: Таны хариулт дутуу байна. Өгүүлбэрийн тоо болон санаагаа илүү тодорхой гүнзгийрүүлж бичээрэй.";
        } else {
          scoreEarned = 0;
          advice = "👴 Цэндао өвөө: Хариулт хангалтгүй эсвэл бичээгүй байна. Даалгавраа гүйцэд ажиллана уу.";
        }
      }

      totalScore += scoreEarned;
      feedbackList.push({
        num: t.num,
        question: t.question,
        scoreEarned,
        maxPoints: t.points,
        userAns: userAns || "(Бичээгүй)",
        advice
      });
    });

    setSubmittedResult({
      totalScore,
      maxScore: 12,
      percentage: Math.round((totalScore / 12) * 100),
      feedbackList
    });

    // Чатлах 20 минутын таймер эхлүүлэх
    setChatTimeLeft(20 * 60);
    setIsChatTimerRunning(true);
    setChatMessages([
      { sender: "tsendao", text: `Сайн байна уу, хүү минь! Багш нь Цэндао өвөө нь байна. Та шалгалтаараа ${totalScore}/12 оноо авлаа. Асуух зүйл байвал өвөөгөөсөө асуугаарай. (20 минутын яриа эхэллээ)` }
    ]);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "tsendao", text: `👴 Цэндао өвөө: "${msg}" гэсэн асуултад сургамжлахад, эх бичвэрийн гол утга санааг анхааран, PISA даалгаврын эргэцүүлэн дүгнэх шалгуурыг хангаж ажиллах нь чухал шүү, хүү минь.` }
      ]);
    }, 600);
  };

  return (
    /* 🎨 ЗУРАГ-1: ДЭВСГЭР ӨНГӨ ЦАЙВАР ШАРГАЛ (#fffdf0) */
    <main style={{ minHeight: "100vh", backgroundColor: "#fffdf0", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* СУРАГЧИЙН HEADER BARR */}
      <header style={{ maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#059669", borderRadius: "16px", padding: "14px 24px", color: "#ffffff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "19px", fontWeight: "bold", margin: 0 }}>👨‍🎓 Сурагчийн танхим (9Е анги)</h1>
          <p style={{ fontSize: "12px", margin: "2px 0 0 0", opacity: 0.9 }}>PISA Бүтээлч уншлага-2 төслийн даалгавар гүйцэтгэх талбар</p>
        </div>

        {/* ⏳ 40 МИНУТЫН ТАЙМЕР */}
        {activeTask && isExamTimerRunning && (
          <div style={{ backgroundColor: "#047857", padding: "8px 16px", borderRadius: "10px", border: "1px solid #34d399", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "#a7f3d0", display: "block", fontWeight: "bold" }}>⏱️ Даалгаврын хугацаа:</span>
            <span style={{ fontSize: "18px", fontWeight: "900", color: "#ffffff" }}>{formatTime(examTimeLeft)}</span>
          </div>
        )}
      </header>

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        {!activeTask ? (
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "30px", border: "1.5px solid #fde68a", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
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
              <div style={{ borderTop: "1px dashed #fcd34d", paddingTop: "20px" }}>
                <p style={{ fontSize: "13px", fontWeight: "bold", color: "#374151", margin: "0 0 12px 0" }}>🏫 Сүүлд 9Е ангид ирсэн даалгаврууд ({assignedList.length}):</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {assignedList.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fffdf0", padding: "12px 16px", borderRadius: "10px", border: "1px solid #fde68a" }}>
                      <div>
                        <span style={{ fontWeight: "bold", fontSize: "14px", color: "#065f46" }}>[{item.taskData.subject}] {item.taskData.title}</span>
                        <p style={{ fontSize: "12px", color: "#047857", margin: "2px 0 0 0" }}>Код: <strong>{item.assignmentCode}</strong> • Хугацаа: 40 минут</p>
                      </div>
                      <button type="button" onClick={() => handleOpenByCode(item.assignmentCode)} style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Ажиллах ➔</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 📏 ЗУРАГ-1: ЭХ БИЧВЭР 8:5 БА АСУУЛТ 8:3 ХАРЬЦААТАЙ, ЦАЙВАР ШАРГАЛ ФОНТОЙ ДЭЛГЭЦ */
          <div style={{ display: "grid", gridTemplateColumns: "5fr 3fr", gap: "16px" }}>
            
            {/* ЭХ БИЧВЭР (8:5 ХАРЬЦАА / ЦАЙВАР ШАРГАЛ) */}
            <div style={{ backgroundColor: "#fffdf0", padding: "20px", borderRadius: "16px", border: "1.5px solid #fde68a", minHeight: "580px", maxHeight: "760px", overflowY: "auto" }}>
              <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>{activeTask.taskData.subject}</span>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: "10px 0" }}>{activeTask.taskData.title}</h2>
              <div style={{ fontSize: "14.5px", lineHeight: "1.8", color: "#1e293b", whiteSpace: "pre-wrap" }}>{activeTask.taskData.storyText}</div>
            </div>

            {/* АСУУЛТ ДААЛГАВАР (8:3 ХАРЬЦАА / ЦАЙВАР ШАРГАЛ) */}
            <div style={{ backgroundColor: "#fffdf0", padding: "20px", borderRadius: "16px", border: "1.5px solid #fde68a", minHeight: "580px", maxHeight: "760px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ overflowY: "auto", paddingRight: "6px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: "0 0 14px 0", borderBottom: "1.5px solid #fde68a", paddingBottom: "8px" }}>📝 Даалгаврууд</h3>

                {submittedResult ? (
                  /* 📊 ЗУРАГ-2 БА 3, 4, 5: ДҮН ОНОО + ЦЭНДАО ӨВӨӨ БАГШИЙН ЗӨВЛӨМЖ ВЬЮ */
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    
                    {/* НИЙТ ОНООНЫ КАРТ */}
                    <div style={{ backgroundColor: "#ffffff", padding: "18px", borderRadius: "12px", border: "2px solid #10b981", textAlign: "center" }}>
                      <div style={{ fontSize: "36px", marginBottom: "4px" }}>🎯</div>
                      <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#065f46", margin: 0 }}>Шалгалт дууслаа!</h2>
                      <div style={{ margin: "10px 0", fontSize: "28px", fontWeight: "900", color: "#059669" }}>
                        {submittedResult.totalScore} <span style={{ fontSize: "18px", color: "#6b7280" }}>/ {submittedResult.maxScore} оноо</span>
                        <p style={{ fontSize: "13px", margin: "2px 0 0 0", color: "#047857" }}>Гүйцэтгэл: {submittedResult.percentage}%</p>
                      </div>

                      {/* 💬 ЦЭНДАО ӨВӨӨТЭЙ ЧАТЛАХ ТОВЧ (20 МИН) */}
                      <button
                        type="button"
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        style={{ backgroundColor: "#fbbf24", color: "#78350f", border: "1px solid #f59e0b", padding: "10px 16px", borderRadius: "10px", fontWeight: "bold", fontSize: "13px", cursor: "pointer", width: "100%", marginTop: "8px" }}
                      >
                        💬 Цэндао өвөө-багштай ярилцах (20 мин)
                      </button>
                    </div>

                    {/* 💬 ЦЭНДАО ӨВӨӨТЭЙ ЯРИЛЦАХ ЧАТ ЦОНХ */}
                    {isChatOpen && (
                      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1.5px solid #fcd34d", padding: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #fde68a", paddingBottom: "6px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#92400e" }}>👴 Цэндао өвөө (Үлдсэн цаг: {formatTime(chatTimeLeft)})</span>
                          <button type="button" onClick={() => setIsChatOpen(false)} style={{ border: "none", background: "none", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}>✕</button>
                        </div>
                        <div style={{ height: "140px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", padding: "4px" }}>
                          {chatMessages.map((m, idx) => (
                            <div key={idx} style={{ alignSelf: m.sender === "user" ? "flex-end" : "flex-start", backgroundColor: m.sender === "user" ? "#dcfce7" : "#fef3c7", padding: "6px 10px", borderRadius: "8px", fontSize: "12px" }}>
                              {m.text}
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()} placeholder="Өвөөгөөсөө асуух зүйлээ бичээрэй..." style={{ flex: 1, padding: "6px 10px", border: "1px solid #fcd34d", borderRadius: "6px", fontSize: "12px" }} />
                          <button type="button" onClick={handleSendChatMessage} style={{ backgroundColor: "#fbbf24", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Асуух</button>
                        </div>
                      </div>
                    )}

                    {/* 3. ДААЛГАВРЫН ХАРИУНД ЦЭНДАО ӨВӨӨ-БАГШИЙН ЗӨВЛӨМЖҮҮД */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>👴 Цэндао өвөө-багшийн тусгайлсан зөвлөмж:</h4>
                      {submittedResult.feedbackList.map((f: any) => (
                        <div key={f.num} style={{ backgroundColor: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "12.5px", fontWeight: "bold", color: "#0284c7" }}>Даалгавар {f.num}</span>
                            <span style={{ fontSize: "11px", fontWeight: "bold", color: f.scoreEarned > 0 ? "#059669" : "#dc2626" }}>{f.scoreEarned} / {f.maxPoints} оноо</span>
                          </div>
                          <p style={{ fontSize: "12px", color: "#475569", margin: "0 0 6px 0" }}>Таны хариулт: "{f.userAns}"</p>
                          <div style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a", padding: "8px", borderRadius: "6px", fontSize: "11.5px", color: "#78350f" }}>
                            {f.advice}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button type="button" onClick={() => setActiveTask(null)} style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>Буцах / Код дахин оруулж турших</button>
                  </div>
                ) : (
                  /* АСУУЛТАНД ХАРИУЛАХ ГОРИМ */
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {activeTask.taskData.tasks.map((t: any) => (
                      <div key={t.num} style={{ border: "1px solid #fde68a", padding: "12px", borderRadius: "10px", backgroundColor: "#ffffff" }}>
                        <p style={{ fontSize: "13.5px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>{t.num}. {t.question} ({t.points} оноо)</p>
                        
                        {t.options ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {t.options.map((opt: string) => (
                              <label key={opt} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", cursor: "pointer", backgroundColor: "#fffdf0", padding: "6px 10px", borderRadius: "6px", border: "1px solid #fde68a" }}>
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
                            placeholder="Хариултаа энд бичээрэй..."
                            value={answers[t.num] || ""}
                            onChange={(e) => setAnswers({ ...answers, [t.num]: e.target.value })}
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px", boxSizing: "border-box", fontFamily: "inherit" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!submittedResult && (
                <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "10px" }}>
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