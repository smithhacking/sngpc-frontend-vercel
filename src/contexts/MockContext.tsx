import React, { createContext, useContext, useState } from 'react';

interface MockContextType {
  isMockEnabled: boolean;
  toggleMock: () => void;
}

const MockContext = createContext<MockContextType | undefined>(undefined);

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [isMockEnabled, setIsMockEnabled] = useState(true);

  const toggleMock = () => {
    setIsMockEnabled(!isMockEnabled);
  };

  return (
    <MockContext.Provider value={{ isMockEnabled, toggleMock }}>
      {children}
    </MockContext.Provider>
  );
}

export function useMock() {
  const context = useContext(MockContext);
  if (context === undefined) {
    throw new Error('useMock must be used within a MockProvider');
  }
  return context;
}