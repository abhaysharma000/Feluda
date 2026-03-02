import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUI } from './context/UIContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GlobalToast } from './components/GlobalToast'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { Dashboard } from './pages/Dashboard'
import { Logs } from './pages/Logs'
import { ThreatMapPage } from './pages/ThreatMapPage'
import { Settings } from './pages/Settings'
import { ShowcaseModal } from './components/ShowcaseModal'
import { LiveFeed } from './components/LiveFeed'

const App = () => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-black overflow-hidden selection:bg-green-accent/30 selection:text-white">
        <div className="fixed inset-0 grid-bg pointer-events-none opacity-40"></div>

        <GlobalToast />
        <ShowcaseModal />

        <div className="flex h-screen overflow-hidden relative z-10 w-full">
          <Sidebar />

          <main className="flex-1 flex flex-col overflow-hidden relative">
            <Topbar />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Routes location={location}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/threat-map" element={<ThreatMapPage />} />
                    <Route path="/live-feed" element={<div className="space-y-8 pb-12">
                      <header>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Neural stream</h1>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Real-time inference logs from global intelligence nodes.</p>
                      </header>
                      <div className="flex-1 min-h-[600px] glass-card p-1 overflow-hidden border-white/5 bg-white/[0.01]">
                        <LiveFeed />
                      </div>
                    </div>} />
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
