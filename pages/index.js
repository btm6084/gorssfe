import Feed from "../components/Feed";
import React from 'react';

function HomePage() {
	// Effectively componentDidMount
	React.useEffect(() => {
		window.setTimeout(() => { window.scrollTo(0, 0); }, 250);
		window.addEventListener("unload", function (event) { window.scrollTo(0, 0); });
	})

	const serverHost = 'https://dailies.benjaminmaynor.com/api';
	// const serverHost = 'http://localhost:4080';

	return (
		<Feed serverHost={serverHost} />
	)
}

export default HomePage
