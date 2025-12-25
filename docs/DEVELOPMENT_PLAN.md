# Retail-X 3D Builder 개발 계획서

## 1. 프로젝트 개요

### 1.1 프로젝트명
**Retail-X 3D Builder** (매장 VMD 3D 시뮬레이션 플랫폼)

### 1.2 목표
2D 평면도를 기반으로 3D 매장 공간을 자동/반자동으로 생성하고, 다양한 규격의 집기(매대) 배치부터 상품 진열, LCD 디스플레이 시뮬레이션까지 가능한 통합 VMD 솔루션 개발

### 1.3 핵심 가치
- 매장 오픈/리뉴얼 전 가상 시뮬레이션을 통한 비용 절감
- 브랜드별 규격화된 매대 관리
- 직관적인 진열 관리

---

## 2. 시스템 아키텍처

### 2.1 전체 구성도

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    React + React Three Fiber                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │    │
│  │  │ Layout Mode  │  │  VMD Mode    │  │   Dashboard          │  │    │
│  │  │  (Top View)  │  │(Frontal View)│  │   (Project Mgmt)     │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ HTTPS/WSS
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         AWS Cloud Infrastructure                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Application Load Balancer                     │    │
│  └───────────────────────────────┬─────────────────────────────────┘    │
│                                  │                                       │
│  ┌───────────────────────────────┴─────────────────────────────────┐    │
│  │                     EC2 (Ubuntu 24.04 LTS)                       │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │                    Docker Containers                     │    │    │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │    │    │
│  │  │  │   Nginx     │  │  NestJS     │  │  Python/FastAPI │  │    │    │
│  │  │  │  (Proxy)    │  │  (Main API) │  │  (Image Process)│  │    │    │
│  │  │  └─────────────┘  └─────────────┘  └─────────────────┘  │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                  │                                       │
│  ┌───────────────┬───────────────┴───────────────┬─────────────────┐    │
│  │               │                               │                 │    │
│  ▼               ▼                               ▼                 ▼    │
│ ┌─────────┐  ┌─────────┐                    ┌─────────┐      ┌────────┐ │
│ │  MySQL  │  │ MongoDB │                    │   S3    │      │ Redis  │ │
│ │ (RDS)   │  │ (Atlas/ │                    │(Storage)│      │(Cache) │ │
│ │         │  │  EC2)   │                    │         │      │        │ │
│ └─────────┘  └─────────┘                    └─────────┘      └────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 기술 스택 상세

| 레이어 | 기술 | 버전 | 용도 |
|--------|------|------|------|
| **Frontend** | React | 18.x | UI 프레임워크 |
| | TypeScript | 5.x | 타입 안전성 |
| | React Three Fiber | 8.x | 3D 렌더링 |
| | Three.js | 0.160+ | WebGL 엔진 |
| | Zustand | 4.x | 상태 관리 |
| | GSAP | 3.x | 카메라 애니메이션 |
| | TailwindCSS | 3.x | 스타일링 |
| **Backend (Main)** | NestJS | 10.x | REST API 서버 |
| | TypeScript | 5.x | 타입 안전성 |
| | TypeORM | 0.3.x | MySQL ORM |
| | Mongoose | 8.x | MongoDB ODM |
| **Backend (Image)** | Python | 3.11+ | 이미지 처리 서버 |
| | FastAPI | 0.109+ | REST API |
| | OpenCV | 4.9+ | 도면 인식 |
| | NumPy | 1.26+ | 수치 연산 |
| **Database** | MySQL | 8.0 | 정형 데이터 (사용자, 프로젝트, 매대 규격) |
| | MongoDB | 7.0 | 비정형 데이터 (상품, 3D 씬 데이터) |
| | Redis | 7.x | 캐시, 세션 |
| **Infrastructure** | AWS EC2 | t3.large+ | 애플리케이션 서버 |
| | Ubuntu | 24.04 LTS | 운영체제 |
| | Docker | 24.x | 컨테이너화 |
| | Nginx | 1.24+ | 리버스 프록시 |
| | AWS S3 | - | 파일 스토리지 |
| | AWS RDS | MySQL 8.0 | 관리형 MySQL |

---

## 3. 데이터베이스 설계

### 3.1 MySQL 스키마 (정형 데이터)

