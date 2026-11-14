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
    
    // 성능 지표 데이터 삽입 (가상)
    const performanceData = [
      { metric_name: 'response_time_ms', value: 250, unit: 'ms' },
      { metric_name: 'cpu_usage_percent', value: 45.5, unit: '%' },
      { metric_name: 'memory_usage_mb', value: 128.7, unit: 'MB' }
    ];
    
    for (const data of performanceData) {
      await connection.execute(
        'INSERT INTO performance_metrics (execution_id, metric_name, value, unit) VALUES (:execution_id, :metric_name, :value, :unit)',
        [executionId, data.metric_name, data.value, data.unit],
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

// 성능 지표 조회
app.get('/api/performance-metrics', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      'SELECT id, execution_id, metric_name, value, unit, recorded_at FROM performance_metrics ORDER BY recorded_at DESC',
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

// 성능 지표 저장
app.post('/api/performance-metrics', async (req, res) => {
  let connection;
  try {
    const { execution_id, metric_name, value, unit } = req.body;
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      'INSERT INTO performance_metrics (execution_id, metric_name, value, unit) VALUES (:execution_id, :metric_name, :value, :unit) RETURNING id INTO :id',
      [execution_id, metric_name, value, unit],
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

// 통합 대시보드 데이터 조회
app.get('/api/dashboard', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    // 테스트 실행 결과 요약
    const executionSummaryResult = await connection.execute(
      "SELECT status, COUNT(*) as count FROM test_executions GROUP BY status",
      [],
      { resultSet: true }
    );
    const executionSummary = await executionSummaryResult.resultSet.getRows();
    
    // 코드 커버리지 요약
    const coverageSummaryResult = await connection.execute(
      "SELECT AVG(coverage_percentage) as avg_coverage, COUNT(*) as file_count FROM code_coverage",
      [],
      { resultSet: true }
    );
    const coverageSummary = await coverageSummaryResult.resultSet.getRows();
    
    // 성능 지표 요약
    const performanceSummaryResult = await connection.execute(
      "SELECT metric_name, AVG(value) as avg_value, unit FROM performance_metrics GROUP BY metric_name, unit",
      [],
      { resultSet: true }
    );
    const performanceSummary = await performanceSummaryResult.resultSet.getRows();
    
    // 최근 테스트 실행
    const recentExecutionsResult = await connection.execute(
      "SELECT id, plan_id, status, executed_at FROM test_executions ORDER BY executed_at DESC FETCH FIRST 5 ROWS ONLY",
      [],
      { resultSet: true }
    );
    const recentExecutions = await recentExecutionsResult.resultSet.getRows();
    
    res.json({
      executionSummary,
      coverageSummary: coverageSummary[0],
      performanceSummary,
      recentExecutions
    });
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