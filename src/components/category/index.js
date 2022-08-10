import cn from "classnames";
import { formatRelative } from "date-fns";
import { CATEGORY_TYPES } from "../../lib/store";
import Button from "../button";
import Card from "../card";
import Rating from "../rating";
import Text from "../text";
import Toggle from "../toggle";
import style from "./style.css";

export default function Category({
	category,
	class: className,
	onChange,
	...props
}) {
	const renderContent = () => {
		switch (category.type) {
			default:
			case CATEGORY_TYPES.Time:
				return (
					<div class={style.time}>
						<Button onClick={() => onChange()}>Track</Button>
					</div>
				);
			case CATEGORY_TYPES.Rating:
				return (
					<div class={style.rating}>
						<Rating value={category.latest?.value} onChange={onChange} />
					</div>
				);
			case CATEGORY_TYPES.YesNo:
				return (
					<div class={style.yesno}>
						<Toggle
							value={category.latest?.value}
							id={category.id}
							onChange={onChange}
						/>
					</div>
				);
			case CATEGORY_TYPES.Text:
				return (
					<div class={style.text}>
						{category.latest !== null ? <p>{category.latest.value}</p> : null}
						<Text onChange={onChange} />
					</div>
				);
		}
	};

	return (
		<Card {...props} class={cn(style.Category, className)}>
			<h2>{category.name}</h2>
			<span class={style.date}>
				{category.latest
					? `Last added ${formatRelative(
							category.latest.timestamp,
							new Date(),
					  )}`
					: "Not tracked yet"}
			</span>
			<div class={style.content}>{renderContent()}</div>
		</Card>
	);
}
