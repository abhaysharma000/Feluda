import { useCallback } from 'react';
import { useUI } from '../context/UIContext';

export const useScan = () => {
    const {
        setIsScanning,
        setScanResult,
        setIsShowcaseOpen,
        addToast,
        isZeroDayMode,
        addLog,
        setStats,
        setLastScanVerdict
    } = useUI();

    const triggerScan = useCallback(async (url) => {
        if (!url) return;

        setIsScanning(true);
        addToast(`Neural Sweep Initialized: ${url}`, 'info', 2000);

        try {
            // Standardize URL scheme for API
            const targetUrl = url.startsWith('http') ? url : `https://${url}`;

            const response = await fetch('/api/scan/url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl })
            });

            if (!response.ok) throw new Error('Neural handshake failed');

            const result = await response.json();
            const isThreat = result.classification === 'Malicious' || result.classification === 'Suspicious';

            setScanResult(result);
            setIsScanning(false);
            setIsShowcaseOpen(true);
            setLastScanVerdict(isThreat ? 'threat' : 'safe');

            // Add to Global logs with real telemetry
            addLog({
                node: 'User_Manual_Scan',
                vector: `NEURAL_SWEEP [${url}]`,
                risk: result.risk_score,
                verdict: result.classification
            });

            // Update stats
            setStats(prev => ({
                ...prev,
                scanned: prev.scanned + 1,
                malicious: result.classification === 'Malicious' ? prev.malicious + 1 : prev.malicious,
                suspicious: result.classification === 'Suspicious' ? prev.suspicious + 1 : prev.suspicious
            }));

            addToast(
                isThreat ? "Neural analysis complete. Threat identified." : "Neural analysis complete. Site is safe.",
                isThreat ? "danger" : "success",
                4000
            );

            return result;
        } catch (error) {
            console.error('Scan Error:', error);
            setIsScanning(false);
            addToast("Failed to complete neural scan. Ensure Backend (8001) is active.", "danger");
            throw error;
        }
    }, [setIsScanning, setScanResult, setIsShowcaseOpen, addToast, addLog, setStats, setLastScanVerdict]);

    return { triggerScan };
};
