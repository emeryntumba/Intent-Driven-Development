import React from 'react';

export const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 py-8">
    {children}
  </div>
);