import { renderHook, act } from '@testing-library/react-hooks';

import useForm from '.';

it.each`
    type          | event                                                    | expected
    ${'input'}    | ${{ name: 'input', value: 'New text' }}                  | ${'New text'}
    ${'radio'}    | ${{ name: 'radio', value: 'b' }}                         | ${'b'}
    ${'checkbox'} | ${{ name: 'checkbox', checked: true, type: 'checkbox' }} | ${true}
`(`change handle $type change events`, ({ event, expected }) => {
    const initialValues = {
        [event.name]: ''
    };

    const { result } = renderHook(() => useForm(initialValues, () => {}));

    act(() => {
        result.current.handleChange({
            target: event
        });
    });

    expect(result.current.values[event.name]).toEqual(expected);
});

it('should handle submit', async () => {
    const initialValues = {
        mock: 'data'
    };
    const onSubmit = jest.fn();
    const preventDefault = jest.fn();

    const { result } = renderHook(() => useForm(initialValues, onSubmit));

    await act(async () => {
        await result.current.handleSubmit({
            preventDefault
        });
    });

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(initialValues, {
        preventDefault
    });
    expect(result.current.submitted).toEqual(true);
});

it('should handle errors on submit', async () => {
    const validationError = new Error('Validation failed.');
    const initialValues = {
        mock: 'data'
    };
    const onSubmit = jest.fn(() => Promise.reject(validationError));
    const preventDefault = jest.fn();

    const { result } = renderHook(() => useForm(initialValues, onSubmit));

    expect(result.current.submitting).toEqual(false);

    const submit = act(() =>
        result.current.handleSubmit({
            preventDefault
        })
    );

    expect(result.current.submitting).toEqual(true);

    await submit;

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(initialValues, {
        preventDefault
    });
    expect(result.current.submitting).toEqual(false);
    expect(result.current.submitted).toEqual(false);
    expect(result.current.error).toEqual(validationError);
});
