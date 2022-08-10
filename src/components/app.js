import { h } from "preact";
import { Router } from "preact-router";

import Header from "./header";
import Store from "../providers/Store";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Edit from "../routes/edit";
import Settings from "../routes/settings";

const App = () => (
	<Store>
		<div id="app">
			<Header />
			<Router>
				<Home path="/" />
				<Edit path="/edit" />
				<Settings path="/settings" />
			</Router>
		</div>
	</Store>
);

export default App;
