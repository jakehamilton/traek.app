import { h } from "preact";
import { Router } from "preact-router";

import Header from "./header";
import Store from "../providers/Store";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Edit from "../routes/edit";
import Settings from "../routes/settings";
import Graph from "../routes/graph";

const App = () => (
	<Store>
		<div id="app">
			<Header />
			<Router>
				<Home path="/" />
				<Graph path="/graph" />
				<Edit path="/edit" />
				<Settings path="/settings" />
			</Router>
		</div>
	</Store>
);

export default App;
