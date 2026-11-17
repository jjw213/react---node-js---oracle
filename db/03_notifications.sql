-- 알림 설정 테이블
CREATE TABLE notifications (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_type VARCHAR2(100) NOT NULL, -- 예: 'TEST_FAILED', 'PERFORMANCE_DEGRADATION'
  notification_type VARCHAR2(50) NOT NULL, -- 예: 'EMAIL', 'WEBHOOK'
  target VARCHAR2(500) NOT NULL, -- 이메일 주소 또는 웹훅 URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 알림 기록 테이블
CREATE TABLE notification_logs (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  notification_id NUMBER NOT NULL,
  event_data CLOB,
  status VARCHAR2(50) NOT NULL, -- 예: 'SENT', 'FAILED'
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notification_id) REFERENCES notifications(id)
);