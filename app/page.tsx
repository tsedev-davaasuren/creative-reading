"use client";

import { useState } from "react";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Уран зохиол");
  const [imgError, setImgError] = useState(false);

  // Эх бичвэрийн төлөвүүд
  const [title, setTitle] = useState('Ж.Лхагва "Арван долоотой байхад" өгүүлэг');
  const [storyText, setStoryText] = useState(
    `Манайх Цээлд, Бөөдэйн Улаандэлд зусч байлаа. Цээлийн тойром нуурлачихсанаас хойш тэдний адуу тэмээ усны үнэрээр цуван ирэх болж бид хоёрын уулзаж байхад ганц сайн шалтаг болсон юм.\nБөөдэй ээжтэйгээ хоёрулхаа суудаг болохоор тэмээ малдаа өөрөө л явна. Хааяа унагаа үлдээнэ гэж адуугаа тууж ирэхэд нь би уургынхаа хээрийг барьж мордоод хорь хүрэхгүй адууг нь хураан хөндөлсүүлж явахаар барих морио тэгэхээс тэгж адуунаас нь гарган элдээд сүүл дэрлэн дагах хэвтээ дэмтэй сайхан хээрийнхээ дөрөө зуран эргэх яг л тэр агшинд бөхийн цацаж, сүүлэндээ салхи татуулан зугатаах морины нарийн хоншоороор уургалан эргүүлээд үргэн давхисан адууныхаа хойноос янцгаан тэмүүлэх түүнийг эмнэг уургалсан мэт цухалзуураар нь эргэ Бөөдэйг хүлээж зогсоно.\nБөөдэй үсрэн бууж олмоо тавиад, эмээлээ өргөн, мориныхуу нурууг нар харвахаас болгоомжлон салхи оруулж хэсэг сүүдэрлэн зогссоноо хазаараа мулталж инээсээр ирнэ.\nЭнэ бол миний арван долоон насанд хамгийн жаргалтай мөч байлаа. Гэвч энэ маань өглөөдөө үзэгдэх хөвчийн манан шиг байжээ.`
  );

  // Даалгавар боловсруулах төлөв
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<any[] | null>(null);

  // Чатын төлөв болон мессежүүд
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bagsh",
      text: "Сайн байна уу! Би 'Бүтээлч уншлага-2' төслийн AI Ментор Цэндао багш байна. PISA унших чадварын даалгавар боловсруулах эсвэл хичээлийн арга зүйн талаар хамтран ажиллахад бэлэн байна."
    }
  ]);
  const [inputText, setInputText] = useState("");

  const subjects = ["Уран зохиол", "Хими", "Биологи", "Түүх", "Физик", "Газар зүй"];

  // 1. Асуултыг ухаалаг ойлгох чатын функц
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userQuery = inputText.trim();
    const newMsg = { id: Date.now(), sender: "user", text: userQuery };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Ухаалаг Ментор AI хариулт
    setTimeout(() => {
      let responseText = "";
      const lower = userQuery.toLowerCase();

      if (lower.includes("төсөл") || lower.includes("үүрэг") || lower.includes("ойлгох")) {
        responseText = "Ойлголоо, багш аа. Би 'Бүтээлч уншлага-2' төслийн хүрээнд сурагчдын PISA унших чадварыг хөгжүүлэх жишиг даалгавар боловсруулах болон багш танд дидактик арга зүйн дэмжлэг үзүүлэх AI Менторын үүргээ бүрэн ухамсарлаж байна. Хоёулаа хамтраад чанартай даалгаврын сан бүрдүүлцгээе!";
      } else if (lower.includes("pisa") || lower.includes("даалгавар")) {
        responseText = "PISA стандартын даалгавар нь сурагчдын эх бичвэрийг задлан шинжлэх, мэдээллийг олох, эргэцүүлэн дүгнэх 3 үндсэн чадварыг сорьдог. Зүүн талын цонхонд эх бичвэрээ оруулаад '⚡ Даалгавар боловсруулах' товчийг дараарай.";
      } else {
        responseText = `Багш аа, таны дурдсан "${userQuery.slice(0, 35)}..." асуудлын дагуу арга зүйн зөвлөмж болон даалгаврын бүтцийг оновчтой болгоход би туслахад бэлэн байна.`;
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bagsh", text: responseText }
      ]);
    }, 600);
  };

  // 2. Даалгавар боловсруулах функц
  const handleGenerateTasks = () => {
    if (!storyText.trim()) {
      alert("Эх бичвэрээ оруулна уу!");
      return;
    }

    setIsGenerating(true);

    // AI даалгавар боловсруулж буй үйл явц (1.5 сек)
    setTimeout(() => {
      setGeneratedTasks([
        {
          num: 1,
          type: "Мэдээлэл олох",
          points: 1,
          question: "Эх бичвэрт гарч буй Бөөдэй болон зохиогч хоёр уулзах болсон гол шалтаг юу байсан бэ?",
          answer: "Цээлийн тойром нуурлаж, тэдний адуу тэмээ усны үнэрээр цуван ирэх болсон явдал."
        },
        {
          num: 2,
          type: "Задлан шинжлэх",
          points: 2,
          question: "'Өглөөдөө үзэгдэх хөвчийн манан шиг байжээ' гэсэн адилтгалаар зохиолч юуг илэрхийлэхийг хүссэн бэ?",
          answer: "Арван долоон насанд тохиосон жаргалтай мөч нь хурдан өнгөрч, дурсамж болон үлдсэнийг батлан харуулж байна."
        },
        {
          num: 3,
          type: "Дүгнэн эргэцүүлэх",
          points: 2,
          question: "Бөөдэйн морио арчлах үйлдэл болон зан чанарыг эх бичвэрээс эш татан тайлбарлана уу.",
          answer: "'Олмоо тавиад, эмээлээ өргөн, мориныхоо нурууг нар харвахаас болгоомжлон салхи оруулж сүүдэрлэн зогссон' нь малд хайртай, ажилч занг харуулна."
        },
        {
          num: 4,
          type: "PISA Стандарт баримтлах",
          points: 2,
          question: "Зохиогчийн Бөөдэйг хүлээж зогсохдоо мэдэрч байсан сэтгэлийн догдлолыг илтгэх 2 өгүүлбэрийг олно уу.",
          answer: "1. 'Дөрөө зуран эргэх яг л тэр агшинд бөхийн цацаж...'\n2. 'Энэ бол миний арван долоон насанд хамгийн жаргалтай мөч байлаа.'"
        },
        {
          num: 5,
          type: "Нэгтгэн дүгнэх",
          points: 2,
          question: "Эх бичвэрийн орчин болон баатруудын сэтгэл зүйн холбоог PISA-ийн түвшинд дүгнэн бичнэ үү.",
          answer: "Хөдөөгийн байгаль, адуу тэмээний бэлчээр нь залуусын цагаан сэтгэл, догдлолыг тодотгож байна."
        },
        {
          num: 6,
          type: "Бүтээлч эргэцүүлэл",
          points: 3,
          question: "Та өөрийн насанд тохиосон хамгийн дурсгалт мөчөө зохиолын баатрын мэдрэмжтэй харьцуулан 3 өгүүлбэрт багтаан бичээрэй.",
          answer: "Сурагчийн хувийн үзэл бодол, эргэцүүлэн бичих чадварыг үнэлнэ."
        }
      ]);
      setIsGenerating(false);
    }, 1200);
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
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        
        {/* ЛОГО */}
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
              Бүтээлч уншлага-2 төсөл
            </h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0", fontWeight: "500" }}>
              Creative reading-2 project
            </p>
          </div>
        </div>

        {/* ТӨВ ХЭСЭГ */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{
            backgroundColor: "#fbbf24",
            border: "1px solid #f59e0b",
            padding: "4px 18px",
            borderRadius: "12px"
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
              Mentor AI Цэндао багштай
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            <button type="button" style={{
              backgroundColor: "#fde68a",
              border: "1px solid #fcd34d",
              padding: "5px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#0f172a",
              cursor: "pointer"
            }}>
              PISA шалгалтын жишиг даалгавар боловсруулах
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
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>мэргэжил, арга зүйн яриа өрнүүлэх</span>
              <span style={{ fontSize: "10px" }}>{isChatOpen ? "▲" : "▼"}</span>
            </button>
          </div>
        </div>

        {/* МЕНТОР */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>Таны Ментор</p>
            <p style={{ fontSize: "10px", fontWeight: "600", color: "#059669", margin: "2px 0 0 0", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }}></span>
              Онлайн
            </p>
          </div>
          
          <div style={{
            width: "72px",
            height: "72px",
            minWidth: "72px",
            borderRadius: "50%",
            border: "3px solid #f59e0b",
            overflow: "hidden",
            backgroundColor: "#fef3c7",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
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
              <span style={{ fontSize: "32px" }}>👨‍🏫</span>
            )}
          </div>
        </div>

      </header>

      {/* ЧАТ ХЭСЭГ */}
      {isChatOpen && (
        <section style={{
          maxWidth: "1280px",
          margin: "0 auto 16px auto",
          backgroundColor: "#fffdf0",
          border: "1.5px solid #fcd34d",
          borderRadius: "14px",
          padding: "10px 14px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "6px", marginBottom: "8px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
              <span>💬</span> Цэндао багштай арга зүйн яриа өрнүүлэх
            </h3>
            <button 
              type="button"
              onClick={() => setIsChatOpen(false)}
              style={{ fontSize: "11px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px 8px", cursor: "pointer", fontWeight: "600" }}
            >
              Хураах ✕
            </button>
          </div>

          <div style={{ height: "140px", backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid #fde68a", padding: "10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#dcfce7" : "#fef3c7",
                  color: "#0f172a",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  maxWidth: "75%",
                  fontSize: "13px",
                  lineHeight: "1.4",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                }}
              >
                {msg.sender === "bagsh" && <strong>👨‍🏫 Цэндао багш: </strong>}
                {msg.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "8px", alignItems: "flex-end" }}>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Багш та асуултаа энд бичээд бүрэн нягтлан хараарай... (Shift + Enter-ээр шинэ мөр авна)"
              rows={2}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1.5px solid #fcd34d",
                borderRadius: "8px",
                fontSize: "13px",
                outline: "none",
                resize: "vertical",
                minHeight: "48px",
                fontFamily: "inherit"
              }}
            />
            <button 
              type="button" 
              onClick={handleSendMessage}
              style={{ 
                backgroundColor: "#fbbf24", 
                border: "none", 
                color: "#0f172a", 
                fontWeight: "bold", 
                padding: "12px 20px", 
                borderRadius: "8px", 
                fontSize: "13px", 
                cursor: "pointer",
                height: "48px",
                flexShrink: 0
              }}
            >
              Илгээх
            </button>
          </div>
        </section>
      )}

      {/* ҮНДСЭН АЖЛЫН ХЭСЭГ (8:5 БА 8:3 ХАРЬЦАА) */}
      <div style={{ 
        maxWidth: "1280px", 
        margin: "0 auto", 
        display: "grid", 
        gridTemplateColumns: "5fr 3fr", 
        gap: "16px" 
      }}>
        
        {/* ЗҮҮН ТАЛ: ЭХ БИЧВЭР */}
        <section style={{ 
          backgroundColor: "#fffdf0", 
          borderRadius: "16px", 
          border: "1.5px solid #fde68a", 
          padding: "18px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between", 
          minHeight: "580px" 
        }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#fbbf24", display: "inline-block" }}></span>
                Эх бичвэр
              </h3>

              <button type="button" style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                Даалгаврын сан ➔
              </button>
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "6px" }}>Хичээл сонгох:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: selectedSubject === sub ? "#0284c7" : "#38bdf8",
                      color: "#ffffff"
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Эх бичвэрийн гарчиг</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Эх бичвэрийн гарчгийг оруулна уу..." 
                style={{ 
                  width: "100%", 
                  padding: "10px 12px", 
                  border: "1.5px solid #fde68a", 
                  borderRadius: "8px", 
                  fontSize: "14px", 
                  fontWeight: "500",
                  boxSizing: "border-box" 
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "4px" }}>Унших эх бичвэр (Эх сурвалж)</label>
              <textarea 
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Эх бичвэрээ оруулаарай." 
                style={{ 
                  width: "100%", 
                  height: "280px", 
                  padding: "12px", 
                  border: "1.5px solid #fde68a", 
                  borderRadius: "8px", 
                  fontSize: "14.5px", 
                  lineHeight: "1.6",
                  resize: "vertical", 
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }}
              />
            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "14px" }}>
            <button 
              type="button" 
              onClick={handleGenerateTasks}
              disabled={isGenerating}
              style={{ 
                width: "100%", 
                backgroundColor: isGenerating ? "#93c5fd" : "#059669", 
                color: "#ffffff", 
                border: "none", 
                padding: "12px", 
                borderRadius: "10px", 
                fontWeight: "bold", 
                fontSize: "14px", 
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {isGenerating ? "⏳ Даалгавар боловсруулж байна..." : "⚡ Даалгавар боловсруулах"}
            </button>
          </div>

        </section>

        {/* БАРУУН ТАЛ: АСУУЛТ ДААЛГАВАР */}
        <section style={{ 
          backgroundColor: "#fffdf0", 
          borderRadius: "16px", 
          border: "1.5px solid #fde68a", 
          padding: "18px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between", 
          minHeight: "580px" 
        }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #fde68a", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#fbbf24", display: "inline-block" }}></span>
                Асуулт даалгавар
              </h3>

              <button type="button" style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                Хяналт шинжилгээ ➔
              </button>
            </div>

            {/* БОЛОВСРУУЛСАН ДААЛГАВАР ХАРАГДАХ ЦОНХ */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fde68a", padding: "16px", height: "420px", overflowY: "auto" }}>
              
              {isGenerating ? (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#0284c7" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>⚡</div>
                  <p style={{ fontWeight: "bold", fontSize: "14px" }}>PISA Стандарт даалгавар боловсруулж байна...</p>
                  <p style={{ fontSize: "12px", color: "#64748b" }}>Түр хүлээнэ үү.</p>
                </div>
              ) : generatedTasks ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ backgroundColor: "#fef3c7", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", color: "#92400e" }}>
                    ✅ {selectedSubject}: {title.slice(0, 30)}... (6 Даалгавар / 12 Оноо)
                  </div>
                  {generatedTasks.map((t) => (
                    <div key={t.num} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", backgroundColor: "#f8fafc" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "bold", fontSize: "12px", color: "#0284c7" }}>
                          Даалгавар {t.num} ({t.type})
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: "bold", backgroundColor: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "4px" }}>
                          {t.points} оноо
                        </span>
                      </div>
                      <p style={{ fontSize: "12.5px", fontWeight: "600", color: "#1e293b", margin: "0 0 6px 0", lineHeight: "1.4" }}>
                        {t.question}
                      </p>
                      <p style={{ fontSize: "11.5px", color: "#059669", margin: 0, backgroundColor: "#f0fdf4", padding: "6px", borderRadius: "4px" }}>
                        💡 <strong>Загвар хариулт:</strong> {t.answer}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "10px" }}>
                    📝
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#334155", margin: "0 0 6px 0" }}>
                    PISA Стандарт 6 Даалгавар (12 Оноо)
                  </p>
                  <p style={{ fontSize: "12px", color: "#64748b", maxWidth: "240px", margin: 0, lineHeight: "1.5" }}>
                    Зүүн талд хичээлээ сонгон, эх бичвэрээ оруулж "Даалгавар боловсруулах" товчийг дарснаар асуултууд энд бэлэн болно.
                  </p>
                </div>
              )}

            </div>
          </div>

          <div style={{ paddingTop: "12px", borderTop: "1px solid #fde68a", marginTop: "14px" }}>
            <button 
              type="button" 
              onClick={() => {
                if (!generatedTasks) {
                  alert("Эхлээд даалгавар боловсруулна уу!");
                } else {
                  alert("Даалгавар амжилттай баталгаажиж, санд хадгалагдлаа!");
                }
              }}
              style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}
            >
              💾 Даалгаврыг баталж, санд илгээх
            </button>
          </div>

        </section>

      </div>

    </main>
  );
}