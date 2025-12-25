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
| 1-1 | NestJS 프로젝트 초기 설정 | [ ] | TypeScript 5.x |
| 1-2 | MySQL 연결 및 TypeORM 설정 | [ ] | MySQL 8.0 |
| 1-3 | MongoDB 연결 및 Mongoose 설정 | [ ] | MongoDB 7.0 |
| 1-4 | 사용자 인증 (JWT) 구현 | [ ] | 로그인/회원가입 |
| 1-5 | 프로젝트 CRUD API | [ ] | |
| 1-6 | 파일 업로드 (S3) 연동 | [ ] | AWS S3 |

#### Frontend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 1-7 | React + Vite 프로젝트 설정 | [ ] | React 18.x |
| 1-8 | React Three Fiber 기본 씬 구성 | [ ] | Three.js 0.160+ |
| 1-9 | 카메라 컨트롤 (OrbitControls) | [ ] | |
| 1-10 | 기본 조명 설정 | [ ] | |
| 1-11 | Zustand 상태 관리 설정 | [ ] | Zustand 4.x |
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
| 2-6 | 3D 벽체 렌더링 | [ ] | ExtrudeGeometry |
| 2-7 | 구역(Zone) 시각화 | [ ] | |
| 2-8 | 벡터 편집기 (정점 수정) | [ ] | |
| 2-9 | 탑뷰 모드 구현 | [ ] | |
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
| 3-6 | 파라메트릭 곤돌라 컴포넌트 | [ ] | 너비/높이/깊이 조절 |
| 3-7 | 평대 컴포넌트 | [ ] | |
| 3-8 | 매대 드래그 앤 드롭 배치 | [ ] | |
| 3-9 | 매대 회전/이동/삭제 | [ ] | |
| 3-10 | 매대 ID 자동 부여 로직 | [ ] | A-01-01 형식 |
| 3-11 | 속성 편집 패널 | [ ] | 우측 |

---

### Phase 4: VMD 에디터 (VMD Logic)

#### Frontend 작업
| 순번 | 작업 항목 | 상태 | 비고 |
|------|----------|------|------|
| 4-1 | 카메라 트위닝 (GSAP) | [ ] | 탑뷰 <-> 정면뷰 |
| 4-2 | 매대 고스팅 처리 | [ ] | 투명도 30% |
| 4-3 | 선반 높이 드래그 조절 | [ ] | 25mm 스냅 |
| 4-4 | 좌/우 화살표 네비게이션 | [ ] | |
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

| 프로젝트 | Git 저장소 | 설명 |
|----------|-----------|------|
| **Planogram (현재)** | https://github.com/frogmyth/planogram | 매장 VMD 3D 시뮬레이션 |
| **회의실 시스템** | https://github.com/frogmyth/meeting-room-system | 회의실 예약 시스템 |

> 각 프로젝트는 별도 worklog로 관리
