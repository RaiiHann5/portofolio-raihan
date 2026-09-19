import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CursorProvider } from "./context/CursorContext";
import { ContentProvider } from "./context/ContentContext";
import { AuthProvider } from "./context/AuthContext";
import SmoothScroll from "./components/layout/SmoothScroll";
import CustomCursor from "./components/layout/CustomCursor";
import ScrollToTop from "./components/layout/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import AboutMe from "./pages/AboutMe";
import Project from "./pages/Project";
import Marketplace from "./pages/Marketplace";
import FindMe from "./pages/FindMe";
import ProjectDetail from "./pages/ProjectDetail";
import TemplateDetail from "./pages/TemplateDetail";

// Panel admin dimuat terpisah dan hanya saat dibuka. Pengunjung biasa
// tidak pernah mengunduh formulir, katalog ikon, maupun pustaka Supabase.
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminTemplates = lazy(() => import("./pages/admin/AdminTemplates"));
const AdminCertificates = lazy(() => import("./pages/admin/AdminCertificates"));
const AdminLinks = lazy(() => import("./pages/admin/AdminLinks"));
const AdminText = lazy(() => import("./pages/admin/AdminText"));
const AdminSections = lazy(() => import("./pages/admin/AdminSections"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

function AdminFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="font-mono text-xs text-[var(--text-faint)]">Memuat panel…</p>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ContentProvider>
          <AuthProvider>
            <CursorProvider>
              <SmoothScroll>
                <div className="relative min-h-screen">
                  <div className="noise-layer" />
                  <CustomCursor />
                  <ScrollToTop />
                  <Navbar />
                  <main>
                    <Suspense fallback={<AdminFallback />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutMe />} />
                        <Route path="/project" element={<Project />} />
                        <Route path="/project/:slug" element={<ProjectDetail />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/marketplace/:slug" element={<TemplateDetail />} />
                        <Route path="/find-me" element={<FindMe />} />

                        <Route path="/admin" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route path="projects" element={<AdminProjects />} />
                          <Route path="templates" element={<AdminTemplates />} />
                          <Route path="certificates" element={<AdminCertificates />} />
                          <Route path="links" element={<AdminLinks />} />
                          <Route path="text" element={<AdminText />} />
                          <Route path="sections" element={<AdminSections />} />
                          <Route path="settings" element={<AdminSettings />} />
                        </Route>
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
              </SmoothScroll>
            </CursorProvider>
          </AuthProvider>
        </ContentProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
