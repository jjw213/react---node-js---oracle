-- 테스트 계획 데이터
INSERT INTO test_plans (name, description) VALUES ('API 통합 테스트', 'REST API 엔드포인트에 대한 통합 테스트');
INSERT INTO test_plans (name, description) VALUES ('사용자 인증 테스트', '로그인 및 권한 검증 테스트');

-- 테스트 실행 기록 데이터
INSERT INTO test_executions (plan_id, status) VALUES (1, 'SUCCESS');
INSERT INTO test_executions (plan_id, status) VALUES (2, 'FAILED');

-- 코드 커버리지 데이터
INSERT INTO code_coverage (execution_id, file_path, covered_lines, total_lines, coverage_percentage)
VALUES (1, '/src/api/users.js', 85, 100, 85.00);

-- 성능 지표 데이터
INSERT INTO performance_metrics (execution_id, metric_name, value, unit)
VALUES (1, 'response_time_ms', 250, 'ms');

COMMIT;