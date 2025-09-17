import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow p-4 ${className ?? ''}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`border-b pb-2 mb-2 font-bold text-lg ${className ?? ''}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`text-xl font-semibold mb-1 ${className ?? ''}`}>{children}</div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`py-2 ${className ?? ''}`}>{children}</div>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`text-gray-500 text-sm mb-2 ${className ?? ''}`}>{children}</div>
);
