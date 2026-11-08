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

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});