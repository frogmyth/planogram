# SVG → Three.js 좌표 변환 가이드

## 1. 좌표계 개요

### SVG 좌표계
- 원점: 왼쪽 상단 (0, 0)
- X축: 오른쪽으로 증가
- Y축: 아래쪽으로 증가
- 단위: 픽셀 (px)

### Three.js 좌표계 (본 프로젝트)
- 원점: 매장 왼쪽 상단 (북서쪽)
- X축: 오른쪽으로 증가 (동쪽)
- Z축: 아래쪽으로 증가 (남쪽)
- Y축: 위쪽으로 증가 (높이)
- 단위: 미터 (m)

## 2. 좌표 변환 공식 (범용)

### 2.1 스케일 계산 (매장마다 다름)

```
[입력값]
- 매장 실제 크기: WIDTH_M (미터), DEPTH_M (미터)
- SVG viewBox: VIEWBOX_W (px), VIEWBOX_H (px)

[스케일 계산]
- X_SCALE = WIDTH_M / VIEWBOX_W
- Z_SCALE = DEPTH_M / VIEWBOX_H

[변환 공식]
- Three.js X = SVG_X * X_SCALE
- Three.js Z = SVG_Y * Z_SCALE
```

### 2.2 거제 하나로마트 예시

```
매장 크기: 46.25m x 20.3m
SVG viewBox: 3700 x 2050 px

스케일:
- X_SCALE = 46.25 / 3700 = 0.0125 (≈ 1/80)
- Z_SCALE = 20.3 / 2050 = 0.0099 (≈ 1/101)

변환:
- Three.js X = SVG_X / 80
- Three.js Z = SVG_Y / 101
```

### 2.3 다른 매장 예시 (가상)

```
매장 크기: 30m x 15m
SVG viewBox: 3000 x 1500 px

스케일:
- X_SCALE = 30 / 3000 = 0.01 (= 1/100)
- Z_SCALE = 15 / 1500 = 0.01 (= 1/100)

변환:
- Three.js X = SVG_X / 100
- Three.js Z = SVG_Y / 100
```

### 2.4 좌표 변환 예시

```
SVG 좌표 (735.42, 531.3) @ 거제 하나로마트
→ Three.js X = 735.42 / 80 = 9.19
→ Three.js Z = 531.3 / 101 = 5.26
→ Three.js (9.19, 5.26)
```

## 3. 벽면 생성 로직

### 3.1 SVG에서 벽면 추출

SVG 파일의 `<path>` 요소에서 외벽 경계를 추출합니다:

```xml
<path d="M3649.55,53.3v1594h-116.51l.1,353H59.27V53.3h3590.28..."/>
```

이 path에서 주요 좌표점을 파싱:
- 시작점, 끝점, 꺾이는 점들

### 3.2 벽면 데이터 구조

```typescript
interface Wall {
  id: string
  start: { x: number; z: number }  // 시작점 (미터)
  end: { x: number; z: number }    // 끝점 (미터)
  height: number                    // 높이 (미터)
  thickness: number                 // 두께 (미터)
}
```

### 3.3 벽 두께 조정 (모서리 처리)

벽은 중심선 기준으로 양쪽으로 thickness/2 만큼 확장됩니다.
모서리가 깔끔하게 맞물리려면 좌표 조정이 필요합니다.

```
벽 두께: 0.25m
절반: 0.125m

모서리 조정 패턴:
┌─────────────────┐
│     가로벽       │ ← 가로벽은 세로벽 중심까지
├───┐             │
│   │             │
│세 │             │ ← 세로벽은 가로벽 바깥 가장자리까지 연장
│로 │             │
│벽 │             │
└───┴─────────────┘
```

**조정 규칙:**
1. 가로벽 끝점: 세로벽 중심까지만 (세로벽X - 0.125)
2. 세로벽 시작/끝점: 가로벽 바깥까지 연장 (가로벽Z ± 0.125)

### 3.4 실제 벽면 좌표 예시

```typescript
// 외벽 - 북쪽 (위쪽)
// SVG Y=53.3 → Z=53.3/101=0.53m
{ id: 'wall-n', start: { x: 0.74, z: 0.53 }, end: { x: 45.62, z: 0.53 }, height: 3, thickness: 0.25 }

// 외벽 - 동쪽 (오른쪽)
// 북쪽 벽 바깥까지 연장 (z: 0.53 - 0.125 = 0.405)
{ id: 'wall-e1', start: { x: 45.62, z: 0.405 }, end: { x: 45.62, z: 16.31 }, height: 3, thickness: 0.25 }

// 계단형 벽 - 1단 가로벽
// 세로벽 중심까지만 (x: 2.43 - 0.125 = 2.305)
{ id: 'wall-step1-h', start: { x: 0.74, z: 1.87 }, end: { x: 2.305, z: 1.87 }, height: 3, thickness: 0.25 }

// 계단형 벽 - 1단 세로벽
// 위아래 가로벽 바깥까지 연장 (z: 1.87-0.125=1.745 ~ 4.38+0.125=4.505)
{ id: 'wall-step1-v', start: { x: 2.43, z: 1.745 }, end: { x: 2.43, z: 4.505 }, height: 3, thickness: 0.25 }
```

## 4. 기둥 생성 로직

