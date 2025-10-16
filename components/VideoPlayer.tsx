import React from 'react';

interface VideoPlayerProps {
    videoUrl: string | null;
    onFileChange: (file: File) => void;
    onTimeUpdate: (time: number) => void;
    videoRef: React.RefObject<HTMLVideoElement>;
    onImportSession: (file: File) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onFileChange, onTimeUpdate, videoRef, onImportSession }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileChange(event.target.files[0]);
        }
    };

    const handleSessionFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImportSession(event.target.files[0]);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900/50 rounded-lg p-4 flex flex-col items-center justify-center h-[500px] border border-slate-700">
            {!videoUrl ? (
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4 text-slate-300">Carica un Video</h2>
                     <label htmlFor="video-upload" className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Seleziona File Video
                    </label>
                    <input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="mt-6 text-sm text-slate-400">
                        <p>Oppure</p>
                         <label htmlFor="session-upload" className="cursor-pointer text-cyan-400 hover:text-cyan-300 hover:underline transition">
                            importa una sessione di analisi (.json)
                        </label>
                        <input
                            id="session-upload"
                            type="file"
                            accept=".json"
                            onChange={handleSessionFileChange}
                            className="hidden"
                        />
                    </div>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain rounded-md"
                    onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
                />
            )}
        </div>
    );
};

export default VideoPlayer;