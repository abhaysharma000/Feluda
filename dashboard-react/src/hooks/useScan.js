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
        addToast(`Initializing Deep Scan for: ${url}`, 'info', 2000);

        try {
            await new Promise(resolve => setTimeout(resolve, 2200));

            const isThreat = isZeroDayMode || Math.random() > 0.4;
            const risk_score = isThreat ? (85 + Math.random() * 10).toFixed(1) : (5 + Math.random() * 15).toFixed(1);

            const mockResult = {
                url,
                risk_score: parseFloat(risk_score),
                classification: isThreat ? "Malicious" : "Safe",
                top_contributors: isThreat ? [
                    "Domain Age Anomaly",
                    "Excessive Subdomain Depth",
                    "Malicious Pattern Match",
                    "Visual Similarity (91%)"
                ] : ["Known Clean Domain", "High SSL Reputation", "Standard URL Structure"],
                explanation: isThreat ? [
                    "Neural Engine detected high entropy in URL structure",
                    "External threat intel flagged domain as high priority",
                    "Recent creation date (2 days ago) is highly suspicious",
                    "AI visual engine detected 91% similarity to authentic PayPal login"
                ] : ["Verified legitimate infrastructure", "No heuristic triggers active", "Compliant domain metadata"],
                raw_features: {
                    domain_age_days: isThreat ? 2 : 1420,
                    visual_similarity: isThreat ? 91.2 : 0.4,
                    entropy_score: isThreat ? 4.82 : 1.2,
                    subdomain_count: isThreat ? 5 : 0,
                    tld_reputation: isThreat ? -0.42 : 0.98
                }
            };

            setScanResult(mockResult);
            setIsScanning(false);
            setIsShowcaseOpen(true);
            setLastScanVerdict(isThreat ? 'threat' : 'safe');

            // Add to Global logs
            addLog({
                node: 'User_Manual_Scan',
                vector: `DEEP_SCAN [${url}]`,
                risk: parseFloat(risk_score),
                verdict: isThreat ? 'Malicious' : 'Safe'
            });

            // Update stats
            setStats(prev => ({
                ...prev,
                scanned: prev.scanned + 1,
                malicious: isThreat ? prev.malicious + 1 : prev.malicious,
                suspicious: !isThreat && Math.random() > 0.8 ? prev.suspicious + 1 : prev.suspicious
            }));

            addToast(
                isThreat ? "Neural analysis complete. Threat identified." : "Neural analysis complete. Site is safe.",
                isThreat ? "danger" : "success",
                4000
            );

            return mockResult;
        } catch (error) {
            setIsScanning(false);
            addToast("Failed to complete neural scan.", "danger");
            throw error;
        }
    }, [setIsScanning, setScanResult, setIsShowcaseOpen, addToast, isZeroDayMode, addLog, setStats, setLastScanVerdict]);

    return { triggerScan };
};
