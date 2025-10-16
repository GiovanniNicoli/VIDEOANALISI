import { CommunicationTurn, CalculatedStatistics, ParentCommunicationStyles } from '../types';
import { PARENT_COMM_STYLES } from './constants';

const safeDivide = (numerator: number, denominator: number): number => {
    return denominator === 0 ? 0 : numerator / denominator;
};

export const calculateStatistics = (turns: CommunicationTurn[]): CalculatedStatistics => {
    const totalTurns = turns.length;
    const classifiedTurns = turns.filter(t => t.classification);

    const isVT = (turn: CommunicationTurn) => turn.classification?.communicationMode === 'VERBAL (VT)';
    const isGT = (turn: CommunicationTurn) => turn.classification?.communicationMode === 'GESTURAL (GT)';

    const vtCount = classifiedTurns.filter(isVT).length;
    const gtCount = classifiedTurns.filter(isGT).length;
    const vtOrGtCount = vtCount + gtCount;

    // Communicative Mode
    const commModePercent = safeDivide(vtCount, totalTurns) * 100; // Based on user feedback, this seems more aligned
    let communicativeMode = '';
    if (commModePercent > 50) communicativeMode = 'Predominantly Verbal';
    else if (commModePercent >= 40) communicativeMode = 'Mixed to Predominantly Verbal';
    else if (commModePercent >= 30) communicativeMode = 'Mixed';
    else if (commModePercent > 0) communicativeMode = 'Mixed Predominantly Gestural';
    else communicativeMode = 'Predominantly Gestural';
    if(vtOrGtCount === 0) communicativeMode = 'N/A';


    // Vocalization Type
    const vocalizations = classifiedTurns.map(t => t.classification?.vocalizationType).filter(Boolean);
    const vocalizationCounts = vocalizations.reduce((acc, val) => {
        acc[val!] = (acc[val!] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });
    const predominantVocalization = vocalizations.length > 0 ? Object.keys(vocalizationCounts).reduce((a, b) => vocalizationCounts[a] > vocalizationCounts[b] ? a : b) : 'N/A';

    // [TT-CONS] Consistency of Turn-Taking
    const ttCons = safeDivide(vtOrGtCount, totalTurns);

    // [TT-AD] Adequacy of Turn-Taking
    const adequateTurns = classifiedTurns.filter(t => !t.classification?.isInadequate).length;
    const ttAd = safeDivide(adequateTurns, totalTurns);


    // [AUT] Auditory Autonomy
    const auditoryOnlyTurns = classifiedTurns.filter(t => t.classification?.usesOnlyAuditoryChannel).length;
    const aut = safeDivide(auditoryOnlyTurns, totalTurns);

    // [IN] Initiative
    const newInfoTurns = classifiedTurns.filter(t => (isVT(t) || isGT(t)) && t.classification?.childProvidesNewInfo).length;
    const in_ = safeDivide(newInfoTurns, vtOrGtCount);

    // [EC-PRES] Presence of Eye Contact
    const eyeContactTurns = turns.filter(t => t.eyeContact).length;
    const ecPres = safeDivide(eyeContactTurns, totalTurns);

    // [EC-AD] Adequacy of Eye Contact
    const adequateEyeContactTurns = classifiedTurns.filter(t => t.classification?.isEyeContactAdequate).length;
    const ecAd = safeDivide(adequateEyeContactTurns, totalTurns);
    
    // Parental Communication Style
    const styleCounts: ParentCommunicationStyles = { TUTORIAL: 0, DIDACTIC: 0, DIRECTIVE: 0, CONVERSATIONAL: 0 };
    const styleMap: { [key: string]: keyof ParentCommunicationStyles } = {
        'T': 'TUTORIAL',
        'D': 'DIDACTIC',
        'DC': 'DIRECTIVE',
        'C': 'CONVERSATIONAL',
    };
    let totalStyleOccurrences = 0;

    classifiedTurns.forEach(turn => {
        const strategies = turn.classification!.parentCommunication;
        Object.keys(strategies).forEach(strategyId => {
            if (strategies[strategyId]) { // if strategy is checked
                const styleCodes = PARENT_COMM_STYLES[strategyId];
                if (styleCodes) {
                    styleCodes.forEach(code => {
                        const styleKey = styleMap[code];
                        if (styleKey) {
                            styleCounts[styleKey]++;
                            totalStyleOccurrences++;
                        }
                    });
                }
            }
        });
    });

    const stylePercentages: ParentCommunicationStyles = {
        TUTORIAL: safeDivide(styleCounts.TUTORIAL, totalStyleOccurrences) * 100,
        DIDACTIC: safeDivide(styleCounts.DIDACTIC, totalStyleOccurrences) * 100,
        DIRECTIVE: safeDivide(styleCounts.DIRECTIVE, totalStyleOccurrences) * 100,
        CONVERSATIONAL: safeDivide(styleCounts.CONVERSATIONAL, totalStyleOccurrences) * 100,
    };

    let predominantStyle = 'No Specific Style';
    const sortedStyles = Object.entries(stylePercentages).sort(([,a],[,b]) => b-a);
    if (totalStyleOccurrences > 0) {
        if(sortedStyles[0][1] >= 40) {
            predominantStyle = sortedStyles[0][0];
        } else if (sortedStyles[0][1] >= 25 && sortedStyles.length > 1 && sortedStyles[1][1] > 0) {
            predominantStyle = `${sortedStyles[0][0]} & ${sortedStyles[1][0]}`;
        } else if (sortedStyles[0][1] >= 25) {
             predominantStyle = sortedStyles[0][0];
        }
    }


    return {
        communicativeMode,
        predominantVocalization,
        ttCons,
        ttAd,
        aut,
        in: in_,
        ecPres,
        ecAd,
        parentalStyle: {
            percentages: stylePercentages,
            predominantStyle: predominantStyle,
        },
    };
};