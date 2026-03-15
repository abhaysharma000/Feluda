import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Shield, AlertTriangle, CheckCircle2, Loader2, X, Download } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { clsx } from 'clsx';

export const FileScanner = () => {
    const { addToast } = useUI();
    const [file, setFile] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setResult(null);
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const performScan = async () => {
        if (!file) return;
        setIsScanning(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/scan/file', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data);
                addToast("Neural File Sweep Complete", data.classification === 'Malicious' ? 'warning' : 'success');
            } else {
                addToast("Interference detected in scan pipeline", "danger");
            }
        } catch (err) {
            console.error("File scan failed:", err);
            addToast("Backend Connection Lost", "danger");
        } finally {
            setIsScanning(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setResult(null);
    };

    return (
        <div className="glass-panel p-8 min-h-[400px] flex flex-col relative overflow-hidden group border-soc-accent/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-soc-accent/10 rounded-lg">
                        <Shield className="w-5 h-5 text-soc-accent" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-widest uppercase">File Armor</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Pre-execution structural validation</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                {!file ? (
                    <label 
                        className={clsx(
                            "w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                            dragActive ? "border-soc-accent bg-soc-accent/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input type="file" className="hidden" onChange={handleFileChange} />
                        <FileUp className={clsx("w-10 h-10 mb-4 transition-colors", dragActive ? "text-soc-accent" : "text-slate-500")} />
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Drag & Drop Secure File</p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-2">Max limit: 20MB per ingestion</p>
                    </label>
                ) : (
                    <div className="w-full space-y-6">
                        {/* Selected File Info */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <FileUp className="w-6 h-6 text-soc-accent" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-[10px] font-bold text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            {!isScanning && !result && (
                                <button onClick={clearFile} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Scanner Pulse / Result Area */}
                        <AnimatePresence mode="wait">
                            {isScanning ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center justify-center py-10"
                                >
                                    <Loader2 className="w-12 h-12 text-soc-accent animate-spin mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-soc-accent animate-pulse">Running Neural Hash Sweep...</p>
                                </motion.div>
                            ) : result ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={clsx(
                                        "p-6 rounded-2xl border flex flex-col items-center text-center",
                                        result.classification === 'Malicious' 
                                            ? "bg-soc-danger/5 border-soc-danger/20" 
                                            : "bg-soc-accent/5 border-soc-accent/20"
                                    )}
                                >
                                    {result.classification === 'Malicious' ? (
                                        <AlertTriangle className="w-12 h-12 text-soc-danger mb-4" />
                                    ) : (
                                        <CheckCircle2 className="w-12 h-12 text-soc-accent mb-4" />
                                    )}
                                    <h4 className={clsx(
                                        "text-xl font-black uppercase tracking-widest mb-2",
                                        result.classification === 'Malicious' ? "text-soc-danger" : "text-soc-accent"
                                    )}>
                                        {result.classification === 'Malicious' ? "Threat Isolated" : "No Threat Found"}
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-4">
                                        Risk Score: <span className={result.classification === 'Malicious' ? "text-soc-danger" : "text-soc-accent"}>{result.risk_score}/100</span>
                                    </p>
                                    <div className="w-full h-px bg-white/5 mb-4" />
                                    <p className="text-xs text-white/70 leading-relaxed font-medium">
                                        {result.explanation[0]}
                                    </p>
                                    <button 
                                        onClick={clearFile}
                                        className="mt-6 px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all"
                                    >
                                        Scan Another
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={performAnalysis}
                                    className="w-full py-4 rounded-xl bg-soc-accent text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-soc-accent/90 transition-all shadow-lg shadow-soc-accent/20"
                                >
                                    Initiate Full Scan
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Subtle Background Icons */}
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                <Download className="w-32 h-32 text-white" />
            </div>
        </div>
    );
};
