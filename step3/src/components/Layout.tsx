import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-56 w-full relative z-0">{children}</main>
    </div>
  );
};

export default Layout;
