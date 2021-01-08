import FeedItem from "../components/FeedItem";
import React from 'react';
import styles from './index.module.scss'


function HomePage({ feed }) {
	// Effectively componentDidMount
	React.useEffect(() => {
		window.setTimeout(() => { window.scrollTo(0, 0); }, 250);
		window.addEventListener("unload", function(event) { window.scrollTo(0, 0); });
	})

	const serverHost = 'https://dailies.benjaminmaynor.com/api';

	return (
		<div className={styles.mainBody}>
			{feed.map((item) => (
				<FeedItem item={item} serverHost={serverHost} key={item.id} />
			))}
		</div>
	)
}

export async function getServerSideProps() {
	const serverHost = "http://localhost:4080";
	const res = await fetch(`${serverHost}/feed`);
	const feed = await res.json();

	return {
		props: {
			feed: feed.result,
		},
	};
}

export default HomePage
