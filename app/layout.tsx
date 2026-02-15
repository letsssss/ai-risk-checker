import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "자소서 AI 문체 오해 가능성 점검",
  description:
    "AI 문체와 유사한 표현 패턴을 바탕으로 자기소개서 제출 시 오해 가능성을 점검하는 참고 자료를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
