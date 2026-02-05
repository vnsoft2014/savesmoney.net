'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import { Button } from '../../../shared/shadecn/ui/button';
import { FormProps } from '../../../shared/types';

const Form = ({
    title,
    description,
    inputs,
    radioBtns,
    textarea,
    checkboxes,
    btn,
    btnPosition,
    containerClass,
}: FormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [inputValues, setInputValues] = useState<Record<string, string>>({});
    const [radioBtnValue, setRadioBtnValue] = useState('');
    const [textareaValues, setTextareaValues] = useState('');
    const [checkedState, setCheckedState] = useState<boolean[]>(new Array(checkboxes?.length || 0).fill(false));

    // Update the value of the entry fields
    const changeInputValueHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setInputValues({
            ...inputValues,
            [name]: value,
        });
    };

    // Update checked radio buttons
    const changeRadioBtnsHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadioBtnValue(event.target.value);
    };

    // Update the textarea value
    const changeTextareaHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaValues(event.target.value);
    };

    // Update checkbox radio buttons
    const changeCheckboxHandler = (index: number) => {
        setCheckedState((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        const selectedCheckboxes = checkboxes?.filter((_, i) => checkedState[i]).map((c) => c.label) || [];

        const payload = {
            ...inputValues,
            radio: radioBtnValue,
            message: textareaValues,
            checkboxes: selectedCheckboxes,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || 'Failed to send');
                return;
            }

            toast.success('Message sent successfully!');
        } catch (error) {
            toast.error(INTERNAL_SERVER);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form id="contactForm" onSubmit={submitHandler} className={twMerge('', containerClass)}>
            <div className="mb-6">
                {/* Inputs */}
                <div className="mx-0 mb-1 sm:mb-4">
                    {inputs &&
                        inputs.map(({ type, label, name, autocomplete, placeholder }, index) => (
                            <div key={`item-input-${index}`} className="mx-0 mb-1 sm:mb-4">
                                <label htmlFor={name} className="pb-1 text-xs uppercase tracking-wider">
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    id={name}
                                    name={name}
                                    autoComplete={autocomplete}
                                    value={inputValues[index]}
                                    onChange={changeInputValueHandler}
                                    placeholder={placeholder}
                                    className="mb-2 w-full rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md dark:text-gray-300 sm:mb-0"
                                />
                            </div>
                        ))}
                </div>
                {/* Radio buttons */}
                {radioBtns && (
                    <div className="mx-0 mb-1 sm:mb-3">
                        <span className="pb-1 text-xs uppercase tracking-wider">{radioBtns?.label}</span>
                        <div className="flex flex-wrap">
                            {radioBtns.radios.map(({ label }, index) => (
                                <div key={`radio-btn-${index}`} className="mr-4 items-baseline">
                                    <input
                                        id={label}
                                        type="radio"
                                        name={label}
                                        value={`value${index}`}
                                        checked={radioBtnValue === `value${index}`}
                                        onChange={changeRadioBtnsHandler}
                                        className="cursor-pointer"
                                    />
                                    <label htmlFor={label} className="ml-2">
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Textarea */}
                {textarea && (
                    <div className={`mx-0 mb-1 sm:mb-4`}>
                        <label htmlFor={textarea.name} className="pb-1 text-xs uppercase tracking-wider">
                            {textarea.label}
                        </label>
                        <textarea
                            id={textarea.name}
                            name={textarea.name}
                            cols={textarea.cols}
                            rows={textarea.rows}
                            value={textareaValues}
                            onChange={(e) => changeTextareaHandler(e)}
                            placeholder={textarea.placeholder}
                            className="mb-2 w-full rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md dark:text-gray-300 sm:mb-0"
                        />
                    </div>
                )}
                {/* Checkboxes */}
                {checkboxes && (
                    <div className="mx-0 mb-1 sm:mb-4">
                        {checkboxes.map(({ label }, index) => (
                            <div key={`checkbox-${index}`} className="mx-0 my-1 flex items-baseline">
                                <input
                                    id={label}
                                    type="checkbox"
                                    name={label}
                                    checked={checkedState[index]}
                                    onChange={() => changeCheckboxHandler(index)}
                                    className="cursor-pointer"
                                />
                                <label htmlFor={label} className="ml-2">
                                    {label}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {btn && (
                <div
                    className={`${btnPosition === 'left' ? 'text-left' : btnPosition === 'right' ? 'text-right' : 'text-center'}`}
                >
                    <Button type="submit" className="min-w-32" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send message'}
                    </Button>
                </div>
            )}
        </form>
    );
};

export default Form;