```sql
-- =============================================
-- 사용자 및 인증
-- =============================================

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'EDITOR', 'VIEWER') DEFAULT 'VIEWER',
    company_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_company (company_id)
);

CREATE TABLE companies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    business_number VARCHAR(20),
    plan_type ENUM('FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE') DEFAULT 'FREE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 프로젝트 관리
-- =============================================

CREATE TABLE projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    company_id BIGINT NOT NULL,
    retailer_type VARCHAR(50) NOT NULL COMMENT '이마트, CU, GS25 등',
    store_name VARCHAR(255) COMMENT '매장명 (예: 이마트 성수점)',
    status ENUM('DRAFT', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'ARCHIVED') DEFAULT 'DRAFT',
    floor_plan_url VARCHAR(500) COMMENT 'S3 도면 이미지 URL',
    scene_data_id VARCHAR(100) COMMENT 'MongoDB 3D 씬 데이터 참조 ID',
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_company_status (company_id, status)
);

-- =============================================
-- 매대 템플릿 (규격 관리)
-- =============================================

CREATE TABLE fixture_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    template_code VARCHAR(50) UNIQUE NOT NULL COMMENT '예: EMT_GONDOLA_STD_01',
    name VARCHAR(255) NOT NULL COMMENT '예: 이마트 표준 곤돌라',
    category ENUM('GONDOLA', 'FLAT', 'ENDCAP', 'REFRIGERATOR', 'FREEZER', 'CHECKOUT') NOT NULL,
    retailer_type VARCHAR(50) NOT NULL,

    -- 치수 (mm 단위)
    width INT NOT NULL COMMENT '너비 (mm)',
    height INT NOT NULL COMMENT '높이 (mm)',
    depth INT NOT NULL COMMENT '깊이 (mm)',

    -- 구조 설정
    base_deck_height INT DEFAULT 150 COMMENT '바닥 걸레받이 높이',
    default_shelf_count INT DEFAULT 5,
    post_interval INT DEFAULT 25 COMMENT '선반 높이 조절 간격 (mm)',
    material VARCHAR(50) DEFAULT 'STEEL_POWDER_COATED',
    color_hex VARCHAR(7) DEFAULT '#FFFFFF',

    -- 부가 기능
    lcd_supported BOOLEAN DEFAULT FALSE,
    header_pop_supported BOOLEAN DEFAULT TRUE,

    -- 메타데이터
    thumbnail_url VARCHAR(500),
    model_glb_url VARCHAR(500) COMMENT '3D 모델 파일 URL',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_retailer_category (retailer_type, category),
    INDEX idx_active (is_active)
);

-- =============================================
-- 구역(Zone) 정의
-- =============================================

CREATE TABLE zone_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL COMMENT '예: PRODUCE, DAIRY, FROZEN',
    name VARCHAR(100) NOT NULL COMMENT '예: 농산, 유제품, 냉동',
    color_hex VARCHAR(7) DEFAULT '#3B82F6',
    icon_name VARCHAR(50),
    is_refrigerated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- LCD 디스플레이 모델
-- =============================================

CREATE TABLE lcd_models (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    model_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    width_mm INT NOT NULL COMMENT '화면 너비 (mm)',
    height_mm INT NOT NULL COMMENT '화면 높이 (mm)',
    depth_mm INT NOT NULL,
    resolution_width INT COMMENT '해상도 가로',
    resolution_height INT COMMENT '해상도 세로',
    model_glb_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 상품 카테고리
-- =============================================

CREATE TABLE product_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    parent_id BIGINT,
    level INT DEFAULT 1,
    is_refrigerated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES product_categories(id),
    INDEX idx_parent (parent_id)
);

-- =============================================
-- 감사 로그
-- =============================================

CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_action (user_id, action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
);
```

### 3.2 MongoDB 스키마 (비정형 데이터)

