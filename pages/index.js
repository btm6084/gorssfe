import FeedItem from "../components/FeedItem";

function HomePage({ feed }) {
	console.log(feed)

	return (
		<div>
			{feed.map((item) => (
				<FeedItem item={item} key={item.id} />
			))}
		</div>
	)
}

export async function getStaticProps() {
	const res = await fetch('http://localhost:4080/feed/');
	const feed = await res.json();

	return {
		props: {
			feed: feed.result,
		},
	};
}

export default HomePage