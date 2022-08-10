import { h } from "preact";
import {
	ArrowDownCircle,
	ArrowUpCircle,
	Clock,
	Star,
	ToggleLeft,
	Trash2,
	Type,
} from "preact-feather";
import { useMemo, useRef, useState } from "preact/hooks";
import Button from "../../components/button";
import Card from "../../components/card";
import { category, CATEGORY_TYPES } from "../../lib/store";
import style from "./style.css";

const placeholders = [
	"Take Out Trash",
	"Drink Water",
	"Mood Check",
	"On Break?",
	"Dream Journal",
];

const Edit = () => {
	const [placeholderUpdate, setPlaceholderUpdate] = useState(0);
	const [forcedUpdate, setForcedUpdate] = useState(0);
	const [categoryName, setCategoryName] = useState("");
	const [categoryType, setCategoryType] = useState(CATEGORY_TYPES.Time);
	const categoryNameInputRef = useRef(null);

	const placeholder = useMemo(() => {
		return placeholders[Math.floor(Math.random() * placeholders.length)];
	}, [placeholderUpdate]);

	const categories = useMemo(() => {
		return category.findMany().sort((a, b) => a.order > b.order);
	}, [forcedUpdate]);

	const changePlaceholder = () => {
		setPlaceholderUpdate((i) => i + 1);
	};

	const forceUpdate = () => {
		setForcedUpdate((i) => i + 1);
	};

	const handleAddCategory = () => {
		if (categoryName === "") {
			return;
		}

		category.create({ name: categoryName, type: categoryType });

		setCategoryName("");

		forceUpdate();
		changePlaceholder();

		categoryNameInputRef.current?.focus();
	};

	const handleDeleteCategory = (cat) => () => {
		category.delete({ id: cat.id });

		forceUpdate();
	};

	const handleChangeCategoryType = (e) => {
		setCategoryType(e.target.value);
	};

	const renderIcon = (type) => {
		switch (type) {
			default:
			case CATEGORY_TYPES.Time:
				return <Clock size={18} />;
			case CATEGORY_TYPES.Rating:
				return <Star size={18} />;
			case CATEGORY_TYPES.YesNo:
				return <ToggleLeft size={18} />;
			case CATEGORY_TYPES.Text:
				return <Type size={18} />;
		}
	};

	const handleMoveCategoryUp = (cat) => () => {
		const prevCat = categories[cat.order - 1];

		category.update(
			{ id: prevCat.id },
			{
				order: prevCat.order + 1,
			},
		);

		category.update(
			{ id: cat.id },
			{
				order: cat.order - 1,
			},
		);

		forceUpdate();
	};

	const handleMoveCategoryDown = (cat) => () => {
		const nextCat = categories[cat.order + 1];

		category.update(
			{ id: nextCat.id },
			{
				order: nextCat.order - 1,
			},
		);

		category.update(
			{ id: cat.id },
			{
				order: cat.order + 1,
			},
		);

		forceUpdate();
	};

	const handleCategoryNameKeyUp = (e) => {
		if (e.key === "Enter") {
			handleAddCategory(e);
		}
	};

	const renderCategories = () => {
		return categories.map((cat, i) => {
			return (
				<Card key={cat.id} class={style.category}>
					<div class={style.order}>
						<button
							type="button"
							disabled={i === 0}
							onClick={handleMoveCategoryUp(cat)}
						>
							<ArrowUpCircle />
						</button>
						<button
							type="button"
							disabled={i === categories.length - 1}
							onClick={handleMoveCategoryDown(cat)}
						>
							<ArrowDownCircle />
						</button>
					</div>
					<div class={style.content}>
						<div class={style.title}>{cat.name}</div>
						<div class={style.type}>
							{renderIcon(cat.type)}
							{cat.type}
						</div>
					</div>
					<div class={style.controls}>
						<button type="button" onClick={handleDeleteCategory(cat)}>
							<Trash2 size={18} />
						</button>
					</div>
				</Card>
			);
		});
	};

	return (
		<div class={style.edit}>
			<h1>træk.app</h1>
			<div class={style.createCategory}>
				<input
					type="text"
					value={categoryName}
					placeholder={placeholder}
					onChange={(e) => setCategoryName(e.target.value)}
					className={style.categoryName}
					ref={categoryNameInputRef}
					onKeyUp={handleCategoryNameKeyUp}
				/>
				<div class={style.types}>
					<formset>
						<label
							class={
								categoryType === CATEGORY_TYPES.Time
									? style.selected
									: undefined
							}
						>
							<Clock />
							Time
							<input
								type="radio"
								name="categoryType"
								checked={categoryType === CATEGORY_TYPES.Time}
								value={CATEGORY_TYPES.Time}
								onChange={handleChangeCategoryType}
							/>
						</label>
						<label
							class={
								categoryType === CATEGORY_TYPES.Rating
									? style.selected
									: undefined
							}
						>
							<Star />
							Rating
							<input
								type="radio"
								name="categoryType"
								checked={categoryType === CATEGORY_TYPES.Rating}
								value={CATEGORY_TYPES.Rating}
								onChange={handleChangeCategoryType}
							/>
						</label>
						<label
							class={
								categoryType === CATEGORY_TYPES.YesNo
									? style.selected
									: undefined
							}
						>
							<ToggleLeft />
							Toggle
							<input
								type="radio"
								name="categoryType"
								checked={categoryType === CATEGORY_TYPES.YesNo}
								value={CATEGORY_TYPES.YesNo}
								onChange={handleChangeCategoryType}
							/>
						</label>
						<label
							class={
								categoryType === CATEGORY_TYPES.Text
									? style.selected
									: undefined
							}
						>
							<Type />
							Text
							<input
								type="radio"
								name="categoryType"
								checked={categoryType === CATEGORY_TYPES.Text}
								value={CATEGORY_TYPES.Text}
								onChange={handleChangeCategoryType}
							/>
						</label>
					</formset>
				</div>
				<Button
					type="button"
					onClick={handleAddCategory}
					class={style.createButton}
				>
					Create
				</Button>
			</div>
			{categories.length === 0 ? (
				<div class={style.empty}>
					<Star size={32} color="currentColor" />
					No Categories Yet
				</div>
			) : (
				<div class={style.categories}>
					<h2>Categories</h2>
					{renderCategories()}
				</div>
			)}
		</div>
	);
};

export default Edit;
