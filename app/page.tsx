"use client";

import { useState } from "react";
import { TextInput } from "@/components/text-input";
import { FreeResult } from "@/components/free-result";
import { LockedSection } from "@/components/locked-section";
import { PaidResult } from "@/components/paid-result";
import { ShieldCheck } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

export default function Page() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (text.length < 50 || text.length > 1000) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setPaid(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const raw = await res.text();
      let data: { result?: AnalysisResult; error?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        setError("서버 응답을 처리할 수 없습니다. 다시 시도해 주세요.");
        return;
      }

      if (!res.ok) {
        setError(data?.error ?? "분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
        return;
      }

      if (data.result) setResult(data.result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "분석 중 오류가 발생했습니다. 다시 시도해 주세요."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[640px] px-5 py-16 md:py-24">
        <header className="flex flex-col items-center gap-5 mb-12">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight text-balance text-center md:text-2xl">
              자소서 AI 문체 오해 가능성 점검
            </h1>
            <p className="text-[13px] text-muted-foreground text-center leading-relaxed max-w-md">
              AI 사용 여부를 판별하지 않으며, AI 문체와 유사한 표현 패턴을 바탕으로
              제출 시 오해 가능성을 점검합니다.
            </p>
          </div>
        </header>

        <section className="mb-10" aria-label="자소서 입력 영역">
          <TextInput
            text={text}
            onChange={setText}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </section>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <section className="flex flex-col gap-5" aria-label="분석 결과">
            <FreeResult result={result} />
            {!paid ? (
              <LockedSection onPaymentComplete={() => setPaid(true)} />
            ) : (
              <PaidResult result={result} />
            )}
          </section>
        )}

        <footer className="mt-20 pt-6 border-t border-border">
          <p className="text-[11px] text-muted-foreground/60 text-center leading-relaxed">
            본 서비스는 AI 사용 여부를 판별하는 도구가 아닙니다.
            AI 문체와 유사한 표현 패턴을 바탕으로 오해 가능성을 점검하는 참고 자료입니다.
          </p>
        </footer>
      </div>
    </main>
  );
}
