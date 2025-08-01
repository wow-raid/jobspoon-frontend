import React from 'react';

interface FormFieldProps {
    id: string;
    name: string;
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    as?: 'input' | 'textarea' | 'select';
    type?: string;
    options?: string[];
    [x: string]: any;
}

const FormField: React.FC<FormFieldProps> = ({
                                                 id,
                                                 name,
                                                 label,
                                                 value,
                                                 onChange,
                                                 as = 'input',
                                                 type = 'text',
                                                 options = [],
                                                 ...rest
                                             }) => {

    const renderField = () => {
        if (as === 'textarea') {
            return <textarea id={id} name={name} value={value} onChange={onChange} {...rest} />;
        }
        if (as === 'select') {
            return (
                <select id={id} name={name} value={value} onChange={onChange} {...rest}>
                    {options.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
            );
        }
        return <input type={type} id={id} name={name} value={value} onChange={onChange} {...rest} />;
    };

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            {renderField()}
        </div>
    );
};

export default FormField;