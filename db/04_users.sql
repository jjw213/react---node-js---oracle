-- 사용자 테이블
CREATE TABLE users (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR2(100) NOT NULL UNIQUE,
  password_hash VARCHAR2(255) NOT NULL,
  role VARCHAR2(50) DEFAULT 'user', -- 'admin' 또는 'user'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 역할 테이블
CREATE TABLE user_roles (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id NUMBER NOT NULL,
  role VARCHAR2(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 인증 토큰 저장 테이블
CREATE TABLE auth_tokens (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id NUMBER NOT NULL,
  token VARCHAR2(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 사용자 데이터 삽입
INSERT INTO users (username, password_hash, role) VALUES ('admin', '$2b$10$example_hash_for_admin', 'admin');
INSERT INTO users (username, password_hash, role) VALUES ('user1', '$2b$10$example_hash_for_user1', 'user');

COMMIT;