import cn from "classnames";
import { TOGGLE_TYPES } from "../../lib/store";
import style from "./style.css";

export default function Toggle({
	class: className,
	id,
	value,
	onChange,
	...props
}) {
	return (
		<div {...props} class={cn(style.Toggle, className)}>
			<formset>
				<label class={value === TOGGLE_TYPES.No ? style.active : undefined}>
					No
					<input
						type="radio"
						value={TOGGLE_TYPES.No}
						onChange={(e) => onChange(e.target.value)}
						checked={value === TOGGLE_TYPES.No}
					/>
				</label>
				<label class={value === TOGGLE_TYPES.Yes ? style.active : undefined}>
					Yes
					<input
						type="radio"
						value={TOGGLE_TYPES.Yes}
						onChange={(e) => onChange(e.target.value)}
						checked={value === TOGGLE_TYPES.Yes}
					/>
				</label>
			</formset>
		</div>
	);
}
