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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // NLP Scan State
    const [isNLPScanning, setIsNLPScanning] = useState(false);
    const [nlpResult, setNlpResult] = useState(null);

    const analyzeEmail = async (content) => {
        setIsNLPScanning(true);
        setNlpResult(null);
        try {
            const response = await fetch('http://localhost:8001/api/scan/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            if (response.ok) {
                const data = await response.json();
                setNlpResult(data);
                addToast("Neural Text Analysis Complete", "success");
            } else {
                addToast("NLP Analysis Failed", "danger");
            }
        } catch (err) {
            console.error("NLP scan failed:", err);
            addToast("Network Error", "danger");
        } finally {
            setIsNLPScanning(false);
        }
    };

    // Real-time Data State
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        scanned: 0,
        malicious: 0,
        suspicious: 0,
        avgRisk: 0
    });

    const addLog = useCallback((log) => {
        setLogs(prev => {
            const newLogs = [
                { 
                    id: Date.now(), 
                    timestamp: new Date().toISOString(), 
                    source: 'manual',
                    ...log 
                },
                ...prev.slice(0, 49) // Keep last 50
            ];

            // Calculate new average risk for visual consistency
            const totalRisk = newLogs.reduce((acc, curr) => acc + (curr.risk || 0), 0);
            const newAvgRisk = newLogs.length > 0 ? (totalRisk / newLogs.length).toFixed(1) : 0;

            setStats(s => ({ ...s, avgRisk: parseFloat(newAvgRisk) }));
            return newLogs;
        });
    }, []);

    const refreshTelemetry = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8001/api/analytics/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(prev => ({
                    ...prev,
                    scanned: data.total_scanned,
                    malicious: data.malicious_blocked,
                    suspicious: data.suspicious
                }));
            }

            const logsRes = await fetch('http://localhost:8001/api/analytics/logs');
            if (logsRes.ok) {
                const logsData = await logsRes.json();
                const mappedLogs = logsData.map(l => ({
                    id: l._id || Math.random().toString(36).substr(2, 9),
                    timestamp: l.timestamp,
                    node: l.result?.node_id || 'Neural_Node_7',
                    vector: `${l.type} [${l.input}]`,
                    risk: l.result?.risk_score ?? 0,
                    verdict: l.result?.classification ?? 'Unknown',
                    source: l.source || 'manual'
                }));
                setLogs(mappedLogs);
            }
        } catch (err) {
            console.error("Telemetry fetch failed:", err);
        }
    }, [addToast]);

    // Initial Telemetry Load
    useEffect(() => {
        refreshTelemetry();
        // Background polling for forensic logs
        const interval = setInterval(refreshTelemetry, 8000);
        return () => clearInterval(interval);
    }, [refreshTelemetry]);

    // Simulation logic disabled
    useEffect(() => {
        if (isSimulationMode && !isPlaybackPaused) {
            // Simulation Logic disabled for pure backend stream
        }
    }, [isSimulationMode, isPlaybackPaused]);

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
        isSidebarOpen,
        setIsSidebarOpen,
        isNLPScanning,
        nlpResult,
        analyzeEmail,
        logs,
        addLog,
        stats,
        setStats,
        refreshTelemetry
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};
