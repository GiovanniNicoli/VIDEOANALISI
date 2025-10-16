import React from 'react';
import { CalculatedStatistics } from '../types';

interface StatisticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: CalculatedStatistics | null;
    onExportStats: () => void;
}

const StatCard: React.FC<{ title: string, value: string | number, description: string }> = ({ title, value, description }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">{title}</h4>
        <p className="text-3xl font-bold text-white my-1">{value}</p>
        <p className="text-xs text-slate-400">{description}</p>
    </div>
);

const StyleBar: React.FC<{ label: string, percentage: number }> = ({ label, percentage }) => (
    <div className="w-full">
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-slate-300">{label}</span>
            <span className="text-sm font-medium text-slate-300">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2.5">
            <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose, stats, onExportStats }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Interaction Statistics</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                </header>
                <div className="p-6 overflow-y-auto">
                    {!stats ? (
                         <p className="text-slate-400 text-center py-8">Not enough data to calculate statistics.</p>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard title="TT-CONS" value={stats.ttCons.toFixed(2)} description="Consistency of Turn-Taking" />
                                <StatCard title="TT-AD" value={stats.ttAd.toFixed(2)} description="Adequacy of Turn-Taking" />
                                <StatCard title="EC-PRES" value={stats.ecPres.toFixed(2)} description="Presence of Eye Contact" />
                                <StatCard title="EC-AD" value={stats.ecAd.toFixed(2)} description="Adequacy of Eye Contact" />
                                <StatCard title="AUT" value={stats.aut.toFixed(2)} description="Auditory Autonomy" />
                                <StatCard title="IN" value={stats.in.toFixed(2)} description="Initiative" />
                            </div>
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-slate-700/50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Communicative Profile</h3>
                                    <StatCard title="COMMUNICATIVE MODE" value={stats.communicativeMode} description="Child's predominant communication mode" />
                                    <div className="mt-4">
                                        <StatCard title="VOCALIZATION TYPE" value={stats.predominantVocalization} description="Child's most frequent vocalization" />
                                    </div>
                                </div>
                                <div className="bg-slate-700/50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Parental Communication Style</h3>
                                    <div className="space-y-3 mb-4">
                                        <StyleBar label="Tutorial" percentage={stats.parentalStyle.percentages.TUTORIAL} />
                                        <StyleBar label="Didactic" percentage={stats.parentalStyle.percentages.DIDACTIC} />
                                        <StyleBar label="Directive" percentage={stats.parentalStyle.percentages.DIRECTIVE} />
                                        <StyleBar label="Conversational" percentage={stats.parentalStyle.percentages.CONVERSATIONAL} />
                                    </div>
                                    <StatCard title="PREDOMINANT STYLE" value={stats.parentalStyle.predominantStyle} description="Based on interaction patterns" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                 <footer className="p-4 border-t border-slate-700 mt-auto flex justify-end gap-4">
                    <button 
                        type="button" 
                        onClick={onExportStats}
                        disabled={!stats}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed">
                        Esporta Statistiche
                    </button>
                    <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
                        Chiudi
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default StatisticsModal;