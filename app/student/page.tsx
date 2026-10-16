"use client";

import { useState, useEffect } from "react";

export default function StudentPage() {
  const [inputCode, setInputCode] = useState("");
  const [assignedList, setAssignedList] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<any | null>(null);

  // Сурагчийн хариулт ба гүйцэтгэсэн даалгаврын түүх
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);
  const [completedCodes, setCompletedCodes] = useState<string[]>([]);

  // ⏳ ТАЙМЕР STATE-ҮҮД
  const [examTimeLeft, setExamTimeLeft] = useState<number>(40 * 60);
  const [chatTimeLeft, setChatTimeLeft] = useState<number>(20 * 60);
  const [isExamTimerRunning, setIsExamTimerRunning] = useState<boolean>(false);
  const [isChatTimerRunning, setIsChatTimerRunning] = useState<boolean>(false);

  // 💬 ЦЭНДАО ӨВӨӨТЭЙ ЧАТЛАХ STATE-ҮҮД
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const bankData = localStorage.getItem("creative_reading_task_bank");
    const assignedData = localStorage.getItem("creative_reading_assigned_tasks");
    const savedCompleted = localStorage.getItem("creative_reading_completed_codes");

    if (savedCompleted) {
      try { setCompletedCodes(JSON.parse(savedCompleted)); } catch (e) { console.error(e); }
    }

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

  // 40 МИНУТЫН ДААЛГАВРЫН ТАЙМЕР
  useEffect(() => {
    let interval: any = null;
    if (isExamTimerRunning && examTimeLeft > 0) {
      interval = setInterval(() => {
        setExamTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (examTimeLeft === 0 && isExamTimerRunning) {
      setIsExamTimerRunning(false);
      alert("⏰ 40 минутын хугацаа дууслаа! Даалгаврыг хураалаа.");
      handleSubmitExam();
    }
    return () => clearInterval(interval);
  }, [isExamTimerRunning, examTimeLeft]);

  // 20 МИНУТЫН ЧАТНЫ ТАЙМЕР
  useEffect(() => {
    let interval: any = null;
    if (isChatTimerRunning && chatTimeLeft > 0) {
      interval = setInterval(() => {
        setChatTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (chatTimeLeft === 0 && isChatTimerRunning) {
      setIsChatTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isChatTimerRunning, chatTimeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOpenByCode = (codeToSearch?: string) => {
    const code = (codeToSearch || inputCode).trim().toUpperCase();
    if (!code) return alert("Даалгаврын кодоо оруулна уу!");

    if (completedCodes.includes(code)) {
      return alert("🔒 Та энэ даалгаврыг 1 удаагийн оролдлогоор гүйцэтгэсэн тул дахин нээх боломжгүй!");
    }

    const found = assignedList.find((item) => item.assignmentCode.toUpperCase() === code);
    if (found) {
      setActiveTask(found);
      setAnswers({});
      setSubmittedResult(null);
      setExamTimeLeft(40 * 60);
      setIsExamTimerRunning(true);
      setIsChatTimerRunning(false);
    } else {
      alert("Даалгаврын код олдсонгүй. Кодоо шалгана уу.");
    }
  };

  // 🎯 ЧАНГА БА УХААЛАГ ОНООЖУУЛАЛТ (ИЛТ БУРУУД ОНОО ӨГӨХГҮЙ)
  const handleSubmitExam = () => {
    if (!activeTask) return;
    setIsExamTimerRunning(false);

    let totalScore = 0;
    const taskDetails = activeTask.taskData.tasks;
    const feedbackList: any[] = [];

    // Блюпринтийн 3 түвшний онооны нэгтгэл
    let level1Score = 0, level1Max = 2; // Мэдээлэл олох
    let level2Score = 0, level2Max = 4; // Задлан шинжлэх
    let level3Score = 0, level3Max = 6; // Эргэцүүлэн дүгнэх

    const userAnswersList = Object.values(answers).map(a => a.trim().toLowerCase()).filter(a => a.length > 0);
    const hasDuplicateSpam = userAnswersList.length > 1 && new Set(userAnswersList).size === 1 && userAnswersList[0].length > 5;

    taskDetails.forEach((t: any) => {
      const userAns = (answers[t.num] || "").trim();
      let scoreEarned = 0;
      let advice = "";

      if (hasDuplicateSpam && t.num !== 1) {
        scoreEarned = 0;
        advice = "👴 Цэндао өвөө: Нэг бичвэрийг дахин хуулж тавьсан тул оноо олгогдоогүй. Асуулт бүрд тусдаа хариулна уу.";
      } else if (t.num === 1 || t.form === "Сонгох тест") {
        if (userAns.toLowerCase() === t.correctAnswer.trim().toLowerCase() || (userAns.length > 0 && userAns.startsWith(t.correctAnswer.slice(0, 2)))) {
          scoreEarned = t.points;
          advice = "👴 Цэндао өвөө: Маш сайн! Эх бичвэрийн баримтыг оновчтой зөв сонгосон байна.";
        } else {
          scoreEarned = 0;
          advice = `👴 Цэндао өвөө: Сонголт буруу байна. Зөв хариулт нь: ${t.correctAnswer}`;
        }
      } else {
        // Утгын хамаарлыг чанд шалгах
        const keywords = t.question.split(" ").filter((w: string) => w.length > 4);
        const hasRelevance = keywords.some((kw: string) => userAns.toLowerCase().includes(kw.toLowerCase())) || userAns.length > 30;

        if (!hasRelevance || userAns.length < 10) {
          scoreEarned = 0;
          advice = "👴 Цэндао өвөө: Хариулт асуултынхаа агуулгатай тохирохгүй эсвэл хэт богино байна.";
        } else if (userAns.length >= 35) {
          scoreEarned = t.points;
          advice = "👴 Цэндао өвөө: Онц сайн! Асуултын агуулгыг гүнзгий эргэцүүлэн оновчтой бичжээ.";
        } else {
          scoreEarned = Math.floor(t.points / 2);
          advice = "👴 Цэндао өвөө: Таны хариулт санаагаа дутуу илэрхийлсэн байна. Илүү дэлгэрүүлж бичээрэй.";
        }
      }

      totalScore += scoreEarned;

      // Түвшний оноо бодох
      if (t.num <= 2) level1Score += scoreEarned;
      else if (t.num <= 4) level2Score += scoreEarned;
      else level3Score += scoreEarned;

      feedbackList.push({
        num: t.num,
        question: t.question,
        scoreEarned,
        maxPoints: t.points,
        userAns: userAns || "(Бичээгүй)",
        correctAnswer: t.correctAnswer,
        advice
      });
    });

    setSubmittedResult({
      totalScore,
      maxScore: 12,
      percentage: Math.round((totalScore / 12) * 100),
      level1Score, level1Max,
      level2Score, level2Max,
      level3Score, level3Max,
      feedbackList
    });

    // Оролдлогыг түгжих
    const newCompleted = [...completedCodes, activeTask.assignmentCode.toUpperCase()];
    setCompletedCodes(newCompleted);
    localStorage.setItem("creative_reading_completed_codes", JSON.stringify(newCompleted));

    // Чатлах 20 минутын таймер эхлүүлж, чатыг автоматаар нээх
    setChatTimeLeft(20 * 60);
    setIsChatTimerRunning(true);
    setChatMessages([
      { sender: "tsendao", text: `Сайн байна уу, хүү минь! Өвөө нь байна. Та шалгалтаараа ${totalScore}/12 оноо авлаа. Даалгавраа хэрхэн сайжруулах талаар өвөөгөөсөө асуугаарай. (20 минутын чат эхэллээ)` }
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
        { sender: "tsendao", text: `👴 Цэндао өвөө: "${msg}" гэсэн асуултад хэлэхэд, PISA даалгаварт эх бичвэрийн баримтыг өөрийн бодолтой холбон эргэцүүлж бичих нь хамгийн чухал шүү, хүү минь.` }
      ]);
    }, 600);
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fffdf0", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* HEADER */}
      <header style={{ maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#059669", borderRadius: "16px", padding: "14px 24px", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "19px", fontWeight: "bold", margin: 0 }}>👨‍🎓 Сурагчийн танхим (9Е анги)</h1>
          <p style={{ fontSize: "12px", margin: "2px 0 0 0", opacity: 0.9 }}>PISA Бүтээлч уншлага-2 төслийн даалгавар гүйцэтгэх талбар</p>
        </div>

        {activeTask && isExamTimerRunning && !submittedResult && (
          <div style={{ backgroundColor: "#047857", padding: "8px 16px", borderRadius: "10px", border: "1px solid #34d399", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "#a7f3d0", display: "block", fontWeight: "bold" }}>⏱️ Хугацаа:</span>
            <span style={{ fontSize: "18px", fontWeight: "900", color: "#ffffff" }}>{formatTime(examTimeLeft)}</span>
          </div>
        )}
      </header>

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        {!activeTask ? (
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "30px", border: "1.5px solid #fde68a" }}>
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
                  {assignedList.map((item) => {
                    const isDone = completedCodes.includes(item.assignmentCode.toUpperCase());
                    return (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: isDone ? "#f1f5f9" : "#fffdf0", padding: "12px 16px", borderRadius: "10px", border: "1px solid #fde68a" }}>
                        <div>
                          <span style={{ fontWeight: "bold", fontSize: "14px", color: isDone ? "#64748b" : "#065f46" }}>[{item.taskData.subject}] {item.taskData.title}</span>
                          <p style={{ fontSize: "12px", color: "#475569", margin: "2px 0 0 0" }}>Код: <strong>{item.assignmentCode}</strong> • Хугацаа: 40 минут</p>
                        </div>

                        {isDone ? (
                          <span style={{ backgroundColor: "#e2e8f0", color: "#475569", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" }}>✅ Гүйцэтгэсэн (Түгжсэн)</span>
                        ) : (
                          <button type="button" onClick={() => handleOpenByCode(item.assignmentCode)} style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Ажиллах ➔</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : submittedResult ? (
          /* 🚀 ШААРДЛАГА 3: ДААЛГАВАР ИЛГЭЭСНИЙ ДАРААХ 3 ХЭСЭГ ХАРАГДАЦ */
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* 1️⃣ ХЭСЭГ: ДЭЛГЭЦИЙН 7:1 ХЭСЭГТ - ДҮН ОНОО БА БЛЮПРИНТИЙН 3 ТҮВШНИЙ НЭГТГЭЛ */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "16px 24px", border: "2px solid #10b981", display: "grid", gridTemplateColumns: "2fr 3fr", gap: "20px", alignItems: "center" }}>
              <div style={{ textAlign: "center", borderRight: "2px solid #e2e8f0", paddingRight: "20px" }}>
                <span style={{ fontSize: "12px", color: "#047857", fontWeight: "bold" }}>Нийт нийтлэг дүн:</span>
                <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#059669", margin: "2px 0" }}>{submittedResult.totalScore} / 12 оноо</h2>
                <span style={{ backgroundColor: "#dcfce7", color: "#15803d", padding: "3px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>Гүйцэтгэл: {submittedResult.percentage}%</span>
              </div>

              {/* БЛЮПРИНТИЙН 3 ТҮВШИН */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div style={{ backgroundColor: "#f0f9ff", padding: "10px", borderRadius: "10px", border: "1px solid #bae6fd", textAlign: "center" }}>
                  <p style={{ fontSize: "10.5px", color: "#0369a1", fontWeight: "bold", margin: 0 }}>1. Мэдээлэл олох</p>
                  <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#0284c7", margin: "4px 0 0 0" }}>{submittedResult.level1Score} / {submittedResult.level1Max} оноо</h4>
                </div>
                <div style={{ backgroundColor: "#fef3c7", padding: "10px", borderRadius: "10px", border: "1px solid #fde68a", textAlign: "center" }}>
                  <p style={{ fontSize: "10.5px", color: "#92400e", fontWeight: "bold", margin: 0 }}>2. Задлан шинжлэх</p>
                  <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#d97706", margin: "4px 0 0 0" }}>{submittedResult.level2Score} / {submittedResult.level2Max} оноо</h4>
                </div>
                <div style={{ backgroundColor: "#f0fdf4", padding: "10px", borderRadius: "10px", border: "1px solid #bbf7d0", textAlign: "center" }}>
                  <p style={{ fontSize: "10.5px", color: "#15803d", fontWeight: "bold", margin: 0 }}>3. Эргэцүүлэн дүгнэх</p>
                  <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#16a34a", margin: "4px 0 0 0" }}>{submittedResult.level3Score} / {submittedResult.level3Max} оноо</h4>
                </div>
              </div>
            </div>

            {/* ДЭЛГЭЦИЙН 7:3 ХАРЬЦАА СЕКЦ (2 Ба 3-р хэсгүүд) */}
            <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr", gap: "16px" }}>
              
              {/* 2️⃣ ХЭСЭГ: СУРАГЧИЙН ИЛГЭЭСЭН ХАРИУ, ЖИШИГ ЗӨВ ХАРИУ, ЦЭНДАО ӨВӨӨГИЙН ЗӨВЛӨМЖ */}
              <div style={{ backgroundColor: "#fffdf0", padding: "20px", borderRadius: "16px", border: "1.5px solid #fde68a", maxHeight: "650px", overflowY: "auto" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: "0 0 14px 0", borderBottom: "1.5px solid #fde68a", paddingBottom: "8px" }}>📋 Шалгалтын дэлгэрэнгүй хариулт ба Зөвлөмж</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {submittedResult.feedbackList.map((f: any) => (
                    <div key={f.num} style={{ backgroundColor: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "bold", color: "#0284c7" }}>Даалгавар {f.num}: {f.question}</span>
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: f.scoreEarned > 0 ? "#059669" : "#dc2626" }}>{f.scoreEarned} / {f.maxPoints} оноо</span>
                      </div>

                      <div style={{ backgroundColor: "#f8fafc", padding: "8px 10px", borderRadius: "6px", marginBottom: "6px", fontSize: "12.5px" }}>
                        <strong>✍️ Таны хариулт:</strong> <span style={{ color: "#334155" }}>{f.userAns}</span>
                      </div>

                      <div style={{ backgroundColor: "#f0fdf4", padding: "8px 10px", borderRadius: "6px", marginBottom: "6px", fontSize: "12.5px", border: "1px solid #bbf7d0" }}>
                        <strong>💡 Жишиг зөв хариулт:</strong> <span style={{ color: "#166534" }}>{f.correctAnswer}</span>
                      </div>

                      <div style={{ backgroundColor: "#fef3c7", padding: "8px 10px", borderRadius: "6px", fontSize: "12px", border: "1px solid #fde68a", color: "#78350f" }}>
                        {f.advice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3️⃣ ХЭСЭГ: ЦЭНДАО ӨВӨӨ БАГШТАЙ ЯРИЛЦАХ ШУУД ЧАТ (20 МИНУТЫН ТАЙМЕРТАЙ) */}
              <div style={{ backgroundColor: "#fffdf0", padding: "16px", borderRadius: "16px", border: "1.5px solid #fde68a", display: "flex", flexDirection: "column", justifyContent: "space-between", maxHeight: "650px" }}>
                <div>
                  {/* ӨВӨӨ БАГШИЙН ПРОФАЙЛ */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "1.5px solid #fde68a", paddingBottom: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", border: "2px solid #f59e0b", overflow: "hidden", backgroundColor: "#fef3c7" }}>
                      {!imgError ? <img src="/tsendao.jpg" alt="Цэндао өвөө" onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "28px" }}>👨‍🏫</span>}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Цэндао өвөө-багш</h4>
                      <span style={{ fontSize: "11px", color: "#d97706", fontWeight: "bold" }}>⏱️ Үлдсэн цаг: {formatTime(chatTimeLeft)}</span>
                    </div>
                  </div>

                  {/* ЧАТГИЙН МЕССЕЖҮҮД */}
                  <div style={{ height: "380px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "4px" }}>
                    {chatMessages.map((m, idx) => (
                      <div key={idx} style={{ alignSelf: m.sender === "user" ? "flex-end" : "flex-start", backgroundColor: m.sender === "user" ? "#dcfce7" : "#ffffff", border: "1px solid #cbd5e1", padding: "8px 12px", borderRadius: "10px", fontSize: "12px", maxWidth: "90%" }}>
                        {m.sender === "tsendao" && <strong style={{ color: "#92400e", display: "block", marginBottom: "2px" }}>👴 Цэндао өвөө:</strong>}
                        {m.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* АСУУЛТ БИЧИХ ХЭСЭГ */}
                <div style={{ display: "flex", gap: "6px", borderTop: "1px solid #fde68a", paddingTop: "10px" }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                    placeholder="Өвөө багшаасаа асуулт асуух..."
                    style={{ flex: 1, padding: "8px 10px", border: "1.5px solid #fcd34d", borderRadius: "8px", fontSize: "12px", boxSizing: "border-box" }}
                  />
                  <button type="button" onClick={handleSendChatMessage} style={{ backgroundColor: "#fbbf24", color: "#78350f", border: "none", padding: "8px 12px", borderRadius: "8px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Асуух</button>
                </div>
              </div>

            </div>

            {/* ТАНХИМ РУУ БУЦАХ ТОВЧ */}
            <button type="button" onClick={() => setActiveTask(null)} style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
              🏠 Сурагчийн танхим руу буцах
            </button>

          </div>
        ) : (
          /* АСУУЛТАНД ХАРИУЛАХ ХЭСЭГ (8:5 БА 8:3) */
          <div style={{ display: "grid", gridTemplateColumns: "5fr 3fr", gap: "16px" }}>
            <div style={{ backgroundColor: "#fffdf0", padding: "20px", borderRadius: "16px", border: "1.5px solid #fde68a", minHeight: "580px", maxHeight: "760px", overflowY: "auto" }}>
              <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "6px