```javascript
// =============================================
// Collection: products (상품 정보)
// =============================================
{
  "_id": ObjectId,
  "product_id": "P_8801043014856",      // 내부 관리 코드
  "barcode": "8801043014856",           // EAN-13/GTIN
  "sku_name": "농심 신라면 멀티팩 (5입)",
  "brand": "농심",
  "category_id": "CAT_INSTANT_NOODLE",
  "company_id": NumberLong,             // MySQL companies.id 참조

  // 3D 렌더링용 물리적 속성
  "dimensions": {
    "width": 160,      // mm
    "height": 130,     // mm
    "depth": 120,      // mm
    "weight_g": 600
  },

  // 텍스처 및 모델 에셋
  "assets": {
    "texture_front_url": "https://cdn.../front.jpg",
    "texture_top_url": "https://cdn.../top.jpg",
    "texture_side_url": "https://cdn.../side.jpg",
    "model_glb_url": null,
    "thumbnail_url": "https://cdn.../thumb.png"
  },

  // VMD 진열 규칙
  "merchandising_rules": {
    "stacking_limit": 5,
    "orientation_allowed": ["FRONT", "SIDE"],
    "is_refrigerated": false,
    "min_facing": 1,
    "max_facing": 10
  },

  // 가격 정보
  "price_info": {
    "retail_price": 4350,
    "currency": "KRW",
    "effective_date": ISODate
  },

  "is_active": true,
  "created_at": ISODate,
  "updated_at": ISODate
}

// Indexes
db.products.createIndex({ "barcode": 1 }, { unique: true });
db.products.createIndex({ "sku_name": "text", "brand": "text" });
db.products.createIndex({ "category_id": 1, "is_active": 1 });
db.products.createIndex({ "company_id": 1 });

// =============================================
// Collection: scene_data (3D 씬 데이터)
// =============================================
{
  "_id": ObjectId,
  "project_id": NumberLong,             // MySQL projects.id 참조
  "version": 1,

  // 매장 공간 정의
  "space": {
    "floor_dimensions": {
      "width": 50000,    // mm (50m)
      "depth": 30000     // mm (30m)
    },
    "walls": [
      {
        "id": "wall_001",
        "start": { "x": 0, "y": 0, "z": 0 },
        "end": { "x": 50000, "y": 0, "z": 0 },
        "height": 3000,
        "thickness": 200
      }
    ],
    "zones": [
      {
        "id": "zone_001",
        "type_code": "PRODUCE",
        "name": "농산 코너",
        "bounds": {
          "min": { "x": 0, "z": 0 },
          "max": { "x": 10000, "z": 8000 }
        },
        "color_hex": "#22C55E"
      }
    ]
  },

  // 배치된 매대 인스턴스
  "fixtures": [
    {
      "instance_id": "ZONE_A_01_01",
      "template_id": NumberLong,        // MySQL fixture_templates.id 참조
      "template_code": "EMT_GONDOLA_STD_01",
      "position": { "x": 1200, "y": 0, "z": 3500 },
      "rotation": 90,

      // 선반 설정
      "shelves": [
        {
          "index": 1,
          "elevation": 200,
          "has_lcd": false,
          "lcd_content_url": null,
          "products": []
        },
        {
          "index": 2,
          "elevation": 600,
          "has_lcd": true,
          "lcd_content_url": "https://cdn.../promo.mp4",
          "products": [
            {
              "product_id": "P_8801043014856",
              "position_x": 50,
              "facing_count": 3,
              "stacking_count": 2,
              "orientation": "FRONT"
            }
          ]
        }
      ],

      "metadata": {
        "assigned_zone": "zone_001",
        "last_modified_by": NumberLong,
        "last_modified_at": ISODate
      }
    }
  ],

  // 카메라 북마크
  "camera_bookmarks": [
    {
      "name": "입구 전경",
      "position": { "x": 5000, "y": 2000, "z": 15000 },
      "target": { "x": 25000, "y": 0, "z": 15000 }
    }
  ],

  "created_at": ISODate,
  "updated_at": ISODate,
  "created_by": NumberLong,
  "updated_by": NumberLong
}

// Indexes
db.scene_data.createIndex({ "project_id": 1 }, { unique: true });
db.scene_data.createIndex({ "updated_at": -1 });

// =============================================
// Collection: scene_history (변경 이력)
// =============================================
{
  "_id": ObjectId,
  "scene_id": ObjectId,
  "project_id": NumberLong,
  "version": 1,
  "snapshot": { /* scene_data 전체 복사본 */ },
  "change_summary": "매대 3개 추가, 상품 진열 수정",
  "created_by": NumberLong,
  "created_at": ISODate
}

// Indexes
db.scene_history.createIndex({ "project_id": 1, "version": -1 });
db.scene_history.createIndex({ "created_at": -1 });
```

---

## 4. API 설계

### 4.1 REST API 엔드포인트 (NestJS)

#### 인증 API
```
POST   /api/v1/auth/register          # 회원가입
POST   /api/v1/auth/login             # 로그인
POST   /api/v1/auth/refresh           # 토큰 갱신
POST   /api/v1/auth/logout            # 로그아웃
GET    /api/v1/auth/me                # 현재 사용자 정보
```

#### 프로젝트 API
```
GET    /api/v1/projects               # 프로젝트 목록 (페이지네이션)
POST   /api/v1/projects               # 프로젝트 생성
GET    /api/v1/projects/:id           # 프로젝트 상세
PUT    /api/v1/projects/:id           # 프로젝트 수정
DELETE /api/v1/projects/:id           # 프로젝트 삭제
POST   /api/v1/projects/:id/duplicate # 프로젝트 복제
```

#### 도면 처리 API
```
POST   /api/v1/projects/:id/floor-plan/upload    # 도면 업로드
POST   /api/v1/projects/:id/floor-plan/analyze   # 도면 분석 (OpenCV)
GET    /api/v1/projects/:id/floor-plan/result    # 분석 결과 조회
PUT    /api/v1/projects/:id/floor-plan/walls     # 벽체 수정
```

#### 3D 씬 API
```
GET    /api/v1/projects/:id/scene                # 씬 데이터 조회
PUT    /api/v1/projects/:id/scene                # 씬 데이터 저장
GET    /api/v1/projects/:id/scene/history        # 변경 이력
POST   /api/v1/projects/:id/scene/restore/:version  # 특정 버전 복원
```

#### 구역(Zone) API
```
GET    /api/v1/projects/:id/zones                # 구역 목록
POST   /api/v1/projects/:id/zones                # 구역 생성
PUT    /api/v1/projects/:id/zones/:zoneId        # 구역 수정
DELETE /api/v1/projects/:id/zones/:zoneId        # 구역 삭제
```

