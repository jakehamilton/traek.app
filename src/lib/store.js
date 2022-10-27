import cuid from "cuid";
import invariant from "./invariant";
import migrations from "./migrations";
import { get, has, remove, set } from "./storage";

export const tag = (...parts) => {
	return parts.join(".");
};

export const tags = {
	STORE_META: "store.meta",
	STORE_CATEGORIES_PREFIX: "store.categories",
	STORE_ENTRIES_PREFIX: "store.entries",
	STORE_ENTRY_PREFIX: "store.entry",
};

export const CATEGORY_TYPES = {
	Time: "Time",
	Rating: "Rating",
	YesNo: "YesNo",
	Text: "Text",
	Number: "Number",
};

export const TOGGLE_TYPES = {
	No: "No",
	Yes: "Yes",
};

export const GRAPH_TYPES = {
	Time: "Time",
	Pie: "Pie",
	Bar: "Bar",
	Score: "Score",
};

export const GRAPH_FIDELITY = {
	Day: "Day",
	Week: "Week",
};

// let example = {
// 	version: 0,
// 	categories: {
// 		$id: "store.categories.$id",
// 	},
// };

// let example_categories_$id = {
// 	id: "$id",
// 	name: "name",
// 	entries: {
// 		$id: "store.entries.$id",
// 	},
//  latest: {
//		timestamp: Date,
//    entriesId: "$id",
//    entryId: "$id"
//  }
// };

// let example_entries_$id = {
// 	id: "$id",
// 	categoryId: "$id",
// 	range: {
// 		start: Date,
// 		end: Date,
// 	},
// 	items: {
// 		$id: "store.entry.$id",
// 	},
// };

// let example_entry_$id = {
// 	id: "$id",
// 	entriesId: "$id",
// 	timestamp: Date,
// };

export const migrate = () => {
	const meta = get(tags.STORE_META);

	if (meta.version < migrations.length) {
		for (let i = meta.version; i < migrations.length; i++) {
			const migration = migrations[i];

			migration();

			set(tags.STORE_META, {
				...meta,
				version: i + 1,
			});
		}
	}
};

export const initialize = () => {
	if (!has(tags.STORE_META)) {
		set(tags.STORE_META, {
			version: 0,
			categories: {},
		});
	}

	migrate();
};

export const getDefaultGraph = (type) => {
	switch (type) {
		default:
		case CATEGORY_TYPES.Time:
			return GRAPH_TYPES.Time;
		case CATEGORY_TYPES.Rating:
			return GRAPH_TYPES.Bar;
		case CATEGORY_TYPES.YesNo:
			return GRAPH_TYPES.Time;
		case CATEGORY_TYPES.Text:
			return GRAPH_TYPES.Time;
	}
};

