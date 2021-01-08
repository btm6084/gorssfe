import FeedItem from "../components/FeedItem";
import React from 'react';
import styles from './index.module.scss'


function HomePage({ feed, serverHost }) {
	// Effectively componentDidMount
	React.useEffect(() => {
		window.setTimeout(() => { window.scrollTo(0, 0); }, 250);
	})

	return (
		<div className={styles.mainBody}>
			{feed.map((item) => (
				<FeedItem item={item} serverHost={serverHost} key={item.id} />
			))}
		</div>
	)
}

export async function getStaticProps() {
	const serverHost = "http://localhost:4080";
	const res = await fetch(`${serverHost}/feed`);
	const feed = await res.json();

	return {
		props: {
			feed: feed.result,
			serverHost: serverHost,
		},
	};
}

export default HomePage