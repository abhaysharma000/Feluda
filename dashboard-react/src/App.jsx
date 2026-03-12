import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GlobalToast } from './components/GlobalToast'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { Dashboard } from './pages/Dashboard'
import { InterceptorLogs } from './pages/InterceptorLogs'
import { Settings } from './pages/Settings'
const App = () => {
  console.log("APP.JSX: Rendering...");
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="fixed top-0 left-0 z-[9999] bg-white text-black p-2 font-bold">REACT_RENDER_OK</div>
      <div className="relative min-h-screen bg-soc-bg text-slate-300 overflow-hidden font-sans">
        <GlobalToast />

        <div className="flex h-screen overflow-hidden relative z-10 w-full">
          <Sidebar />

          <main className="flex-1 flex flex-col overflow-hidden relative lg:ml-72">
            <Topbar />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 space-y-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full"
                >
                  <Routes location={location}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/intercepts" element={<InterceptorLogs />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App
