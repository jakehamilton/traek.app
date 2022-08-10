export const has = (key) => {
	return localStorage.getItem(key) !== null;
};

export const get = (key, options = { json: true, default: undefined }) => {
	const value = localStorage.getItem(key);

	if (value === null && options.default) {
		return options.default;
	}

	if (options.json) {
		return JSON.parse(value);
	}

	return value;
};

export const set = (key, value, options = { json: true }) => {
	if (options.json) {
		localStorage.setItem(key, JSON.stringify(value));
	} else {
		localStorage.setItem(key, value);
	}
};

export const remove = (key) => {
	localStorage.removeItem(key);
};

export const removeAll = () => {
	const length = localStorage.length;

	for (let i = 0; i < length; i++) {
		remove(localStorage.key(0));
	}
};

export const getAll = () => {
	const data = {};

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);

		const value = get(key);

		data[key] = value;
	}

	return data;
};

export const restore = (data) => {
	removeAll();

	for (const [key, value] of Object.entries(data)) {
		set(key, value);
	}
};
