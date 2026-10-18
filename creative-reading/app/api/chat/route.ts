import { NextResponse } from 'next/server';

const BLUEPRINT_INSTRUCTIONS = `
ТА БОЛ "БҮТЭЭЛЧ УНШЛАГА-2" ТӨСЛИЙН МЕНТОР ЦЭНДАО БАГШ ЮМ.
Та багш нарт PISA стандартын дагуу 6 хичээлээр (Уран зохиол, Хими, Биологи, Түүх, Физик, Газар зүй) даалгавар боловсруулахад тусална.

ҮНЭЛГЭЭНИЙ ХАТУУ БЛЮПРИНТ БОЛОН РУБРИК (Нийт 6 даалгавар, 12 оноо):
- Даалгавар 1: Сонгох тест | Мэдээлэл олох сэргээн санах | ABCD сонголтоос зөв нэг хариултыг сонгох | Оноо: 0-1 | Рубрик: Зөв сонгосон бол 1 оноо, буруу сонгосон бол 0 оноо
- Даалгавар 2: Задгай даалгавар | Мэдээлэл олох сэргээн санах | Эхээс холбогдох нэг өгүүлбэр олж бичих | Оноо: 0-1 | Рубрик: Зөв олсон бол 1 оноо, огт бичээгүй бол 0 оноо
- Даалгавар 3: Задгай даалгавар | Задлан шинжлэх | 1-2 өгүүлбэр бичих | Оноо: 0-2 | Рубрик: Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, тайлбар дутуу бол 1 оноо, Бичээгүй бол 0 оноо
- Даалгавар 4: Задгай даалгавар | Задлан шинжлэх | 1-2 өгүүлбэр бичих | Оноо: 0-2 | Рубрик: Зөв тайлбарлан 1-2 өгүүлбэрээр бичсэн бол 2 оноо, тайлбар дутуу бол 1 оноо, Бичээгүй бол 0 оноо
- Даалгавар 5: Задгай даалгавар | Эргэцүүлэн дүгнэх | 2-3 өгүүлбэр бичих | Оноо: 0-3 | Рубрик: 2-3 өгүүлбэрээр шинэ санаа гарган дүгнэсэн бол 3 оноо, шинэ санаагүй бол 2 оноо, дутуу бол 1 оноо
- Даалгавар 6: Задгай даалгавар | Эргэцүүлэн дүгнэх | 2-3 өгүүлбэр бичих | Оноо: 0-3 | Рубрик: 2-3 өгүүлбэрээр шинэ санаа гарган дүгнэсэн бол 3 оноо, шинэ санаагүй бол 2 оноо, дутуу бол 1 оноо

ЭХ БИЧВЭРИЙН ДҮРЭМ:
- Уран зохиол хичээлд: 5 эх бүгд ДАН БИЧВЭР.
- Бусад 5 хичээлд (Хими, Биологи, Түүх, Физик, Газар зүй): 1-2 даалгавар ДАН БИЧВЭР, 3-6 даалгавар ХҮСНЭГТ/ДИАГРАММ/СХЕМ/ЗУРАГ-тай байна.

ДАРХАЛСАН ДҮРЭМ:
1. Хариултыг ЗӨВХӨН Монгол хэлээр бичнэ. Гадаад үг, англи үг (campaign, objective гэх мэт) ашиглаж болохгүй.
2. Даалгавар боловсруулах үед зөвхөн JSON массив буцаана.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, message, subject, textContent } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY тохируулаагүй байна." }, { status: 400 });
    }

    let chatPrompt = '';

    if (action === 'generate_tasks') {
      chatPrompt = `
${BLUEPRINT_INSTRUCTIONS}

[СОНГОСОН ХИЧЭЭЛ]: ${subject || 'Ерөнхий'}
[ЭХ БИЧВЭР]:
${textContent}

Дээрх эхэд тохируулан 6 даалгаврыг доорх JSON бүтцээр үүсгэ.
[
  {
    "no": 1,
    "cognitive": "Мэдээлэл олох сэргээн санах",
    "type": "Сонгох тест",
    "score": "0-1",
    "action": "ABCD сонголтоос зөв нэг хариултыг сонгох",
    "question": "Асуулт...",
    "options": ["А. Сонголт 1", "Б. Сонголт 2", "В. Сонголт 3", "Г. Сонголт 4"],
    "answer": "Б. Сонголт 2",
    "rubric": "Зөв сонгосон бол 1 оноо, буруу сонгосон бол 0 оноо"
  },
  ...
]
`;
    } else {
      chatPrompt = `
${BLUEPRINT_INSTRUCTIONS}

Та бол Багшийн Танхимын ментор Цэндао багш. Таны зорилго бол "Бүтээлч уншлага-2" төслийн 6 хичээлээр багш нарт зөвлөгөө өгөх.
[Сонгосон хичээл]: ${subject || 'Ерөнхий'}
[Багшийн асуулт]: ${message}

Монгол хэлээр ойлгомжтой, тодорхой туслах хариулт өгнө үү.
`;
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Creative Reading Project',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct',
        messages: [{ role: 'user', content: chatPrompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data?.error?.message || 'API Алдаа' }, { status: 500 });
    }

    const replyText = data.choices?.[0]?.message?.content || '';

    if (action === 'generate_tasks') {
      try {
        const jsonMatch = replyText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return NextResponse.json(JSON.parse(jsonMatch[0]));
        }
        return NextResponse.json(JSON.parse(replyText));
      } catch {
        return NextResponse.json({ error: "Даалгавар JSON форматаар ирсэнгүй. Дахин туршина уу." }, { status: 500 });
      }
    }

    return new Response(replyText, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

  } catch (error: any) {
    return NextResponse.json({ error: `Серверийн алдаа: ${error.message}` }, { status: 500 });
  }
}