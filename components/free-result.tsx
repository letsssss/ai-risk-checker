"use client"

import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

interface FreeResultProps {
  result: AnalysisResult
}

function getRiskConfig(level: string) {
  switch (level) {
    case "낮음":
      return {
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        pillBg: "bg-emerald-100 text-emerald-700",
        icon: CheckCircle,
        ringColor: "stroke-emerald-500",
        trackColor: "stroke-emerald-100",
      }
    case "보통":
      return {
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        pillBg: "bg-amber-100 text-amber-700",
        icon: AlertTriangle,
        ringColor: "stroke-amber-500",
        trackColor: "stroke-amber-100",
      }
    case "높음":
      return {
        text: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        pillBg: "bg-red-100 text-red-700",
        icon: ShieldAlert,
        ringColor: "stroke-red-500",
        trackColor: "stroke-red-100",
      }
    default:
      return {
        text: "text-muted-foreground",
        bg: "bg-muted",
        border: "border-border",
        pillBg: "bg-muted text-muted-foreground",
        icon: AlertTriangle,
        ringColor: "stroke-muted-foreground",
        trackColor: "stroke-muted",
      }
  }
}

// API는 0~1(예: 0.95) 또는 0~100(예: 95)으로 올 수 있음 → 항상 0~100으로 표시
function toPercent(value: number | undefined): number {
  if (value == null) return 0
  return value <= 1 ? Math.round(value * 100) : Math.round(value)
}

export function FreeResult({ result }: FreeResultProps) {
  const config = getRiskConfig(result.riskLevel)
  const RiskIcon = config.icon
  const score = toPercent(result.similarityScore) // 0~100으로 통일해 표시·게이지에 사용
  const circumference = 2 * Math.PI * 40

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      {/* Risk Score Card */}
      <div className={`rounded-xl border ${config.border} ${config.bg} p-6`}>
        <div className="flex items-center gap-6">
          {/* Circular gauge */}
          <div className="relative flex-shrink-0">
            <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
              <circle
                cx="48" cy="48" r="40"
                fill="none"
                strokeWidth="6"
                className={config.trackColor}
              />
              <circle
                cx="48" cy="48" r="40"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                className={config.ringColor}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * score) / 100}
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold tabular-nums ${config.text}`}>
                {score}
              </span>
              <span className="text-[10px] text-muted-foreground">{"/ 100"}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <RiskIcon className={`h-4 w-4 flex-shrink-0 ${config.text}`} />
              <span className={`text-sm font-semibold ${config.text}`}>
                AI 문체 오해 가능성
              </span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.pillBg}`}>
                {result.riskLevel}
              </span>
            </div>
            <p className="text-[13px] text-foreground/70 leading-relaxed">
              {"최근 기업 AI 필터 기준상 "}
              <span className={`font-semibold ${config.text}`}>{result.riskLevel}</span>
              {" 단계"}
              {result.riskSentenceCount !== undefined && (
                <span className="text-muted-foreground">
                  {" \u00B7 위험 문장 "}{result.riskSentenceCount}{"개"}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Headline */}
      {result.headline && (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-[14px] text-foreground leading-relaxed">
            {result.headline}
          </p>
        </div>
      )}

      {/* Sample Sentence */}
      {result.sampleSentence && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/50">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[13px] font-medium text-foreground/80">
              위험 문장 예시
            </span>
            <span className="text-[11px] text-muted-foreground">{"(일부 공개)"}</span>
          </div>
          <div className="p-5 flex flex-col gap-3">
            <p className="text-[14px] text-foreground leading-relaxed italic">
              {`\u201C${result.sampleSentence}\u201D`}
            </p>
            {result.sampleReason && (
              <p className="text-[13px] text-amber-600 leading-relaxed pl-3 border-l-2 border-amber-300">
                {result.sampleReason}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
