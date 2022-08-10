import cn from "classnames";
import { useEffect, useRef, useState } from "preact/hooks";
import Button from "../button";
import style from "./style.css";

export default function Text({ onChange, class: className, ...props }) {
	const [text, setText] = useState("");

	const handleSubmit = () => {
		onChange(text);
		setText("");
	};

	return (
		<div {...props} class={cn(style.Text, className)}>
			<textarea
				placeholder="Something important..."
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<Button onClick={handleSubmit}>Track</Button>
		</div>
	);
}
