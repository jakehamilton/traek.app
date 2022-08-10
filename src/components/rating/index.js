import cn from "classnames";
import { Star } from "preact-feather";
import style from "./style.css";

export default function Rating({
	value,
	onChange,
	class: className,
	...props
}) {
	return (
		<div {...props} class={cn(style.Rating, className)}>
			{Array.from({ length: 5 }, (_, i) => (
				<button
					key={i}
					type="button"
					onClick={() => onChange(i + 1)}
					class={cn(style.star, i + 1 <= value && style.active)}
				>
					<Star size={40} color="currentColor" />
				</button>
			))}
		</div>
	);
}
