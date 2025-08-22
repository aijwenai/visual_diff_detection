import React from 'react';
type Result = {
  before_image: string;
  after_image: string;
  diff_image: string;
  diff_percentage: number;
  diff_pixels: number;
  total_pixels: number;
  threshold: number;
};
type Props = { result?: Result };
export default function ResultsPanel({ result }: Props) {
  if (!result) return <p>No comparison yet.</p>;
  return (
    <div>
      <h3>Results</h3>
      <p>Difference: {result.diff_percentage.toFixed(2)}% ({result.diff_pixels}/{result.total_pixels})</p>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
        <div><img src={result.before_image} alt="before" width={200} /></div>
        <div><img src={result.after_image} alt="after" width={200} /></div>
        <div><img src={result.diff_image} alt="diff" width={200} /></div>
      </div>
      <p>Threshold: {result.threshold}</p>
    </div>
  );
}