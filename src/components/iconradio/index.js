import cn from "classnames";
import style from "./style.css";

const IconRadio = ({ name, value, onChange, options }) => {
	return (
		<formset class={style.IconRadio}>
			{options.map((option, i) => (
				<label key={i} class={cn(option.value === value && style.active)}>
					{option.icon}
					{option.name}
					<input
						type="radio"
						name={name}
						checked={option.value === value}
						value={option.value}
						onChange={onChange}
					/>
				</label>
			))}
		</formset>
	);
};

export default IconRadio;
