const getValue = event => {
    const { value, checked, files, multiple, type } = event.target;

    if (type === 'file') {
        return multiple ? files : files[0];
    }

    if (type === 'checkbox') {
        return checked;
    }

    return value;
};

export default getValue;
