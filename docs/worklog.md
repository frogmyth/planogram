# Retail-X 3D Builder 작업 일지

## 프로젝트 개요
- **프로젝트명**: Retail-X 3D Builder (매장 VMD 3D 시뮬레이션 플랫폼)
- **목표**: 2D 평면도 기반 3D 매장 공간 생성 및 VMD 솔루션 개발

---

## 개발 환경 정보

### Git 저장소
| 항목 | 값 |
|------|-----|
| Repository | https://github.com/frogmyth/planogram |
| Branch | main |

### 로컬 개발 환경

#### 집 (Windows)
| 항목 | 값 |
|------|-----|
| 로컬 경로 | E:\30.dev\Planogram |
| Node.js | v22.19.0 |
| npm | 10.9.3 |
| Python | 3.11.2 |
| Git | 2.49.0 |
| MySQL | 설치됨 |
| Docker | 미설치 |

#### 회사 (Windows)
| 항목 | 값 |
|------|-----|
| 로컬 경로 | (설정 필요) |
| Node.js | (확인 필요) |
| npm | (확인 필요) |
| Python | (확인 필요) |
| Git | (확인 필요) |
| MySQL | (확인 필요) |
| Docker | (확인 필요) |

### 로컬 MySQL 설정
| 항목 | 값 |
|------|-----|
| Host | localhost |
| Port | 3306 |
| Database | planogram (생성 예정) |
| User | (설정 필요) |
| Password | (설정 필요) |

### AWS 인프라 (배포 시 설정)
| 서비스 | 설정값 | 상태 |
|--------|--------|------|
| EC2 | Ubuntu 24.04 LTS, t3.large | 미생성 |
| RDS MySQL | MySQL 8.0, db.t3.medium | 미생성 |
| S3 | planogram-assets | 미생성 |
| MongoDB | Atlas 또는 EC2 설치 | 미설정 |
| Redis | ElastiCache cache.t3.micro | 미생성 |

### 환경 변수 템플릿
```bash
# .env.local (로컬 개발용)
NODE_ENV=development
PORT=3000

# MySQL (로컬)
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=planogram
DATABASE_USER=root
DATABASE_PASSWORD=<설정필요>

# MongoDB (로컬 또는 Atlas)
MONGODB_URI=mongodb://localhost:27017/planogram

# JWT
JWT_SECRET=<생성필요>
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# AWS (배포 시 설정)
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=<설정필요>
AWS_SECRET_ACCESS_KEY=<설정필요>
AWS_S3_BUCKET=planogram-assets
```

---

## 개발 단계별 작업 순서

### Phase 1: 기반 구축 (Core & Infrastructure)

#### Backend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 1-1 | NestJS 프로젝트 초기 설정 | [X] | TypeScript 5.x |
| 1-2 | MySQL 연결 및 TypeORM 설정 | [X] | MySQL 8.0 |
| 1-3 | MongoDB 연결 및 Mongoose 설정 | [ ] | MongoDB 7.0 |
| 1-4 | 사용자 인증 (JWT) 구현 | [ ] | 로그인/회원가입 |
| 1-5 | 프로젝트 CRUD API | [ ] | |
| 1-6 | 파일 업로드 (S3) 연동 | [ ] | AWS S3 |

#### Frontend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 1-7 | React + Vite 프로젝트 설정 | [X] | React 18.x |
| 1-8 | React Three Fiber 기본 씬 구성 | [X] | Three.js 0.160+ |
| 1-9 | 카메라 컨트롤 (OrbitControls) | [X] | |
| 1-10 | 기본 조명 설정 | [X] | |
| 1-11 | Zustand 상태 관리 설정 | [X] | Zustand 4.x |
| 1-12 | 로그인/회원가입 페이지 | [ ] | |
| 1-13 | 대시보드 레이아웃 | [ ] | TailwindCSS |

