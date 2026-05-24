import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#121212]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <div
        className={`
          flex flex-col flex-1 w-full transition-all duration-300 md:ml-64
          ${sidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-16"}
        `}
      >
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="p-4 md:p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
