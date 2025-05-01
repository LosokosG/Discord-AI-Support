import { useState, useEffect } from 'react';

/**
 * Custom hook for managing the sidebar state in the dashboard layout
 * Controls the visibility of the mobile sidebar (Drawer component)
 */
const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    // Auto-close sidebar on window resize to desktop breakpoint
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint in Tailwind
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Optional: Close sidebar when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const sidebarElement = document.getElementById('mobile-sidebar');
      if (sidebarElement && !sidebarElement.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return { isOpen, toggleSidebar, openSidebar, closeSidebar };
};

export default useSidebar; 