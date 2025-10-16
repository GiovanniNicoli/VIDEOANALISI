import React, { useState, useRef, useCallback, useMemo } from 'react';
import { CommunicationTurn, TurnClassification, CalculatedStatistics } from './types';
import VideoPlayer from './components/VideoPlayer';
import ClassificationPanel from './components/TranscriptionPanel';
import TurnInputForm from './components/CommandPanel';
import TurnLog from './components/PlayByPlayLog';
import StatisticsModal from './components/StatisticsModal';
import { exportToTxt, exportStatsToTxt } from './utils/exportUtils';
import { calculateStatistics } from './utils/statisticsCalculator';

const App: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [turns, setTurns] = useState<CommunicationTurn[]>([]);
    const [isClassifying, setIsClassifying] = useState<boolean>(false);
    const [turnToClassify, setTurnToClassify] = useState<CommunicationTurn | null>(null);
    const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    const stats: CalculatedStatistics | null = useMemo(() => {
        if (turns.length > 0) {
            return calculateStatistics(turns);
        }
        return null;
    }, [turns]);

    const handleFileChange = (file: File | null) => {
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            // Reset state for new video, unless data was just imported
            if (turns.length === 0) {
                setCurrentTime(0);
                setIsClassifying(false);
                setTurnToClassify(null);
                setIsStatsOpen(false);
            }
        }
    };

    const handleTimeUpdate = (time: number) => {
        setCurrentTime(time);
    };

    const handleSubmitTurn = useCallback((data: Omit<CommunicationTurn, 'id' | 'timestamp' | 'classification'>) => {
        if (!videoFile) {
            alert("Per favore, carica un video prima di registrare un turno.");
            return;
        }
        const newTurn: CommunicationTurn = {
            ...data,
            id: Date.now(),
            timestamp: currentTime,
            classification: null,
        };
        setTurnToClassify(newTurn);
        setIsClassifying(true);
        if (videoRef.current) videoRef.current.pause();
    }, [currentTime, videoFile]);

    const handleSaveClassification = (classification: TurnClassification) => {
        if (!turnToClassify) return;

        const classifiedTurn = { ...turnToClassify, classification };
        setTurns(prevTurns => [...prevTurns, classifiedTurn].sort((a,b) => a.timestamp - b.timestamp));
        
        setIsClassifying(false);
        setTurnToClassify(null);
    };

    const handleCloseClassification = () => {
        setIsClassifying(false);
        setTurnToClassify(null);
    }

    const handleDeleteTurn = (id: number) => {
        if (window.confirm('Sei sicuro di voler cancellare questo turno?')) {
            setTurns(prevTurns => prevTurns.filter(turn => turn.id !== id));
        }
    };

    const handleExport = () => {
        if (turns.length === 0) {
            alert("Nessun dato da esportare.");
            return;
        }
        exportToTxt(turns, `analisi_comunicazione_${videoFile?.name.split('.')[0] || 'export'}_${new Date().toISOString().split('T')[0]}.txt`);
    };

    const handleExportStats = () => {
        if (!stats) {
            alert("Nessuna statistica da esportare.");
            return;
        }
        exportStatsToTxt(stats, `statistiche_${videoFile?.name.split('.')[0] || 'export'}_${new Date().toISOString().split('T')[0]}.txt`);
    };

    const handleExportSession = () => {
         if (turns.length === 0) {
            alert("Nessuna sessione da salvare.");
            return;
        }
        const sessionData = {
            videoFilename: videoFile?.name || 'unknown_video',
            analysisDate: new Date().toISOString(),
            turns: turns
        };
        const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sessione_${videoFile?.name.split('.')[0] || 'export'}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportSession = (file: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Il file non è un testo valido.");
                const data = JSON.parse(text);
                if (!data.videoFilename || !Array.isArray(data.turns)) {
                    throw new Error("Formato del file di sessione non valido.");
                }
                setTurns(data.turns);
                alert(`Sessione per il video "${data.videoFilename}" caricata con successo.\n\nAssicurati di caricare il file video corretto per continuare l'analisi.`);
            } catch (error) {
                console.error("Errore nell'importazione della sessione:", error);
                alert(`Errore durante l'importazione del file di sessione: ${(error as Error).message}`);
            }
        };
        reader.readAsText(file);
    };


    const isInputDisabled = !videoFile || isClassifying;

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
            <div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8 relative">
                <header className="text-center mb-8 pb-4 border-b border-slate-700/50">
                    <h1 className="text-4xl lg:text-5xl font-bold text-cyan-400 tracking-tight">Analizzatore di Turni Comunicativi</h1>
                    <p className="text-slate-400 mt-2 text-lg">Carica un video, descrivi i turni di comunicazione e classificali.</p>
                </header>

                <div className="absolute top-8 right-8 bg-slate-800 border border-cyan-500/50 text-cyan-300 rounded-lg px-4 py-2 text-center">
                    <div className="text-3xl font-bold">{turns.length}</div>
                    <div className="text-sm uppercase tracking-wider">Turni Registrati</div>
                </div>

                <main className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                            <VideoPlayer 
                                videoUrl={videoUrl} 
                                onFileChange={handleFileChange} 
                                onTimeUpdate={handleTimeUpdate} 
                                videoRef={videoRef}
                                onImportSession={handleImportSession}
                            />
                        </div>
                        <div className="lg:col-span-2 h-[500px]">
                           {isClassifying ? (
                               <ClassificationPanel onSave={handleSaveClassification} onClose={handleCloseClassification} />
                           ) : (
                               <TurnInputForm onSubmit={handleSubmitTurn} disabled={isInputDisabled} />
                           )}
                        </div>
                    </div>
                    
                    <div style={{ filter: isClassifying ? 'blur(2px)' : 'none', transition: 'filter 0.3s' }}>
                        <TurnLog 
                            turns={turns} 
                            onExport={handleExport} 
                            isExportDisabled={turns.length === 0}
                            onCalculateStats={() => setIsStatsOpen(true)}
                            onDeleteTurn={handleDeleteTurn}
                            onExportSession={handleExportSession}
                        />
                    </div>
                </main>

                <StatisticsModal 
                    isOpen={isStatsOpen}
                    onClose={() => setIsStatsOpen(false)}
                    stats={stats}
                    onExportStats={handleExportStats}
                />
            </div>
        </div>
    );
};

export default App;