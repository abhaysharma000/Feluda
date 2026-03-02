import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UIProvider, useUI } from './context/UIContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GlobalToast } from './components/GlobalToast'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { Dashboard } from './pages/Dashboard'
import { Logs } from './pages/Logs'
import { ThreatMapPage } from './pages/ThreatMapPage'
import { ShowcaseModal } from './components/ShowcaseModal'

const AppContent = () => {
  const { activePage } = useUI();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'logs':
        return <Logs />;
      case 'threat-map':
        return <ThreatMapPage />;
      case 'live-feed':
        return (
          <div className="h-full flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Neural Information Stream</h2>
              <p className="text-slate-500 text-sm italic">Real-time inference logs from global intelligence nodes.</p>
            </div>
            <div className="flex-1">
              <LiveFeed />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <h1 className="text-2xl font-display font-bold mb-2 uppercase tracking-widest">Module: {activePage}</h1>
            <p className="text-sm opacity-50 italic">Neural interface for this sector is still synchronizing...</p>
          </div>
        );
    }
  };

  return (
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
                key={activePage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
