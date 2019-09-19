import { useState } from 'react';

export const getValue = event => {
    const { value, checked, files, multiple, type } = event.target;

    if (type === 'file') {
        return multiple ? files : files[0];
    }

    if (type === 'checkbox') {
        return checked;
    }

    return value;
};

const useForm = (initialValues, onSubmit) => {
    const [values, setValues] = useState(initialValues);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault();

        setSubmitting(true);
        setError(false);

        try {
            await onSubmit(values, event);
            setSubmitted(true);
        } catch (err) {
            setError(err);
        }

        setSubmitting(false);
    };

    const handleChange = event => {
        const { name } = event.target;
        const value = getValue(event);

        setValues(currentValues => ({
            ...currentValues,
            [name]: value
        }));
    };

    return {
        handleSubmit,
        handleChange,
        values,
        submitting,
        submitted,
        error
    };
};

export default useForm;