#### Infrastructure 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 1-14 | AWS EC2 인스턴스 생성 | [ ] | Ubuntu 24.04 LTS |
| 1-15 | Docker 환경 구성 | [ ] | Docker 24.x |
| 1-16 | RDS MySQL 인스턴스 생성 | [ ] | db.t3.medium |
| 1-17 | S3 버킷 생성 및 정책 설정 | [ ] | |

---

### Phase 2: 공간 생성 (Space Builder)

#### Backend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 2-1 | FastAPI 이미지 서비스 구축 | [ ] | Python 3.11+ |
| 2-2 | OpenCV 도면 분석 알고리즘 | [ ] | Canny Edge, Hough Transform |
| 2-3 | 분석 결과 저장 API | [ ] | |
| 2-4 | 벽체/구역 수정 API | [ ] | |

#### Frontend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 2-5 | 도면 이미지 업로드 UI | [ ] | |
| 2-6 | 3D 벽체 렌더링 | [X] | WallRenderer 컴포넌트 |
| 2-7 | 구역(Zone) 시각화 | [X] | ZoneRenderer 컴포넌트 |
| 2-8 | 벡터 편집기 (정점 수정) | [ ] | |
| 2-9 | 탑뷰 모드 구현 | [X] | CameraController |
| 2-10 | 구역 라벨링 UI | [ ] | |

---

### Phase 3: 매대 시스템 (Fixture Engine)

#### Backend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 3-1 | 매대 템플릿 CRUD API | [ ] | |
| 3-2 | 매대 인스턴스 API | [ ] | |
| 3-3 | 씬 데이터 저장/조회 API | [ ] | MongoDB |
| 3-4 | 변경 이력 관리 | [ ] | scene_history |

#### Frontend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 3-5 | 매대 라이브러리 UI | [ ] | 좌측 패널 |
| 3-6 | 파라메트릭 곤돌라 컴포넌트 | [X] | GondolaMesh 컴포넌트 |
| 3-7 | 평대 컴포넌트 | [ ] | |
| 3-8 | 매대 드래그 앤 드롭 배치 | [ ] | |
| 3-9 | 매대 회전/이동/삭제 | [X] | 3ds Max 스타일 기즈모 |
| 3-10 | 매대 ID 자동 부여 로직 | [ ] | A-01-01 형식 |
| 3-11 | 속성 편집 패널 | [ ] | 우측 |

---

### Phase 4: VMD 에디터 (VMD Logic)

#### Frontend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 4-1 | 카메라 트위닝 (GSAP) | [X] | 탑뷰 <-> 정면뷰 |
| 4-2 | 매대 고스팅 처리 | [X] | 투명도 30% |
| 4-3 | 선반 높이 드래그 조절 | [ ] | 25mm 스냅 |
| 4-4 | 좌/우 화살표 네비게이션 | [X] | |
| 4-5 | 선반 추가/삭제 기능 | [ ] | |
| 4-6 | 매대/선반 번호 오버레이 | [ ] | HTML Overlay |

---

### Phase 5: 상품 진열 (Items & Products)

#### Backend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 5-1 | 상품 CRUD API | [ ] | MongoDB |
| 5-2 | 상품 검색 API | [ ] | 텍스트 검색, 필터 |
| 5-3 | 상품 대량 등록 | [ ] | Excel import |
| 5-4 | 진열 상품 저장 API | [ ] | |

#### Frontend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 5-5 | 상품 팔레트 UI | [ ] | 우측 패널 |
| 5-6 | 상품 검색 기능 | [ ] | |
| 5-7 | 상품 드래그 앤 드롭 | [ ] | |
| 5-8 | Raycasting + Grid Snap | [ ] | |
| 5-9 | 충돌 감지 (AABB) | [ ] | |
| 5-10 | 고스트 프리뷰 | [ ] | 배치 전 미리보기 |
| 5-11 | 페이싱 수 조절 | [ ] | |
| 5-12 | 상품 적재 (Stacking) | [ ] | |
| 5-13 | InstancedMesh 최적화 | [ ] | |

---

### Phase 6: LCD 시뮬레이션 (LCD Display)