#### 매대 템플릿 API
```
GET    /api/v1/fixture-templates                 # 템플릿 목록
GET    /api/v1/fixture-templates/:id             # 템플릿 상세
POST   /api/v1/fixture-templates                 # 템플릿 생성 (관리자)
PUT    /api/v1/fixture-templates/:id             # 템플릿 수정 (관리자)
```

#### 매대 인스턴스 API
```
GET    /api/v1/projects/:id/fixtures             # 배치된 매대 목록
POST   /api/v1/projects/:id/fixtures             # 매대 배치
PUT    /api/v1/projects/:id/fixtures/:instanceId # 매대 수정 (위치, 선반 등)
DELETE /api/v1/projects/:id/fixtures/:instanceId # 매대 삭제
PUT    /api/v1/projects/:id/fixtures/:instanceId/shelves  # 선반 설정 수정
```

#### 상품 API
```
GET    /api/v1/products                          # 상품 목록 (검색, 필터)
GET    /api/v1/products/:id                      # 상품 상세
POST   /api/v1/products                          # 상품 등록
PUT    /api/v1/products/:id                      # 상품 수정
POST   /api/v1/products/bulk-import              # 대량 등록 (Excel)
```

#### 상품 진열 API
```
POST   /api/v1/projects/:id/fixtures/:instanceId/shelves/:shelfIndex/products
       # 상품 진열
PUT    /api/v1/projects/:id/fixtures/:instanceId/shelves/:shelfIndex/products/:productId
       # 진열 수정 (위치, 페이싱 수)
DELETE /api/v1/projects/:id/fixtures/:instanceId/shelves/:shelfIndex/products/:productId
       # 상품 제거
```

#### LCD API
```
POST   /api/v1/projects/:id/fixtures/:instanceId/shelves/:shelfIndex/lcd
       # LCD 설치
PUT    /api/v1/projects/:id/fixtures/:instanceId/shelves/:shelfIndex/lcd
       # LCD 콘텐츠 변경
DELETE /api/v1/projects/:id/fixtures/:instanceId/shelves/:shelfIndex/lcd
       # LCD 제거
```

#### 파일 업로드 API
```
POST   /api/v1/uploads/image                     # 이미지 업로드 (S3)
POST   /api/v1/uploads/model                     # 3D 모델 업로드
POST   /api/v1/uploads/video                     # 비디오 업로드
GET    /api/v1/uploads/:key/presigned-url        # 다운로드 URL 생성
```

### 4.2 이미지 처리 API (FastAPI/Python)

```
POST   /api/v1/image/analyze-floor-plan
       # 도면 이미지 분석 (벽체 추출)
       Request: multipart/form-data (image file)
       Response: {
         "walls": [...],
         "detected_zones": [...],
         "confidence": 0.85
       }

POST   /api/v1/image/extract-edges
       # 엣지 검출

POST   /api/v1/image/detect-regions
       # 구역 자동 분할

POST   /api/v1/image/generate-texture
       # 상품 텍스처 자동 생성 (배경 제거)
```

### 4.3 WebSocket 이벤트 (실시간 협업)

```javascript
// 클라이언트 -> 서버
socket.emit('join_project', { projectId });
socket.emit('leave_project', { projectId });
socket.emit('fixture_moved', { instanceId, position, rotation });
socket.emit('product_placed', { instanceId, shelfIndex, product });
socket.emit('cursor_move', { position }); // 다른 사용자 커서 위치

// 서버 -> 클라이언트
socket.on('user_joined', { userId, userName });
socket.on('user_left', { userId });
socket.on('fixture_updated', { instanceId, data });
socket.on('product_updated', { instanceId, shelfIndex, products });
socket.on('user_cursor', { userId, position });
socket.on('scene_saved', { version, timestamp });
```

---

## 5. 프론트엔드 구조

### 5.1 디렉토리 구조

