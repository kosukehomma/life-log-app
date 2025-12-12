import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="md:ml-48 w-full relative z-0">{children}</main>
    </div>
  );
};

export default Layout;
