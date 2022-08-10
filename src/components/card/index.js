import cn from "classnames";
import style from "./style.css";

export default function Card({ class: className, ...props }) {
	return <div {...props} class={cn(style.Card, className)} />;
}
