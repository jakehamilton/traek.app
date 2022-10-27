import {
	addDays,
	endOfDay,
	endOfWeek,
	format,
	startOfDay,
	startOfWeek,
	subDays,
} from "date-fns";
import { ArrowLeft, ArrowRight, Calendar, Sun } from "preact-feather";
import { useMemo, useState } from "preact/hooks";
import Button from "../../components/button";
import Card from "../../components/card";
import Chart from "../../components/chart";
import IconRadio from "../../components/iconradio";
import useForceUpdate from "../../hooks/useForceUpdate";
import {
	category,
	CATEGORY_TYPES,
	entry,
	GRAPH_FIDELITY,
	GRAPH_TYPES,
} from "../../lib/store";
import style from "./style.css";

const CategoryGraph = ({ category: cat, onUpdate }) => {
	const [timestamp, setTimestamp] = useState(() => new Date());

	const range = useMemo(() => {
		switch (cat.graph.fidelity) {
			default:
			case GRAPH_FIDELITY.Week:
				return {
					start: startOfWeek(timestamp),
					end: endOfWeek(timestamp),
				};
			case GRAPH_FIDELITY.Day:
				return {
					start: startOfDay(timestamp),
					end: endOfDay(timestamp),
				};
		}
	}, [cat.graph.fidelity, timestamp]);

	const data = useMemo(() => {
		const es = entry.findMany({ categoryId: cat.id, range });

		switch (cat.graph.type) {
			default:
			case GRAPH_TYPES.Time:
				return es.map((ent) => {
					switch (cat.type) {
						default:
							return {
								x: ent.timestamp,
								y: ent.value ?? 0,
							};
						case CATEGORY_TYPES.Time:
							return {
								x: ent.timestamp,
								y: 1,
							};
						case CATEGORY_TYPES.YesNo:
							return {
								label: ent.value,
								x: ent.timestamp,
								y: ent.value === "Yes" ? 1 : 0,
							};
					}
				});
			case GRAPH_TYPES.Score:
				return es.map((ent) => ({
					x: ent.timestamp,
					y: ent.value ?? 1,
				}));
			case GRAPH_TYPES.Pie: {
				if (es.length === 0) {
					return [];
				}
				switch (cat.type) {
					default:
					case CATEGORY_TYPES.Number: {
						const scores = es.reduce(
							(acc, e) => {
								acc[e.value] = (acc[e.value] ?? 0) + 1;

								return acc;
							},
							{},
						);

						return Object.keys(scores).map((score) => ({
							label: score,
							value: scores[score],
						}));
					}
					case CATEGORY_TYPES.YesNo: {
						const scores = es.reduce(
							(acc, e) => {
								acc[e.value] = (acc[e.value] ?? 0) + 1;

								return acc;
							},
							{
								Yes: 0,
								No: 0,
							},
						);

						return Object.keys(scores).map((score) => ({
							label: score,
							value: scores[score],
						}));
					}
					case CATEGORY_TYPES.Rating: {
						const scores = es.reduce(
							(acc, e) => {
								acc[e.value] = (acc[e.value] ?? 0) + 1;

								return acc;
							},
							{
								1: 0,
								2: 0,
								3: 0,
								4: 0,
								5: 0,
							},
						);

						return Object.keys(scores).map((score) => ({
							label: `${score} Stars`,
							value: scores[score],
						}));
					}
				}
			}
			case GRAPH_TYPES.Bar: {
				if (es.length === 0) {
					return [];
				}

				switch (cat.type) {
					default:
					case CATEGORY_TYPES.Number: {
						const scores = es.reduce(
							(acc, e) => {
								acc[e.value] = (acc[e.value] ?? 0) + 1;

								return acc;
							},
							{},
						);

						return Object.keys(scores).map((score) => ({
							label: score,
							x: score,
							y: scores[score],
						}));
					}
					case CATEGORY_TYPES.YesNo: {
						const scores = es.reduce(
							(acc, e) => {
								acc[e.value] = (acc[e.value] ?? 0) + 1;

								return acc;
							},
							{
								Yes: 0,
								No: 0,
							},
						);

						return Object.keys(scores).map((score) => ({
							label: score,
							x: score,
							y: scores[score],
						}));
					}
					case CATEGORY_TYPES.Rating: {
						const scores = es.reduce(
							(acc, e) => {
								acc[e.value] = (acc[e.value] ?? 0) + 1;

								return acc;
							},
							{
								1: 0,
								2: 0,
								3: 0,
								4: 0,
								5: 0,
							},
						);

						return Object.keys(scores).map((score) => ({
							label: `${score} Stars`,
							x: `${score} Stars`,
							y: scores[score],
						}));
					}
				}
			}
		}
	}, [cat.type, range, cat.graph.type, timestamp]);

	const options = useMemo(() => {
		switch (cat.graph.type) {
			default:
			case GRAPH_TYPES.Time:
				return {
					scales: {
						xAxis: {
							min: range.start,
							max: range.end,
							type: "time",
							position: "bottom",
							axis: "x",
							adapters: {
								date: {
									time: {
										minUnit: "second",
									},
								},
							},
						},
						yAxis: {
							ticks: {
								precision: 0,
							},
							axis: "y",
							display: false,
							...(cat.type === CATEGORY_TYPES.Rating
								? {
									min: 1,
									max: 5,
									ticks: {
										precision: 0,
									},
									axis: "y",
									offset: true,
									display: true,
								}
								: {}),
							...(cat.type === CATEGORY_TYPES.YesNo
								? {
									labels: ["No", "Yes"],
									ticks: {
										precision: 0,
										callback: (value) => {
											return value === 0 ? "No" : "Yes";
										},
									},
									min: 0,
									max: 1,
									axis: "y",
									offset: true,
									display: true,
								}
								: {}),
						},
					},
					...(cat.type === CATEGORY_TYPES.YesNo
						? {
							plugins: {
								tooltip: {
									callbacks: {
										label(context) {
											return context.raw.label;
										},
									},
								},
							},
						}
						: {}),
				};
			case GRAPH_TYPES.Score:
				return {
					scales: {
						xAxis: {
							min: range.start,
							max: range.end,
							type: "time",
							position: "bottom",
							axis: "x",
							adapters: {
								date: {
									time: {
										minUnit: "second",
									},
								},
							},
						},
						yAxis: {
							min: 1,
							max: 5,
							ticks: {
								precision: 0,
							},
							axis: "y",
							offset: true,
						},
					},
				};
			case GRAPH_TYPES.Pie:
				return {};
			case GRAPH_TYPES.Bar:
				return {
					scales: {
						yAxis: {
							ticks: {
								precision: 0,
							},
						},
					},
				};
		}
	}, [cat.graph.type, range]);

	const label = useMemo(() => {
		switch (cat.type) {
			default:
				return "Value";
			case CATEGORY_TYPES.Rating:
				return "Rating";
		}
	}, [cat.type]);

	const labels = useMemo(() => {
		switch (cat.graph.type) {
			default:
				return ["Value"];
			case GRAPH_TYPES.Pie:
				return data.map((datum) => datum.label);
			case GRAPH_TYPES.Bar:
				return data.map((datum) => datum.label);
		}
	}, [cat.graph.type, data]);

	const colors = useMemo(() => {
		switch (cat.graph.type) {
			default:
				return ["#81a1c1"];
			case GRAPH_TYPES.Time:
				return ["#81a1c1"];
			case GRAPH_TYPES.Pie:
			case GRAPH_TYPES.Bar:
				return ["#5E81AC", "#6991B5", "#73A1BE", "#7EB1C7", "#88C0D0"];
		}
	}, [cat.graph.type]);

	const handleFidelityChange = (e) => {
		category.update(
			{ id: cat.id },
			{
				graph: {
					fidelity: e.target.value,
				},
			},
		);

		onUpdate();
	};

	const handlePrevious = () => {
		switch (cat.graph.fidelity) {
			default:
			case GRAPH_FIDELITY.Week:
				setTimestamp((prev) => subDays(prev, 7));
				break;
			case GRAPH_FIDELITY.Day:
				setTimestamp((prev) => subDays(prev, 1));
				break;
		}
	};

	const handleNext = () => {
		switch (cat.graph.fidelity) {
			default:
			case GRAPH_FIDELITY.Week:
				setTimestamp((prev) => addDays(prev, 7));
				break;
			case GRAPH_FIDELITY.Day:
				setTimestamp((prev) => addDays(prev, 1));
				break;
		}
	};

	const renderTimespan = () => {
		switch (cat.graph.fidelity) {
			default:
			case GRAPH_FIDELITY.Week:
				return `${format(range.start, "MMMM do, yyyy")} – ${format(
					range.end,
					"MMMM do, yyyy",
				)}`;
			case GRAPH_FIDELITY.Day:
				return format(timestamp, "MMMM do, yyyy");
		}
	};

	return (
		<Card class={style.card}>
			<h2>{cat.name}</h2>
			<div class={style.timespan}>{renderTimespan()}</div>
			<div class={style.actions}>
				<Button onClick={handlePrevious}>
					<ArrowLeft />
				</Button>
				<IconRadio
					name={`category-fidelity-${cat.id}`}
					value={cat.graph.fidelity}
					onChange={handleFidelityChange}
					options={[
						{
							icon: <Sun />,
							name: "Day",
							value: GRAPH_FIDELITY.Day,
						},
						{
							icon: <Calendar />,
							name: "Week",
							value: GRAPH_FIDELITY.Week,
						},
					]}
				/>
				<Button onClick={handleNext}>
					<ArrowRight />
				</Button>
			</div>

			<Chart
				class={style.chart}
				range={range}
				options={options}
				data={data}
				type={cat.graph.type}
				label={label}
				labels={labels}
				colors={colors}
			/>
		</Card>
	);
};

const Graph = () => {
	const [forcedUpdate, forceUpdate] = useForceUpdate();

	const categories = useMemo(() => {
		return category.findMany().sort((a, b) => a.order > b.order);
	}, [forcedUpdate]);

	return (
		<div class={style.graph}>
			<h1>træk.app</h1>
			{categories.map((cat) =>
				cat.type === CATEGORY_TYPES.Text ? null : (
					<CategoryGraph key={cat.id} category={cat} onUpdate={forceUpdate} />
				),
			)}
		</div>
	);
};

export default Graph;
