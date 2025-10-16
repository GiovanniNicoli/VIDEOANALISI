export const COMM_MODES = ["VERBAL (VT)", "GESTURAL (GT)", "BOTH GESTURAL AND VERBAL", "NO RESPONSE WAS PROVIDED (*)"];
export const VOCALIZATION_TYPES = ["SVI", "SV", "SVC", "SV+C", "PB", "P", "F", "S", "NONE (IF THE MODE WAS GESTURAL)"];
export const SHARED_ATTENTION_OPTS = ["OBSERVED", "NOT OBSERVED"];
export const SEMANTIC_OPTS = ["SI", "NO"];

export const PARENT_COMM_STRATEGIES = [
    { id: 'repeat', label: 'a. Repeat the child’s verbalization' },
    { id: 'expand', label: 'b. Expand/restructure child’s verbal or gestural turn' },
    { id: 'reformulate', label: 'c. Verbally reformulate/denominate child’s actions' },
    { id: 'paraphrase', label: 'd. Paraphrase child’s verbalization' },
    { id: 'reference', label: 'e. Make references to shared experiences, roles, format, routines' },
    { id: 'encourage', label: 'f. Encourage the child' },
    { id: 'attention', label: 'g. Pay attention to the child' },
    { id: 'closedQuestions', label: 'h. Ask closed questions' },
    { id: 'complexInfo', label: 'i. Provide complex descriptions or complex verbal information' },
    { id: 'denominate', label: 'j. Denominate objects' },
    { id: 'demonstrate', label: 'k. Demonstrate actions' },
    { id: 'askRepetitions', label: 'l. Ask for repetitions' },
    { id: 'correct', label: 'm. Correct child’s verbal or non-verbal behavior' },
    { id: 'controlAttention', label: 'n. Control child’s attention' },
    { id: 'initiative', label: 'o. Show communicative initiative' },
    { id: 'openQuestions', label: 'p. Formulate open questions' },
    { id: 'selfAnswers', label: 'q. Self-answers' },
    { id: 'empathic', label: 'r. Make empathic comments' },
    { id: 'topicChange', label: 's. Sudden topic changes' },
    { id: 'selfReformulate', label: 't. Self-reformulate' },
    { id: 'intrusion', label: 'u. Make intrusion in the child’s turn' },
    { id: 'missVocal', label: 'v. Miss response to child’s vocal turn' },
    { id: 'missTurn', label: 'z. Miss response to child’s turn' },
    { id: 'unknownWords', label: 'a1. Use unknown/complicated words' },
    { id: 'selfReformulate2', label: 'a2. Self-reformulate' },
    { id: 'intrusion2', label: 'a3. Make intrusions into the child’s turn' },
];

export const PARENT_COMM_STYLES: { [key: string]: string[] } = {
    repeat: ['T'],
    expand: ['T'],
    reformulate: ['T'],
    paraphrase: ['T'],
    reference: ['T'],
    encourage: ['T'],
    attention: ['T'],
    closedQuestions: ['D', 'DC'],
    complexInfo: ['D'],
    denominate: ['D'],
    demonstrate: ['D'],
    askRepetitions: ['D'],
    correct: ['D'],
    controlAttention: ['DC'],
    initiative: ['DC'],
    openQuestions: ['C'],
    selfAnswers: ['C'],
    empathic: ['C'],
    topicChange: ['C'],
    selfReformulate: ['C'],
    intrusion: [], // Not specified
    missVocal: [], // Not specified
    missTurn: [], // Not specified
    unknownWords: [], // Not specified
    selfReformulate2: ['C'], // Assuming same as 'selfReformulate'
    intrusion2: [], // Not specified
};
