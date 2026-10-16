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

  // 💬 ЦЭНДАО БАГШТАЙ ЯРИЛЦАХ ЧАТ МЕССЕЖҮҮД
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bagsh",
      text: "Сайн байна уу! Би 'Бүтээлч уншлага-2' төслийн AI Ментор Цэндао багш байна. 9Е ангид болон 6 хичээл тус бүрийн эх бичвэрт тохирсон PISA 6 даалгавар (12 оноо)-г блюпринтийн дагуу чанартай боловсруулахад туслахад бэлэн байна."
    }
  ]);
  const [inputText, setInputText] = useState("");

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
      story: `Биеийн хөдөлгөөн ба түүний хурд, массын хамаарлыг механик энергиэр тодорхойлдог. Биеийн масс m, хурд v байх үед кинетик энерги нь Ek = (1/2)*m*v^2 томьёогоор бодогдоно. Биеийн хурд 2 дахин нэмэгдэхэд кинетик энерги 4 дахин өсдөг.

Автомашины тоормосны замын урт нь хурдны квадратаас шууд хамаардаг тул замын хөдөлгөөний аюулгүй байдалд хурдыг хэтрүүлэхгүй байх нь ач холбогдолтой юм. Хурд нэмэгдэхэд автомашины зогсох замын урт асар ихээр уртсаж, мөргөлдөх үеийн цохилтын энерги нэмэгддэг тул замын хөдөлгөөний дүрмийг баримтлах нь хүний амь насыг аврах физикийн үндэслэл болно.`
    },
    "Хими": {
      title: 'Хими: "Усны бүтэц ба химийн холбоос"',
      story: `Усны молекул (H2O) нь хоёр водород ба нэг кислородын атомоос тогтоно. Ковалент туйлшралтай холбоотой тул усны молекулуудын хооронд водородон холбоо үүсдэг. Үүний дүнд ус нь өндөр буцлах температуртай, гадаргуугийн шахалт өндөртэй байдаг.

Ус нь 4°C температурт хамгийн их нягттай байдаг тул нуур, цөөрмийн доод үе өвөлдөө хөлдөхгүй, усны амьтад амьдрах боломж бүрддэг. Мөн ус нь нийтлэг уусгагч болохын хувьд шим бодисыг уусган амьд биеийн эс хооронд тээвэрлэх химийн чухал үүрэгтэй.`
    },
    "Биологи": {
      title: 'Биологи: "Эсийн бүтээц ба фотосинтез"',
      story: `Ургамлын эс нь хлоропласт хэмээх эрхтэнцэртэй бөгөөд нарны гэрлийн энергийг ашиглан нүүрсхүчлийн хий (CO2) болон уснаас (H2O) глюкоз (C6H12O6) ба хүчилтөрөгч (O2) нийлэгжүүлдэг. Энэ үйл явцыг фотосинтез гэнэ.

Фотосинтезийн дүнд дэлхийн шим мандлын хүчилтөрөгчийн тэнцвэрт байдал хангагдаж, бүх амьд биетийн идэш тэжээлийн суваг бүрэлддэг. Ногоон ургамал нь агаар дахь хүлэмжийн хийг шингээн авч амьд байгалийг тэтгэдэг тул ой модыг хамгаалах нь уур амьсгалын дулаарлыг сааруулах үндэс юм.`
    },
    "Түүх": {
      title: 'Түүх: "Их Монгол Улсын гадаад харилцаа ба өртөөний систем"',
      story: `Чингис хаан 1206 онд Их Монгол Улсыг байгуулсны дараа Өгэдэй хаан орон даяар Морин өртөөний сүлжээг засаж тохижуулжээ. Өртөөний систем нь мэдээ мэдээллийг түргэн шуурхай дамжуулах, худалдаа иргэншлийн аюулгүй байдлыг хангахад шийдвэрлэх үүрэг гүйцэтгэсэн.

Энэхүү систем нь Ази, Европыг холбосон Торгоны замыг аюулгүй болгож, Дорно ба Өрнийн соёлын солилцоо ("Pax Mongolica") идэвхжих нөхцөлийг бүрдүүлсэн юм. Өртөөний харуул ба гэрэгэ бүхий элч нар мэдээллийг хурдан дамжуулж байсан нь тухайн үеийнхээ хамгийн том мэдээллийн хурдны сүлжээ байв.`
    },
    "Газар зүй": {
      title: 'Газар зүй: "Монгол орны уур амьсгал ба усан сүлжээ"',
      story: `Монгол орон нь Евразийн эх газрын төвд оршдог тул эх газрын эрс тэс уур амьсгалтай. Жилийн ба хоногийн температурын свеч ихтэй, тунадасны хэмжээ бага. Хангай, Хэнтий, Алтайн нуруунаас эх авсан Сэлэнгэ, Орхон, Туул зэрэг томоохон голууд нь Хойд мөсөн далайн болон Төв Азийн гадагш урсгалгүй айрагт хамаардаг.

Сүүлийн жилүүдэд уур амьсгалын дулаарлаас шалтгаалан цөлжилт, гол нуурын ширгэлт нэмэгдэж байна. Иймд усан сүлжээ, гол мөрний эх сурвалжийг хамгаалах, усыг гамнах нь газар зүйн орчны тэнцвэрийг хадгалахад нэн чухал тулгамдсан асуудал болоод байна.`
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

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userQuery = inputText.trim();
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: userQuery }]);
    setInputText("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bagsh", text: `Багш аа, ${selectedSubject} хичээлээр 9Е ангид болон шинэ блюпринтийн дагуу даалгавар боловсруулахад тусалъя.` }
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
    setTargetClass("9Е");
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
      
      {/* HEADER ХЭСЭГ (БҮХ БОЛОМЖУУД БҮРЭН СЭРГЭЭГДСЭН) */}
      <header style={{
        maxWidth: "1280px",
        margin: "0 auto 16px auto",
        backgroundColor: "#fffdf0",
        borderRadius: "16px",
        border: "1px solid #fde68a",
        padding: "12px 20px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        
        {/* ТӨСЛИЙН ЛОГО & НЭР */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <div style={{
            width: "64px",
            height: "64px",
            minWidth: "64px",
            borderRadius: "14px",
            backgroundColor: "#ffffff",
            border: "2px solid #fcd34d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "2px"
          }}>
            <img 
              src="/project-logo.jpg" 
              alt="Бүтээлч уншлага лого" 
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
          <div>
            <h1 style={{ fontSize: "17px", fontWeight: "bold", color: "#0f172a", margin: 0, lineHeight: 1.2 }}>
              Бүтээлч уншлага-2 төсөл (9Е анги)
            </h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0", fontWeight: "500" }}>
              Creative reading-2 project (Багшийн танхим)
            </p>
          </div>
        </div>

        {/* ТОП ТОВЧНУУД */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{
            backgroundColor: "#fbbf24",
            border: "1px solid #f59e0b",
            padding: "4px 18px",
            borderRadius: "12px"
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
              Mentor AI Цэндао багштай
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            <button 
              type="button" 
              onClick={() => setIsBlueprintOpen(!isBlueprintOpen)}
              style={{
                backgroundColor: "#fde68a",
                border: "1px solid #fcd34d",
                padding: "5px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#0f172a",
                cursor: "pointer"
              }}
            >
              📋 Блюпринт, рубрик
            </button>

            <button 
              type="button" 
              onClick={() => setIsChatOpen(!isChatOpen)}
              style={{
                backgroundColor: "#fde68a",
                border: "1px solid #fcd34d",
                padding: "5px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#0f172a",
                cursor: "pointer"
              }}
            >
              💬 Цэндао багштай ярилцах
            </button>

            <a 
              href="/student"
              style={{
                backgroundColor: "#059669",
                color: "#ffffff",
                padding: "5px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                textDecoration: "none"
              }}
            >
              👨‍🎓 Сурагчийн танхим руу шилжих ➔
            </a>
          </div>
        </div>

        {/* МЕНТОР ЦЭНДАО БАГШИЙН ЗУРАГ БА ОНЛАЙН ТӨЛӨВ */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>Таны Ментор</p>
            <p style={{ fontSize: "10px", fontWeight: "600", color: "#059669", margin: "2px 0 0 0", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }}></span>
              Онлайн
            </p>
          </div>
          
          <div style={{
            width: "68px",
            height: "68px",
            minWidth: "68px",
            borderRadius: "50%",
            border: "3px solid #f59e0b",
            overflow: "hidden",
            backgroundColor: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {!imgError ? (
              <img 
                src="/tsendao.jpg" 
                alt="Цэндао багш"
                onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <span style={{ fontSize: "30px" }}>👨‍🏫</span>
            )}
          </div>
        </div>

      </header>

      {/* ШИНЭ БЛЮПРИНТ БА РУБРИКИЙН ЦОНХ */}
      {isBlueprintOpen && (
        <section style={{ maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#fffdf0", border: "1.5px solid #fcd34d", borderRadius: "14px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "6px", marginBottom: "10px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📋 Шинэ блюпринт ба рубрик (6 Даалгавар / 12 Оноо)</h3>
            <button type="button" onClick={() => setIsBlueprintOpen(false)} style={{ fontSize: "11px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px 8px", cursor: "pointer", fontWeight: "600" }}>Хаах ✕</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#fbbf24", color: "#0f172a" }}>
                  <th style={{ padding: "6px", border: "1px solid #fcd34d" }}>№</th>
                  <th style={{ padding: "6px", border: "1px solid #fcd34d" }}>Хэлбэр</th>
                  <th style={{ padding: "6px", border: "1px solid #fcd34d" }}>Танин мэдэхүй</th>
                  <th style={{ padding: "6px", border: "1px solid #fcd34d" }}>Оноо</th>
                  <th style={{ padding: "6px", border: "1px solid #fcd34d" }}>Рубрик</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#ffffff" }}><td style={{ padding: "6px" }}>1</td><td style={{ padding: "6px" }}>Сонгох тест</td><td style={{ padding: "6px" }}>Мэдээлэл олох</td><td style={{ padding: "6px" }}>1</td><td style={{ padding: "6px" }}>Зөв сонгосон бол 1, буруу бол 0</td></tr>
                <tr style={{ backgroundColor: "#fffdf0" }}><td style={{ padding: "6px" }}>2</td><td style={{ padding: "6px" }}>Задгай</td><td style={{ padding: "6px" }}>Мэдээлэл олох</td><td style={{ padding: "6px" }}>1</td><td style={{ padding: "6px" }}>1 өгүүлбэр олж бичвэл 1, үгүй бол 0</td></tr>
                <tr style={{ backgroundColor: "#ffffff" }}><td style={{ padding: "6px" }}>3-4</td><td style={{ padding: "6px" }}>Задгай</td><td style={{ padding: "6px" }}>Задлан шинжлэх</td><td style={{ padding: "6px" }}>2 х 2 = 4</td><td style={{ padding: "6px" }}>1-2 өгүүлбэрээр задлан тайлбарлавал 2 оноо</td></tr>
                <tr style={{ backgroundColor: "#fffdf0" }}><td style={{ padding: "6px" }}>5-6</td><td style={{ padding: "6px" }}>Задгай</td><td style={{ padding: "6px" }}>Эргэцүүлэн дүгнэх</td><td style={{ padding: "6px" }}>3 х 2 = 6</td><td style={{ padding: "6px" }}>2-3 өгүүлбэрээр шинэ санаа гаргавал 3 оноо</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ЧАТ СЕКЦИ: МЕНТОР ЦЭНДАО БАГШТАЙ ЯРИЛЦАХ */}
      {isChatOpen && (
        <section style={{ maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#fffdf0", border: "1.5px solid #fcd34d", borderRadius: "14px", padding: "10px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "6px", marginBottom: "8px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>💬 Цэндао багштай ярилцах</h3>
            <button type="button" onClick={() => setIsChatOpen(false)} style={{ fontSize: "11px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px 8px", cursor: "pointer" }}>Хаах ✕</button>
          </div>
          <div style={{ height: "120px", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #fde68a", padding: "8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", backgroundColor: msg.sender === "user" ? "#dcfce7" : "#fef3c7", padding: "6px 10px", borderRadius: "8px", fontSize: "12.5px" }}>
                {msg.sender === "bagsh" && <strong>👨‍🏫 Цэндао багш: </strong>} {msg.text}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Асуултаа бичээрэй..." style={{ flex: 1, padding: "6px 10px", border: "1px solid #fcd34d", borderRadius: "6px", fontSize: "12.5px" }} />
            <button type="button" onClick={handleSendMessage} style={{ backgroundColor: "#fbbf24", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "bold", fontSize: "12.5px", cursor: "pointer" }}>Илгээх</button>
          </div>
        </section>
      )}

      {/* ҮНДСЭН АЖЛЫН ТАЛБАР (8:5 БА 8:3 ХАРЬЦАА, БҮДЭГ ШАРГАЛ ФОН) */}
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
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display