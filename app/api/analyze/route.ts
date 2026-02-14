// 목적: 자소서 텍스트를 받아 "AI 문체 오해 가능성" 요약을 JSON으로 반환
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    console.log("✅ /api/analyze hit");
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY가 없습니다. .env.local을 확인하세요." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    const text = body?.text;
    console.log("text length =", (text ?? "").length);

    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return NextResponse.json(
        { error: "텍스트가 너무 짧습니다(최소 50자)." },
        { status: 400 }
      );
    }
    if (text.length > 1000) {
      return NextResponse.json(
        { error: "텍스트는 최대 1000자까지 가능합니다." },
        { status: 400 }
      );
    }

    const clipped = text.slice(0, 1000);

    // 사용자 텍스트에서 첫 문장 추출 (fallback용)
    const firstSentence = (() => {
      const trimmed = clipped.trim();
      const match = trimmed.match(/^[^.!?\n]+[.!?]?/);
      return (match?.[0]?.trim() || trimmed.slice(0, 80) || "저는 항상 최선을 다해왔습니다.").slice(0, 200);
    })();

    const system = `
너는 한국어 자소서 문체 점검기다.
AI 사용 여부를 판별하지 말고,
AI 자동 생성 문체와 유사해 '오해받을 수 있는' 패턴을 찾아 요약해라.
반드시 JSON만 출력해라.
riskLevel은 "낮음"|"보통"|"높음" 중 하나.
`.trim();

    const user = `
아래 자소서를 분석해 아래 JSON 형태로만 답해:
{
  "riskLevel": "낮음"|"보통"|"높음",
  "similarityScore": number,
  "riskSentenceCount": number,
  "headline": string,
  "sampleSentence": string,
  "sampleReason": string,
  "beforeAfterExamples": [{ "original": string, "improved": string }] (자소서에서 위험한 문장 3~5개를 원문+개선예시 쌍으로),
  "abstractRatio": number (0~100, 추상 표현 비율),
  "generalRatio": number (0~100, 일반화 문장 비율),
  "subjectRepeat": "낮음"|"보통"|"높음" (주어 반복 패턴),
  "concreteDensity": "낮음"|"보통"|"높음" (구체 사례 밀도),
  "penaltyScenarios": string[] (대기업 AI 필터 기준 추정. "추상 문장 60% 이상 → 1차 경고" 형태 2~3개),
  "bullets": string[]
}

sampleSentence는 자소서 원문에서 그대로 복사.
beforeAfterExamples는 최소 3개 이상. original은 자소서 원문 그대로, improved는 해당 original을 구체적 경험·숫자·사례를 넣어 개선한 문장. 각 원문마다 다르게 작성.
abstractRatio, generalRatio는 퍼센트 숫자. subjectRepeat, concreteDensity는 낮음/보통/높음.
penaltyScenarios는 "추상 문장 비율 60% 이상 → 1차 경고", "경험 수치 미기재 → 감점 위험" 등 실감나는 시나리오.

자소서:
"""${clipped}"""
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      // 추천: 출력이 길어지지 않게 (선택)
      temperature: 0.2,
    });

    const outputText = completion.choices[0]?.message?.content ?? "";

    // 🔥 JSON 블록만 추출 (앞뒤 설명 텍스트 무시)
    const jsonMatch = outputText.match(/\{[\s\S]*\}/);

    let parsed: any;

    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        parsed = {
          riskLevel: "보통",
          similarityScore: 50,
          riskSentenceCount: 3,
          headline: "JSON 파싱 실패",
          sampleSentence: firstSentence,
          sampleReason: "추상적·포괄적 서술 방식으로 AI 생성 문체에서 자주 나타나는 구조입니다",
          beforeAfterExamples: [{ original: firstSentence, improved: null }],
          abstractRatio: 65,
          generalRatio: 52,
          subjectRepeat: "보통",
          concreteDensity: "낮음",
          penaltyScenarios: [
            "추상 문장 비율 60% 이상 → 1차 경고",
            "경험 수치 미기재 → 감점 위험",
            "구체 사례 부족 → 서류 2차 탈락 가능성",
          ],
          bullets: ["모델이 JSON을 일부만 반환했습니다."],
          _raw: outputText.slice(0, 300),
        };
      }
    } else {
      parsed = {
        riskLevel: "보통",
        similarityScore: 50,
        riskSentenceCount: 3,
        headline: "JSON 형식이 감지되지 않음",
        sampleSentence: firstSentence,
        sampleReason: "추상적·포괄적 서술 방식으로 AI 생성 문체에서 자주 나타나는 구조입니다",
        beforeAfterExamples: [{ original: firstSentence, improved: null }],
        abstractRatio: 65,
        generalRatio: 52,
        subjectRepeat: "보통",
        concreteDensity: "낮음",
        penaltyScenarios: [
          "추상 문장 비율 60% 이상 → 1차 경고",
          "경험 수치 미기재 → 감점 위험",
          "구체 사례 부족 → 서류 2차 탈락 가능성",
        ],
        bullets: ["모델 출력에서 JSON 구조를 찾을 수 없습니다."],
        _raw: outputText.slice(0, 300),
      };
    }

    return NextResponse.json({ result: parsed });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "서버 오류" },
      { status: 500 }
    );
  }
}
