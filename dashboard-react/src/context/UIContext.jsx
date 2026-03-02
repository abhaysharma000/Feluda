import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
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
    const [lastScanVerdict, setLastScanVerdict] = useState(null); // 'safe' | 'threat' | null

    // Real-time Data State
    const [logs, setLogs] = useState([
        { id: 1, timestamp: new Date().toISOString(), node: 'Node_Alpha_7', vector: 'URL_SCAN [hianimez.is]', risk: 1.4, verdict: 'Safe' },
        { id: 2, timestamp: new Date(Date.now() - 3600000).toISOString(), node: 'Node_Gamma_2', vector: 'Visual Match [paypal-login.co]', risk: 94.2, verdict: 'Malicious' },
    ]);

    const [stats, setStats] = useState({
        scanned: 12842,
        malicious: 423,
        suspicious: 1102,
        avgRisk: 4.2
    });

    // Simulation Timer Ref
    const simInterval = useRef(null);

    const addLog = useCallback((log) => {
        setLogs(prev => {
            const newLogs = [
                { id: Date.now(), timestamp: new Date().toISOString(), ...log },
                ...prev.slice(0, 49) // Keep last 50
            ];

            // Calculate new average risk
            const totalRisk = newLogs.reduce((acc, curr) => acc + curr.risk, 0);
            const newAvgRisk = (totalRisk / newLogs.length).toFixed(1);

            setStats(s => ({ ...s, avgRisk: parseFloat(newAvgRisk) }));
            return newLogs;
        });
    }, []);

    // Simulation logic effect
    useEffect(() => {
        if (isSimulationMode && !isPlaybackPaused) {
            simInterval.current = setInterval(() => {
                const isThreat = Math.random() > (isZeroDayMode ? 0.6 : 0.85);
                const risk = isThreat ? (75 + Math.random() * 20).toFixed(1) : (1 + Math.random() * 5).toFixed(1);

                const newLog = {
                    node: `Node_${['Alpha', 'Beta', 'Gamma', 'Delta'][Math.floor(Math.random() * 4)]}_${Math.floor(Math.random() * 100)}`,
                    vector: isThreat
                        ? `${['Threat Match', 'Polymorphic Signature', 'C2 Callback'][Math.floor(Math.random() * 3)]} [${['bank-verify.cc', 'login-secured.net', 'update-account.io', 'portal-auth.sh'][Math.floor(Math.random() * 4)]}]`
                        : `Heuristic Scan [${['google.com', 'github.com', 'slack.com'][Math.floor(Math.random() * 3)]}]`,
                    risk: parseFloat(risk),
                    verdict: isThreat ? 'Malicious' : 'Safe'
                };

                addLog(newLog);
                setStats(prev => ({
                    ...prev,
                    scanned: prev.scanned + 1,
                    malicious: isThreat ? prev.malicious + 1 : prev.malicious,
                    suspicious: !isThreat && Math.random() > 0.9 ? prev.suspicious + 1 : prev.suspicious
                }));
            }, (isZeroDayMode ? 2000 : 5000) / playbackSpeed);
        } else {
            clearInterval(simInterval.current);
        }
        return () => clearInterval(simInterval.current);
    }, [isSimulationMode, isPlaybackPaused, playbackSpeed, isZeroDayMode, addLog]);

    // Simulation logic helper
    const toggleSimulation = () => {
        setIsSimulationMode(!isSimulationMode);
        addToast(
            !isSimulationMode ? "Simulation Mode Active" : "Simulation Mode Deactivated",
            !isSimulationMode ? "warning" : "info"
        );
    };

    const value = {
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
        setIsShowcaseOpen,
        lastScanVerdict,
        setLastScanVerdict,
        logs,
        addLog,
        stats,
        setStats
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};