### 4.1 SVG에서 기둥 추출

SVG 파일의 `<rect>` 요소에서 기둥을 추출합니다:

```xml
<rect x="735.42" y="531.3" width="44" height="44"/>
```

### 4.2 기둥 데이터 구조

```typescript
interface Column {
  id: string
  position: { x: number; z: number }  // 중심 위치 (미터)
  width: number                        // X축 크기 (미터)
  depth: number                        // Z축 크기 (미터)
  height: number                       // 높이 (미터)
}
```

### 4.3 기둥 좌표 변환

```typescript
// SVG rect 좌표는 왼쪽 상단 모서리
// Three.js에서는 중심 좌표 사용

// SVG: x=735.42, y=531.3, width=44, height=44
// 중심점 계산: (735.42 + 44/2, 531.3 + 44/2) = (757.42, 553.3)
// 또는 간단히 SVG 좌표 그대로 사용 (rect 시작점 ≈ 중심)

// 크기 변환: 44px / 80 = 0.55m (X), 44px / 101 = 0.44m (Z)
{ id: 'col-1', position: { x: 9.19, z: 5.26 }, width: 0.55, depth: 0.44, height: 3 }
```

## 5. 벽 렌더링 로직

### WallRenderer 동작 방식

```typescript
function WallMesh({ wall }) {
  const { start, end, height, thickness } = wall

  // 벽 길이 계산
  const length = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.z - start.z, 2)
  )

  // 벽 각도 계산
  const angle = Math.atan2(end.z - start.z, end.x - start.x)

  // 벽 중심점 계산
  const centerX = (start.x + end.x) / 2
  const centerZ = (start.z + end.z) / 2

  return (
    <mesh
      position={[centerX, height / 2, centerZ]}
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length, height, thickness]} />
    </mesh>
  )
}
```

## 6. 새 매장 추가 시 작업 순서 (체크리스트)

### Step 1: SVG 파일 준비 및 분석

```
□ SVG 파일 준비 (평면도)
□ viewBox 확인: <svg viewBox="0 0 [WIDTH] [HEIGHT]">
□ 매장 실제 크기 확인 (미터 단위)
□ 스케일 계산:
  - X_SCALE = 매장가로(m) / viewBox너비(px)
  - Z_SCALE = 매장세로(m) / viewBox높이(px)
```

### Step 2: 벽면 좌표 추출

```
□ SVG에서 <path> 요소 찾기 (외벽 경계)
□ path의 d 속성에서 좌표 추출:
  - M: moveto (시작점)
  - L: lineto (직선)
  - V: vertical lineto (수직선)
  - H: horizontal lineto (수평선)
□ 좌표를 벽 세그먼트로 분리
□ 각 벽의 시작점/끝점 기록
```

### Step 3: 기둥 좌표 추출

```
□ SVG에서 <rect> 요소 찾기 (기둥)
□ 각 rect의 x, y, width, height 추출
□ 기둥 중심 좌표 계산 (x + width/2, y + height/2)
□ 기둥 크기 계산 (width * X_SCALE, height * Z_SCALE)
```

### Step 4: 좌표 변환

```
□ 모든 SVG 좌표에 스케일 적용
□ 벽 두께 결정 (일반적으로 0.25m)
□ 모서리 조정:
  - 가로벽 끝점: 세로벽 중심까지 (X ± thickness/2)
  - 세로벽 시작/끝점: 가로벽 바깥까지 (Z ± thickness/2)
```

### Step 5: 데이터 파일 생성

```
□ stores/ 폴더에 [매장명].ts 파일 생성
□ walls 배열 작성 (id, start, end, height, thickness)
□ columns 배열 작성 (id, position, width, depth, height)
□ floorPlan 정보 작성 (imageUrl, widthMeters, depthMeters)
□ Store 객체 export
```

### Step 6: 검증

```
□ 개발 서버 실행
□ 바닥에 SVG 이미지 오버레이 확인
□ 3D 벽과 이미지 벽선 일치 여부 확인
□ 기둥 위치 확인
□ 모서리 빈틈/겹침 확인 및 수정
□ 출입구 등 특수 영역 확인
```

### 파일 구조 예시

```
frontend/src/data/stores/
├── README-coordinate-system.md  # 이 문서
├── geoje-hanaromart.ts          # 매장 데이터
├── geoje-fixtures.ts            # 매대 데이터
├── [새매장].ts                   # 새 매장 데이터
└── [새매장]-fixtures.ts          # 새 매장 매대 데이터
```

## 7. 주의사항

1. **SVG Y축과 Three.js Z축 방향이 같음**
   - SVG에서 Y가 증가하면 Three.js에서 Z도 증가
   - Y축 뒤집기 불필요

2. **벽 두께 조정은 필수**
   - 조정 없이 그리면 모서리에 빈틈 또는 겹침 발생
   - 세로벽을 가로벽 바깥까지 연장하는 것이 일반적

3. **스케일 일관성 유지**
   - X와 Z의 스케일이 약간 다름 (80 vs 101)
   - 이는 SVG viewBox 비율 때문

4. **기둥 위치는 중심 좌표**
   - SVG rect는 왼쪽 상단 기준
   - Three.js에서는 중심 기준으로 렌더링
