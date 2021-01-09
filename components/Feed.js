import FeedItem from "../components/FeedItem";
import React, { Component } from 'react';
import styles from './Feed.module.scss'

class Feed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			feed: {},
			count: 0,
		}
	}

	componentDidMount() {
		this.fetchFeed(this.props.serverHost);
	}

	async fetchFeed(host) {
		try {
			const res = await fetch(`${host}/feed`);
			const feed = await res.json();
			this.setState({ feed: feed.result, count: feed.total, loading: false });
		} catch (e) {
			this.setState({ error: e });
			console.error(e);
		}
	}

	render() {
		const { feed, count, loading, error } = this.state;
		const { serverHost } = this.props;

		return (
			<div>
				<div className={styles.header}>GoRSS Feed Reader! Unread: {count}</div>
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
			</div>
		)
	}
}

export default Feed
