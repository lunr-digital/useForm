/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { render, fireEvent, act } from '@testing-library/react';
import useForm from '.';

const Form = ({ onSubmit }) => {
    const form = useForm(
        {
            name: '',
            tsAndCs: false
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

            <label>
                Agree to terms
                <input
                    name="tsAndCs"
                    type="checkbox"
                    onChange={form.handleChange}
                    checked={form.values.tsAndCs}
                />
            </label>

            <p>Product:</p>
            <label>
                <input
                    name="product"
                    type="radio"
                    onChange={form.handleChange}
                    value="bee"
                    checked={form.values.product === 'bee'}
                />
                Bee
            </label>
            <label>
                <input
                    name="product"
                    type="radio"
                    onChange={form.handleChange}
                    value="octopus"
                    checked={form.values.product === 'octopus'}
                />
                Octopus
            </label>

            <button type="submit" disabled={form.submitting}>
                Submit
            </button>
        </form>
    );
};

it('should handle the form lifecycle', async () => {
    const onSubmit = jest.fn(values => {
        if (
            values.name.length &&
            values.tsAndCs === true &&
            values.product === 'bee'
        ) {
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
    fireEvent.click(getByLabelText('Agree to terms'));
    fireEvent.click(getByLabelText('Bee'));

    const successful = act(async () => {
        fireEvent.click(getByText('Submit'));
    });

    expect(getByText('Submit')).toBeDisabled();

    await successful;

    expect(getByText('Thanks.')).toBeInTheDocument();
});
