import React, { useState, useEffect } from 'react';

function App() {
  const [testPlans, setTestPlans] = useState([]);
  const [coverageData, setCoverageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestPlans();
    fetchCodeCoverage();
  }, []);

  const fetchTestPlans = async () => {
    try {
      const response = await fetch('/api/test-plans');
      if (!response.ok) {
        throw new Error('Failed to fetch test plans');
      }
      const data = await response.json();
      setTestPlans(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchCodeCoverage = async () => {
    try {
      const response = await fetch('/api/code-coverage');
      if (!response.ok) {
        throw new Error('Failed to fetch code coverage data');
      }
      const data = await response.json();
      setCoverageData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  // 커버리지 데이터를 파일별로 그룹화
  const coverageByFile = coverageData.reduce((acc, item) => {
    if (!acc[item.file_path]) {
      acc[item.file_path] = [];
    }
    acc[item.file_path].push(item);
    return acc;
  }, {});

  return (
    <div className="app">
      <h1>테스트 자동화 및 품질 지표 시각화 도구</h1>
      
      <h2>테스트 계획 목록</h2>
      <ul>
        {testPlans.map(plan => (
          <li key={plan.id}>
            <strong>{plan.name}</strong>: {plan.description}
          </li>
        ))}
      </ul>

      <h2>코드 커버리지</h2>
      <div>
        {Object.entries(coverageByFile).map(([filePath, data]) => (
          <div key={filePath} style={{ marginBottom: '20px' }}>
            <h3>{filePath}</h3>
            <div>
              {data.map((item, index) => (
                <div key={index} style={{ margin: '5px 0' }}>
                  <span>커버리지: {item.coverage_percentage}%</span>
                  <span> ({item.covered_lines}/{item.total_lines} 라인)</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;