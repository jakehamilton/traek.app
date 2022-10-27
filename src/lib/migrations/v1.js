import { get, set } from "../storage";
import { getDefaultGraph, GRAPH_FIDELITY, tags } from "../store";

export default function() {
	const meta = get(tags.STORE_META);

	for (const path of Object.values(meta.categories)) {
		const cat = get(path);

		if (!cat.graph) {
			cat.graph = {
				type: getDefaultGraph(cat.type),
				fidelity: GRAPH_FIDELITY.Week,
			};
		}

		set(path, cat);
	}
}
