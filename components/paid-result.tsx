"use client"

import { ArrowRight, BarChart3, AlertCircle, FileText, X, Check } from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

interface PaidResultProps {
  result: AnalysisResult
}

function getPatternLevel(value: string) {
  switch (value) {
    case "낮음":
      return { color: "text-emerald-600", bg: "bg-emerald-100 text-emerald-700" }
    case "보통":
      return { color: "text-amber-600", bg: "bg-amber-100 text-amber-700" }
    case "높음":
      return { color: "text-red-600", bg: "bg-red-100 text-red-700" }
    default:
      return { color: "text-muted-foreground", bg: "bg-muted text-muted-foreground" }
  }
}

export function PaidResult({ result }: PaidResultProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      {/* Before/After */}
      {result.beforeAfterExamples && result.beforeAfterExamples.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
            <ArrowRight className="h-4 w-4 text-primary" />
            <h3 className="text-[13px] font-semibold text-foreground">수정 전 / 수정 후 비교</h3>
          </div>
          <div className="p-5 flex flex-col gap-5">
            {result.beforeAfterExamples.map((example, index) => (
              <div key={index} className="flex flex-col gap-2">
                {index > 0 && <div className="border-t border-border -mx-5 mb-3" />}
                {/* Before */}
                <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 flex-shrink-0 mt-0.5">
                    <X className="h-3 w-3 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-red-500 mb-1">원문</p>
                    <p className="text-[13px] text-foreground leading-relaxed">{example.original}</p>
                  </div>
                </div>
                {/* After */}
                <div className="flex items-start gap-3 rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-emerald-500 mb-1">개선 예시</p>
                    <p className="text-[13px] text-foreground leading-relaxed">
                      {example.improved ?? "원문에 구체적 경험·숫자·사례를 넣어 수정해 보세요."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Pattern Scores */}
      {(result.abstractRatio !== undefined ||
        result.generalRatio !== undefined ||
        result.subjectRepeat ||
        result.concreteDensity) && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="text-[13px] font-semibold text-foreground">AI 유사 패턴 점수</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.abstractRatio !== undefined && (
                <PatternBar label="추상 표현 비율" value={result.abstractRatio} />
              )}
              {result.generalRatio !== undefined && (
                <PatternBar label="일반화 문장 비율" value={result.generalRatio} />
              )}
              {result.subjectRepeat && (
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-[13px] text-muted-foreground">주어 반복 패턴</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${getPatternLevel(result.subjectRepeat).bg}`}>
                    {result.subjectRepeat}
                  </span>
                </div>
              )}
              {result.concreteDensity && (
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-[13px] text-muted-foreground">구체 사례 밀도</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${getPatternLevel(result.concreteDensity).bg}`}>
                    {result.concreteDensity}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Penalty Scenarios */}
      {result.penaltyScenarios && result.penaltyScenarios.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <h3 className="text-[13px] font-semibold text-foreground">대기업 서류 AI 필터 기준 추정</h3>
          </div>
          <div className="p-5 flex flex-col gap-2">
            {result.penaltyScenarios.map((scenario, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3"
              >
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-[13px] text-foreground leading-relaxed">{scenario}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Bullets */}
      {result.bullets && result.bullets.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-[13px] font-semibold text-foreground">상세 분석</h3>
          </div>
          <div className="p-5">
            <ul className="flex flex-col gap-3">
              {result.bullets.map((bullet, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[13px] text-foreground/80 leading-relaxed"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function PatternBar({ label, value }: { label: string; value: number }) {
  const barColor =
    value > 60
      ? "bg-red-400"
      : value > 35
        ? "bg-amber-400"
        : "bg-emerald-400"

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted/50 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">{label}</span>
        <span className="text-[13px] font-bold text-foreground tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  )
}
