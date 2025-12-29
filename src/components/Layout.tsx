import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="md:ml-48 w-full relative z-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
