import { useMemo } from "preact/hooks";
import { category, entries, entry } from "../../lib/store";
import style from "./style.css";
import { startOfWeek, endOfWeek } from "date-fns";
import { Link } from "preact-router";
import Category from "../../components/category";
import { Star } from "preact-feather";
import useForceUpdate from "../../hooks/useForceUpdate";

const Home = () => {
	const [forcedUpdate, forceUpdate] = useForceUpdate();

	const categories = useMemo(() => {
		return category.findMany().sort((a, b) => a.order > b.order);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				))
			)}
		</div>
	);
};

export default Home;
