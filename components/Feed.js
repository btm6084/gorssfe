import FeedItem from "../components/FeedItem";
import React, { Component } from 'react';
import styles from './Feed.module.scss'
import delve from 'dlv';

class Feed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			feed: {},
			count: 0,
			error: null,
		}

		this.queryRE = /q=([^&=]+)/
		this.searchInput = React.createRef();
	}

	componentDidMount() {
		this.fetchFeed(this.props.serverHost);
	}

	doSearch(e) {
		if (e.keyCode !== 13) {
			return;
		}

		let l = window.location;
		let href = `${l.protocol}//${l.host}?q=${this.searchInput.current.value}`
		window.location.href = href;
		e.preventDefault();
	}

	async fetchFeed(host) {
		let s = delve(window, 'location.search', '');
		let href = `${host}/feed/`

		if (this.queryRE.test(s)) {
			href = `${host}/feed/search/?q=${s.match(this.queryRE)[1]}`
		}

		try {
			const res = await fetch(href);

			if (res.status === 404) {
				this.setState({ feed: [], count: 0, loading: false, error: "No results found." });
				return;
			}

			if (parseInt(res.status / 200, 10) !== 1) {
				console.error(res);
				this.setState({ feed: [], count: 0, loading: false, error: "A critical error has occured." });
				return;
			}

			const feed = await res.json();
			if (feed) {
				this.setState({ feed: feed.result, count: feed.total, loading: false });
			}
		} catch (e) {
			this.setState({ error: e });
			console.error(e);
		}
	}

	async fetchTotal(host) {
		try {
			const res = await fetch(`${host}/feed/unread?cacheBust=${Math.round(new Date().getTime() / 1000)}`);
			const feed = await res.json();
			this.setState({ count: feed.total });
		} catch (e) {
			console.error(e);
		}
	}

	onMarkSeen = () => {
		this.fetchTotal(this.props.serverHost);
	}

	render() {
		const { feed, count, loading, error } = this.state;
		const { serverHost } = this.props;

		return (
			<div>
				<div className={styles.header}>
					<span className={styles.label}>GoRSS Feed Reader! Unread: {count}</span>
					<span className={styles.search}>
						Search: <input type="text" name="q" ref={this.searchInput} onKeyDown={(e) => this.doSearch(e)}></input>
					</span>
				</div>

				<div className={styles.mainBody}>
					{
						error ? error.toString() :
							loading ?
								`Loading`
								:
								feed.map((item) => (
									<FeedItem item={item} serverHost={serverHost} onMarkSeen={this.onMarkSeen} key={item.id} />
								))
					}
				</div>
				<div className={styles.reloadButton} onClick={() => window.location.reload()}>Reload</div>
				<div className={styles.spacer}></div>
				<div className={styles.reloadButton} onClick={() => window.location.reload()}>Reload</div>
			</div>
		)
	}
}

export default Feed
