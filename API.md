# API 명세

요청/응답 형식과 경로를 정의하고 프론트와 백엔드 모두 동일한 기준으로 구현합니다.

## 테스트 계획 관리
- GET `/api/test-plans` - 테스트 계획 목록 조회
- POST `/api/test-plans` - 테스트 계획 생성
- PUT `/api/test-plans/:id` - 테스트 계획 수정
- DELETE `/api/test-plans/:id` - 테스트 계획 삭제

## 테스트 실행 관리
- GET `/api/test-executions` - 테스트 실행 결과 조회
- POST `/api/test-executions` - 테스트 실행 요청

## 코드 커버리지
- GET `/api/code-coverage` - 코드 커버리지 데이터 조회

## 성능 지표
- GET `/api/performance-metrics` - 성능 지표 조회

## 대시보드
- GET `/api/dashboard` - 통합 대시보드 데이터 조회

## 알림 설정
- POST `/api/notifications` - 알림 설정 저장

## 사용자 관리
- GET `/api/users` - 사용자 정보 조회
- PUT `/api/users` - 사용자 정보 수정
- DELETE `/api/users` - 사용자 삭제