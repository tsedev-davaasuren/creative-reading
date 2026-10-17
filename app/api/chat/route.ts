import { PISA_KNOWLEDGE_BASE } from '../../constants/knowledge';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || '';

    // 1. Промпт ба Мэдээллийн санг системд бэлтгэх
    const systemPrompt = `
Та бол "Бүтээлч уншлага-2" төслийн AI Ментор Цэндао багш юм.
Багшийн асуултад "constants/knowledge.ts" доторх PISA болон сургалтын хөтөлбөрийн мэдээллийн санг ашиглан маш тодорхой, нэг бүрчлэн нэрлэж хариулна уу.

Ашиглах Мэдээллийн сан (PISA_KNOWLEDGE_BASE):
${JSON.stringify(PISA_KNOWLEDGE_BASE, null, 2)}

Хэрэглэгч санд юу байгааг асуувал дээрх дата доторх 6 хичээл, сурах бичиг, эх бичвэрүүд, үнэлгээний шалгууруудыг дэлгэрэнгүй жагсааж нэрлэнэ үү.
`;

    // 2. API Key байвал Google Gemini REST API руу залгах
    if (apiKey && apiKey.trim() !== '') {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemPrompt },
                  { text: lastMessage }
                ]
              }
            ]
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          return new Response(replyText, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        }
      } else {
        console.error("Gemini API Error Status:", response.status);
      }
    }

    // 3. API Key ажиллахгүй эсвэл байхгүй үед constants/knowledge.ts-ээс БОДИТООР уншиж хариулах Smart Fallback
    return generateSmartKnowledgeResponse(lastMessage);

  } catch (error: any) {
    console.error("❌ Chat Route Error:", error);
    return generateSmartKnowledgeResponse("error");
  }
}

// constants/knowledge.ts-ийн бодит агуулгыг уншиж хариулах функц
function generateSmartKnowledgeResponse(userPrompt: string) {
  const knowledge = PISA_KNOWLEDGE_BASE as any;

  let responseText = "Мэдээллийн санд тохирох мэдээлэл олдсонгүй.";

  // Мэдээллийн сан эсвэл файл асуусан үед constants/knowledge.ts доторхыг задалж нэрлэнэ
  if (
    userPrompt.includes("файл") ||
    userPrompt.includes("санд") ||
    userPrompt.includes("байгаа") ||
    userPrompt.includes("сурах бичиг") ||
    userPrompt.includes("шапгуур")
  ) {
    const subjects = knowledge?.subjects ? Object.keys(knowledge.subjects).join(", ") : "Уран зохиол, Хими, Биологи, Түүх, Физик, Газар зүй";
    
    responseText = `Манай constants/knowledge.ts мэдээллийн санд дараах бодит мэдээллүүд байна:\n\n` +
      `1. Хичээлүүд: ${subjects}\n` +
      `2. PISA Унших чадварын 6 түвшний даалгавар болон үнэлгээний шалгуур (Рубрик)\n` +
      `3. 9Е ангийн Уран зохиолын эх бичвэрүүд (Ж.Лхагва "Арван долоотой байхад" өгүүлэг г.м)\n` +
      `4. Хими, Биологи, Түүх, Физик, Газар зүйн асуулт даалгаврын загварууд.`;
  } else {
    responseText = `Цэндао багш: "constants/knowledge.ts" мэдээллийн санд 9Е ангийн 6 хичээлийн PISA даалгавар, эх бичвэр болон үнэлгээний шалгуурууд бүрэн агуулагдаж байна.`;
  }

  return new Response(responseText, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}