#### Backend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 6-1 | LCD 모델 관리 API | [ ] | |
| 6-2 | LCD 콘텐츠 업로드 API | [ ] | |

#### Frontend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 6-3 | LCD 3D 모델 컴포넌트 | [ ] | |
| 6-4 | 선반 엣지 부착 로직 | [ ] | |
| 6-5 | 비디오 텍스처 매핑 | [ ] | VideoTexture |
| 6-6 | 이미지 텍스처 매핑 | [ ] | |
| 6-7 | LCD 콘텐츠 변경 UI | [ ] | |

---

### Phase 7: 협업 및 최적화 (Collaboration & Optimization)

#### Backend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 7-1 | WebSocket 게이트웨이 구현 | [ ] | Socket.IO |
| 7-2 | 실시간 동기화 로직 | [ ] | |
| 7-3 | 씬 버전 관리 강화 | [ ] | |

#### Frontend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 7-4 | 다중 사용자 커서 표시 | [ ] | |
| 7-5 | 실시간 변경 반영 | [ ] | |
| 7-6 | LOD 구현 | [ ] | Level of Detail |
| 7-7 | 지연 로딩 | [ ] | Lazy Loading |
| 7-8 | 메모리 최적화 | [ ] | |
| 7-9 | 3D 공간 워크스루 모드 | [ ] | |

#### Infrastructure 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 7-10 | 로드밸런서 설정 | [ ] | ALB |
| 7-11 | CDN 최적화 | [ ] | CloudFront |
| 7-12 | 모니터링 설정 | [ ] | CloudWatch |
| 7-13 | 백업 정책 수립 | [ ] | |

---

## 작업 로그

