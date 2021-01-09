import FeedItem from "../components/FeedItem";
import React, { Component } from 'react';
import styles from './Feed.module.scss'

class Feed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			feed: {},
		}
	}

	componentDidMount() {
		this.fetchFeed(this.props.serverHost);
	}

	async fetchFeedAsync(host) {
		try {
			const res = await fetch(`${host}/feed`);
			const feed = await res.json();
			this.setState({ feed: feed.result, loading: false });
		} catch (e) {
			this.setState({ error: e });
			console.error(e);
		}
	}

	fetchFeed = this.fetchFeedAsync;

	render() {
		const { feed, loading, error } = this.state;
		const { serverHost } = this.props;

		return (
			<div className={styles.mainBody}>
				{
					loading ?
						error ? error.toString() : `Loading`
						:
						feed.map((item) => (
							<FeedItem item={item} serverHost={serverHost} key={item.id} />
						))
				}
			</div>
		)
	}
}

export default Feed
