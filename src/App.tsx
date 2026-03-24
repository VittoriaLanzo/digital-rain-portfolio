import { lazy, Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

/* Section pages loaded lazily — only parsed on first visit */
const About        = lazy(() => import('./pages/sections/About'));
const Skills       = lazy(() => import('./pages/sections/Skills'));
const Work         = lazy(() => import('./pages/sections/Work'));
const Lab          = lazy(() => import('./pages/sections/Lab'));
const ProjectDetail= lazy(() => import('./pages/sections/ProjectDetail'));
const Privacy      = lazy(() => import('./pages/Privacy'));

const queryClient = new QueryClient();

/* Fixed overlay that covers the city while a section page is active */
function SectionOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#050512', overflowY: 'auto',
    }}>
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </div>
  );
}

/* Inner component that can use useLocation (must be inside BrowserRouter) */
function AppRoutes() {
  const location = useLocation();
  const isCity = location.pathname === '/';

  /* Lock body scroll when an overlay is visible — prevents the city scroll
     from advancing while the user reads a section page */
  useEffect(() => {
    document.body.style.overflow = isCity ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isCity]);

  return (
    <>
      {/* City is ALWAYS mounted — WebGL context is never destroyed on navigation */}
      <Index />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/about"      element={<SectionOverlay><About /></SectionOverlay>} />
        <Route path="/skills"     element={<SectionOverlay><Skills /></SectionOverlay>} />
        <Route path="/work"       element={<SectionOverlay><Work /></SectionOverlay>} />
        <Route path="/work/:slug" element={<SectionOverlay><ProjectDetail /></SectionOverlay>} />
        <Route path="/lab"        element={<SectionOverlay><Lab /></SectionOverlay>} />
        <Route path="/privacy"    element={<SectionOverlay><Privacy /></SectionOverlay>} />
        <Route path="*"           element={<SectionOverlay><NotFound /></SectionOverlay>} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
