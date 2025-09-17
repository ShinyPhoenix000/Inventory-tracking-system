import React from 'react';

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className, ...props }) => (
  <select className={`border rounded px-3 py-2 w-full ${className ?? ''}`} {...props}>
    {children}
  </select>
);

export const SelectContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const SelectItem = ({ children }: { children: React.ReactNode }) => <option>{children}</option>;
export const SelectTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const SelectValue = ({ children }: { children: React.ReactNode }) => <span>{children}</span>;

export default Select;
export { Select };
