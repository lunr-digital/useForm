/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { render, fireEvent, act } from '@testing-library/react';
import useForm from '.';

const Form = ({ onSubmit }) => {
    const form = useForm(
        {
            name: ''
        },
        onSubmit
    );

    if (form.submitted) {
        return <p>Thanks.</p>;
    }

    return (
        <form onSubmit={form.handleSubmit}>
            <label>
                Name
                <input
                    name="name"
                    onChange={form.handleChange}
                    value={form.values.name}
                />
            </label>

            <button type="submit" disabled={form.submitting}>
                Submit
            </button>
        </form>
    );
};

it('should handle the form lifecycle', async () => {
    const onSubmit = jest.fn(values => {
        if (values.name.length) {
            return Promise.resolve();
        }

        return Promise.reject(new Error('Validation failed'));
    });

    const { getByText, getByLabelText } = render(<Form onSubmit={onSubmit} />);

    const failedSubmit = act(async () => {
        fireEvent.click(getByText('Submit'));
    });

    expect(getByText('Submit')).toBeDisabled();

    await failedSubmit;

    // Fill form
    fireEvent.change(getByLabelText('Name'), {
        target: {
            value: 'Bob'
        }
    });

    const successfulSubmit = act(async () => {
        fireEvent.click(getByText('Submit'));
    });

    expect(getByText('Submit')).toBeDisabled();

    await successfulSubmit;

    expect(getByText('Thanks.')).toBeInTheDocument();
});