```
frontend/
├── public/
│   └── models/                    # 기본 3D 모델 (GLB)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarLibrary.tsx      # 매대/상품 라이브러리
│   │   │   └── InspectorPanel.tsx      # 속성 편집 패널
│   │   │
│   │   ├── 3d/
│   │   │   ├── SceneContainer.tsx      # Canvas 래퍼
│   │   │   ├── CameraController.tsx    # 카메라 제어 + GSAP
│   │   │   ├── LightingSetup.tsx       # 조명 설정
│   │   │   │
│   │   │   ├── floor/
│   │   │   │   ├── FloorGrid.tsx       # 바닥 그리드
│   │   │   │   ├── ZoneRenderer.tsx    # 구역 렌더링
│   │   │   │   └── WallRenderer.tsx    # 벽체 렌더링
│   │   │   │
│   │   │   ├── fixtures/
│   │   │   │   ├── FixtureGroup.tsx    # 매대 그룹
│   │   │   │   ├── GondolaMesh.tsx     # 곤돌라 메쉬 (파라메트릭)
│   │   │   │   ├── FlatTableMesh.tsx   # 평대 메쉬
│   │   │   │   ├── ShelfBoard.tsx      # 선반 + 드래그 앤 드롭
│   │   │   │   ├── GhostFixture.tsx    # 반투명 매대
│   │   │   │   └── FixtureLabel.tsx    # 매대 ID 라벨 (HTML Overlay)
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── ProductItem.tsx     # 단일 상품
│   │   │   │   ├── ProductInstances.tsx # InstancedMesh 최적화
│   │   │   │   └── GhostProduct.tsx    # 드래그 중 고스트
│   │   │   │
│   │   │   ├── lcd/
│   │   │   │   ├── LCDDisplay.tsx      # LCD 모델
│   │   │   │   └── LCDContent.tsx      # 비디오/이미지 텍스처
│   │   │   │
│   │   │   └── controls/
│   │   │       ├── TransformControls.tsx
│   │   │       └── SelectionBox.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   └── common/
│   │       ├── DragOverlay.tsx
│   │       ├── ContextMenu.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── ProjectCard.tsx
│   │   │
│   │   ├── SpaceBuilder/
│   │   │   ├── SpaceBuilderPage.tsx    # 레이아웃 모드
│   │   │   ├── FloorPlanUploader.tsx
│   │   │   └── VectorEditor.tsx        # 벽체 편집
│   │   │
│   │   ├── VMDEditor/
│   │   │   ├── VMDEditorPage.tsx       # 진열 모드
│   │   │   ├── ShelfController.tsx
│   │   │   └── ProductPalette.tsx
│   │   │
│   │   └── Admin/
│   │       ├── FixtureTemplateManager.tsx
│   │       └── ProductManager.tsx
│   │
│   ├── store/                          # Zustand 스토어
│   │   ├── useAuthStore.ts
│   │   ├── useProjectStore.ts
│   │   ├── useSceneStore.ts            # 3D 씬 상태
│   │   ├── useFixtureStore.ts          # 매대 상태
│   │   ├── useProductStore.ts
│   │   ├── useSelectionStore.ts        # 선택 상태
│   │   └── useUIStore.ts               # UI 상태 (뷰 모드 등)
│   │
│   ├── hooks/
│   │   ├── useRaycaster.ts             # 3D 좌표 계산
│   │   ├── useCameraTween.ts           # 카메라 애니메이션
│   │   ├── useGridSnap.ts              # 스냅 로직
│   │   ├── useCollisionDetection.ts    # 충돌 감지
│   │   ├── useDragAndDrop.ts           # 드래그 앤 드롭
│   │   └── useWebSocket.ts             # 실시간 협업
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── authApi.ts
│   │   │   ├── projectApi.ts
│   │   │   ├── fixtureApi.ts
│   │   │   ├── productApi.ts
│   │   │   └── uploadApi.ts
│   │   │
│   │   └── socket/
│   │       └── socketService.ts
│   │
│   ├── utils/
│   │   ├── three/
│   │   │   ├── geometryUtils.ts        # 지오메트리 헬퍼
│   │   │   ├── materialUtils.ts        # 머티리얼 헬퍼
│   │   │   └── loaderUtils.ts          # 모델 로더
│   │   │
│   │   ├── math.ts                     # 수학 유틸
│   │   └── format.ts                   # 포맷 유틸
│   │
│   ├── types/
│   │   ├── api.types.ts
│   │   ├── fixture.types.ts
│   │   ├── product.types.ts
│   │   ├── scene.types.ts
│   │   └── user.types.ts
│   │
│   ├── constants/
│   │   ├── config.ts
│   │   └── defaults.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### 5.2 주요 컴포넌트 상세

#### CameraController.tsx (카메라 전환)
```typescript
interface CameraControllerProps {
  viewMode: 'TOP' | 'FRONT';
  focusTarget?: [number, number, number];
  controlsRef: React.RefObject<OrbitControls>;
}
```

#### FixtureGroup.tsx (매대)
```typescript
interface FixtureGroupProps {
  instance: FixtureInstance;
  template: FixtureTemplate;
  isSelected: boolean;
  isGhosted: boolean;  // 주변 매대 투명 처리
  onClick: () => void;
}
```

#### ShelfBoard.tsx (선반 + 드래그)
```typescript
interface ShelfBoardProps {
  width: number;
  depth: number;
  elevation: number;
  products: PlacedProduct[];
  onProductDrop: (product: Product, position: Vector3) => void;
}
```

---

## 6. 백엔드 구조

### 6.1 NestJS 프로젝트 구조

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   │
│   │   ├── projects/
│   │   │   ├── projects.controller.ts
│   │   │   ├── projects.service.ts
│   │   │   ├── projects.module.ts
│   │   │   ├── entities/
│   │   │   │   └── project.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-project.dto.ts
│   │   │       └── update-project.dto.ts
│   │   │
│   │   ├── fixtures/
│   │   │   ├── fixtures.controller.ts
│   │   │   ├── fixtures.service.ts
│   │   │   ├── templates.controller.ts
│   │   │   ├── templates.service.ts
│   │   │   ├── fixtures.module.ts
│   │   │   └── entities/
│   │   │       └── fixture-template.entity.ts
│   │   │
│   │   ├── products/
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   ├── products.module.ts
│   │   │   └── schemas/
│   │   │       └── product.schema.ts     # Mongoose Schema
│   │   │
│   │   ├── scenes/
│   │   │   ├── scenes.controller.ts
│   │   │   ├── scenes.service.ts
│   │   │   ├── scenes.module.ts
│   │   │   ├── schemas/
│   │   │   │   ├── scene-data.schema.ts
│   │   │   │   └── scene-history.schema.ts
│   │   │   └── dto/
│   │   │       └── update-scene.dto.ts
│   │   │
│   │   ├── uploads/
│   │   │   ├── uploads.controller.ts
│   │   │   ├── uploads.service.ts
│   │   │   └── uploads.module.ts
│   │   │
│   │   └── websocket/
│   │       ├── websocket.gateway.ts
│   │       └── websocket.module.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── aws.config.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── test/
├── package.json
├── tsconfig.json
└── nest-cli.json
```

