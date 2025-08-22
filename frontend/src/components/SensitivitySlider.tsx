import React from 'react';
type Props = { value: number, onChange: (v:number)=>void };
export default function SensitivitySlider({ value, onChange }: Props) {
  return (
    <div>
      <label>
        Threshold: {value.toFixed(2)}
        <input type="range" min={0} max={1} step={0.01} value={value}
        onChange={e=>onChange(Number(e.target.value))} />
      </label>
    </div>
  );
}