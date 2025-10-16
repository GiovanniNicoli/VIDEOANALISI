import { CommunicationTurn, CalculatedStatistics } from '../types';
import { PARENT_COMM_STRATEGIES } from './constants';

const formatTimeForTxt = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
};

const formatTurnForTxt = (turn: CommunicationTurn, index: number): string => {
    let content = `--- TURNO ${index + 1} @ ${formatTimeForTxt(turn.timestamp)} ---\n\n`;

    content += `[DESCRIZIONE]\n`;
    content += `Parent Action: ${turn.parentAction || 'N/A'}\n`;
    content += `Parent Speech: ${turn.parentSpeech || 'N/A'}\n`;
    content += `Child Action: ${turn.childAction || 'N/A'}\n`;
    content += `Child Speech: ${turn.childSpeech || 'N/A'}\n`;
    content += `Eye Contact Present: ${turn.eyeContact ? 'Yes' : 'No'}\n`;
    content += `Overlapping Dialogue: ${turn.overlappingDialogue ? 'Yes' : 'No'}\n`;
    content += `\n`;

    if (turn.classification) {
        const c = turn.classification;
        content += `[CLASSIFICAZIONE]\n`;
        content += `1. Communication Mode: ${c.communicationMode || 'N/A'}\n`;
        content += `2. Vocalization Type: ${c.vocalizationType || 'N/A'}\n`;
        content += `3. Shared Attention: ${c.sharedAttention || 'N/A'}\n`;
        
        const strategies = PARENT_COMM_STRATEGIES
            .filter(s => c.parentCommunication[s.id])
            .map(s => s.label);
        
        content += `4. Parent Communication:\n`;
        if (strategies.length > 0) {
            strategies.forEach(s => {
                content += `   - ${s}\n`;
            });
        } else {
            content += `   - None\n`;
        }

        content += `5. Is the turn inadequate?: ${c.isInadequate ? 'Yes' : 'No'}\n`;
        content += `6. Is the child providing new information?: ${c.childProvidesNewInfo ? 'Yes' : 'No'}\n`;
        content += `7. Il bambino comprende il referente semantico?: ${c.childUnderstandsSemantic || 'N/A'}\n`;
        content += `8. Uses only auditory channel?: ${c.usesOnlyAuditoryChannel ? 'Yes' : 'No'}\n`;
        content += `9. Is eye contact adequate?: ${c.isEyeContactAdequate ? 'Yes' : 'No'}\n`;
    } else {
        content += `[CLASSIFICAZIONE NON COMPLETATA]\n`;
    }

    content += `\n--------------------------------------------\n\n`;
    return content;
};


export const exportToTxt = (turns: CommunicationTurn[], filename: string): void => {
    const fileContent = turns.map(formatTurnForTxt).join('');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const exportStatsToTxt = (stats: CalculatedStatistics, filename: string): void => {
    let content = `--- STATISTICHE DI INTERAZIONE ---\n\n`;
    content += `Data Esportazione: ${new Date().toLocaleString()}\n\n`;

    content += `--- PROFILO COMUNICATIVO ---\n`;
    content += `Modalità Comunicativa Predominante: ${stats.communicativeMode}\n`;
    content += `Tipo di Vocalizzazione Predominante: ${stats.predominantVocalization}\n\n`;

    content += `--- METRICHE CHIAVE ---\n`;
    content += `Consistenza del Turno (TT-CONS): ${stats.ttCons.toFixed(2)}\n`;
    content += `Adeguatezza del Turno (TT-AD): ${stats.ttAd.toFixed(2)}\n`;
    content += `Presenza Contatto Visivo (EC-PRES): ${stats.ecPres.toFixed(2)}\n`;
    content += `Adeguatezza Contatto Visivo (EC-AD): ${stats.ecAd.toFixed(2)}\n`;
    content += `Autonomia Uditiva (AUT): ${stats.aut.toFixed(2)}\n`;
    content += `Iniziativa (IN): ${stats.in.toFixed(2)}\n\n`;
    
    content += `--- STILE COMUNICATIVO GENITORIALE ---\n`;
    content += `Stile Predominante: ${stats.parentalStyle.predominantStyle}\n`;
    content += `Distribuzione:\n`;
    content += `  - Tutoriale: ${stats.parentalStyle.percentages.TUTORIAL.toFixed(1)}%\n`;
    content += `  - Didattico: ${stats.parentalStyle.percentages.DIDACTIC.toFixed(1)}%\n`;
    content += `  - Direttivo: ${stats.parentalStyle.percentages.DIRECTIVE.toFixed(1)}%\n`;
    content += `  - Conversazionale: ${stats.parentalStyle.percentages.CONVERSATIONAL.toFixed(1)}%\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
