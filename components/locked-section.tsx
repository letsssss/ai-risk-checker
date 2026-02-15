"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Lock, Check, Smartphone } from "lucide-react"

interface LockedSectionProps {
  onPaymentComplete: () => void
}

export function LockedSection({ onPaymentComplete }: LockedSectionProps) {
  const [qrOpen, setQrOpen] = useState(false)

  const lockedFeatures = [
    "AI 유사 표현 위치 표시",
    "수정 권장 문장 5개",
    "감점 가능성 분석",
    "개선 후 예상 점수 변화",
  ]

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
      <div className="relative rounded-xl border border-border bg-card overflow-hidden">
        {/* Blurred preview behind */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-muted/80 to-transparent pointer-events-none" />

        <div className="relative px-6 py-8 flex flex-col items-center text-center gap-5">
          {/* Lock icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>

          <div className="flex flex-col gap-2 max-w-sm">
            <h3 className="text-[15px] font-semibold text-foreground">
              상세 분석 리포트
            </h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              수정 없이 제출 시 AI 사용 의심 항목으로 분류될 수 있습니다. 다음 내용을 확인하세요.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {lockedFeatures.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] text-foreground/80"
              >
                <Check className="h-3 w-3 text-primary" />
                {feature}
              </span>
            ))}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-[15px] text-muted-foreground line-through">
              {"\u20A99,900"}
            </span>
            <span className="text-3xl font-bold text-foreground tracking-tight">
              {"\u20A93,900"}
            </span>
          </div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
            오늘 한정 할인
          </span>

          {/* Payment */}
          <div className="flex flex-col items-center gap-3 w-full max-w-[260px] mt-1">
            <Dialog open={qrOpen} onOpenChange={setQrOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-lg h-10 text-[13px]"
                >
                  <Smartphone className="h-4 w-4" />
                  카카오페이 QR 보기
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-center">카카오페이 QR 결제</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center p-4">
                  <div className="w-56 h-56 bg-muted rounded-xl flex items-center justify-center border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/qr.png"
                      alt="카카오페이 QR 코드"
                      className="w-full h-full object-contain rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          const fallback = document.createElement("p")
                          fallback.textContent = "QR 이미지를 등록해주세요"
                          fallback.className = "text-xs text-muted-foreground text-center px-4"
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  </div>
                </div>
                <p className="text-center text-[12px] text-muted-foreground pb-2">
                  QR 스캔 후 결제를 완료해주세요
                </p>
              </DialogContent>
            </Dialog>

            <Button
              onClick={onPaymentComplete}
              className="w-full font-semibold rounded-lg h-11 text-[14px] animate-pulse-glow"
              size="lg"
            >
              결제 완료했습니다
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground/70 mt-1">
            결제 후 즉시 상세 분석 결과를 확인할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  )
}
