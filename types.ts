// Fix: Added AnnotationItem interface for transcription results.
export interface AnnotationItem {
    timestamp: number;
    text: string;
}

export interface ParentCommunicationStrategies {
    [key: string]: boolean;
}

export interface TurnClassification {
    communicationMode: string;
    vocalizationType: string;
    sharedAttention: string;
    parentCommunication: ParentCommunicationStrategies;
    isInadequate: boolean;
    childProvidesNewInfo: boolean;
    childUnderstandsSemantic: string;
    usesOnlyAuditoryChannel: boolean; // New field
    isEyeContactAdequate: boolean;    // New field
}

export interface CommunicationTurn {
    id: number;
    timestamp: number;
    parentAction: string;
    parentSpeech: string;
    childSpeech: string;
    childAction: string;
    eyeContact: boolean;
    overlappingDialogue: boolean;
    classification: TurnClassification | null;
}

export interface ParentCommunicationStyles {
    TUTORIAL: number;
    DIDACTIC: number;
    DIRECTIVE: number;
    CONVERSATIONAL: number;
}

export interface CalculatedStatistics {
    communicativeMode: string;
    predominantVocalization: string;
    ttCons: number;
    ttAd: number;
    aut: number;
    in: number;
    ecPres: number;
    ecAd: number;
    parentalStyle: {
        percentages: ParentCommunicationStyles;
        predominantStyle: string;
    };
}
