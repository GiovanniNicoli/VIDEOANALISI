import React from 'react';
import { CommunicationTurn } from '../types';
import { PARENT_COMM_STRATEGIES } from '../utils/constants';

interface TurnLogProps {
    turns: CommunicationTurn[];
    onExport: () => void;
    onCalculateStats: () => void;
    isExportDisabled: boolean;
    onDeleteTurn: (id: number) => void;
    onExportSession: () => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
};

const DetailItem: React.FC<{ label: string; value?: string | boolean | null; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div className="py-2">
        <p className="text-sm text-slate-400">{label}</p>
        {children ? <div className="text-slate-200 text-sm">{children}</div> : <p className="text-slate-200 text-sm">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || 'N/A')}</p>}
    </div>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const TurnDetails: React.FC<{ turn: CommunicationTurn }> = ({ turn }) => {
    const c = turn.classification;
    if (!c) return null;

    const parentStrategies = PARENT_COMM_STRATEGIES
        .filter(s => c.parentCommunication[s.id])
        .map(s => s.label);

    return (
        <div className="bg-slate-800/50 p-4 mt-2 rounded-b-lg">
            <h4 className="font-semibold text-cyan-400 mb-2">Descrizione Turno</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4">
                <DetailItem label="Parent Action" value={turn.parentAction} />
                <DetailItem label="Parent Speech" value={turn.parentSpeech} />
                <DetailItem label="Child Action" value={turn.childAction} />
                <DetailItem label="Child Speech" value={turn.childSpeech} />
                <DetailItem label="Eye Contact" value={turn.eyeContact} />
                <DetailItem label="Overlapping Dialogue" value={turn.overlappingDialogue} />
            </div>
             <h4 className="font-semibold text-cyan-400 mt-4 mb-2 pt-2 border-t border-slate-700">Classificazione</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4">
                <DetailItem label="Communication Mode" value={c.communicationMode} />
                <DetailItem label="Vocalization Type" value={c.vocalizationType} />
                <DetailItem label="Shared Attention" value={c.sharedAttention} />
                <DetailItem label="Turn Inadequate" value={c.isInadequate} />
                <DetailItem label="Child Provides New Info" value={c.childProvidesNewInfo} />
                <DetailItem label="Child Understands Semantic" value={c.childUnderstandsSemantic} />
                <DetailItem label="Uses Auditory Channel Only" value={c.usesOnlyAuditoryChannel} />
                <DetailItem label="Adequate Eye Contact" value={c.isEyeContactAdequate} />
             </div>
             <DetailItem label="Parent Communication Strategies">
                {parentStrategies.length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                        {parentStrategies.map(s => <li key={s}>{s}</li>)}
                    </ul>
                ) : "N/A"}
             </DetailItem>
        </div>
    )
};


const TurnLog: React.FC<TurnLogProps> = ({ turns, onExport, onCalculateStats, isExportDisabled, onDeleteTurn, onExportSession }) => {
    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900/50 rounded-lg p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h2 className="text-xl font-semibold text-slate-300">Log dei Turni</h2>
                <div className="flex gap-4">
                    <button 
                        onClick={onCalculateStats}
                        disabled={isExportDisabled}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800">
                        Calcola Statistiche
                    </button>
                     <button 
                        onClick={onExportSession}
                        disabled={isExportDisabled}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800">
                        Salva Sessione
                    </button>
                    <button 
                        onClick={onExport}
                        disabled={isExportDisabled}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800">
                        Esporta in TXT
                    </button>
                </div>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                {turns.length === 0 ? (
                     <p className="text-slate-400 text-center py-8">Nessun turno registrato.</p>
                ) : (
                    turns.map((turn, index) => (
                        <details key={turn.id} className="bg-slate-700/50 rounded-lg">
                            <summary className="p-3 cursor-pointer hover:bg-slate-700 rounded-t-lg list-none flex justify-between items-center">
                                <div>
                                    <span className="font-bold">Turno {index + 1}</span>
                                    <span className="font-mono text-cyan-400 ml-4">{formatTime(turn.timestamp)}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate-400">Dettagli</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteTurn(turn.id); }} 
                                        className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/20 transition-colors"
                                        aria-label={`Delete turn ${index + 1}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </summary>
                            <TurnDetails turn={turn} />
                        </details>
                    ))
                )}
            </div>
        </div>
    );
};

export default TurnLog;