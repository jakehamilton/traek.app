const invariant = (condition, message) => {
	if (!condition) {
		throw new Error(message);
	}
};

export default invariant;
