import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    // Navigation State
    const [activePage, setActivePage] = useState('dashboard');

    // Simulation / Playback State
    const [isSimulationMode, setIsSimulationMode] = useState(false);
    const [isPlaybackPaused, setIsPlaybackPaused] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 4x

    // Global Toast State
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    // Zero-Day State
    const [isZeroDayMode, setIsZeroDayMode] = useState(false);

    // Scan Logic State
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);

    // Simulation logic helper
    const toggleSimulation = () => {
        setIsSimulationMode(!isSimulationMode);
        addToast(
            !isSimulationMode ? "Simulation Mode Active" : "Simulation Mode Deactivated",
            !isSimulationMode ? "warning" : "info"
        );
    };

    const value = {
        activePage,
        setActivePage,
        isSimulationMode,
        toggleSimulation,
        isPlaybackPaused,
        setIsPlaybackPaused,
        playbackSpeed,
        setPlaybackSpeed,
        toasts,
        addToast,
        isZeroDayMode,
        setIsZeroDayMode,
        isScanning,
        setIsScanning,
        scanResult,
        setScanResult,
        isShowcaseOpen,
        setIsShowcaseOpen
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};
