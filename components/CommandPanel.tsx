import React, { useState } from 'react';

interface TurnInputFormProps {
    onSubmit: (data: {
        parentAction: string;
        parentSpeech: string;
        childSpeech: string;
        childAction: string;
        eyeContact: boolean;
        overlappingDialogue: boolean;
    }) => void;
    disabled: boolean;
}

const initialState = {
    parentAction: '',
    parentSpeech: '',
    childSpeech: '',
    childAction: '',
    eyeContact: false,
    overlappingDialogue: false,
};

const LabeledTextarea: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name: string, disabled: boolean }> = 
({ label, value, onChange, name, disabled }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={2}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition disabled:opacity-50"
            disabled={disabled}
        />
    </div>
);

const TurnInputForm: React.FC<TurnInputFormProps> = ({ onSubmit, disabled }) => {
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(initialState);
    };

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900/50 rounded-lg p-4 h-full border border-slate-700 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-slate-300">Registra Turno</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-grow">
                <LabeledTextarea label="What the parent is doing" name="parentAction" value={formData.parentAction} onChange={handleChange} disabled={disabled} />
                <LabeledTextarea label="What the parent is saying" name="parentSpeech" value={formData.parentSpeech} onChange={handleChange} disabled={disabled} />
                <LabeledTextarea label="What the child is saying" name="childSpeech" value={formData.childSpeech} onChange={handleChange} disabled={disabled} />
                <LabeledTextarea label="What the child is doing" name="childAction" value={formData.childAction} onChange={handleChange} disabled={disabled} />
                
                <div className="flex items-center justify-between mt-2">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="eyeContact" checked={formData.eyeContact} onChange={handleChange} disabled={disabled} className="form-checkbox bg-slate-600 border-slate-500 text-cyan-500 focus:ring-cyan-500 disabled:opacity-50" />
                        <span className="text-slate-300">Eye contact</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="overlappingDialogue" checked={formData.overlappingDialogue} onChange={handleChange} disabled={disabled} className="form-checkbox bg-slate-600 border-slate-500 text-cyan-500 focus:ring-cyan-500 disabled:opacity-50" />
                        <span className="text-slate-300">Overlapping of the dialogue</span>
                    </label>
                </div>
                
                <button
                    type="submit"
                    className="w-full mt-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    disabled={disabled}
                >
                    Submit Turn & Classify
                </button>
            </form>
        </div>
    );
};

export default TurnInputForm;
