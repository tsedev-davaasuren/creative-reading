"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isTaskBankOpen, setIsTaskBankOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Уран зохиол");
  const [bankFilterSubject, setBankFilterSubject] = useState("Бүх хичээл");
  const [imgError, setImgError] = useState(false);

  const [taskBank, setTaskBank] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveSuccessModal, setSaveSuccessModal] = useState<boolean>(false);
  const [expandedTaskIds, setExpandedTaskIds] = useState<number[]>([]);

  // 🚀 9Е ANGI-Д ИЛГЭЭХ STATE-ҮҮД
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [taskToAssign, setTaskToAssign] = useState<any | null>(null);
  const [targetClass, setTargetClass] = useState("9Е");
  const [deadline, setDeadline] = useState("");
  const [assignmentCode, setAssignmentCode] = useState("");
  const [teacherNote, setTeacherNote] = useState("");
  const [assignSuccessModal, setAssignSuccessModal] = useState(false);

  const classesList = ["9Е"];

  const subjectDefaults: { [key: string]: { title: string; story: string } } = {
    "Уран зохиол": {
      title: 'Ж.Лхагва "Арван долоотой байхад" өгүүлэг',
      story: `Манайх Цээлд, Бөөдэйн Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.

Бөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор тэмээ малдаа өөрөө л явна. Хааяа унагаа үлдээнэ гэж адуугаа тууж ирэхэд нь би уургынхаа хээрийг барьж мордоод хорь хүрэхгүй адууг нь хураан хөндөлсүүлж явахаар барих морио тэгэхээс тэгж адуунаас нь гарган элдээд сүүл дэрлэн дагах хэвтээ дэмтэй сайхан хээрийнхээ дөрөө зуран эргэх яг л тэр агшинд бөхийн цацаж, сүүлэндээ салхи татуулан зугатаах морины нарийн хоншоороор уургалан эргүүлээд үргэн давхисан адууныхаа хойноос янцгаан тэмүүлэх түүнийг эмнэг уургалсан мэт цухалзуураар нь эргүүлж Бөөдэйг хүлээж зогсоно.

Бөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн, мориныхоо нурууг нар харвахаас болгоомжлон салхи оруулж хэсэг сүүдэрлэн зогссоноо хазаараа мулталж инээсээр ирнэ.

Энэ бол миний арван долоон насанд хамгийн жаргалтай мөч байлаа. Гэвч энэ маань өглөөдөө үзэгдэх хөвчийн манан шиг байжээ.`
    },
    "Физик": {
      title: 'Физик: "Механик хөдөлгөөн ба кинетик энерги"',
      story: `Биеийн хөдөлгөөн ба түүний хурд, массын хамаарлыг механик энергиэр тодорхойлдог. Биеийн масс m, хурд v байх үед кинетик энерги нь Ek = (1/2)*m*v^2 томьёогоор бодогдоно.`
    },
    "Хими": {
      title: 'Хими: "Усны бүтэц ба химийн холбоос"',
      story: `Усны молекул (H2O) нь хоёр водород ба нэг кислородын атомоос тогтоно. Ковалент туйлшралтай холбоотой тул усны молекулуудын хооронд водородон холбоо үүсдэг.`
    },
    "Биологи": {
      title: 'Биологи: "Эсийн бүтээц ба фотосинтез"',
      story: `Ургамлын эс нь хлоропласт хэмээх эрхтэнцэртэй бөгөөд нарны гэрлийн энергийг ашиглан нүүрсхүчлийн хий болон уснаас глюкоз ба хүчилтөрөгч нийлэгжүүлдэг.`
    },
    "Түүх": {
      title: 'Түүх: "Их Монгол Улсын гадаад харилцаа ба өртөөний систем"',
      story: `Чингис хаан 1206 онд Их Монгол Улсыг байгуулсны дараа Өгэдэй хаан орон даяар Морин өртөөний сүлжээг засаж тохижуулжээ.`
    },
    "Газар зүй": {
      title: 'Газар зүй: "Монгол орны уур амьсгал ба усан сүлжээ"',
      story: `Монгол орон нь Евразийн эх газрын төвд оршдог тул эх газрын эрс тэс уур амьсгалтай.`
    }
  };

  const [title, setTitle] = useState(subjectDefaults["Уран зохиол"].title);
  const [storyText, setStoryText] = useState(subjectDefaults["Уран зохиол"].story);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<any[] | null>(null);

  useEffect(() => {
    const savedBank = localStorage.getItem("creative_reading_task_bank");
    if (savedBank) {
      try {
        setTaskBank(JSON.parse(savedBank));
      } catch (e) {
        console.error("Task bank load error:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("creative_reading_task_bank", JSON.stringify(taskBank));
    }
  }, [taskBank, isLoaded]);

  const toggleExpandTask = (id: number) => {
    setExpandedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectSubject = (sub: string) => {
    setSelectedSubject(sub);
    if (subjectDefaults[sub]) {
      setTitle(subjectDefaults[sub].title);
      setStoryText(subjectDefaults[sub].story);
    }
    setGeneratedTasks(null);
  };

  const subjects = ["Уран зохиол", "Хими", "Биологи", "Түүх", "Физик", "Газар зүй"];

  const generateDynamicTasksFromText = (sub: string, customTitle: string, customText: string) => {
    const rawSentences = customText.split(/[.!?\n]/).map((s) => s.trim()).filter((s) => s.length > 8);
    const s1 = rawSentences[0] || customText.slice(0, 60);
    const s2 = rawSentences[Math.floor(rawSentences.length / 4)] || rawSentences[0] || customText.slice(0, 80);
    const s3 = rawSentences[Math.floor(rawSentences.length / 2)] || rawSentences[0] || customText;
    const sLast = rawSentences[rawSentences.length - 1] || rawSentences[0] || customText;
    const cleanTitle = customTitle.trim() || `${sub} хичээлийн эх бичвэр`;

    return [
      {
        num: 1, form: "Сонгох тест", level: "Мэдээлэл олох, сэргээн санах", taskAction: "ABCD сонголтоос нэг хариулт сонгох", points: 1,
        question: `"${cleanTitle}" эх бичвэрийн агуулгатай тохирч буй гол мэдээлэл аль нь бэ?`,
        options: [`A. ${s1.slice(0, 55)}...`, `B. Эх бичвэрт дурдагдаагүй өөр сэдэв агуулсан.`, `C. Эх бичвэрийн гол утга нь эсрэг утгатай байна.`, `D. Дээрх хариултууд бүгд буруу байна.`],
        correctAnswer: `A. ${s1.slice(0, 55)}...`, rubric: "Зөв сонгосон бол 1 оноо, буруу сонгосон бол 0 оноо."
      },
      {
        num: 2, form: "Задгай даалгавар", level: "Мэдээлэл олох, сэргээн санах", taskAction: "Нэг өгүүлбэр олж бичих", points: 1,
        question: `Эх бичвэрээс гол мэдээллийг агуулсан НЭГ өгүүлбэрийг олж бичээрэй.`, correctAnswer: `"${s2}"`, rubric: "Зөв олсон бол 1 оноо, огт бичээгүй бол 0 оноо."
      },
      {
        num: 3, form: "Задгай даалгавар", level: "Задлан шинжлэх", taskAction: "1-2 өгүүлбэр бичих", points: 2,
        question: `"${cleanTitle}" эх бичвэрт гарч буй үйл явдал, онцлогийг 1-2 өгүүлбэрт багтаан задлан тайлбарлана уу.`, correctAnswer: `${s3.slice(0, 100)}... гэдэг нь тухайн сэдвийн онцлогийг тодорхойлж байна.`, rubric: "Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо."
      },
      {
        num: 4, form: "Задгай даалгавар", level: "Задлан шинжлэх", taskAction: "1-2 өгүүлбэр бичих", points: 2,
        question: `Эх бичвэрийн агуулга болон гол харилцан хамаарлыг 1-2 өгүүлбэрээр задлан тайлбарлаарай.`, correctAnswer: `Эх бичвэрт дурдсан баримтууд нь бие биенээ баталгаажуулж байна.`, rubric: "Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо."
      },
      {
        num: 5, form: "Задгай даалгавар", level: "Эргэцүүлэн дүгнэх", taskAction: "2-3 өгүүлбэр бичих", points: 3,
        question: `"${sLast.slice(0, 70)}..." гэсэн санааг өөрийн бодлоор шинэ санаа гарган 2-3 өгүүлбэрээр эргэцүүлэн дүгнээрэй.`, correctAnswer: `Энэхүү санаа нь өдөр тутмын амьдралд тохиолддог сургамжтай зүйл юм.`, rubric: "2-3 өгүүлбэрээр шинэ санаа гаргасан бол 3 оноо."
      },
      {
        num: 6, form: "Задгай даалгавар", level: "Эргэцүүлэн дүгнэх", taskAction: "2-3 өгүүлбэр бичих", points: 3,
        question: `"${cleanTitle}" эхийн сэдэвтэй холбон практик туршлагыг өөрийн бодлоор 2-3 өгүүлбэрээр эргэцүүлэн дүгнээрэй.`, correctAnswer: `Тухайн сэдвийн ач холбогдол нь хүний төлөвшилд эерэгээр нөлөөлдөг.`, rubric: "2-3 өгүүлбэрээр шинэ санаа гаргасан бол 3 оноо."
      }
    ];
  };

  const handleGenerateTasks = () => {
    if (!storyText.trim()) return alert("Эх бичвэрээ оруулна уу!");
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedTasks(generateDynamicTasksFromText(selectedSubject, title, storyText));
      setIsGenerating(false);
    }, 1000);
  };

  const handleSaveToTaskBank = () => {
    if (!generatedTasks || generatedTasks.length === 0) return alert("Эхлээд даалгавар боловсруулна уу!");

    const newBankItem = {
      id: Date.now(),
      subject: selectedSubject,
      title: title || `${selectedSubject} эх бичвэр`,
      storyText: storyText,
      tasks: generatedTasks,
      totalPoints: 12,
      createdDate: new Date().toLocaleDateString("mn-MN") + " " + new Date().toLocaleTimeString("mn-MN", { hour: '2-digit', minute: '2-digit' })
    };

    setTaskBank((prev) => [newBankItem, ...prev.filter((i) => !(i.subject === selectedSubject && i.title === newBankItem.title))]);
    setSaveSuccessModal(true);
  };

  // 🚀 9Е ANGI-Д ИЛГЭЭХ CLICK HANDLER
  const handleOpenAssignModal = (taskItem: any) => {
    setTaskToAssign(taskItem);
    setTargetClass("9Е"); // Шууд 9Е анги тохируулагдана
    const autoCode = `9E-${taskItem.subject.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setAssignmentCode(autoCode);
    
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    setDeadline(tmr.toISOString().slice(0, 16));

    setTeacherNote("9Е ангийн сурагчид даалгавраа анхааралтай уншиж, хугацаандаа амжиж гүйцэтгээрэй!");
    setIsAssignModalOpen(true);
  };

  // 🚀 9Е ANGI-Д ИЛГЭЭЖ LOCALSTORAGE-Д ХАДГАЛАХ
  const handleConfirmAssign = () => {
    if (!taskToAssign) return;

    const newAssignment = {
      id: Date.now(),
      assignmentCode: assignmentCode || `9E-CODE-${Date.now()}`,
      targetClass: "9Е",
      deadline: deadline,
      teacherNote: teacherNote,
      assignedDate: new Date().toLocaleString("mn-MN"),
      taskData: taskToAssign
    };

    const existingAssigned = localStorage.getItem("creative_reading_assigned_tasks");
    let assignedList: any[] = [];
    if (existingAssigned) {
      try {
        assignedList = JSON.parse(existingAssigned);
      } catch (e) {
        console.error(e);
      }
    }

    assignedList = [newAssignment, ...assignedList];
    localStorage.setItem("creative_reading_assigned_tasks", JSON.stringify(assignedList));

    setIsAssignModalOpen(false);
    setAssignSuccessModal(true);
  };

  const filteredTaskBank = bankFilterSubject === "Бүх хичээл" 
    ? taskBank 
    : taskBank.filter(t => t.subject === bankFilterSubject);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* HEADER ХЭСЭГ */}
      <header style={{
        maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#fffdf0", borderRadius: "16px", border: "1px solid #fde68a", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "12px", backgroundColor: "#ffffff", border: "2px solid #fcd34d", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="/project-logo.jpg" alt="Лого" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "17px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Бүтээлч уншлага-2 төсөл (9Е анги)</h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>Багшийн ажлын танхим</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button type="button" onClick={() => setIsBlueprintOpen(!isBlueprintOpen)} style={{ backgroundColor: "#fde68a", border: "1px solid #fcd34d", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
            📋 Блюпринт харах
          </button>
          <a href="/student" style={{ backgroundColor: "#059669", color: "#ffffff", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", textDecoration: "none" }}>
            👨‍🎓 Сурагчийн танхим руу шилжих ➔
          </a>
        </div>
      </header>

      {/* ШИНЭ БЛЮПРИНТ ЦОНХ */}
      {isBlueprintOpen && (
        <section style={{ maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#fffdf0", border: "1.5px solid #fcd34d", borderRadius: "14px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📋 Шинэ блюпринт ба рубрик (6 Даалгавар / 12 Оноо)</h3>
            <button type="button" onClick={() => setIsBlueprintOpen(false)} style={{ fontSize: "11px", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px 8px", cursor: "pointer" }}>Хаах ✕</button>
          </div>
          <p style={{ fontSize: "12px", color: "#334155" }}>1. Сонгох тест (1) | 2. Задгай-Мэдээлэл олох (1) | 3-4. Задгай-Задлан шинжлэх (4) | 5-6. Задгай-Эргэцүүлэн дүгнэх (6)</p>
        </section>
      )}

      {/* ҮНДСЭН АЖЛЫН ТАЛБАР (8:5 БА 8:3 ХАРЬЦАА) */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "5fr 3fr", gap: "16px" }}>
        
        {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР (8:5) */}
        <section style={{ backgroundColor: "#fffdf0", borderRadius: "16px", border: "1.5px solid #fde68a", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "580px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📖 Эх бичвэр (8:5)</h3>
              <button type="button" onClick={() => setIsTaskBankOpen(true)} style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>📂 Даалгаврын сан ({taskBank.length}) ➔</button>
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Хичээл сонгох:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {subjects.map((sub) => (
                  <button key={sub} type="button" onClick={() => handleSelectSubject(sub)} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", border: "none", cursor: "pointer", backgroundColor: selectedSubject === sub ? "#0284c7" : "#38bdf8", color: "#ffffff" }}>{sub}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Эх бичвэрийн гарчиг</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Гарчиг..." style={{ width: "100%", padding: "10px", border: "1.5px solid #fde68a", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", backgroundColor: "#ffffff" }} />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Унших эх бичвэр (Бүрэн эхээр)</label>
              <textarea value={storyText} onChange={(e) => setStoryText(e.target.value)} rows={12} placeholder="Эх бичвэр..." style={{ width: "100%", minHeight: "280px", padding: "12px", border: "1.5px solid #fde68a", borderRadius: "8px", fontSize: "14.5px", lineHeight: "1.7", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", whiteSpace: "pre-wrap", wordBreak: "break-word", backgroundColor: "#ffffff" }} />
            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "14px" }}>
            <button type="button" onClick={handleGenerateTasks} disabled={isGenerating} style={{ width: "100%", backgroundColor: isGenerating ? "#93c5fd" : "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
              {isGenerating ? `⏳ Даалгавар боловсруулж байна...` : `⚡ ${selectedSubject} хичээлийн даалгавар боловсруулах`}
            </button>
          </div>
        </section>

        {/* БАРУУН ТАЛ: АСУУЛТ ДААЛГАВАР (8:3) */}
        <section style={{ backgroundColor: "#fffdf0", borderRadius: "16px", border: "1.5px solid #fde68a", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "580px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📝 Асуулт даалгавар (8:3)</h3>
              <button type="button" onClick={() => setIsAnalyticsOpen(true)} style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>📊 Статистик ➔</button>
            </div>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fde68a", padding: "14px", height: "420px", overflowY: "auto" }}>
              {isGenerating ? (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>⚡</div>
                  <p style={{ fontWeight: "bold" }}>Боловсруулж байна...</p>
                </div>
              ) : generatedTasks && generatedTasks.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {generatedTasks.map((t) => (
                    <div key={t.num} style={{ border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "12px", backgroundColor: "#f8fafc" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontWeight: "bold", fontSize: "13px", color: "#0284c7" }}>Даалгавар {t.num} ({t.form})</span>
                        <span style={{ fontSize: "11px", fontWeight: "bold", backgroundColor: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "4px" }}>{t.points} оноо</span>
                      </div>
                      <p style={{ fontSize: "13px", fontWeight: "bold", margin: "0 0 6px 0" }}>{t.question}</p>
                      <p style={{ fontSize: "11.5px", color: "#059669", margin: "0 0 4px 0", backgroundColor: "#f0fdf4", padding: "4px 8px", borderRadius: "4px" }}>💡 Зөв хариулт: {t.correctAnswer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#64748b" }}>
                  <p style={{ fontWeight: "bold" }}>Даалгавар боловсруулаагүй байна.</p>
                  <p style={{ fontSize: "12px" }}>"⚡ Даалгавар боловсруулах" товчийг дараарай.</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "14px" }}>
            <button type="button" onClick={handleSaveToTaskBank} style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
              💾 Даалгаврыг баталж, санд илгээх
            </button>
          </div>
        </section>

      </div>

      {/* ДААЛГАВРЫН САНГИЙН ЦОНХ (9Е АНГИД ИЛГЭЭХ ТОВЧТОЙ) */}
      {isTaskBankOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", width: "100%", maxWidth: "1200px", height: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden" }}>
            
            <div style={{ backgroundColor: "#fffdf0", padding: "16px 20px", borderBottom: "1.5px solid #fde68a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📂 Даалгаврын сан</h2>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>Нийт хадгалагдсан: <strong>{taskBank.length}</strong> багц даалгавар</p>
              </div>
              <button type="button" onClick={() => setIsTaskBankOpen(false)} style={{ backgroundColor: "#e2e8f0", color: "#334155", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Хаах ✕</button>
            </div>

            <div style={{ padding: "20px", overflowY: "auto", flex: 1, backgroundColor: "#f8fafc" }}>
              {taskBank.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                  <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#334155" }}>Даалгаврын санд дата одоогоор байхгүй байна.</h4>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {filteredTaskBank.map((item) => {
                    const isExpanded = expandedTaskIds.includes(item.id);

                    return (
                      <div key={item.id} style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: isExpanded ? "2px solid #0284c7" : "1.5px solid #cbd5e1", overflow: "hidden" }}>
                        <div onClick={() => toggleExpandTask(item.id)} style={{ padding: "14px 18px", backgroundColor: isExpanded ? "#f0f9ff" : "#ffffff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ backgroundColor: "#0284c7", color: "#ffffff", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" }}>{item.subject}</span>
                            <h4 style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>{item.title}</h4>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {/* 🚀 9Е АНГИД ИЛГЭЭХ ТОВЧ */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenAssignModal(item);
                              }}
                              style={{
                                backgroundColor: "#059669",
                                color: "#ffffff",
                                border: "none",
                                padding: "6px 14px",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              🚀 9Е ангид илгээх
                            </button>

                            <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedSubject(item.subject); setTitle(item.title); setStoryText(item.storyText); setGeneratedTasks(item.tasks); setIsTaskBankOpen(false); }} style={{ backgroundColor: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>📥 Үндсэн ажилд ачаалах</button>
                            <span style={{ fontSize: "13px", fontWeight: "bold", color: "#0284c7" }}>{isExpanded ? "▲ Хураах" : "▼ Дэлгэрэнгүй"}</span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{ padding: "18px", borderTop: "1px solid #bae6fd", backgroundColor: "#f8fafc", display: "grid", gridTemplateColumns: "5fr 3fr", gap: "16px" }}>
                            <div style={{ backgroundColor: "#fffdf0", padding: "16px", borderRadius: "12px", border: "1.5px solid #fde68a", fontSize: "14px", lineHeight: "1.8", whiteSpace: "pre-wrap", maxHeight: "500px", overflowY: "auto" }}>
                              <h5 style={{ color: "#92400e", margin: "0 0 10px 0", fontSize: "15px", fontWeight: "bold" }}>📖 {item.title}</h5>
                              {item.storyText}
                            </div>
                            <div style={{ backgroundColor: "#fffdf0", padding: "16px", borderRadius: "12px", border: "1.5px solid #fde68a", maxHeight: "500px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                              <h5 style={{ fontSize: "14.5px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📝 Даалгаврууд ({item.tasks.length})</h5>
                              {item.tasks.map((t: any) => (
                                <div key={t.num} style={{ border: "1px solid #cbd5e1", padding: "10px", borderRadius: "8px", backgroundColor: "#ffffff" }}>
                                  <p style={{ fontWeight: "bold", fontSize: "13px", margin: "0 0 4px 0" }}>{t.num}. {t.question}</p>
                                  <p style={{ fontSize: "11.5px", color: "#059669", margin: 0 }}>💡 Зөв хариулт: {t.correctAnswer}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 🚀 9Е ANGI-Д ИЛГЭЭХ ЦОНХ */}
      {isAssignModalOpen && taskToAssign && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "18px", width: "100%", maxWidth: "520px", padding: "24px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" }}>
            
            <div style={{ borderBottom: "1.5px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "17px", fontWeight: "bold", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🚀</span> 9Е ангид даалгавар илгээх
              </h3>
              <button type="button" onClick={() => setIsAssignModalOpen(false)} style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ backgroundColor: "#f0f9ff", padding: "10px 14px", borderRadius: "10px", border: "1px solid #bae6fd" }}>
                <p style={{ fontSize: "12px", color: "#0369a1", margin: 0, fontWeight: "bold" }}>Сонгосон даалгавар:</p>
                <p style={{ fontSize: "14px", color: "#0f172a", margin: "2px 0 0 0", fontWeight: "bold" }}>[{taskToAssign.subject}] {taskToAssign.title}</p>
              </div>

              {/* Хүлээн авах анги (Зөвхөн 9Е) */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Хүлээн авах анги:</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    style={{
                      padding: "8px 20px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      border: "none",
                      backgroundColor: "#059669",
                      color: "#ffffff"
                    }}
                  >
                    🏫 9Е анги
                  </button>
                </div>
              </div>

              {/* Дуусах хугацаа */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Дуусах хугацаа (Deadline):</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              {/* Даалгаврын код */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Даалгаврын код (9Е ангийн сурагчдад өгөх):</label>
                <input
                  type="text"
                  value={assignmentCode}
                  onChange={(e) => setAssignmentCode(e.target.value)}
                  placeholder="Жишээ: 9E-LIT-101"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13px", fontWeight: "bold", color: "#0284c7", boxSizing: "border-box" }}
                />
              </div>

              {/* Зааварчилгаа */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>9Е ангийн сурагчдад зориулсан санамж:</label>
                <textarea
                  value={teacherNote}
                  onChange={(e) => setTeacherNote(e.target.value)}
                  rows={2}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "12.5px", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={handleConfirmAssign}
                style={{ flex: 1, backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "13.5px", cursor: "pointer" }}
              >
                🚀 9Е ангид баталж илгээх
              </button>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                style={{ backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", padding: "12px 18px", borderRadius: "10px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
              >
                Цуцлах
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ИЛГЭЭСНИЙ ДАРААХ MODAL */}
      {assignSuccessModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", maxWidth: "420px", width: "90%", textAlign: "center", border: "2px solid #10b981" }}>
            <div style={{ fontSize: "42px", marginBottom: "10px" }}>📨</div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#065f46", margin: "0 0 8px 0" }}>
              9Е ангид амжилттай илгээгдлээ!
            </h3>
            <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5", margin: "0 0 16px 0" }}>
              9Е ангийн сурагчид <strong>"{assignmentCode}"</strong> кодоор эсвэл Сурагчийн танхим руу шууд орж даалгавраа ажиллах боломжтой.
            </p>
            <button
              type="button"
              onClick={() => {
                setAssignSuccessModal(false);
                setIsTaskBankOpen(false);
              }}
              style={{ width: "100%", backgroundColor: "#0284c7", color: "#ffffff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
            >
              Ойлголоо
            </button>
          </div>
        </div>
      )}

      {/* БАТАЛГААЖУУЛАХ MODAL */}
      {saveSuccessModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", maxWidth: "440px", width: "90%", textAlign: "center", border: "2px solid #10b981" }}>
            <div style={{ fontSize: "42px", marginBottom: "10px" }}>🎉</div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#065f46", margin: "0 0 8px 0" }}>Амжилттай баталгаажлаа!</h3>
            <p style={{ fontSize: "13.5px", color: "#334155", margin: "0 0 20px 0" }}>"{selectedSubject}" хичээлийн 6 даалгавар (12 оноо) санд хадгалагдлаа.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={() => { setSaveSuccessModal(false); setIsTaskBankOpen(true); }} style={{ flex: 1, backgroundColor: "#0284c7", color: "#ffffff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>📂 Даалгаврын сан руу очих</button>
              <button type="button" onClick={() => setSaveSuccessModal(false)} style={{ flex: 1, backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", padding: "10px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>Хаах</button>
            </div>
          </div>
        </div>
      )}

      {/* ХЯНАЛТ ШИНЖИЛГЭЭНИЙ ЦОНХ */}
      {isAnalyticsOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", width: "100%", maxWidth: "800px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📊 9Е ангийн статистик хяналт</h3>
              <button type="button" onClick={() => setIsAnalyticsOpen(false)} style={{ backgroundColor: "#e2e8f0", color: "#334155", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Хаах ✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div style={{ backgroundColor: "#e0f2fe", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#0369a1", fontWeight: "bold", margin: 0 }}>Даалгаврын сан</p>
                <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#0284c7", margin: "4px 0 0 0" }}>{taskBank.length} / 30</h2>
              </div>
              <div style={{ backgroundColor: "#dcfce7", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#15803d", fontWeight: "bold", margin: 0 }}>Блюпринт биелэлт</p>
                <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#16a34a", margin: "4px 0 0 0" }}>100%</h2>
              </div>
              <div style={{ backgroundColor: "#fef3c7", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#a16207", fontWeight: "bold", margin: 0 }}>Хамрагдах анги</p>
                <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#d97706", margin: "4px 0 0 0" }}>9Е анги</h2>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}