import FeedItem from "../components/FeedItem";
import React from 'react';

function HomePage({ feed }) {
	// Effectively componentDidMount
	React.useEffect(() => {
		window.setTimeout(() => { window.scrollTo(0, 0); }, 250);
	})

	return (
		<div>
			{feed.map((item) => (
				<FeedItem item={item} key={item.id} />
			))}
		</div>
	)
}

export async function getStaticProps() {
	const res = await fetch('http://localhost:4080/feed');
	const feed = await res.json();

	return {
		props: {
			feed: feed.result,
		},
	};
}

export default HomePage