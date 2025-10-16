import React, { useState, useEffect } from 'react';
import { TurnClassification, ParentCommunicationStrategies } from '../types';
import { PARENT_COMM_STRATEGIES, VOCALIZATION_TYPES, COMM_MODES, SHARED_ATTENTION_OPTS, SEMANTIC_OPTS } from '../utils/constants';

interface ClassificationPanelProps {
    onSave: (classification: TurnClassification) => void;
    onClose: () => void;
}

const initialParentComm: ParentCommunicationStrategies = PARENT_COMM_STRATEGIES.reduce((acc, curr) => ({...acc, [curr.id]: false }), {});

const initialState: TurnClassification = {
    communicationMode: '',
    vocalizationType: '',
    sharedAttention: '',
    parentCommunication: initialParentComm,
    isInadequate: false,
    childProvidesNewInfo: false,
    childUnderstandsSemantic: '',
    usesOnlyAuditoryChannel: false,
    isEyeContactAdequate: false,
};

const Section: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <div className={`mb-4 ${className}`}>
        <h3 className="text-md font-semibold text-cyan-300 border-b border-slate-600 pb-2 mb-3">{title}</h3>
        {children}
    </div>
);

const RadioGroup: React.FC<{ name: string; options: string[]; selected: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ name, options, selected, onChange }) => (
     <div className="flex flex-wrap gap-x-4 gap-y-2">
        {options.map(opt => (
            <label key={opt} className="flex items-center space-x-2 text-slate-300 cursor-pointer text-sm">
                <input type="radio" name={name} value={opt} checked={selected === opt} onChange={onChange} className="form-radio bg-slate-600 border-slate-500 text-cyan-500 focus:ring-cyan-500" />
                <span>{opt}</span>
            </label>
        ))}
    </div>
);

const Checkbox: React.FC<{ name: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; children: React.ReactNode }> = ({ name, checked, onChange, children }) => (
    <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="form-checkbox bg-slate-600 border-slate-500 text-cyan-500 focus:ring-cyan-500" />
        <span>{children}</span>
    </label>
);

const ClassificationPanel: React.FC<ClassificationPanelProps> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState<TurnClassification>(initialState);

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.checked }));
    };

    const handleParentCommChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            parentCommunication: {
                ...prev.parentCommunication,
                [name]: checked,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900/50 rounded-lg p-4 h-full border border-cyan-500/50 flex flex-col">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Classifica Turno</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
            </header>
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2">
                <Section title="1. Communication Mode">
                   <RadioGroup name="communicationMode" options={COMM_MODES} selected={formData.communicationMode} onChange={handleRadioChange} />
                </Section>
                
                <Section title="2. Vocalization Type">
                     <RadioGroup name="vocalizationType" options={VOCALIZATION_TYPES} selected={formData.vocalizationType} onChange={handleRadioChange} />
                </Section>
                
                <Section title="3. Shared Attention">
                     <RadioGroup name="sharedAttention" options={SHARED_ATTENTION_OPTS} selected={formData.sharedAttention} onChange={handleRadioChange} />
                </Section>
                
                 <Section title="4. Parent Communication">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {PARENT_COMM_STRATEGIES.map(item => (
                            <label key={item.id} className="flex items-start space-x-2 text-slate-300 cursor-pointer">
                                <input type="checkbox" name={item.id} checked={formData.parentCommunication[item.id]} onChange={handleParentCommChange} className="form-checkbox mt-1 bg-slate-600 border-slate-500 text-cyan-500 focus:ring-cyan-500" />
                                <span>{item.label}</span>
                            </label>
                        ))}
                    </div>
                </Section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Section title="5. Is turn inadequate?">
                           <Checkbox name="isInadequate" checked={formData.isInadequate} onChange={handleCheckboxChange}>Check if observed</Checkbox>
                        </Section>
                         <Section title="6. Child providing new info?">
                           <Checkbox name="childProvidesNewInfo" checked={formData.childProvidesNewInfo} onChange={handleCheckboxChange}>Yes</Checkbox>
                        </Section>
                        <Section title="7. Il bambino comprende il referente semantico?">
                            <RadioGroup name="childUnderstandsSemantic" options={SEMANTIC_OPTS} selected={formData.childUnderstandsSemantic} onChange={handleRadioChange} />
                        </Section>
                    </div>
                    <div>
                        <Section title="8. Utilizza solo il canale uditivo?">
                           <Checkbox name="usesOnlyAuditoryChannel" checked={formData.usesOnlyAuditoryChannel} onChange={handleCheckboxChange}>Seleziona se osservato</Checkbox>
                        </Section>
                        <Section title="9. Il contatto oculare è adeguato?">
                           <Checkbox name="isEyeContactAdequate" checked={formData.isEyeContactAdequate} onChange={handleCheckboxChange}>Check if observed</Checkbox>
                        </Section>
                    </div>
                </div>

            </form>
             <footer className="pt-4 mt-auto">
                <button type="button" onClick={handleSubmit} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800">
                    Salva Classificazione
                </button>
            </footer>
        </div>
    );
};

export default ClassificationPanel;