export const category = {
	create: ({
		id = cuid(),
		name,
		type = CATEGORY_TYPES.Time,
		graph = getDefaultGraph(type),
		order,
	} = {}) => {
		invariant(name !== undefined, "category.create() must be called with name");

		const meta = get(tags.STORE_META);

		if (!meta) {
			return null;
		}

		const data = {
			id,
			name,
			type,
			order: order ?? Object.keys(meta.categories).length,
			entries: {},
			graph: {
				type: graph,
				fidelity: GRAPH_FIDELITY.Week,
			},
			latest: null,
		};

		const path = tag(tags.STORE_CATEGORIES_PREFIX, id);

		set(path, data);

		meta.categories[id] = path;

		set(tags.STORE_META, meta);

		return data;
	},
	delete: ({ id }) => {
		invariant(id !== undefined, "category.delete() must be called with id");

		const meta = get(tags.STORE_META);

		const cat = category.findOne({ id });

		if (cat === null) {
			return;
		}

		for (const entriesId of Object.keys(cat.entries)) {
			entries.delete({ id: entriesId });
		}

		delete meta.categories[id];

		set(tags.STORE_META, meta);

		remove(tag(tags.STORE_CATEGORIES_PREFIX, id));
	},
	update: ({ id }, data) => {
		invariant(id !== undefined, "category.update() must be called with id");

		const path = tag(tags.STORE_CATEGORIES_PREFIX, id);

		if (!has(path)) {
			return null;
		}

		const oldData = get(path);

		const result = {
			...oldData,
			...data,
			id: oldData.id,
			entries: data.entries ?? oldData.entries,
			graph: {
				...oldData.graph,
				...data.graph,
			},
		};

		set(path, result);

		return result;
	},
	findOne: ({ id, name } = {}) => {
		const meta = get(tags.STORE_META);

		if (id) {
			if (meta.categories[id]) {
				return get(meta.categories[id]);
			}

			return null;
		}

		for (const key of Object.keys(meta.categories)) {
			const value = get(meta.categories[key]);

			if (name !== undefined && value.name === name) {
				return value;
			}
		}

		return null;
	},
	findMany: ({ names = [], ids = [] } = {}) => {
		const meta = get(tags.STORE_META);

		if (names.length == 0 && ids.length == 0) {
			return Object.keys(meta.categories).map((id) =>
				get(tag(tags.STORE_CATEGORIES_PREFIX, id)),
			);
		}

		if (ids.length > 0) {
			return Object.keys(meta.categories)
				.filter((id) => ids.includes(id))
				.map((id) => get(meta.categories[id]));
		}

		const categories = [];

		for (const key of Object.keys(meta.categories)) {
			const value = get(meta.categories[key]);

			if (names.includes(value.name) || ids.includes(value.id)) {
				categories.push(value);
			}
		}

		return categories;
	},
};

export const entries = {
	create: ({ id = cuid(), categoryId, range } = {}) => {
		invariant(
			categoryId !== undefined,
			"entries.create() must be called with categoryId",
		);
		invariant(
			range !== undefined,
			"entries.create() must be called with range",
		);

		const cat = category.findOne({ id: categoryId });

		if (!cat) {
			return null;
		}

		const data = {
			id,
			categoryId,
			range,
			items: {},
		};

		const path = tag(tags.STORE_ENTRIES_PREFIX, id);

		set(path, data);

		category.update(
			{ id: cat.id },
			{
				entries: {
					...cat.entries,
					[id]: path,
				},
			},
		);

		return data;
	},
	delete: ({ id } = {}) => {
		invariant(id !== undefined, "entries.delete() must be called with id");

		const path = tag(tags.STORE_ENTRIES_PREFIX, id);

		if (!has(path)) {
			return;
		}

		const ents = get(path);

		const cat = category.findOne({ id: ents.categoryId });

		if (cat) {
			const newEntries = {
				...cat.entries,
			};

			delete newEntries[id];

			category.update({ id: cat.id }, { entries: newEntries });
		}

		for (const entryId of Object.keys(ents.items)) {
			entry.delete({ id: entryId });
		}

		remove(path);
	},
	update: ({ id }, data) => {
		const path = tag(tags.STORE_ENTRIES_PREFIX, id);

		if (!has(path)) {
			return null;
		}

		const oldData = get(path);

		const result = {
			...oldData,
			...data,
			id: oldData.id,
			categoryId: oldData.categoryId,
			range: {
				...oldData.range,
				...data.range,
			},
			items: data.items ?? oldData.items,
		};

		set(path, result);

		return result;
	},
	findOne: ({ categoryId, id, range } = {}) => {
		const cat = category.findOne({ id: categoryId });

		if (!cat) {
			return null;
		}

		if (id) {
			if (cat.entries[id]) {
				return get(cat.entries[id]);
			}

			return null;
		}

		if (range) {
			for (const key of Object.keys(cat.entries)) {
				const data = get(cat.entries[key]);

				if (
					(data.range.start >= range.start && data.range.start <= range.end) ||
					(data.range.end >= range.start && data.range.end <= range.end) ||
					(data.range.start <= range.start && data.range.end >= range.end)
				) {
					return data;
				}
			}
		}

		return null;
	},
	findMany: ({ categoryId, ids = [], range } = {}) => {
		const cat = category.findOne({ id: categoryId });

		if (!cat) {
			return [];
		}

		if (ids.length > 0) {
			return Object.keys(cat.entries)
				.filter((id) => ids.includes(id))
				.map((id) => get(cat.entries[id]));
		}

		if (range) {
			const entries = [];

			for (const key of Object.keys(cat.entries)) {
				const data = get(cat.entries[key]);

				if (
					(data.range.start >= range.start && data.range.start <= range.end) ||
					(data.range.end >= range.start && data.range.end <= range.end) ||
					(data.range.start <= range.start && data.range.end >= range.end)
				) {
					entries.push(data);
				}
			}

			return entries;
		}
	},
};

