import cn from "classnames";
import style from "./style.css";

export default function Button({ class: className, ...props }) {
	return (
		<button type="button" {...props} class={cn(className, style.Button)} />
	);
}
