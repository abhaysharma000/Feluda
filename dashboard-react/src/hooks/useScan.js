import { useCallback } from 'react';
import { useUI } from '../context/UIContext';

export const useScan = () => {
    const {
        setIsScanning,
        setScanResult,
        setIsShowcaseOpen,
        addToast,
        isZeroDayMode
    } = useUI();

    const triggerScan = useCallback(async (url) => {
        if (!url) return;

        setIsScanning(true);
        addToast(`Initializing Deep Scan for: ${url}`, 'info', 2000);

        // Mock API call simulation
        try {
            await new Promise(resolve => setTimeout(resolve, 1800));

            const mockResult = {
                url,
                risk_score: isZeroDayMode ? 94.2 : 72.8,
                classification: "Malicious",
                top_contributors: [
                    "Domain Age Anomaly",
                    "Excessive Subdomain Depth",
                    "Malicious Pattern Match",
                    "Visual Similarity (91%)"
                ],
                explanation: [
                    "Neural Engine detected high entropy in URL structure",
                    "External threat intel flagged domain as high priority",
                    "Recent creation date (2 days ago) is highly suspicious",
                    "AI visual engine detected 91% similarity to authentic PayPal login"
                ],
                raw_features: {
                    domain_age_days: 2,
                    visual_similarity: 91.2,
                    entropy_score: 4.82,
                    subdomain_count: 5,
                    tld_reputation: -0.42
                }
            };

            setScanResult(mockResult);
            setIsScanning(false);
            setIsShowcaseOpen(true);
            addToast("Neural analysis complete. Threat identified.", "danger", 4000);

            return mockResult;
        } catch (error) {
            setIsScanning(false);
            addToast("Failed to complete neural scan.", "danger");
            throw error;
        }
    }, [setIsScanning, setScanResult, setIsShowcaseOpen, addToast, isZeroDayMode]);

    return { triggerScan };
};
