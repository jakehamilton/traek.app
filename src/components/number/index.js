import cn from "classnames";
import { useState, useEffect } from "preact/hooks";
import Button from "../button";
import style from "./style.css";

export default function Number({ onChange, value, class: className, ...props }) {
	const [number, setNumber] = useState(value);

	useEffect(() => {
		if (number !== value) {
			setNumber(value);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const handleSubmit = () => {
		onChange(number);
	};

	return (
		<div {...props} class={cn(style.Number, className)}>
			<input
				type="number"
				value={number}
				onInput={(e) => setNumber(e.target.value)}
			/>
			<Button onClick={handleSubmit}>Track</Button>
		</div>
	);
}
