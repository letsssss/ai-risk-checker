# v0용 프론트엔드 스펙 (자소서 AI 문체 오해 가능성 점검)

## 1. 페이지 구조 (한 화면에 모두)

### 상단
- **타이틀**: "자소서 AI 문체 오해 가능성 점검"
- **설명**: "본 서비스는 AI 사용 여부를 판별하지 않으며, AI 문체와 유사한 표현 패턴을 바탕으로 제출 시 오해 가능성을 점검하는 참고 자료를 제공합니다."

### 입력 영역
- **textarea**: placeholder "자소서를 그대로 붙여넣으세요 (최소 50자, 최대 1000자)"
  - 최대 1000자 제한
  - 현재 글자 수 표시: "※ 최소 50자, 최대 1000자. (현재 N자 / 1000자)"
- **버튼**: "점검 시작" (50자 미만이면 비활성화, 로딩 중에는 "분석 중...")

---

### 결과 영역 (분석 후 표시)

#### 무료로 보이는 부분
- **헤더**: "AI 문체 오해 가능성: {riskLevel} ({similarityScore}%)"
- **한 줄**: "→ 최근 기업 AI 필터 기준상 {안전|주의|위험} 단계"
- **한 줄**: "위험 문장 {riskSentenceCount}개 발견"
- **요약**: headline (있을 때만)
- **맛보기 박스**: "위험 문장 예시 (일부 공개)"
  - 문장: "{sampleSentence}"
  - 설명: "→ {sampleReason}"

#### 잠금 영역 (결제 전)
- "⚠️ 현재 상태로 제출 시 AI 사용 의심 가능성이 있습니다."
- "다음 내용을 확인하지 않으면 실제 평가 단계에서 AI 사용 의심 항목으로 분류될 가능성이 있습니다:"
- 리스트: AI 유사 표현 위치 표시, 수정 권장 문장 5개, 감점 가능성 분석, 개선 후 예상 점수 변화
- "※ 현재 상태에서는 수정 없이 제출하는 것을 권장하지 않습니다."
- 가격: "정가 ₩9,900" (취소선) "오늘 한정 ₩4,900" (강조)
- "카카오페이 QR 결제 후 아래 버튼을 눌러주세요."
- QR 이미지: /qr.png
- 버튼: "📱 카카오페이 QR 보기"
- 버튼: "결제 완료했습니다" (클릭 시 paid=true → 상세 공개)

#### 결제 후 보이는 상세
1. **수정 전 / 수정 후 비교** (여러 쌍 가능)
   - 각 쌍: "❌ 원문" + 문장, "✅ 개선 예시" + 문장
   - 데이터: beforeAfterExamples: [{ original, improved }]
2. **AI 유사 패턴 점수**
   - 추상 표현 비율: N%
   - 일반화 문장 비율: N%
   - 주어 반복 패턴: 낮음|보통|높음
   - 구체 사례 밀도: 낮음|보통|높음
3. **대기업 서류 AI 필터 기준 추정**
   - penaltyScenarios: string[] (예: "추상 문장 비율 60% 이상 → 1차 경고")
4. **상세 분석**: bullets: string[]

---

## 2. API 연동

- **POST** `/api/analyze`
- **Body**: `{ "text": string }` (50~1000자)
- **Response**: `{ result: { riskLevel, similarityScore?, riskSentenceCount?, headline?, sampleSentence?, sampleReason?, beforeAfterExamples?, abstractRatio?, generalRatio?, subjectRepeat?, concreteDensity?, penaltyScenarios?, bullets? } }`

---

## 3. 상태

- text, loading, result, paid, error
- paid=false → 잠금 영역 표시, paid=true → 수정 전/후, 패턴 점수, 감점 시나리오, bullets 표시

---

## 4. 현재 메인 페이지 코드 (참고용)

아래는 지금 프로젝트의 `app/page.tsx` 전체입니다. v0에 붙여넣고 "이 구조 유지하면서 UI만 새로 디자인해줘" 또는 "Tailwind/ shadcn 스타일로 바꿔줘" 식으로 요청하면 됩니다.

```tsx
// app/page.tsx 전체는 프로젝트의 app/page.tsx 파일을 그대로 복사해서 사용하세요.
// 줄 수 제한으로 여기에는 생략합니다. 아래 경로에서 열어서 v0에 붙여넣으면 됩니다.
// 경로: ai-risk-checker/app/page.tsx
```
