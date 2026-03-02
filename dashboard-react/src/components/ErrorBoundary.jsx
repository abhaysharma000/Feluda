import React, { Component } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center p-8">
                    <div className="glass-card p-10 max-w-md text-center border-danger/20 shadow-neon-red">
                        <div className="w-16 h-16 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Neural Engine Crash</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            We've encountered a critical failure in the UI layer. The system is attempting to restore neural stability.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-danger text-white rounded-xl font-bold hover:bg-white hover:text-danger transition-all active:scale-95"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            <span>Retry Neutral Sync</span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
