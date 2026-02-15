"use client"

import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight } from "lucide-react"

const MAX_LENGTH = 1000
const MIN_LENGTH = 50

interface TextInputProps {
  text: string
  onChange: (text: string) => void
  onSubmit: () => void
  loading: boolean
}

export function TextInput({ text, onChange, onSubmit, loading }: TextInputProps) {
  const charCount = text.length
  const isValid = charCount >= MIN_LENGTH && charCount <= MAX_LENGTH

  return (
    <div className="flex flex-col gap-3">
      <div className="relative group">
        <textarea
          placeholder="자소서를 그대로 붙여넣으세요 (최소 50자, 최대 1,000자)"
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= MAX_LENGTH) {
              onChange(e.target.value)
            }
          }}
          aria-label="자소서 입력"
          className="w-full min-h-[220px] resize-none rounded-xl border border-border bg-card px-5 py-4 text-[15px] leading-7 text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
        />
        {/* Scan effect while loading */}
        {loading && (
          <div className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
            <div className="animate-scan-line absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          <span className={charCount >= MIN_LENGTH ? "text-primary font-medium" : ""}>
            {charCount.toLocaleString()}
          </span>
          <span className="text-muted-foreground/50">{" / "}{MAX_LENGTH.toLocaleString()}{"자"}</span>
          {charCount > 0 && charCount < MIN_LENGTH && (
            <span className="ml-2 text-muted-foreground/70">
              {"("}{MIN_LENGTH - charCount}{"자 더 입력해주세요)"}
            </span>
          )}
        </p>

        <Button
          onClick={onSubmit}
          disabled={!isValid || loading}
          size="lg"
          className="rounded-lg px-6 font-semibold text-[14px] h-10 gap-2 shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              분석 중
            </>
          ) : (
            <>
              점검 시작
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
