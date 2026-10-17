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

  // ✏️ ДААЛГАВАР ЗАСАХ STATE-ҮҮД
  const [editingTaskNum, setEditingTaskNum] = useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editOptions, setEditOptions] = useState<string[]>(["", "", "", ""]);
  const [editCorrectAnswerText, setEditCorrectAnswerText] = useState("");

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
      story: `Ургамлын эс нь хлоропласт хэмээх эрхтэнцэртэй бөгөөд нарны гэрлийн энергийг ашиглан нүүрсхүчлийн хий (CO2) болон уснаас (H2O) глюкоз (C6H12O6) ба хүчилтөрөгч (O2) нийлэгжүүлдэг.`
    },
    "Түүх": {
      title: 'Түүх: "Их Монгол Улсын гадаад харилцаа ба өртөөний систем"',
      story: `Чингис хаан 1206 онд Их Монгол Улсыг байгуулсны дараа Өгэдэй хаан орон даяар Морин өртөөний сүлжээг засаж тохижуулжээ.`
    },
    "Газар зүй": {
      title: 'Газар зүй: "Монгол орны уур амьсгал ба усан сүлжээ"',
      story: `Монгол орон нь Евразийн эх газрын төвд оршдог тул эх газрын эрс тэс уур амьсгалтай. Жилийн ба хоногийн температурын свеч ихтэй, тунадасны хэмжээ бага.`
    }
  };

  const [title, setTitle] = useState(subjectDefaults["Уран зохиол"].title);
  const [storyText, setStoryText] = useState(subjectDefaults["Уран зохиол"].story);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<any[] | null>(null);

  useEffect(() => {
    const savedBank = localStorage.getItem("creative_reading_task_bank");
    if (savedBank) {
      try { setTaskBank(JSON.parse(savedBank)); } catch (e) { console.error(e); }
    }
    const savedSession = localStorage.getItem("creative_reading_active_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.selectedSubject) setSelectedSubject(session.selectedSubject);
        if (session.title !== undefined) setTitle(session.title);
        if (session.storyText !== undefined) setStoryText(session.storyText);
        if (session.generatedTasks !== undefined) setGeneratedTasks(session.generatedTasks);
      } catch (e) { console.error(e); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const session = { selectedSubject, title, storyText, generatedTasks };
      localStorage.setItem("creative_reading_active_session", JSON.stringify(session));
    }
  }, [selectedSubject, title, storyText, generatedTasks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("creative_reading_task_bank", JSON.stringify(taskBank));
    }
  }, [taskBank, isLoaded]);

  const toggleExpandTask = (id: number) => {
    setExpandedTaskIds((prev) => prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]);
  };

  const handleSelectSubject = (sub: string) => {
    setSelectedSubject(sub);
    if (subjectDefaults[sub]) {
      setTitle(subjectDefaults[sub].title);
      setStoryText(subjectDefaults[sub].story);
    }
    setGeneratedTasks(null);
  };

  const handleDeleteTaskFromBank = (taskId: number) => {
    if (confirm("Та энэ даалгаврыг сангаас болон сурагчдаас устгахдаа итгэлтэй байна уу?")) {
      const taskToDelete = taskBank.find((t) => t.id === taskId);
      
      setTaskBank((prev) => prev.filter((item) => item.id !== taskId));

      if (taskToDelete) {
        const assignedData = localStorage.getItem("creative_reading_assigned_tasks");
        if (assignedData) {
          try {
            const list = JSON.parse(assignedData);
            const filtered = list.filter((a: any) => a.taskData?.id !== taskId && a.taskData?.title !== taskToDelete.title);
            localStorage.setItem("creative_reading_assigned_tasks", JSON.stringify(filtered));
          } catch (e) { console.error(e); }
        }
      }
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bagsh",
      text: "Сайн байна уу! Би 'Бүтээлч уншлага-2' төслийн AI Ментор Цэндао багш байна. 9Е ангид болон 6 хичээлд зориулан PISA даалгавар боловсруулан засахад туслахад бэлэн байна."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const subjects = ["Уран зохиол", "Хими", "Биологи", "Түүх", "Физик", "Газар зүй"];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userQuery = inputText.trim();
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: userQuery }]);
    setInputText("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bagsh", text: `Багш аа, ${selectedSubject} хичээлийн даалгаварт засалт хийх эсвэл шинээр боловсруулахад би бэлэн.` }
      ]);
    }, 600);
  };

  const generateDynamicTasksFromText = (sub: string, customTitle: string, customText: string) => {
    const rawSentences = customText.split(/[.!?\n]/).map((s) => s.trim()).filter((s) => s.length > 8);
    const s1 = rawSentences[0] || customText.slice(0, 60);
    const s2 = rawSentences[Math.floor(rawSentences.length / 4)] || rawSentences[0] || customText.slice(0, 80);
    const s3 = rawSentences[Math.floor(rawSentences.length / 2)] || rawSentences[0] || customText;
    const sLast = rawSentences[rawSentences.length - 1] || rawSentences[0] || customText;
    const cleanTitle = customTitle.trim() || `${sub} хичээлийн эх бичвэр`;

    return [
      {
        num: 1,
        form: "Сонгох тест",
        level: "Мэдээлэл олох, сэргээн санах",
        taskAction: "ABCD сонголтоос нэг хариулт сонгох",
        points: 1,
        question: `"${cleanTitle}" эх бичвэрийн агуулгатай тохирч буй гол баримтыг сонгоно уу.`,
        options: [
          `A. ${s1.slice(0, 45)}...`,
          `B. Эх бичвэрт дурдагдаагүй өөр сэдэв агуулсан.`,
          `C. Эх бичвэрийн утга санаа эсрэгээрээ илэрхийлэгдсэн.`,
          `D. Дээрх хариултууд бүгд буруу байна.`
        ],
        correctAnswer: `A. ${s1.slice(0, 45)}...`,
        rubric: "Зөв сонгосон бол 1 оноо, буруу сонгосон бол 0 оноо"
      },
      {
        num: 2,
        form: "Задгай даалгавар",
        level: "Мэдээлэл олох, сэргээн санах",
        taskAction: "Нэг өгүүлбэр олж бичих",
        points: 1,
        question: `Эх бичвэрээс тухайн сэдвийн гол утга санааг агуулсан НЭГ өгүүлбэрийг олж бичээрэй.`,
        correctAnswer: `"${s2}"`,
        rubric: "Зөв олсон бол 1 оноо, огт бичээгүй бол 0 оноо"
      },
      {
        num: 3,
        form: "Задгай даалгавар",
        level: "Задлан шинжлэх",
        taskAction: "1-2 өгүүлбэр бичих",
        points: 2,
        question: `"${cleanTitle}" эх бичвэрт гарч буй үйл явдал, онцлогийг 1-2 өгүүлбэрт багтаан задлан тайлбарлана уу.`,
        correctAnswer: `${s3.slice(0, 90)}... гэдэг нь тухайн агуулгын онцлогийг задлан тодорхойлж байна.`,
        rubric: "Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, тайлбар дутуу юмуу 1 өгүүлбэр бичсэн бол 1 оноо, Огт бичээгүй бол 0 оноо"
      },
      {
        num: 4,
        form: "Задгай даалгавар",
        level: "Задлан шинжлэх",
        taskAction: "1-2 өгүүлбэр бичих",
        points: 2,
        question: `Эх бичвэрийн агуулга болон гол дүр/хууль/үзэгдлийн харилцан хамаарлыг 1-2 өгүүлбэрээр задлан тайлбарлаарай.`,
        correctAnswer: `Эх бичвэрт дурдсан баримтууд нь бие биенээ баталгаажуулж байна.`,
        rubric: "Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, тайлбар дутуу юмуу 1 өгүүлбэр бичсэн бол 1 оноо, Огт бичээгүй бол 0 оноо"
      },
      {
        num: 5,
        form: "Задгай даалгавар",
        level: "Эргэцүүлэн дүгнэх",
        taskAction: "2-3 өгүүлбэр бичих",
        points: 3,
        question: `"${sLast.slice(0, 65)}..." гэсэн далд/ил санааг өөрийн бодлоор шинэ санаа гарган 2-3 өгүүлбэрээр эргэцүүлэн дүгнээрэй.`,
        correctAnswer: `Энэхүү санаа нь амьдралд тохиолддог сургамжтай бөгөөд бидний сэтгэлгээнд шинэ ойлголт өгч байна.`,
        rubric: "2-3 өгүүлбэрээр өөрийн бодлоор шинэ санаа гарган эргэцүүлэн дүгнэсэн бол 3 оноо, 2-3 өгүүлбэр бичсэн ч шинэ санаа гаргаагүй бол 2 оноо, 1-2 өгүүлбэрээр дүгнэлт, ойлголт дутуу шинэ санаагүй бол 1 оноо, Огт бичээгүй бол 0 оноо"
      },
      {
        num: 6,
        form: "Задгай даалгавар",
        level: "Эргэцүүлэн дүгнэх",
        taskAction: "2-3 өгүүлбэр бичих",
        points: 3,
        question: `"${cleanTitle}" эхийн сэдэвтэй холбон, амьдралын практик туршлага ба нийгмийн ач холбогдлыг өөрийн бодлоор шинэ санаа гарган 2-3 өгүүлбэрээр эргэцүүлэн дүгнээрэй.`,
        correctAnswer: `Тухайн сэдвийн ач холбогдол нь нийгэм болон хүний төлөвшилд эерэгээр нөлөөлдөг.`,
        rubric: "2-3 өгүүлбэрээр өөрийн бодлоор шинэ санаа гарган эргэцүүлэн дүгнэсэн бол 3 оноо, 2-3 өгүүлбэр бичсэн ч шинэ санаа гаргаагүй бол 2 оноо, 1-2 өгүүлбэрээр дүгнэлт, ойлголт дутуу шинэ санаагүй бол 1 оноо, Огт бичээгүй бол 0 оноо"
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

  const handleStartEditTask = (task: any) => {
    setEditingTaskNum(task.num);
    setEditQuestionText(task.question);
    if (task.options && task.options.length >= 4) {
      setEditOptions([...task.options]);
    } else {
      setEditOptions(["A. ", "B. ", "C. ", "D. "]);
    }
    setEditCorrectAnswerText(task.correctAnswer);
  };

  const handleSaveEditTask = (taskNum: number) => {
    if (!generatedTasks) return;
    const updated = generatedTasks.map((t) => {
      if (t.num === taskNum) {
        return {
          ...t,
          question: editQuestionText,
          options: t.num === 1 || t.form === "Сонгох тест" ? editOptions : t.options,
          correctAnswer: editCorrectAnswerText
        };
      }
      return t;
    });
    setGeneratedTasks(updated);
    setEditingTaskNum(null);
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

  const handleOpenAssignModal = (taskItem: any) => {
    setTaskToAssign(taskItem);
    setTargetClass("9Е");
    const autoCode = `9E-${(taskItem.subject || "TASK").slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setAssignmentCode(autoCode);
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    setDeadline(tmr.toISOString().slice(0, 16));
    setTeacherNote("9Е ангийн сурагчид даалгавраа анхааралтай уншиж, хугацаандаа амжиж гүйцэтгээрэй!");
    setIsAssignModalOpen(true);
  };

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

    const existing = localStorage.getItem("creative_reading_assigned_tasks");
    let list: any[] = [];
    if (existing) {
      try { list = JSON.parse(existing); } catch (e) { console.error(e); }
    }
    list = [newAssignment, ...list];
    localStorage.setItem("creative_reading_assigned_tasks", JSON.stringify(list));
    setIsAssignModalOpen(false);
    setAssignSuccessModal(true);
  };

  const filteredTaskBank = bankFilterSubject === "Бүх хичээл" ? taskBank : taskBank.filter(t => t.subject === bankFilterSubject);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* HEADER */}
      <header style={{ maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#fffdf0", borderRadius: "16px", border: "1px solid #fde68a", padding: "12px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "14px", border: "2px solid #fcd34d", overflow: "hidden", padding: "2px", backgroundColor: "#fff" }}>
            <img src="/project-logo.jpg" alt="Лого" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "17px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Бүтээлч уншлага-2 төсөл (Багшийн танхим)</h1>
            {/* 🎯 ЗУРАГ ДЭЭРХ ТОДРУУЛСАН ХЭСГИЙГ ЗАСАЖ "Creative reading-2 project" БОЛГОВ */}
            <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>Creative reading-2 project PISA даалгавар боловсруулах орчин</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{ backgroundColor: "#fbbf24", border: "1px solid #f59e0b", padding: "4px 18px", borderRadius: "12px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a", margin: 0 }}>Mentor AI Цэндао багштай</h2>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" onClick={() => setIsBlueprintOpen(!isBlueprintOpen)} style={{ backgroundColor: "#fde68a", border: "1px solid #fcd34d", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>📋 Блюпринт харах ▼</button>
            <button type="button" onClick={() => setIsChatOpen(!isChatOpen)} style={{ backgroundColor: "#fde68a", border: "1px solid #fcd34d", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>💬 Цэндао багштай ярилцах</button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>Таны Ментор</p>
            <p style={{ fontSize: "10px", fontWeight: "600", color: "#059669", margin: "2px 0 0 0" }}>● Онлайн</p>
          </div>
          <div style={{ width: "68px", height: "68px", borderRadius: "50%", border: "3px solid #f59e0b", overflow: "hidden", backgroundColor: "#fef3c7" }}>
            {!imgError ? <img src="/tsendao.jpg" alt="Цэндао багш" onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "30px" }}>👨‍🏫</span>}
          </div>
        </div>
      </header>

      {/* БЛЮПРИНТ */}
      {isBlueprintOpen && (
        <section style={{ maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#fffdf0", border: "1.5px solid #fcd34d", borderRadius: "14px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1.5px solid #fde68a", paddingBottom: "8px", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📋 Шинэ Блюпринт ба Рубрикийн стандарт (6 даалгавар / 12 оноо)</h3>
            <button type="button" onClick={() => setIsBlueprintOpen(false)} style={{ fontSize: "11px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px 8px", cursor: "pointer", fontWeight: "bold" }}>Хаах ✕</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#fbbf24", color: "#0f172a" }}>
                  <th style={{ padding: "8px", border: "1px solid #fcd34d" }}>№</th>
                  <th style={{ padding: "8px", border: "1px solid #fcd34d" }}>Хэлбэр</th>
                  <th style={{ padding: "8px", border: "1px solid #fcd34d" }}>Танин мэдэхүйн түвшин</th>
                  <th style={{ padding: "8px", border: "1px solid #fcd34d" }}>Гүйцэтгэх ажил</th>
                  <th style={{ padding: "8px", border: "1px solid #fcd34d" }}>Оноо</th>
                  <th style={{ padding: "8px", border: "1px solid #fcd34d" }}>Онооны задаргаа (Рубрик)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#ffffff" }}>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>1</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Сонгох тест</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Мэдээлэл олох, сэргээн санах</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>ABCD сонголтоос нэг хариулт сонгох</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>0-1</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Зөв сонгосон бол 1 оноо, буруу сонгосон бол 0 оноо</td>
                </tr>
                <tr style={{ backgroundColor: "#fffdf0" }}>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>2</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Задгай даалгавар</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Мэдээлэл олох, сэргээн санах</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Нэг өгүүлбэр олж бичих</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>0-1</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Зөв олсон бол 1 оноо, огт бичээгүй бол 0 оноо</td>
                </tr>
                <tr style={{ backgroundColor: "#ffffff" }}>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>3</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Задгай даалгавар</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Задлан шинжлэх</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>1-2 өгүүлбэр бичих</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>0-2</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, тайлбар дутуу юмуу 1 өгүүлбэр бичсэн бол 1 оноо, Огт бичээгүй бол 0 оноо</td>
                </tr>
                <tr style={{ backgroundColor: "#fffdf0" }}>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>4</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Задгай даалгавар</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Задлан шинжлэх</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>1-2 өгүүлбэр бичих</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>0-2</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, тайлбар дутуу юмуу 1 өгүүлбэр бичсэн бол 1 оноо, Огт бичээгүй бол 0 оноо</td>
                </tr>
                <tr style={{ backgroundColor: "#ffffff" }}>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>5</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Задгай даалгавар</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Эргэцүүлэн дүгнэх</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>2-3 өгүүлбэр бичих</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>0-3</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>2-3 өгүүлбэрээр өөрийн бодлоор шинэ санаа гарган эргэцүүлэн дүгнэсэн бол 3 оноо, 2-3 өгүүлбэр бичсэн ч шинэ санаа гаргаагүй бол 2 оноо, 1-2 өгүүлбэрээр дүгнэлт, ойлголт дутуу шинэ санаагүй бол 1 оноо, Огт бичээгүй бол 0 оноо</td>
                </tr>
                <tr style={{ backgroundColor: "#fffdf0" }}>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>6</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Задгай даалгавар</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>Эргэцүүлэн дүгнэх</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>2-3 өгүүлбэр бичих</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a", fontWeight: "bold" }}>0-3</td>
                  <td style={{ padding: "8px", border: "1px solid #fde68a" }}>2-3 өгүүлбэрээр өөрийн бодлоор шинэ санаа гарган эргэцүүлэн дүгнэсэн бол 3 оноо, 2-3 өгүүлбэр бичсэн ч шинэ санаа гаргаагүй бол 2 оноо, 1-2 өгүүлбэрээр дүгнэлт, ойлголт дутуу шинэ санаагүй бол 1 оноо, Огт бичээгүй бол 0 оноо</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 💬 ЦЭНДАО БАГШТАЙ ЯРИЛЦАХ ЧАТ */}
      {isChatOpen && (
        <section style={{ maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#fffdf0", border: "1.5px solid #fcd34d", borderRadius: "14px", padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1.5px solid #fde68a", paddingBottom: "8px", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>💬 Цэндао багштай ярилцах</h3>
            <button type="button" onClick={() => setIsChatOpen(false)} style={{ fontSize: "11px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px 8px", cursor: "pointer", fontWeight: "bold" }}>Хаах ✕</button>
          </div>
          
          <div style={{ height: "180px", backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid #fde68a", padding: "12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", backgroundColor: msg.sender === "user" ? "#dcfce7" : "#fef3c7", padding: "8px 12px", borderRadius: "10px", fontSize: "13px", maxWidth: "85%", lineHeight: "1.5" }}>
                {msg.sender === "bagsh" && <strong style={{ color: "#92400e" }}>👨‍🏫 Цэндао багш: </strong>} {msg.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "stretch" }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={4}
              placeholder="Асуулт, эх бичвэр болон саналаа энд бичээрэй... (Enter дарж илгээнэ, Shift+Enter-ээр шинэ мөр авна)"
              style={{
                flex: 1,
                padding: "12px",
                border: "2px solid #38bdf8",
                borderRadius: "10px",
                fontSize: "14px",
                lineHeight: "1.6",
                fontFamily: "inherit",
                boxSizing: "border-box",
                resize: "vertical",
                minHeight: "90px",
                backgroundColor: "#ffffff",
                color: "#0f172a"
              }}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              style={{
                backgroundColor: "#fbbf24",
                color: "#78350f",
                border: "none",
                padding: "0 24px",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              Илгээх
            </button>
          </div>
        </section>
      )}

      {/* ҮНДСЭН АЖЛЫН ТАЛБАР */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "5fr 3fr", gap: "16px" }}>
        
        {/* ЭХ БИЧВЭР */}
        <section style={{ backgroundColor: "#fffdf0", borderRadius: "16px", border: "1.5px solid #fde68a", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "580px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📖 Эх бичвэр</h3>
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

        {/* АСУУЛТ ДААЛГАВАР */}
        <section style={{ backgroundColor: "#fffdf0", borderRadius: "16px", border: "1.5px solid #fde68a", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "580px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📝 Асуулт даалгавар</h3>
              <button type="button" onClick={() => setIsAnalyticsOpen(true)} style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>📊 Хяналт шинжилгээ ➔</button>
            </div>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fde68a", padding: "14px", height: "420px", overflowY: "auto" }}>
              {isGenerating ? (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>⚡</div>
                  <p style={{ fontWeight: "bold" }}>Боловсруулж байна...</p>
                </div>
              ) : generatedTasks && generatedTasks.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {generatedTasks.map((t) => {
                    const isEditing = editingTaskNum === t.num;
                    const isMultipleChoice = t.num === 1 || t.form === "Сонгох тест";

                    return (
                      <div key={t.num} style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "14px", backgroundColor: "#f8fafc" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", borderBottom: "1px dashed #cbd5e1", paddingBottom: "6px" }}>
                          <div>
                            <span style={{ fontWeight: "bold", fontSize: "13px", color: "#0284c7" }}>Даалгавар {t.num} ({t.form})</span>
                            <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "6px", backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>{t.level}</span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "bold", backgroundColor: "#e0f2fe", color: "#0369a1", padding: "4px 8px", borderRadius: "6px" }}>{t.points} оноо</span>

                            {!isEditing ? (
                              <button type="button" onClick={() => handleStartEditTask(t)} style={{ backgroundColor: "#fbbf24", color: "#78350f", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>✏️ Засах</button>
                            ) : (
                              <button type="button" onClick={() => handleSaveEditTask(t.num)} style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "5px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>💾 Хадгалах</button>
                            )}
                          </div>
                        </div>

                        {isEditing ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "10px 0" }}>
                            <div>
                              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#0f172a", display: "block", marginBottom: "4px" }}>Асуулт засах:</label>
                              <textarea value={editQuestionText} onChange={(e) => setEditQuestionText(e.target.value)} rows={2} style={{ width: "100%", padding: "8px", fontSize: "13px", fontWeight: "bold", borderRadius: "8px", border: "1.5px solid #38bdf8", boxSizing: "border-box", fontFamily: "inherit" }} />
                            </div>

                            {isMultipleChoice && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "11.5px", fontWeight: "bold", color: "#475569" }}>ABCD Сонголтууд засах:</label>
                                {editOptions.map((opt, idx) => (
                                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input type="radio" disabled checked={editCorrectAnswerText.startsWith(opt.slice(0, 2))} />
                                    <input type="text" value={opt} onChange={(e) => { const newOpts = [...editOptions]; newOpts[idx] = e.target.value; setEditOptions(newOpts); }} style={{ flex: 1, padding: "6px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                                  </div>
                                ))}
                              </div>
                            )}

                            <div>
                              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#059669", display: "block", marginBottom: "4px" }}>Зөв хариулт / Загвар засах:</label>
                              <textarea value={editCorrectAnswerText} onChange={(e) => setEditCorrectAnswerText(e.target.value)} rows={2} style={{ width: "100%", padding: "8px", fontSize: "12.5px", borderRadius: "8px", border: "1.5px solid #10b981", backgroundColor: "#f0fdf4", color: "#166534", boxSizing: "border-box", fontFamily: "inherit" }} />
                            </div>
                          </div>
                        ) : (
                          <>
                            <p style={{ fontSize: "13.5px", fontWeight: "bold", color: "#0f172a", margin: "6px 0 10px 0" }}>{t.question}</p>

                            {isMultipleChoice && t.options && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
                                {t.options.map((opt: string) => (
                                  <div key={opt} style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                                    <input type="radio" disabled checked={t.correctAnswer.startsWith(opt.slice(0, 2))} />
                                    <span style={{ fontSize: "12.5px", color: "#334155", fontWeight: "500" }}>{opt}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "8px 10px", borderRadius: "6px", marginBottom: "6px" }}>
                              <p style={{ fontSize: "12px", color: "#15803d", margin: 0 }}>💡 <strong>Зөв хариулт:</strong> {t.correctAnswer}</p>
                            </div>
                          </>
                        )}

                        <div style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa", padding: "6px 10px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "11px", color: "#9a3412" }}>📊 <strong>Стандарт рубрик:</strong> {t.rubric}</span>
                          <span style={{ fontSize: "10px", color: "#c2410c", fontWeight: "bold" }}>(Түгжээтэй)</span>
                        </div>

                      </div>
                    );
                  })}
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

      {/* 📂 ДААЛГАВРЫН САН */}
      {isTaskBankOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", width: "100%", maxWidth: "1200px", height: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden" }}>
            
            <div style={{ backgroundColor: "#fffdf0", padding: "16px 20px", borderBottom: "1.5px solid #fde68a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📂 Даалгаврын сан</h2>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>Нийт хадгалагдсан: <strong>{taskBank.length}</strong> багц даалгавар</p>
              </div>
              <div>
                <button type="button" onClick={() => setIsTaskBankOpen(false)} style={{ backgroundColor: "#e2e8f0", color: "#334155", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Хаах ✕</button>
              </div>
            </div>

            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#fffdf0" }}>
              <p style={{ fontSize: "12px", fontWeight: "bold", color: "#475569", margin: "0 0 8px 0" }}>Хичээлээр ангилах (Тоо ширхэгтэй):</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                <button type="button" onClick={() => setBankFilterSubject("Бүх хичээл")} style={{ padding: "8px", borderRadius: "10px", border: bankFilterSubject === "Бүх хичээл" ? "2px solid #0284c7" : "1px solid #cbd5e1", backgroundColor: bankFilterSubject === "Бүх хичээл" ? "#e0f2fe" : "#ffffff", cursor: "pointer", textAlign: "center" }}>
                  <p style={{ fontSize: "11px", fontWeight: "bold", margin: 0, color: "#334155" }}>Бүх хичээл</p>
                  <span style={{ fontSize: "14px", fontWeight: "900", color: "#0284c7" }}>{taskBank.length}</span>
                </button>

                {subjects.map((sub) => {
                  const count = taskBank.filter((t) => t.subject === sub).length;
                  const isSelected = bankFilterSubject === sub;
                  return (
                    <button key={sub} type="button" onClick={() => setBankFilterSubject(sub)} style={{ padding: "8px", borderRadius: "10px", border: isSelected ? "2px solid #0284c7" : "1px solid #cbd5e1", backgroundColor: isSelected ? "#e0f2fe" : "#ffffff", cursor: "pointer", textAlign: "center" }}>
                      <p style={{ fontSize: "11px", fontWeight: "bold", margin: 0, color: "#334155" }}>{sub}</p>
                      <span style={{ fontSize: "14px", fontWeight: "900", color: count > 0 ? "#059669" : "#94a3b8" }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: "20px", overflowY: "auto", flex: 1, backgroundColor: "#f8fafc" }}>
              {filteredTaskBank.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                  <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#334155" }}>"{bankFilterSubject}" хичээлд даалгавар одоогоор хадгалагдаагүй байна.</h4>
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
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleOpenAssignModal(item); }} style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>🚀 9Е ангид илгээх</button>

                            <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedSubject(item.subject); setTitle(item.title); setStoryText(item.storyText); setGeneratedTasks(item.tasks); setIsTaskBankOpen(false); }} style={{ backgroundColor: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>📥 Үндсэн ажилд ачаалах</button>
                            
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteTaskFromBank(item.id); }} style={{ backgroundColor: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>🗑️ Устгах</button>

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
                                  {t.options && (
                                    <div style={{ fontSize: "11px", color: "#475569", margin: "4px 0" }}>
                                      {t.options.join(" | ")}
                                    </div>
                                  )}
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
              <h3 style={{ fontSize: "17px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>🚀 9Е ангид даалгавар илгээх</h3>
              <button type="button" onClick={() => setIsAssignModalOpen(false)} style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ backgroundColor: "#f0f9ff", padding: "10px 14px", borderRadius: "10px", border: "1px solid #bae6fd" }}>
                <p style={{ fontSize: "12px", color: "#0369a1", margin: 0, fontWeight: "bold" }}>Сонгосон даалгавар:</p>
                <p style={{ fontSize: "14px", color: "#0f172a", margin: "2px 0 0 0", fontWeight: "bold" }}>[{taskToAssign.subject}] {taskToAssign.title}</p>
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Хүлээн авах анги:</label>
                <button type="button" style={{ padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", border: "none", backgroundColor: "#059669", color: "#ffffff" }}>🏫 9Е анги</button>
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Дуусах хугацаа (Deadline):</label>
                <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Даалгаврын код (9Е ангийн сурагчдад өгөх):</label>
                <input type="text" value={assignmentCode} onChange={(e) => setAssignmentCode(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13px", fontWeight: "bold", color: "#0284c7", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>9Е ангийн сурагчдад зориулсан санамж:</label>
                <textarea value={teacherNote} onChange={(e) => setTeacherNote(e.target.value)} rows={2} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "12.5px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button type="button" onClick={handleConfirmAssign} style={{ flex: 1, backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "13.5px", cursor: "pointer" }}>🚀 9Е ангид баталж илгээх</button>
              <button type="button" onClick={() => setIsAssignModalOpen(false)} style={{ backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", padding: "12px 18px", borderRadius: "10px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>Цуцлах</button>
            </div>
          </div>
        </div>
      )}

      {/* ИЛГЭЭСНИЙ ДАРААХ МОДАЛ */}
      {assignSuccessModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", maxWidth: "420px", width: "90%", textAlign: "center", border: "2px solid #10b981" }}>
            <div style={{ fontSize: "42px", marginBottom: "10px" }}>📨</div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#065f46", margin: "0 0 8px 0" }}>9Е ангид амжилттай илгээгдлээ!</h3>
            <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5", margin: "0 0 16px 0" }}>9Е ангийн сурагчид <strong>"{assignmentCode}"</strong> кодоор сурагчийн танхим руу орж даалгавраа ажиллах боломжтой.</p>
            <button type="button" onClick={() => { setAssignSuccessModal(false); setIsTaskBankOpen(false); }} style={{ width: "100%", backgroundColor: "#0284c7", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>Хаах</button>
          </div>
        </div>
      )}

      {/* БАТАЛГААЖУУЛАХ MODAL */}
      {saveSuccessModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", maxWidth: "440px", width: "90%", textAlign: "center", border: "2px solid #10b981" }}>
            <div style={{ fontSize: "42px", marginBottom: "10px" }}>🎉</div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#065f46", margin: "0 0 8px 0" }}>Амжилттай баталгаажлаа!</h3>
            <p style={{ fontSize: "13.5px", color: "#334155", margin: "0 0 20px 0" }}>"{selectedSubject}" хичээлийн 6 даалгавар санд хадгалагдлаа.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={() => { setSaveSuccessModal(false); setIsTaskBankOpen(true); }} style={{ flex: 1, backgroundColor: "#0284c7", color: "#ffffff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>📂 Даалгаврын сан руу очих</button>
              <button type="button" onClick={() => setSaveSuccessModal(false)} style={{ flex: 1, backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", padding: "10px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>Хаах</button>
            </div>
          </div>
        </div>
      )}

      {/* ХЯНАЛТ ШИНЖИЛГЭЭ */}
      {isAnalyticsOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", width: "100%", maxWidth: "800px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📊 Статистик хяналт</h3>
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