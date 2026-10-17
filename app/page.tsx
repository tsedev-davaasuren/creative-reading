{/* ЧАТ */}
{isChatOpen && (
  <section style={{ maxWidth: "1280px", margin: "0 auto 16px auto", backgroundColor: "#fffdf0", border: "1.5px solid #fcd34d", borderRadius: "14px", padding: "12px 16px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #fde68a", paddingBottom: "6px", marginBottom: "10px" }}>
      <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>💬 Цэндао багштай ярилцах</h3>
      <button type="button" onClick={() => setIsChatOpen(false)} style={{ fontSize: "11px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px 8px", cursor: "pointer", fontWeight: "bold" }}>Хаах ✕</button>
    </div>
    
    {/* МЕССЕЖҮҮДИЙН ХЭСЭГ */}
    <div style={{ height: "160px", backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid #fde68a", padding: "10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
      {messages.map((msg) => (
        <div key={msg.id} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", backgroundColor: msg.sender === "user" ? "#dcfce7" : "#fef3c7", padding: "8px 12px", borderRadius: "10px", fontSize: "13px", maxWidth: "85%", lineHeight: "1.5" }}>
          {msg.sender === "bagsh" && <strong style={{ color: "#92400e" }}>👨‍🏫 Цэндао багш: </strong>} {msg.text}
        </div>
      ))}
    </div>

    {/* 🚀 АСУУЛТ БИЧИХ ТАЛБАРЫГ ӨРГӨН, ОЛОН МӨРТЭЙ ХАРДАГ БОЛГОСОН НЬ */}
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        rows={3}
        placeholder="Асуулт, эх бичвэр болон засаж сайжруулах саналаа энд бүтнээр нь бичээрэй... (Enter дарж илгээнэ, Shift+Enter-ээр шинэ мөр авна)"
        style={{
          flex: 1,
          padding: "10px 12px",
          border: "1.5px solid #fbbf24",
          borderRadius: "10px",
          fontSize: "13.5px",
          lineHeight: "1.6",
          fontFamily: "inherit",
          boxSizing: "border-box",
          resize: "vertical",
          minHeight: "70px",
          backgroundColor: "#ffffff"
        }}
      />
      <button
        type="button"
        onClick={handleSendMessage}
        style={{
          backgroundColor: "#fbbf24",
          color: "#78350f",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          fontWeight: "bold",
          fontSize: "13.5px",
          cursor: "pointer",
          height: "100%",
          minHeight: "70px"
        }}
      >
        Илгээх
      </button>
    </div>
  </section>
)}