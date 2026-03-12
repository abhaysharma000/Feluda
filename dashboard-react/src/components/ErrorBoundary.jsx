import React, { Component } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center p-8">
                    <div className="p-10 max-w-2xl w-full text-center border border-red-800/40 rounded-2xl bg-red-950/20">
                        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Neural Engine Crash</h2>

                        {/* SHOW THE REAL ERROR */}
                        <div className="text-left bg-black/60 border border-white/10 rounded-xl p-4 mb-6 overflow-auto max-h-48">
                            <p className="text-red-400 font-mono text-xs font-bold mb-2">
                                {this.state.error && this.state.error.toString()}
                            </p>
                            <pre className="text-slate-500 font-mono text-[10px] whitespace-pre-wrap">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-white hover:text-red-600 transition-all"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            <span>Retry</span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
