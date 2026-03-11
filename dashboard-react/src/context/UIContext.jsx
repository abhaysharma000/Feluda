import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
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
            const response = await fetch('/api/scan/email', {
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
    const [topThreats, setTopThreats] = useState([]);
    const [stats, setStats] = useState({
        scanned_today: 0,
        blocked: 0,
        suspicious: 0,
        latency_ms: 0
    });

    const refreshTelemetry = useCallback(async () => {
        try {
            // 1. System Stats
            const statsRes = await fetch('/api/stats');
            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }

            // 2. Intelligence Logs
            const logsRes = await fetch('/api/logs?limit=50');
            if (logsRes.ok) {
                const logsData = await logsRes.json();
                setLogs(logsData);
            }

            // 3. Top Threats
            const threatRes = await fetch('/api/top-threats');
            if (threatRes.ok) {
                const threatData = await threatRes.json();
                setTopThreats(threatData);
            }
        } catch (err) {
            console.warn("Telemetry fetch failed. Engine offline?");
        }
    }, []);

    // Initial Telemetry Load & Polling
    useEffect(() => {
        refreshTelemetry();
        const interval = setInterval(refreshTelemetry, 5000);
        return () => clearInterval(interval);
    }, [refreshTelemetry]);

    const value = {
        toasts,
        addToast,
        isZeroDayMode,
        setIsZeroDayMode,
        isScanning,
        setIsScanning,
        scanResult,
        setScanResult,
        lastScanVerdict,
        setLastScanVerdict,
        isSidebarOpen,
        setIsSidebarOpen,
        isNLPScanning,
        nlpResult,
        analyzeEmail,
        logs,
        topThreats,
        stats,
        refreshTelemetry
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};
