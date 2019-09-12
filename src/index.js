import { useState } from 'react';

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
        const { name, value, checked, type } = event.target;

        setValues(currentValues => ({
            ...currentValues,
            [name]: type === 'checkbox' ? checked : value
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