### 6.2 FastAPI 이미지 처리 서버 구조

```
image-service/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── floor_plan.py       # 도면 분석 API
│   │   ├── texture.py          # 텍스처 처리 API
│   │   └── health.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── floor_plan_analyzer.py
│   │   ├── edge_detector.py
│   │   ├── region_segmenter.py
│   │   └── texture_generator.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py          # Pydantic 스키마
│   │
│   └── utils/
│       ├── __init__.py
│       ├── image_utils.py
│       └── geometry_utils.py
│
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

---

## 7. 인프라 구성 (AWS)

### 7.1 AWS 리소스 구성

```yaml
# 필수 AWS 서비스
VPC:
  - CIDR: 10.0.0.0/16
  - Public Subnets: 2개 (AZ별)
  - Private Subnets: 2개 (AZ별)
  - NAT Gateway: 1개

EC2:
  - Instance Type: t3.large (초기), c5.xlarge (확장 시)
  - OS: Ubuntu 24.04 LTS
  - Storage: 100GB gp3

RDS (MySQL):
  - Instance: db.t3.medium
  - Engine: MySQL 8.0
  - Storage: 100GB gp3
  - Multi-AZ: Production에서 활성화

DocumentDB/MongoDB:
  - 옵션 A: MongoDB Atlas (관리형, 권장)
  - 옵션 B: EC2에 직접 설치

ElastiCache (Redis):
  - Instance: cache.t3.micro
  - Purpose: 세션, 캐시

S3:
  - Bucket 1: 도면 이미지
  - Bucket 2: 상품 텍스처
  - Bucket 3: 3D 모델 (GLB)
  - CloudFront CDN 연동

Application Load Balancer:
  - HTTPS (443)
  - SSL Certificate (ACM)
```

### 7.2 Docker Compose 구성

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:1.24-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
      - image-service
    networks:
      - app-network

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_HOST=${DATABASE_HOST}
      - DATABASE_PORT=3306
      - DATABASE_NAME=${DATABASE_NAME}
      - DATABASE_USER=${DATABASE_USER}
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_S3_BUCKET=${AWS_S3_BUCKET}
    expose:
      - "3000"
    networks:
      - app-network
    restart: unless-stopped

  image-service:
    build:
      context: ./image-service
      dockerfile: Dockerfile
    environment:
      - PYTHONUNBUFFERED=1
    expose:
      - "8000"
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    expose:
      - "6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  redis-data:
```

### 7.3 Nginx 설정

