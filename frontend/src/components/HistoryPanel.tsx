import React from 'react';
import { useHistory } from '../hooks/useHistory';

export const HistoryPanel: React.FC = () => {
  const { history, loading, error, fetchHistory } = useHistory();

  return (
    <div className="history-panel">
      <h3>Comparison History</h3>
      <button onClick={fetchHistory} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
      {error && <p className="error">{error}</p>}
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            <div>
              <p>ID: {item.id}</p>
              <p>Diff: {item.diff_percentage.toFixed(2)}%</p>
            </div>
            <div>
              <img src={`http://localhost:8000${item.before_image}`} alt="Before" />
              <img src={`http://localhost:8000${item.after_image}`} alt="After" />
              <img src={`http://localhost:8000${item.diff_image}`} alt="Diff" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
