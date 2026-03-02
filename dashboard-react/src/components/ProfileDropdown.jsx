import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 glass-card border-white/10 overflow-hidden shadow-2xl z-[100] bg-navy-950/90 backdrop-blur-xl"
        >
            <div className="p-3 border-b border-white/5 bg-white/5">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Admin User</p>
                <p className="text-[8px] text-slate-500 uppercase tracking-tighter mt-0.5">Level 4 Clearance</p>
            </div>

            <button
                onClick={() => { navigate('/profile'); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-all text-slate-300"
            >
                <User className="w-3.5 h-3.5 text-green-accent" />
                <span>Identity Profile</span>
            </button>

            <button
                onClick={() => { navigate('/settings'); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-all text-slate-300"
            >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span>Core Settings</span>
            </button>

            <div className="border-t border-white/5"></div>

            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-all text-danger">
                <LogOut className="w-3.5 h-3.5" />
                <span>Terminate Session</span>
            </button>
        </motion.div>
    );
};
