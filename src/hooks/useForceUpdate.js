import { useState } from "preact/hooks";

const increment = (x) => x + 1;

const useForceUpdate = () => {
	const [state, setState] = useState(0);

	const forceUpdate = () => {
		setState(increment);
	};

	return [state, forceUpdate];
};

export default useForceUpdate;
