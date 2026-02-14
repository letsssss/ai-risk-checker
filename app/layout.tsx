export const metadata = {
  title: "자소서 AI 문체 오해 가능성 점검",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
