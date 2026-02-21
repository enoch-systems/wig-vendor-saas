import React from 'react';

const AnalyticsChart = ({ data, type, title }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const renderSimpleBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-12 text-sm font-medium text-gray-600">{item.name}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
              <div 
                className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.value)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSimpleLineChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t-lg relative">
                <div 
                  className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg"
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 mt-2">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSimplePieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 rounded-full bg-gray-200"></div>
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const rotation = index === 0 ? 0 : data.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 360, 0);
              
              return (
                <div
                  key={index}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${COLORS[index % COLORS.length]} 0deg ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                    transform: `rotate(${rotation}deg)`
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderSimpleBarChart();
      case 'line':
        return renderSimpleLineChart();
      case 'pie':
        return renderSimplePieChart();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {renderChart()}
    </div>
  );
};

export default AnalyticsChart;
