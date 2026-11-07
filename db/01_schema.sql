-- 테스트 계획 테이블
CREATE TABLE test_plans (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR2(255) NOT NULL,
  description CLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 테스트 실행 기록 테이블
CREATE TABLE test_executions (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  plan_id NUMBER NOT NULL,
  status VARCHAR2(50) NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  result_data CLOB,
  FOREIGN KEY (plan_id) REFERENCES test_plans(id)
);

-- 코드 커버리지 데이터 테이블
CREATE TABLE code_coverage (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  execution_id NUMBER NOT NULL,
  file_path VARCHAR2(500),
  covered_lines NUMBER,
  total_lines NUMBER,
  coverage_percentage NUMBER(5,2),
  FOREIGN KEY (execution_id) REFERENCES test_executions(id)
);

-- 성능 지표 테이블
CREATE TABLE performance_metrics (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  execution_id NUMBER NOT NULL,
  metric_name VARCHAR2(100),
  value NUMBER,
  unit VARCHAR2(20),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (execution_id) REFERENCES test_executions(id)
);