import React, { Component } from 'react';
import styles from './FeedItem.module.scss'

class FeedItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMe: false,
			bottom: 0,
		}

		this.feedItemBody = React.createRef();
	}

	toggle() {
		this.setState({ showMe: !this.state.showMe });
	}

	shouldMark(ref, offset = 0) {
		if (!ref) return false;
		const oldBottom = this.state.bottom;
		this.state.bottom = ref.current.getBoundingClientRect().bottom;

		// Don't mark if we're scrolling up.
		if (oldBottom <= 0 || oldBottom < this.state.bottom) {
			return false;
		}

		return this.state.bottom < 0;
	}

	markSeen = (id) => {
		fetch(`http://localhost:4080/feed/seen/${id}`, { method: 'PUT' });
	}

	handleScroll = () => {
		if (this.shouldMark(this.feedItemBody)) {
			window.removeEventListener('scroll', this.handleScroll);
			this.markSeen(this.props.item.id);
		}
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	render() {
		const { showMe } = this.state;
		let { item } = this.props;

		if (isReddit(item.canonicalURL)) {
			item = parseReddit(item)
		}

		return (
			<div key={item.id} className={styles.feedItem} ref={this.feedItemBody}>
				<div className={styles.body}>
					<div className={styles.flexContainer}>
						<div className={`${styles.titleImage} ${item.imageURL ? `` : styles.noImage}`}>
							<img src={item.imageURL ? item.imageURL : `/defaultImage.png`}></img>
						</div>
						<h1 className={styles.title}>
							<a href={item.canonicalURL} className={styles.titleLink} target="_blank">
								{item.title}
							</a>
						</h1>

					</div>
					<div className={styles.metaData}>
						<span>{item.source}</span>
						<span>{item.age}</span>
						{isReddit(item.canonicalURL) ? <span><a href={cachedReddit(item.canonicalURL)} target="_blank">Removeddit</a></span> : ``}
						{item.target ? <span><a href={item.target} target="_blank">Target</a></span> : ``}
					</div>

					<div onClick={() => this.toggle()} className={styles.showContent}>
						{!showMe ? `Show Content` : `Hide Content`}
					</div>

					<div className={styles.content} align="center">
						{showMe ? <iframe className={styles.contentFrame} src={"http://localhost:4080/proxy/url/" + encodeURIComponent(item.target)} sandbox=""></iframe> : ``}
					</div>
				</div>
			</div>
		)
	}
}

function cachedReddit(url) {
	let re = /^https:\/\/(old|www).reddit.com/;
	return url.replace(re, 'https://www.removeddit.com');
}

function isReddit(url) {
	let re = /^https:\/\/(old|www).reddit.com/;
	return re.test(url);
}

function parseReddit(item) {
	let linkRE = /<a href="([^"]+)">\[link\]/;

	if (linkRE.test(item.content)) {
		const matches = item.content.match(linkRE);
		item.target = matches[1];
	}

	return item
}

export default FeedItem