export const entry = {
	create: ({
		id = cuid(),
		entriesId,
		timestamp = Number(new Date()),
		value,
	} = {}) => {
		invariant(
			entriesId !== undefined,
			"entry.create() must be called with entriesId",
		);
		invariant(
			timestamp !== undefined,
			"entry.create() must be called with timestamp",
		);

		if (!has(tag(tags.STORE_ENTRIES_PREFIX, entriesId))) {
			return null;
		}

		const ents = get(tag(tags.STORE_ENTRIES_PREFIX, entriesId));

		if (!ents) {
			return null;
		}

		const cat = category.findOne({ id: ents.categoryId });

		if (!cat) {
			return null;
		}

		const data = {
			id,
			entriesId,
			timestamp,
			value,
		};

		const path = tag(tags.STORE_ENTRY_PREFIX, id);

		set(path, data);

		entries.update(
			{ id: ents.id },
			{
				items: {
					...ents.items,
					[id]: path,
				},
			},
		);

		if (!category.latest || category.latest.timestamp < timestamp) {
			category.update(
				{ id: cat.id },
				{
					latest: {
						timestamp,
						entriesId: ents.id,
						entryId: id,
						value,
					},
				},
			);
		}

		return data;
	},
	delete: ({ id } = {}) => {
		invariant(id !== undefined, "entry.delete() must be called with id");

		const path = tag(tags.STORE_ENTRY_PREFIX, id);

		if (!has(path)) {
			return;
		}

		const ent = get(path);

		const ents = entries.findOne({ id: ent.entriesId });

		if (ents) {
			const newItems = {
				...ents.items,
			};

			delete newItems[id];

			entries.update(
				{ id: ents.id },
				{
					items: newItems,
				},
			);
		}

		remove(path);
	},
	findOne: ({ category: categoryId, id, timestamp, range } = {}) => {
		if (!id && !timestamp && !range) {
			return null;
		}

		if (id !== undefined) {
			const path = tag(tags.STORE_ENTRY_PREFIX, id);

			if (!has(path)) {
				return null;
			}

			return get(path);
		}

		const entries = entries.findOne({ categoryId, range });

		if (!entries) {
			return null;
		}

		for (const key of Object.keys(entries.items)) {
			const item = get(entries.items[key]);

			if (timestamp && item.timestamp === timestamp) {
				return item;
			}

			if (
				range &&
				item.timestamp >= range.start &&
				item.timestamp <= range.end
			) {
				return item;
			}
		}

		return null;
	},
	findMany: ({ categoryId, ids, range } = {}) => {
		const ents = entries.findMany({ categoryId, range });

		if (ents.length === 0) {
			return [];
		}

		let results = [];

		for (const ent of ents) {
			if (ids) {
				results = results.concat(
					Object.keys(ent.items)
						.filter((id) => ids.includes(id))
						.map((id) => get(ent.items[id])),
				);
			} else if (range) {
				for (const key of Object.keys(ent.items)) {
					const item = get(ent.items[key]);

					if (item.timestamp >= range.start && item.timestamp <= range.end) {
						results.push(item);
					}
				}
			}
		}

		return results;
	},
};
