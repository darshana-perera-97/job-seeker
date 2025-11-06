import { SidebarProvider, useSidebar } from '../components/SidebarProvider';
import AppSidebar from '../components/AppSidebar';
import DashboardNavbar from '../components/DashboardNavbar';

function DashboardLayoutContent({ children }) {
  const { isMobile, openMobile, setOpenMobile, state } = useSidebar();
  const isCollapsed = state === 'collapsed' && !isMobile;

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar
        isMobile={isMobile}
        isOpen={openMobile}
        onClose={() => {
          setOpenMobile(false);
        }}
      />
      {/* Spacer for fixed sidebar on desktop */}
      <div className={`hidden md:block flex-shrink-0 transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`} />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardNavbar />
        <main 
          className="flex-1 overflow-auto transition-all duration-200 dark:bg-[#0F1419] bg-[#F8FAFF]" 
        >
          {children}
        </main>
      </div>
    </div>
  );
}

function DashboardLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

export default DashboardLayout;

