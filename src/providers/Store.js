import { createContext } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { initialize } from "../lib/store";

const context = createContext();

// @NOTE(jakehamilton): The original intent was to provide a
// React-style interface for the store, but it ended up being easy
// enough to use the store directly. This wrapper still provides
// initialization of the store, but nothing else is used currently.
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