```nginx
# nginx/nginx.conf
upstream api_backend {
    server api:3000;
}

upstream image_backend {
    server image-service:8000;
}

server {
    listen 80;
    server_name planogram.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name planogram.example.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # API 라우팅
    location /api/v1/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 이미지 처리 서비스
    location /api/v1/image/ {
        proxy_pass http://image_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 50M;  # 도면 이미지 업로드
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # 정적 파일 (React 빌드)
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 8. 개발 단계별 마일스톤

### Phase 1: 기반 구축 (Core & Infrastructure)

**목표:** 프로젝트 기본 설정, 인증, 3D 뷰어 기본 구현

**Backend 작업:**
- [ ] NestJS 프로젝트 초기 설정
- [ ] MySQL 연결 및 TypeORM 설정
- [ ] MongoDB 연결 및 Mongoose 설정
- [ ] 사용자 인증 (JWT) 구현
- [ ] 프로젝트 CRUD API
- [ ] 파일 업로드 (S3) 연동

**Frontend 작업:**
- [ ] React + Vite 프로젝트 설정
- [ ] React Three Fiber 기본 씬 구성
- [ ] 카메라 컨트롤 (OrbitControls)
- [ ] 기본 조명 설정
- [ ] Zustand 상태 관리 설정
- [ ] 로그인/회원가입 페이지
- [ ] 대시보드 레이아웃

**Infrastructure 작업:**
- [ ] AWS EC2 인스턴스 생성 (Ubuntu 24.04)
- [ ] Docker 환경 구성
- [ ] RDS MySQL 인스턴스 생성
- [ ] S3 버킷 생성 및 정책 설정

**산출물:**
- 빈 3D 캔버스에서 마우스로 시점 조절 가능
- 사용자 로그인/로그아웃 기능
- 프로젝트 생성/목록 조회

---

### Phase 2: 공간 생성 (Space Builder)

**목표:** 도면 업로드, 벽체 생성, 구역 설정

**Backend 작업:**
- [ ] FastAPI 이미지 서비스 구축
- [ ] OpenCV 도면 분석 알고리즘 구현
  - 엣지 검출 (Canny Edge Detection)
  - 직선 검출 (Hough Transform)
  - 구역 분할 (Contour Detection)
- [ ] 분석 결과 저장 API
- [ ] 벽체/구역 수정 API

**Frontend 작업:**
- [ ] 도면 이미지 업로드 UI
- [ ] 3D 벽체 렌더링 (ExtrudeGeometry)
- [ ] 구역(Zone) 시각화
- [ ] 벡터 편집기 (정점 수정)
- [ ] 탑뷰 모드 구현
- [ ] 구역 라벨링 UI

**산출물:**
- 도면 이미지 업로드 시 자동으로 벽체 추출
- 사용자가 벽체 위치/높이 수정 가능
- 구역 생성 및 라벨 지정

---

### Phase 3: 매대 시스템 (Fixture Engine)

**목표:** 매대 템플릿 관리, 배치, 파라메트릭 조절

**Backend 작업:**
- [ ] 매대 템플릿 CRUD API
- [ ] 매대 인스턴스 API
- [ ] 씬 데이터 저장/조회 API
- [ ] 변경 이력 관리

**Frontend 작업:**
- [ ] 매대 라이브러리 UI (좌측 패널)
- [ ] 파라메트릭 곤돌라 컴포넌트
  - 너비/높이/깊이 실시간 변경
  - 선반 수 조절
- [ ] 평대 컴포넌트
- [ ] 매대 드래그 앤 드롭 배치
- [ ] 매대 회전/이동/삭제
- [ ] 매대 ID 자동 부여 로직
- [ ] 속성 편집 패널 (우측)

**산출물:**
- 매대 템플릿 라이브러리에서 드래그하여 배치
- 배치된 매대의 크기 파라메트릭 수정
- 매대 ID 자동 표시 (A-01-01 형식)

---

### Phase 4: VMD 에디터 (VMD Logic)

**목표:** 매대 정면 뷰, 고스팅, 선반 조절, 좌우 네비게이션

**Frontend 작업:**
- [ ] 카메라 트위닝 (GSAP)
  - 탑뷰 -> 정면뷰 전환
  - 정면뷰 -> 탑뷰 복귀
- [ ] 매대 고스팅 처리 (투명도 30%)
- [ ] 선반 높이 드래그 조절
  - 구멍 간격 스냅 (25mm)
- [ ] 좌/우 화살표 네비게이션
- [ ] 선반 추가/삭제 기능
- [ ] 매대/선반 번호 오버레이

**산출물:**
- 매대 더블 클릭 시 부드럽게 정면 뷰로 전환
- 주변 매대 반투명 처리
- 선반 높이 마우스로 조절
- 좌우 화살표로 인접 매대 이동

---

### Phase 5: 상품 진열 (Items & Products)

**목표:** 상품 DB 연동, 드래그 앤 드롭 진열, 충돌 감지

**Backend 작업:**
- [ ] 상품 CRUD API (MongoDB)
- [ ] 상품 검색 API (텍스트 검색, 필터)
- [ ] 상품 대량 등록 (Excel import)
- [ ] 진열 상품 저장 API

**Frontend 작업:**
- [ ] 상품 팔레트 UI (우측 패널)
- [ ] 상품 검색 기능
- [ ] 상품 드래그 앤 드롭
- [ ] Raycasting + Grid Snap 구현
- [ ] 충돌 감지 (AABB)
- [ ] 고스트 프리뷰 (배치 전 미리보기)
- [ ] 페이싱 수 조절
- [ ] 상품 적재 (Stacking)
- [ ] InstancedMesh 최적화

**산출물:**
- 상품 검색 후 선반에 드래그 진열
- 자동 스냅 정렬
- 충돌 시 빨간색 표시
- 페이싱/적재 수 설정

---

### Phase 6: LCD 시뮬레이션 (LCD Display)

**목표:** LCD 모델 배치, 콘텐츠 매핑

**Backend 작업:**
- [ ] LCD 모델 관리 API
- [ ] LCD 콘텐츠 업로드 API

**Frontend 작업:**
- [ ] LCD 3D 모델 컴포넌트
- [ ] 선반 엣지 부착 로직
- [ ] 비디오 텍스처 매핑 (VideoTexture)
- [ ] 이미지 텍스처 매핑
- [ ] LCD 콘텐츠 변경 UI

**산출물:**
- 선반에 LCD 설치/제거
- LCD에 이미지/비디오 표시
- 실제 프로모션 시뮬레이션

---

### Phase 7: 협업 및 최적화 (Collaboration & Optimization)

**목표:** 실시간 협업, 성능 최적화, 최종 마무리

**Backend 작업:**
- [ ] WebSocket 게이트웨이 구현
- [ ] 실시간 동기화 로직
- [ ] 씬 버전 관리 강화

**Frontend 작업:**
- [ ] 다중 사용자 커서 표시
- [ ] 실시간 변경 반영
- [ ] LOD (Level of Detail) 구현
- [ ] 지연 로딩 (Lazy Loading)
- [ ] 메모리 최적화
- [ ] 3D 공간 워크스루 모드

**Infrastructure 작업:**
- [ ] 로드밸런서 설정
- [ ] CDN 최적화
- [ ] 모니터링 설정 (CloudWatch)
- [ ] 백업 정책 수립

**산출물:**
- 여러 사용자 동시 편집
- 대형 매장에서도 부드러운 렌더링
- 프로덕션 배포 완료

---

## 9. 보안 고려사항

### 9.1 인증 및 권한
- JWT 토큰 기반 인증
- Refresh Token 회전 정책
- 역할 기반 접근 제어 (RBAC)
- API Rate Limiting

### 9.2 데이터 보안
- 비밀번호 bcrypt 해시
- HTTPS 강제 적용
- SQL Injection 방지 (파라미터 바인딩)
- XSS 방지 (입력 검증)
- CORS 설정

### 9.3 인프라 보안
- VPC 네트워크 격리
- Security Group 최소 권한
- RDS 암호화 활성화
- S3 버킷 정책 설정
- IAM 역할 분리

---

## 10. 모니터링 및 로깅

### 10.1 모니터링 도구
- AWS CloudWatch (인프라 메트릭)
- Application Performance Monitoring (APM)
- 에러 트래킹 (Sentry)

### 10.2 로그 관리
- 구조화된 로그 형식 (JSON)
- 로그 레벨 분류 (ERROR, WARN, INFO, DEBUG)
- 로그 보관 정책 (30일)
- 중앙 집중 로그 수집

---

## 11. 테스트 전략

### 11.1 Frontend 테스트
- 단위 테스트: Vitest
- 컴포넌트 테스트: React Testing Library
- E2E 테스트: Playwright

### 11.2 Backend 테스트
- 단위 테스트: Jest
- 통합 테스트: Supertest
- API 문서: Swagger/OpenAPI

---

## 12. 배포 전략

### 12.1 개발 환경
- 로컬 Docker Compose
- 개발용 RDS 인스턴스

### 12.2 스테이징 환경
- 프로덕션과 동일 구성
- 테스트 데이터 사용

### 12.3 프로덕션 환경
- Blue-Green 배포
- 자동화된 CI/CD (GitHub Actions)
- 롤백 절차 문서화

---

## 부록 A: 환경 변수

```bash
# .env.example

