import express from 'express';
import oracledb from 'oracledb';

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(express.json());

// Oracle 연결 설정
const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_DSN || 'localhost:1521/FREEPDB1'
};

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Test Automation Dashboard API' });
});

// 테스트 계획 목록 조회
app.get('/api/test-plans', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      'SELECT id, name, description, created_at FROM test_plans ORDER BY created_at DESC',
      [],
      { resultSet: true }
    );
    const rows = await result.resultSet.getRows();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// 테스트 계획 생성
app.post('/api/test-plans', async (req, res) => {
  let connection;
  try {
    const { name, description } = req.body;
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      'INSERT INTO test_plans (name, description) VALUES (:name, :description) RETURNING id INTO :id',
      [name, description],
      { autoCommit: true, outBind: true }
    );
    res.status(201).json({ id: result.outBinds.id[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// 테스트 계획 수정
app.put('/api/test-plans/:id', async (req, res) => {
  let connection;
  try {
    const id = req.params.id;
    const { name, description } = req.body;
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'UPDATE test_plans SET name = :name, description = :description WHERE id = :id',
      [name, description, id],
      { autoCommit: true }
    );
    res.json({ message: 'Test plan updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// 테스트 계획 삭제
app.delete('/api/test-plans/:id', async (req, res) => {
  let connection;
  try {
    const id = req.params.id;
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM test_plans WHERE id = :id',
      [id],
      { autoCommit: true }
    );
    res.json({ message: 'Test plan deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// 테스트 실행 결과 조회
app.get('/api/test-executions', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      'SELECT id, plan_id, status, executed_at FROM test_executions ORDER BY executed_at DESC',
      [],
      { resultSet: true }
    );
    const rows = await result.resultSet.getRows();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// 테스트 실행 요청
app.post('/api/test-executions', async (req, res) => {
  let connection;
  try {
    const { plan_id } = req.body;
    connection = await oracledb.getConnection(dbConfig);
    
    // 새로운 실행 기록 생성
    const insertResult = await connection.execute(
      'INSERT INTO test_executions (plan_id, status) VALUES (:plan_id, :status) RETURNING id INTO :id',
      [plan_id, 'RUNNING'],
      { autoCommit: true, outBind: true }
    );
    
    const executionId = insertResult.outBinds.id[0];
    
    // 여기서 실제 API 테스트 실행 로직을 구현
    // 현재는 가상의 결과를 반환
    const resultData = {
      execution_id: executionId,
      status: 'SUCCESS',
      logs: ['테스트 실행 시작', 'API 요청 전송', '응답 수신', '테스트 완료']
    };
    
    // 결과 업데이트
    await connection.execute(
      'UPDATE test_executions SET status = :status, result_data = :result_data WHERE id = :id',
      [resultData.status, JSON.stringify(resultData), executionId],
      { autoCommit: true }
    );
    
    // 코드 커버리지 데이터 삽입 (가상)
    const coverageData = [
      { file_path: '/src/api/users.js', covered_lines: 85, total_lines: 100, coverage_percentage: 85.00 },
      { file_path: '/src/api/auth.js', covered_lines: 60, total_lines: 75, coverage_percentage: 80.00 }
    ];
    
    for (const data of coverageData) {
      await connection.execute(
        'INSERT INTO code_coverage (execution_id, file_path, covered_lines, total_lines, coverage_percentage) VALUES (:execution_id, :file_path, :covered_lines, :total_lines, :coverage_percentage)',
        [executionId, data.file_path, data.covered_lines, data.total_lines, data.coverage_percentage],
        { autoCommit: true }
      );
    }
    
    res.status(201).json({ id: executionId, ...resultData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// 코드 커버리지 조회
app.get('/api/code-coverage', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      'SELECT execution_id, file_path, covered_lines, total_lines, coverage_percentage FROM code_coverage ORDER BY execution_id',
      [],
      { resultSet: true }
    );
    const rows = await result.resultSet.getRows();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});