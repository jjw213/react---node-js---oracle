# 테스트 자동화 및 품질 지표 시각화 도구

테스트 계획, 실행 결과, 코드 커버리지, 성능 지표를 관리하고 시각화하는 도구

## 현재까지 구현된 기능
- 프로젝트 구조 설정 (Node.js + Express, React + Vite, Oracle Database Free)
- 초기 API 명세 정의 (API.md)
- 테스트 계획 관리 도메인 구현 (생성, 조회, 수정, 삭제)
- API 자동 테스트 실행 시스템 구현 (실행 요청, 결과 저장, 상태 및 로그 관리)
- 코드 커버리지 수집 및 시각화 기능 구현

## 실행 방법

### 백엔드 실행
1. 환경 변수 설정:
   - ORACLE_DSN: Oracle DSN (기본: localhost:1521/FREEPDB1)
   - ORACLE_USER: Oracle 사용자명
   - ORACLE_PASSWORD: Oracle 비밀번호
2. 의존성 설치:
   ```bash
   cd backend
   npm install
   ```
3. 서버 실행:
   ```bash
   npm start
   ```

### 프론트엔드 실행
1. 의존성 설치:
   ```bash
   cd frontend
   npm install
   ```
2. 개발 서버 실행:
   ```bash
   npm run dev
   ```