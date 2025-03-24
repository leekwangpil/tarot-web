import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { question, cards } = await request.json();

    const prompt = `타로 카드 해석을 해주세요.
질문: ${question}
뽑은 카드: ${cards.join(', ')}

각 카드의 의미와 질문에 대한 해석을 종합적으로 설명해주세요. 
해석은 친근하고 이해하기 쉬운 어조로 작성해주세요.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '당신은 전문적인 타로 카드 리더입니다. 카드의 의미를 정확하게 해석하고, 질문자에게 도움이 되는 통찰력 있는 조언을 제공합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      reading: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '타로 해석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
