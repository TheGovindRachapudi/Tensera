import React from 'react';
import { LoadingState } from '../types';

interface HealthStatusProps {
  isConnected: boolean;
  status: LoadingState;
  lastUpdated?: string;
  errorMessage?: string;
}

const HealthStatus: React.FC<HealthStatusProps> = ({
  isConnected,
  status,
  lastUpdated,
  errorMessage
}) => {
  const getStatusColor = () => {
    if (status === 'loading') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (status === 'error') return 'bg-red-100 text-red-800 border-red-200';
    if (isConnected) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = () => {
    if (status === 'loading') return 'Connecting...';
    if (status === 'error') return 'Connection Error';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (status === 'loading') return '⟳';
    if (status === 'error') return '⚠️';
    if (isConnected) return '✅';
    return '❌';
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
      <span className="mr-2">{getStatusIcon()}</span>
      <span>{getStatusText()}</span>
      {lastUpdated && (
        <span className="ml-2 text-xs opacity-75">
          Updated: {new Date(lastUpdated).toLocaleTimeString()}
        </span>
      )}
      {errorMessage && status === 'error' && (
        <span className="ml-2 text-xs opacity-75" title={errorMessage}>
          (Hover for details)
        </span>
      )}
    </div>
  );
};

export default HealthStatus;
