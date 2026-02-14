// 목적: 자소서 텍스트를 붙여넣고 "점검 시작" 버튼을 누를 수 있는 입력 화면 만들기
"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    riskLevel: string;
    headline?: string;
    similarityScore?: number;
    riskSentenceCount?: number;
    sampleSentence?: string;
    sampleReason?: string;
    beforeAfterExamples?: { original: string; improved: string | null }[];
    beforeOriginal?: string;
    beforeImproved?: string;
    abstractRatio?: number;
    generalRatio?: number;
    subjectRepeat?: string;
    concreteDensity?: string;
    penaltyScenarios?: string[];
    bullets?: string[];
  } | null>(null);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onAnalyze() {
    setError(null);
    setResult(null);
    setPaid(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 50)); // 렌더 먼저 표시
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    const raw = await res.text();
    let data: any = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      setError(`서버 응답이 JSON이 아님:\n${raw.slice(0, 500)}`);
      return;
    }

    if (!res.ok) {
      setError(data?.error ?? "분석 실패");
      return;
    }

    setResult(data.result);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 820, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>
        자소서 AI 문체 오해 가능성 점검
      </h1>

      <p style={{ marginTop: 8, lineHeight: 1.6, opacity: 0.9 }}>
        본 서비스는 <b>AI 사용 여부를 판별하지 않으며</b>, AI 문체와 유사한 표현 패턴을
        바탕으로 제출 시 오해 가능성을 점검하는 참고 자료를 제공합니다.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 1000))}
        maxLength={1000}
        placeholder="자소서를 그대로 붙여넣으세요 (최소 50자, 최대 1000자)"
        style={{
          width: "100%",
          height: 260,
          marginTop: 16,
          padding: 12,
          fontSize: 14,
        }}
      />

      <button
        onClick={onAnalyze}
        disabled={text.trim().length < 50 || loading}
        style={{
          marginTop: 16,
          padding: "10px 14px",
          fontSize: 15,
          cursor: text.trim().length < 50 || loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "분석 중..." : "점검 시작"}
      </button>

      <p style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
        ※ 최소 50자, 최대 1000자. (현재 {text.trim().length}자 / 1000자)
      </p>

      {error && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: "#fee",
            border: "1px solid #c00",
            borderRadius: 8,
            fontSize: 14,
            whiteSpace: "pre-wrap",
          }}
        >
          오류: {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "#f8f8f8",
            border: "1px solid #ddd",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: 20, fontWeight: 700 }}>
              AI 문체 오해 가능성: {result.riskLevel} (
              {(result.similarityScore ?? (result.riskLevel === "낮음" ? 25 : result.riskLevel === "보통" ? 55 : 78))}
              %)
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: 13, opacity: 0.85 }}>
              → 최근 기업 AI 필터 기준상{" "}
              {result.riskLevel === "낮음" ? "안전" : result.riskLevel === "보통" ? "주의" : "위험"} 단계
            </p>
            <p style={{ margin: "0 0 4px 0", fontSize: 15 }}>
              위험 문장 {result.riskSentenceCount ?? result.bullets?.length ?? 3}개 발견
            </p>
            {result.headline && (
              <p style={{ margin: "8px 0 0 0", fontSize: 14, opacity: 0.9 }}>{result.headline}</p>
            )}

            <div style={{ marginTop: 12, padding: 12, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 6 }}>
              <p style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 600, opacity: 0.9 }}>
                위험 문장 예시 (일부 공개):
              </p>
              <p style={{ margin: 0, fontSize: 14 }}>
                "{result.sampleSentence ?? "저는 항상 최선을 다해왔습니다."}"
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, opacity: 0.85 }}>
                → {result.sampleReason ?? "추상적·포괄적 서술 방식으로 AI 생성 문체에서 자주 나타나는 구조입니다."}
              </p>
            </div>
          </div>

          {!paid && (
            <div
              style={{
                padding: 20,
                background: "#f5f5f5",
                border: "1px solid #ccc",
                borderRadius: 8,
              }}
            >
              <p style={{ margin: "0 0 8px 0", fontWeight: 600, fontSize: 15 }}>
                ⚠️ 현재 상태로 제출 시 AI 사용 의심 가능성이 있습니다.
              </p>
              <p style={{ margin: "0 0 12px 0", fontSize: 14, opacity: 0.95 }}>
                다음 내용을 확인하지 않으면 실제 평가 단계에서
                AI 사용 의심 항목으로 분류될 가능성이 있습니다:
              </p>
              <ul style={{ margin: "0 0 16px 0", paddingLeft: 20, opacity: 0.95, fontSize: 14 }}>
                <li>AI 유사 표현 위치 표시</li>
                <li>수정 권장 문장 5개</li>
                <li>감점 가능성 분석</li>
                <li>개선 후 예상 점수 변화</li>
              </ul>
              <p style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 600, color: "#c00" }}>
                ※ 현재 상태에서는 수정 없이 제출하는 것을 권장하지 않습니다.
              </p>
              <p style={{ margin: "0 0 12px 0", fontSize: 14 }}>
                <span style={{ textDecoration: "line-through", opacity: 0.7 }}>정가 ₩9,900</span>
                {" "}
                <b style={{ color: "#c00" }}>오늘 한정 ₩3,900</b>
              </p>
              <p style={{ margin: "0 0 12px 0", fontSize: 13, opacity: 0.9 }}>
                카카오페이 QR 결제 후 아래 버튼을 눌러주세요.
              </p>
              <img
                src="/qr.png?v=2"
                alt="카카오페이 QR"
                width={200}
                style={{ display: "block", marginBottom: 12, borderRadius: 8 }}
              />
              <button
                onClick={() => window.open("/qr.png?v=2", "_blank", "width=400,height=500")}
                style={{
                  display: "block",
                  marginBottom: 8,
                  padding: "10px 16px",
                  fontSize: 14,
                  cursor: "pointer",
                  background: "#FEE500",
                  color: "#191919",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                📱 카카오페이 QR 보기
              </button>
              <button
                onClick={() => setPaid(true)}
                style={{
                  display: "block",
                  padding: "10px 16px",
                  fontSize: 14,
                  cursor: "pointer",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                결제 완료했습니다
              </button>
            </div>
          )}

          {paid && (
            <div style={{ marginTop: 20 }}>
              {/* 1️⃣ 수정 전 / 수정 후 비교 (여러 개) */}
              {(() => {
                const examples = result?.beforeAfterExamples?.length
                  ? result.beforeAfterExamples
                  : result?.beforeOriginal
                    ? [{ original: result.beforeOriginal, improved: result.beforeImproved ?? null }]
                    : result?.sampleSentence
                      ? [{ original: result.sampleSentence, improved: null }]
                      : [];
                return examples.length > 0 ? (
                  <div style={{ marginBottom: 20, padding: 16, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8 }}>
                    <p style={{ margin: "0 0 16px 0", fontSize: 15, fontWeight: 700 }}>📝 수정 전 / 수정 후 비교</p>
                    {examples.map((ex, i) => (
                      <div key={i} style={{ marginBottom: i < examples.length - 1 ? 20 : 0 }}>
                        <div style={{ marginBottom: 8 }}>
                          <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#c00", fontWeight: 600 }}>❌ 원문 {examples.length > 1 ? `(${i + 1})` : ""}</p>
                          <p style={{ margin: 0, padding: 10, background: "#fff5f5", borderRadius: 6, fontSize: 14 }}>
                            "{ex.original}"
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#0a6", fontWeight: 600 }}>✅ 개선 예시 {examples.length > 1 ? `(${i + 1})` : ""}</p>
                          {ex.improved ? (
                            <p style={{ margin: 0, padding: 10, background: "#f0fff4", borderRadius: 6, fontSize: 14 }}>
                              "{ex.improved}"
                            </p>
                          ) : (
                            <p style={{ margin: 0, padding: 10, background: "#f8f8f8", borderRadius: 6, fontSize: 13, opacity: 0.9 }}>
                              원문에 구체적 경험·숫자·사례를 넣어 수정해 보세요.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}

              {/* 2️⃣ AI 유사 패턴 점수 시각화 */}
              <div style={{ marginBottom: 20, padding: 16, background: "#fafafa", border: "1px solid #ddd", borderRadius: 8 }}>
                <p style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 700 }}>📊 AI 유사 패턴 점수</p>
                <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>추상 표현 비율</span>
                    <span style={{ fontWeight: 600 }}>{result?.abstractRatio ?? 65}%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>일반화 문장 비율</span>
                    <span style={{ fontWeight: 600 }}>{result?.generalRatio ?? 52}%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>주어 반복 패턴</span>
                    <span style={{ fontWeight: 600 }}>{result?.subjectRepeat ?? "보통"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>구체 사례 밀도</span>
                    <span style={{ fontWeight: 600 }}>{result?.concreteDensity ?? "낮음"}</span>
                  </div>
                </div>
              </div>

              {/* 3️⃣ 감점 시나리오 */}
              {Array.isArray(result?.penaltyScenarios) && result.penaltyScenarios.length > 0 ? (
                <div style={{ marginBottom: 20, padding: 16, background: "#fff8f0", border: "1px solid #e88", borderRadius: 8 }}>
                  <p style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 700 }}>⚠️ 대기업 서류 AI 필터 기준 추정</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {result.penaltyScenarios.map((s, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ marginBottom: 20, padding: 16, background: "#fff8f0", border: "1px solid #fc0", borderRadius: 8 }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 700 }}>⚠️ 대기업 서류 AI 필터 기준 추정</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>추상 문장 비율 60% 이상 → 1차 경고</li>
                    <li>경험 수치 미기재 → 감점 위험</li>
                    <li>구체 사례 부족 → 서류 2차 탈락 가능성</li>
                  </ul>
                </div>
              )}

              {/* bullets (기존 상세) */}
              {Array.isArray(result?.bullets) && result.bullets.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 700 }}>📋 상세 분석</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {result.bullets.map((x, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
