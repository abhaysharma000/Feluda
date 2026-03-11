import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GlobalToast } from './components/GlobalToast'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { Dashboard } from './pages/Dashboard'
import { Logs } from './pages/Logs'
import { Settings } from './pages/Settings'
import { ShowcaseModal } from './components/ShowcaseModal'
import { NeuralBackground } from './components/NeuralBackground'
import { LiveFeed } from './components/LiveFeed'

const App = () => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-soc-bg text-slate-300 overflow-hidden font-sans">
        <NeuralBackground />

        <GlobalToast />
        <ShowcaseModal />

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
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/live-feed" element={
                      <div className="h-full flex flex-col space-y-8 pb-12">
                        <header>
                          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 italic">Threat_Stream_Horizon</h1>
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Real-time forensic telemetry from localized inference nodes.</p>
                        </header>
                        <div className="flex-1 glass-panel p-0 overflow-hidden relative border-white/[0.03] bg-black/20">
                          <LiveFeed />
                        </div>
                      </div>
                    } />
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
