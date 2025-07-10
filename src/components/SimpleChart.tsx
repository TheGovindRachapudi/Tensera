import React from 'react';
import { ChartDataPoint } from '../types';

interface SimpleChartProps {
  data: ChartDataPoint[];
  title?: string;
  color?: string;
  height?: number;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ 
  data, 
  title = 'Price Chart', 
  color = '#3b82f6',
  height = 200 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const values = data.map(point => Number(point.y));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  const createPath = () => {
    const width = 800;
    const stepX = width / (data.length - 1);
    
    return data.map((point, index) => {
      const x = index * stepX;
      const y = range === 0 ? height / 2 : height - ((Number(point.y) - minValue) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const isPositive = data.length > 1 && Number(data[data.length - 1].y) > Number(data[0].y);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '↗' : '↘'} {((Number(data[data.length - 1].y) - Number(data[0].y)) / Number(data[0].y) * 100).toFixed(2)}%
        </div>
      </div>
      
      <div className="relative">
        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 800 ${height}`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="800" height={height} fill="url(#grid)" />
          
          {/* Chart line */}
          <path
            d={createPath()}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Fill area */}
          <path
            d={`${createPath()} L 800 ${height} L 0 ${height} Z`}
            fill={`${color}20`}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = index * (800 / (data.length - 1));
            const y = range === 0 ? height / 2 : height - ((Number(point.y) - minValue) / range) * height;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="hover:r-5 transition-all duration-200"
              >
                <title>{`${point.x}: ${point.y}`}</title>
              </circle>
            );
          })}
        </svg>
        
        {/* Value labels */}
        <div className="absolute top-0 left-0 text-xs text-gray-500">
          ${maxValue.toFixed(2)}
        </div>
        <div className="absolute bottom-0 left-0 text-xs text-gray-500">
          ${minValue.toFixed(2)}
        </div>
      </div>
      
      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-600">Min</div>
          <div className="font-semibold">${minValue.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Max</div>
          <div className="font-semibold">${maxValue.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Avg</div>
          <div className="font-semibold">
            ${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleChart;
