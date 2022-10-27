import { h } from "preact";
import { useMemo, useState } from "preact/hooks";
import { category, entries, entry } from "../../lib/store";
import style from "./style.css";
import { startOfWeek, endOfWeek } from "date-fns";
import { Link } from "preact-router";
import Category from "../../components/category";
import { Star } from "preact-feather";

const Home = () => {
	const [forcedUpdate, setForcedUpdate] = useState(0);

	const forceUpdate = () => {
		setForcedUpdate((i) => i + 1);
	};

	const categories = useMemo(() => {
		return category.findMany().sort((a, b) => a.order > b.order);
	}, [forcedUpdate]);

	const createAddEntryHandler = (cat) => (value) => {
		const start = startOfWeek(Date.now());
		const end = endOfWeek(Date.now());

		let ents = entries.findOne({
			categoryId: cat.id,
			range: {
				start: Number(start),
				end: Number(end),
			},
		});

		if (!ents) {
			ents = entries.create({
				categoryId: cat.id,
				range: {
					start: Number(start),
					end: Number(end),
				},
			});
		}

		if (!ents) {
			return;
		}

		const ent = entry.create({
			entriesId: ents.id,
			value,
		});

		if (!ent) {
			return;
		}

		forceUpdate();
	};

	return (
		<div class={style.home}>
			<h1>træk.app</h1>
			{categories.length === 0 ? (
				<div class={style.empty}>
					<Star size={32} color="currentColor" />
					No Categories Yet
					<Link href="/edit" class={style.editLink}>
						Edit Categories
					</Link>
				</div>
			) : (
				categories.map((cat) => (
					<Category
						key={cat.id}
						category={cat}
						class={style.category}
						onChange={createAddEntryHandler(cat)}
					/>
					// <Card key={cat.id} class={style.category}>
					// 	<h2>{cat.name}</h2>
					// 	<div class={style.time}>
					// 		{cat.latest
					// 			? `Last added ${formatRelative(
					// 					cat.latest.timestamp,
					// 					new Date(),
					// 			  )}`
					// 			: "Not tracked yet"}
					// 	</div>
					// 	<button onClick={createAddEntryHandler(cat)}>Track</button>
					// </Card>
				))
			)}
		</div>
	);
};

export default Home;
