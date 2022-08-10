import { createContext } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { initialize } from "../lib/store";

const context = createContext();

const Store = ({ children }) => {
	useEffect(() => {
		initialize();
	}, []);

	return <context.Provider>{children}</context.Provider>;
};

export const useStore = () => {
	const value = useContext(context);

	if (value === undefined) {
		throw new Error("useStore must be used inside of <Store />");
	}

	return value;
};

export default Store;