# Application
NODE_ENV=production
PORT=3000

# MySQL
DATABASE_HOST=your-rds-endpoint.amazonaws.com
DATABASE_PORT=3306
DATABASE_NAME=planogram
DATABASE_USER=admin
DATABASE_PASSWORD=your-secure-password

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/planogram

# Redis
REDIS_URL=redis://your-elasticache-endpoint:6379

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# AWS
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=planogram-assets

# Image Service
IMAGE_SERVICE_URL=http://image-service:8000
```

---

## 부록 B: 초기 데이터 (Seed)

### 매대 템플릿 예시
```json
[
  {
    "template_code": "EMT_GONDOLA_STD_01",
    "name": "이마트 표준 곤돌라 (하이퍼)",
    "category": "GONDOLA",
    "retailer_type": "EMART",
    "width": 900,
    "height": 1800,
    "depth": 450,
    "default_shelf_count": 5,
    "post_interval": 25
  },
  {
    "template_code": "CU_GONDOLA_CVS_01",
    "name": "CU 편의점 표준 곤돌라",
    "category": "GONDOLA",
    "retailer_type": "CU",
    "width": 600,
    "height": 1500,
    "depth": 400,
    "default_shelf_count": 4,
    "post_interval": 25
  }
]
```

### 구역 타입 예시
```json
[
  { "code": "PRODUCE", "name": "농산", "color_hex": "#22C55E" },
  { "code": "DAIRY", "name": "유제품", "color_hex": "#3B82F6" },
  { "code": "FROZEN", "name": "냉동", "color_hex": "#06B6D4", "is_refrigerated": true },
  { "code": "SNACKS", "name": "과자", "color_hex": "#F59E0B" },
  { "code": "BEVERAGES", "name": "음료", "color_hex": "#8B5CF6" }
]
```
