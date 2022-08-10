import { useState } from "preact/hooks";
import style from "./style.css";
import { format } from "date-fns";
import { Download, Trash2, Upload } from "preact-feather";
import { getAll, removeAll, restore } from "../../lib/storage";
import { saveAs } from "file-saver";
import { read } from "../../lib/file";
import Button from "../../components/button";

const Settings = () => {
	const [forcedUpdate, setForcedUpdate] = useState(0);
	const [isImporting, setIsImporting] = useState(false);

	const forceUpdate = () => {
		setForcedUpdate((i) => i + 1);
	};

	const handleClearData = () => {
		removeAll();
		location.reload();
	};

	const handleExportData = () => {
		const data = getAll();

		const blob = new Blob([JSON.stringify(data)], {
			type: "application/json",
		});

		saveAs(blob, `export-${format(new Date(), "yyyyMMdd-hhmma")}.traek`);
	};

	const handleImportData = async (event) => {
		const file = event.target.files[0];

		const data = await read(file);

		restore(JSON.parse(data));
	};

	return (
		<div class={style.settings}>
			<h1>træk.app</h1>
			<h2>Import</h2>
			<p>
				Your data can be imported from previous export. Select "Import Data" and
				choose your exported data from a file ending with ".traek" or ".json".
			</p>
			<label class={style.importButton}>
				<Upload color="currentColor" size={16} />
				Import Data
				<input
					type="file"
					accept=".traek,application/json"
					onChange={handleImportData}
					disabled={isImporting}
				/>
			</label>
			<h2>Export</h2>
			<p>
				Your data can be exported as a file with the extension ".traek" or
				".json". This can be useful for moving your tracking data from one
				device to another or for making backups for later.
			</p>
			<Button onClick={handleExportData} class={style.exportButton}>
				<Download color="currentColor" size={16} /> Export Data
			</Button>
			<h2>Clear</h2>
			<p>
				You can remove all of your data at any point. This action is not
				reversible. Before selecting "Clear Data", be sure that you have
				exported your data already.
			</p>
			<Button type="button" class={style.errorButton} onClick={handleClearData}>
				<Trash2 color="currentColor" size={16} /> Clear Data
			</Button>
		</div>
	);
};

export default Settings;