### 2025-12-25 (집)
- 개발 계획서 검토 및 작업 순서 정리 완료
- worklog.md 초기 작성
- Git 저장소 생성 및 연동 완료 (https://github.com/frogmyth/planogram)
- 개발 환경 확인: Node.js v22.19.0, Python 3.11.2, MySQL 설치됨
- .gitignore 설정 및 초기 커밋 완료
- **Phase 1 개발 시작**
  - Frontend: React + Vite + TypeScript 프로젝트 생성
  - Frontend: React Three Fiber, Zustand, GSAP, TailwindCSS 설치
  - Frontend: 기본 3D 씬 구성 (Grid, OrbitControls, 조명)
  - Backend: NestJS 프로젝트 생성
  - Backend: TypeORM + MySQL 연결 설정 (planogram DB - 회의실 시스템과 별도)
  - Backend: JWT 인증 관련 패키지 설치
- **TailwindCSS v4 설정 수정**
  - @tailwindcss/postcss 설치 및 postcss.config.js 업데이트
  - index.css에 `@import "tailwindcss"` 적용
- **포트 설정**: 5175로 설정 (회의실 시스템 5173과 분리)
- **3D 매장 시각화 구현** (SmartThings 스타일 참조)
  - ZoneRenderer: 구역 시각화 (8개 샘플 구역: 농산, 정육, 수산, 유제품, 냉동, 과자, 음료, 생활용품)
  - WallRenderer: 벽체 렌더링
  - GondolaMesh: 파라메트릭 매대 컴포넌트 (선반, 포스트, 베이스, 뒷판)
- **VMD 정면뷰 모드 구현** (애플 스타일 UI)
  - CameraController: GSAP 트위닝으로 TOP/PERSPECTIVE/VMD 뷰 전환
  - VMDControls: 좌우 화살표 네비게이션, 키보드 단축키 (←/→/ESC)
  - 매대 고스팅: 선택 외 매대 투명도 30%
  - 샘플 매대 데이터 8개 추가 (A-01, A-02, B-01, B-02, C-01, D-01, E-01, F-01)
- **UI 스타일링**
  - 화이트 배경, backdrop-blur 헤더
  - 둥근 버튼, 부드러운 그림자
  - 2D/3D 토글, 상세보기 버튼
- **3단계 네비게이션 시스템 구현** (Retail Shelf Planner 분석 참고)
  - 매장 > 구역 > 매대 계층적 네비게이션
  - useSceneStore 확장: navigationLevel, selectedZoneId, Zone 인터페이스
  - ZoneRenderer: 클릭/호버 이벤트, 선택 하이라이트
  - CameraController: 구역 뷰 카메라 이동 (구역 크기에 따른 줌)
  - NavigationBreadcrumb: 계층 표시 및 클릭 네비게이션
  - 레벨별 조건부 렌더링:
    - Store: 구역만 표시 (매대 숨김), 구역 클릭으로 진입
    - Zone: 해당 구역 매대만 표시, 매대 클릭으로 선택
    - Fixture: 선택 매대 + 좌우 인접 매대, 고스팅 효과
  - 키보드 단축키: ESC (상위 레벨 이동), Enter (상세보기 진입)
- **다음 개발 계획**
  - Phase B: 상품 데이터 시스템 (MongoDB, Products API)
  - Phase C: 파일 업로드 (CSV/Excel/이미지 자동 배치)
  - Phase D: AI 이미지 서버 연동

### 2025-12-26 (집)
- **그리드 기반 매대 배치 시스템 개발 (진행중)**
  - `geoje-fixtures.ts` 파일 생성: 매대 데이터 정의 헬퍼 함수
  - `createFixture()` 헬퍼 함수 구현:
    - 파라미터: name, zoneId, row, col, widthCells, rotation, type, shelfCount
    - 셀 단위 좌표를 3D 위치로 변환
    - rotation 값에 따른 매대 방향 처리 (0, 90, 180, 270도)
  - 매대 규격 정의:
    - 1개 매대 = 6셀 (widthCells 단위)
    - 매대 깊이 = CELL_SIZE × 0.5 (고정)
    - 통로 오프셋 = CELL_SIZE × 0.25 (매대 앞 공간)
  - 48개 매대 데이터 정의 (12개 구역):
    - 생활용품(living), 정육(meat), 수산물(seafood)
    - 냉장/냉동(cold), 리빙/홈(home), 과자/음료(snack)
    - 가전/디지털(digital), 조미료(sauce), 면류(noodle)
    - 과일/채소(fruit), 특선(special), 베이커리(bakery)
  - 매대 타입: gondola, island, wall, endcap

- **디버깅 및 문제 분석**
  - App.tsx에 Zone 레벨 디버그 로깅 추가
  - 콘솔 확인: 48개 매대 데이터 정상 로드, 구역별 필터링 정상 동작
  - **발견된 문제점**:
    - 매대가 구역 영역 안에 표시되지 않고 아래쪽에 렌더링됨
    - 그리드 좌표계와 매대 좌표계 간 변환 불일치
    - Grid3DRenderer가 90도 Y축 회전 적용하여 좌표 변환 필요

- **설계 재검토 및 방향 전환 결정**
  - 기존 그리드 기반 구역 우선 방식의 문제점 분석:
    - 이중 좌표계 (그리드 좌표 vs 3D 좌표) 변환 복잡도
    - 그리드 셀 기반 매대 배치의 제약
    - 실제 업무 프로세스와 맞지 않음
  - **새로운 설계 방향 결정: 평면도 기반 매대 우선 방식**
    - 기존: 구역 정의 → 구역 내 매대 배치
    - 변경: 평면도 로드 → 매대 자유 배치 → 매대별 제품군 지정 → 구역 자동 형성
  - **3D 좌표계 표준화 (Three.js Y-up)**
    - X축: 동서 방향 (오른쪽 = +X)
    - Y축: 높이 (위쪽 = +Y)
    - Z축: 남북 방향 (앞쪽 = +Z)
    - 단위: 미터 (실척)
  - 업계 플래노그램 솔루션 분석:
    - Blue Yonder, RELEX, 3DVR, ReadySet VR 등
    - 공통점: 평면도 기반 + 실척 + 매대 자유 배치

- **개발 계획서 (DEVELOPMENT_PLAN.md) 업데이트**
  - 핵심 워크플로우 추가
  - 3D 좌표계 표준 문서화
  - Phase 2~3 재구성:
    - Phase 2: 평면도 기반 매장 구현
    - Phase 3: 매대 배치 시스템 (제품군 지정 포함)
  - 새로운 데이터 구조 정의 (Store, Fixture, ProductCategory)

- **1단계 구현: 좌표계 통합 및 기본 씬 재구성**
  - **타입 정의 완전 재작성** (`frontend/src/types/store.ts`)
    - 새로운 타입: Store, Fixture, ProductCategory, FloorPlan, Wall, Column
    - Three.js Y-up 좌표계 명시 (X=동서, Y=높이, Z=남북)
    - 단위: 미터 (실척 100%)
    - 기본값 상수: DEFAULT_CAMERA_CONFIG, DEFAULT_FIXTURE_DIMENSIONS
  - **useSceneStore 새 구조로 업데이트**
    - Zone 관련 코드 제거 (구역 레벨 네비게이션 폐지)
    - 네비게이션: 'select' | 'store' | 'fixture' (3단계 → 2단계 단순화)
    - ProductCategory 관리 추가
    - 헬퍼 함수: getFixtureById, getFixturesByCategory, getStoreDimensions
  - **기존 그리드 관련 코드 제거**
    - GridEditor.tsx 삭제
    - ZoneRenderer.tsx 삭제
    - App.tsx에서 그리드 편집 모드/씬 제거
  - **새로운 3D 컴포넌트 생성**
    - FloorRenderer: 바닥면 렌더링 (미터 단위)
    - FixtureRenderer: 매대 렌더링 (유형별 색상, 선반 구조)
  - **CameraController 단순화**
    - Zone 뷰 관련 코드 제거
    - Store 뷰, Fixture 뷰만 지원
  - **UI 컴포넌트 업데이트**
    - StoreSelector: Store 타입 사용, 구역 수 대신 매대 수 표시
    - NavigationBreadcrumb: Zone 레벨 제거
  - **샘플 데이터 새 타입으로 업데이트**
    - geoje-fixtures.ts: 새 Fixture 타입 (position, dimensions, structure)
    - geoje-hanaromart.ts: 새 Store 타입 (floorPlan, walls, cameraConfig)
    - index.ts: StoreListItem 타입 수정
  - **빌드 테스트 성공**
    - 모든 TypeScript 오류 해결
    - vite build 성공 (13.48초)

---

## 기술 스택 요약

| 영역 | 기술 |
|------|------|
| Frontend | React 18.x, TypeScript 5.x, React Three Fiber, Zustand, GSAP, TailwindCSS |
| Backend (Main) | NestJS 10.x, TypeORM, Mongoose |
| Backend (Image) | Python 3.11+, FastAPI, OpenCV |
| Database | MySQL 8.0, MongoDB 7.0, Redis 7.x |
| Infrastructure | AWS (EC2, RDS, S3, ALB), Docker, Nginx |

---

## 참고사항
- 각 Phase는 순차적으로 진행하되, 독립적인 작업은 병렬 진행 가능
- Phase 1 완료 후 Phase 2~3 동시 진행 가능 (Backend/Frontend 분리 작업)
- 상태 표기: [ ] 미시작, [P] 진행중, [X] 완료

---

## 병행 프로젝트 현황

| 프로젝트 | Git 저장소 | 설명 | 개발서버 |
|----------|-----------|------|---------|
| **Planogram (현재)** | https://github.com/frogmyth/planogram | 매장 VMD 3D 시뮬레이션 | http://localhost:5175 |
| **회의실 시스템** | https://github.com/frogmyth/meeting-room-system | 회의실 예약 시스템 | http://localhost:5173 |

> 각 프로젝트는 별도 worklog로 관리

### 2025-12-27 (집)
- **매대 편집 시스템 대폭 개선**
  - **3ds Max 스타일 변환 도구 구현**
    - W키: 이동 모드 (X, Z 축 화살표 기즈모)
    - E키: 회전 모드 (Y축 원형 기즈모)
    - ESC키: 편집 모드 종료
    - 편집 모드 토글 버튼 및 UI 안내 추가
  - **TransformGizmo 컴포넌트 신규 개발**
    - MoveGizmo: X축(빨강), Z축(파랑) 화살표
    - RotateGizmo: Y축 노란색 원형 링 + 15도 눈금
    - 매대 회전에 따른 로컬 좌표계 지원 (기즈모가 매대 앞방향 기준으로 표시)
    - 히트 영역 확대로 클릭 용이성 개선
    - window 레벨 이벤트 핸들러로 드래그 안정성 확보
  - **회전 시스템 개선**
    - FixtureRotation 타입: 90도 단위 → 15도 단위로 변경
    - rotateFixtureTo 함수: 15도 스냅 적용
    - 회전 모드에서 이동 비활성화 (모드 분리)
  - **줌 상태 유지 기능**
    - 편집 모드 진입/매대 선택 시 카메라 줌 상태 유지
    - VMD 모드 복귀 시에만 카메라 리셋
  - **벽 충돌 및 스냅 기능 구현**
    - checkWallCollision: 매대-벽 AABB 충돌 체크
    - snapToWalls: 벽 근처 자석 스냅 (0.3m 거리)
    - snapToFixturesAndWalls: 매대+벽 통합 스냅
    - clampToWallBounds: 벽 경계 제한
    - 매대가 벽을 통과할 수 없도록 제한
  - **기즈모 크기 증가**
    - 화살표 길이: 0.8m → 1.2m
    - 회전 링 반경: 0.7m → 1.0m
    - 중심점, 화살표 머리 크기 증가
  - **기타 UI 개선**
    - 편집 모드 버튼 z-index 수정
    - 매대 정면 방향 표시 (녹색 라인/화살표)
    - 선반 색상 연한 회색으로 변경

- **파일 변경 사항**
  - 신규: `frontend/src/components/editor/TransformGizmo.tsx`
  - 수정: `frontend/src/components/editor/EditModeToggle.tsx` (W/E 모드 버튼)
  - 수정: `frontend/src/components/editor/DraggableFixture.tsx` (transformMode 체크, 벽 충돌)
  - 수정: `frontend/src/components/editor/snapUtils.ts` (벽 관련 함수 추가)
  - 수정: `frontend/src/store/useSceneStore.ts` (TransformMode 타입, rotateFixtureTo)
  - 수정: `frontend/src/types/store.ts` (FixtureRotation → number)
  - 수정: `frontend/src/components/3d/CameraController.tsx` (줌 상태 유지)
  - 수정: `frontend/src/App.tsx` (키보드 단축키, TransformGizmo 렌더링)

---

## 다음 작업 계획 (TODO)

### 즉시 진행 필요
1. **로컬 좌표계 이동 버그 수정**
   - 현재 기즈모 방향대로 이동하지만 이동량이 두 번 적용되는 문제 확인 필요
   - onDrag 호출 시 x, z 두 번 호출되어 충돌 체크 문제 발생 가능

2. **회전 시 충돌 체크**
   - 매대 회전 시 벽/다른 매대와 충돌 체크 추가
   - 충돌 시 회전 취소 또는 롤백

### 단기 계획
3. **매대 삭제 기능**
   - Delete 키 또는 버튼으로 선택된 매대 삭제
   - 삭제 확인 다이얼로그

4. **매대 복사/붙여넣기**
   - Ctrl+C/V로 매대 복제
   - 복제 시 위치 오프셋 적용

5. **Undo/Redo 시스템**
   - 이동/회전/삭제 작업 취소/재실행
   - 작업 히스토리 스택

### 중기 계획
6. **선반 높이 조절**
   - 정면뷰에서 선반 드래그로 높이 조절
   - 25mm 단위 스냅

7. **상품 데이터 시스템**
   - MongoDB 연동
   - 상품 CRUD API
   - 상품 팔레트 UI

8. **상품 진열 기능**
   - 선반에 상품 드래그 앤 드롭
   - 페이싱 수 조절
   - 충돌 감지
