import { throttle } from "lodash";
import { h } from "preact";
import { BarChart2, Edit3, Home, PieChart, Settings } from "preact-feather";
import { Link } from "preact-router/match";
import { useEffect, useState } from "preact/hooks";
import style from "./style.css";

const checkIfMobile = () => {
	if (typeof window !== "undefined") {
		return matchMedia("screen and (max-width: 600px)").matches;
	}

	return false;
};

const Header = () => {
	const [isMobile, setIsMobile] = useState(checkIfMobile);

	useEffect(() => {
		const listener = throttle(() => {
			setIsMobile(checkIfMobile());
		}, 300);

		window.addEventListener("resize", listener);

		return () => {
			window.removeEventListener("resize", listener);
		};
	}, []);

	const iconSize = isMobile ? 24 : 16;

	return (
		<header class={style.header}>
			<h1>
				<Link href="/">træk.app</Link>
			</h1>
			<nav>
				<Link activeClassName={style.active} href="/">
					<Home size={iconSize} color="currentColor" />
				</Link>
				<Link activeClassName={style.active} href="/graph">
					<PieChart size={iconSize} color="currentColor" />
				</Link>
				<Link activeClassName={style.active} href="/edit">
					<Edit3 size={iconSize} color="currentColor" />
				</Link>
				<Link activeClassName={style.active} href="/settings">
					<Settings size={iconSize} color="currentColor" />
				</Link>
			</nav>
		</header>
	);
};

export default Header;
