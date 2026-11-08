import React, { useState, useEffect } from 'react';

function App() {
  const [testPlans, setTestPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestPlans();
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

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
    </div>
  );
}

export default App;