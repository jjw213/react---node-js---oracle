import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!dashboardData) return <div>데이터가 없습니다.</div>;

  // 테스트 실행 결과 차트 데이터
  const executionChartData = dashboardData.executionSummary.map(item => ({
    name: item.status,
    count: item.count
  }));

  // 성능 지표 차트 데이터
  const performanceChartData = dashboardData.performanceSummary.map(item => ({
    name: item.metric_name,
    value: item.avg_value,
    unit: item.unit
  }));

  return (
    <div className="app">
      <h1>테스트 자동화 및 품질 지표 시각화 도구</h1>
      
      <h2>통합 대시보드</h2>
      
      {/* 테스트 실행 결과 요약 */}
      <div style={{ marginBottom: '30px' }}>
        <h3>테스트 실행 결과 요약</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={executionChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="실행 수" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 코드 커버리지 요약 */}
      <div style={{ marginBottom: '30px' }}>
        <h3>코드 커버리지 요약</h3>
        <p>평균 커버리지: {dashboardData.coverageSummary.avg_coverage?.toFixed(2)}%</p>
        <p>파일 수: {dashboardData.coverageSummary.file_count}</p>
      </div>

      {/* 성능 지표 요약 */}
      <div style={{ marginBottom: '30px' }}>
        <h3>성능 지표 요약</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={performanceChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" name="평균 값" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 최근 테스트 실행 결과 */}
      <div>
        <h3>최근 테스트 실행 결과</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>계획 ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>상태</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>실행 시간</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentExecutions.map(execution => (
              <tr key={execution.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{execution.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{execution.plan_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{execution.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {new Date(execution.executed_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;