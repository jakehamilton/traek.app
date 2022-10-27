import cn from "classnames";
import style from "./style.css";
import { useEffect, useRef } from "preact/hooks";
import { GRAPH_TYPES } from "../../lib/store";
import {
	Chart as ChartJS,
	ArcElement,
	LineElement,
	BarElement,
	PointElement,
	BarController,
	BubbleController,
	DoughnutController,
	LineController,
	PieController,
	PolarAreaController,
	RadarController,
	ScatterController,
	CategoryScale,
	LinearScale,
	LogarithmicScale,
	RadialLinearScale,
	TimeScale,
	TimeSeriesScale,
	Decimation,
	Filler,
	Legend,
	Title,
	Tooltip,
	SubTitle,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
	ArcElement,
	LineElement,
	BarElement,
	PointElement,
	BarController,
	BubbleController,
	DoughnutController,
	LineController,
	PieController,
	PolarAreaController,
	RadarController,
	ScatterController,
	CategoryScale,
	LinearScale,
	LogarithmicScale,
	RadialLinearScale,
	TimeScale,
	TimeSeriesScale,
	Decimation,
	Filler,
	Legend,
	Title,
	Tooltip,
	SubTitle,
);

const getChartJSType = (type) => {
	switch (type) {
		default:
		case GRAPH_TYPES.Time:
			return "line";
		case GRAPH_TYPES.Bar:
			return "bar";
		case GRAPH_TYPES.Pie:
			return "pie";
	}
};

const Chart = ({
	class: className,
	type = "line",
	range,
	options,
	data,
	labels,
	label,
	colors = [
		"#81a1c1",
		"#5e81ac",
		"#ebcb8b",
		"#a3be8c",
		"#b48ead",
		"#8fbcbb",
		"#bf616a",
	],
	...props
}) => {
	const canvasRef = useRef(null);

	useEffect(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext("2d");
			const chart = new ChartJS(ctx, {
				type: getChartJSType(type),
				data: {
					datasets: [
						{
							label,
							data,
							backgroundColor: colors,
						},
					],
					labels,
				},
				options: {
					color: "#81a1c1",
					font: {
						family: "Nunito",
						weight: "700",
					},
					animation: false,
					...options,
				},
			});

			return () => {
				chart.destroy();
			};
		}
	}, [canvasRef.current, range, data, options]);

	return (
		<div {...props} class={cn(className, style.Chart)}>
			<canvas class={style.canvas} ref={canvasRef} />
			{data.length === 0 ? <div class={style.noData}>No Data</div> : null}
		</div>
	);
};

export default Chart;
