import { MainMenu } from './navigation/MainMenu';

import React from 'react';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen max-6xl  w-6xl bg-background text-foreground">
      <header className="bg-header p-4">
        <MainMenu />
      </header>
      <main className="flex-1 container mx-auto p-6">{children}</main>
    </div>
  );
};
