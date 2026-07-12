import { ThemeProvider } from "./context/ThemeContext";
import { CursorProvider } from "./context/CursorContext";
import SmoothScroll from "./components/layout/SmoothScroll";
import CustomCursor from "./components/layout/CustomCursor";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Lab from "./components/sections/Lab";
import Contact from "./components/sections/Contact";

function App() {
  return (
    <ThemeProvider>
      <CursorProvider>
        <SmoothScroll>
          <div className="relative min-h-screen">
            <div className="noise-layer" />
            <CustomCursor />
            <Navbar />
            <main>
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Experience />
              <Lab />
              <Contact />
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </CursorProvider>
    </ThemeProvider>
  );
}

export default App;
