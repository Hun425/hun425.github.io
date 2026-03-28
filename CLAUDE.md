# Project Guidelines

## Excalidraw Architecture Diagram Style Guide

모든 아키텍처 다이어그램은 아래 규칙을 **반드시** 따른다.

### 스타일

| 항목 | 값 |
|------|------|
| 배경색 | `#ffffff` (흰색) |
| 테두리/텍스트 색 | `#1e1e1e` (검정) |
| 배경 채우기 | `transparent` (투명) |
| strokeWidth | `2` |
| roughness | `1` (hand-drawn 느낌) |
| roundness | `{ "type": 3 }` (둥근 모서리) |
| 컬러 사용 | **금지** — 순수 흑백 스케치만 |

### 글씨체

- **fontFamily: 1** (Virgil, hand-drawn) — **모든 텍스트에 통일**
- fontFamily 3(monospace) 등 다른 글씨체 혼용 금지
- 박스 내부 텍스트: fontSize 14~18
- 화살표 라벨 텍스트: fontSize 12~13
- 영역 그룹 라벨: fontSize 18

### 레이아웃

- **그리드 배치**: 열/행 구조로 정렬 (3열 × N행 권장)
- 박스 간 최소 간격: **60~80px**
- 박스 크기 통일: 너비 200~240, 높이 50~55
- 영역 그룹 박스: 내부 컴포넌트와 최소 **30px 패딩**

### 화살표

- **수평(좌→우) + 수직(위→아래) 직선만** 사용
- 대각선 화살표 **금지** — 꺾이는 경로(L자)로 대체
- 수직 화살표: 박스 하단 중앙 → 다음 박스 상단 중앙
- 수평 화살표: 박스 우측 중앙 → 다음 박스 좌측 중앙
- 비동기/보조 경로: `strokeStyle: "dashed"` 사용
- endArrowhead: `"arrow"`

### 화살표 라벨 배치

- 수평 화살표: 라벨을 화살표 **위쪽 10~20px** 에 배치
- 수직 화살표: 라벨을 화살표 **오른쪽 10px** 에 배치
- 라벨이 다른 박스/화살표와 **절대 겹치지 않도록** 배치
- textAlign: `"center"` (수평 라벨) 또는 `"left"` (수직 라벨)

### 파일 규칙

- 원본: `images/{name}.excalidraw`
- 배포용: `images/{name}.svg` (excalidraw.com에서 Export)
- HTML에서는 `.svg` 파일을 참조

### 기존 양식 참고

아래 파일들이 이 스타일의 기준 양식이다:
- `images/elasticsearch-architecture.png`
- `images/caffeine-architecture.png`
- `images/websocket-architecture.png`
- `images/saga-architecture.png`
- `images/stats-pipeline-architecture.svg` (최신 기준)
