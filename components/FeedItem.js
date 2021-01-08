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
		this.contentFrame = React.createRef();
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
		fetch(`${this.props.serverHost}/feed/seen/${id}`, { method: 'PUT' });
	}

	handleScroll = () => {
		if (this.shouldMark(this.feedItemBody)) {
			window.removeEventListener('scroll', this.handleScroll);
			this.markSeen(this.props.item.id);
			this.setState({ showMe: false });
		}
	}

	onIframeChange() {
		if (!this.contentFrame) return;
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
							<div className={`${styles.metaData} ${styles.titleMeta}`}>
								<span>{item.source}</span>
								<span>{new URL(item.target).hostname.replace('www.', '')}</span>
							</div>
						</h1>

					</div>
					<div className={styles.metaData}>
						<span>{item.age}</span>
						{isReddit(item.canonicalURL) ? <span><a href={cachedReddit(item.canonicalURL)} target="_blank">Removeddit</a></span> : ``}
						{item.target ? <span><a href={item.target} target="_blank">Target</a></span> : ``}
					</div>

					<div onClick={() => this.toggle()} className={styles.showContent}>
						{!showMe ? `Show Content` : `Hide Content`}
					</div>

					<div className={styles.content} align="center">
						{showMe ? getContent(item) : ``}
					</div>
				</div>
			</div>
		)
	}
}

const imageRE = /\.jpg|\.png/

function cachedReddit(url) {
	let re = /^https:\/\/(old|www).reddit.com/;
	return url.replace(re, 'https://www.removeddit.com');
}

function isReddit(url) {
	return /(old|www|i|v).reddit.com|v.redd.it/.test(new URL(url).hostname)
}

function parseReddit(item) {
	let linkRE = /<a href="([^"]+)">\[link\]/;

	if (linkRE.test(item.content)) {
		const matches = item.content.match(linkRE);
		if (!/v.redd.it/.test(matches[1])) {
			item.target = matches[1];
		}
	}

	switch (true) {
		case imageRE.test(item.target):
			item.type = "Picture"
			item.imageURL = item.target;
			break;
	}

	return item
}

function getContent(item) {
	switch(true) {
		case imageRE.test(item.target):
			return <img src={item.target} />
		default:
			let sandbox = false
			if (isReddit(item.target)) {
				sandbox = true
			}

			return <iframe className={styles.contentFrame} src={"http://localhost:4080/proxy/url/" + encodeURIComponent(item.target)} sandbox={sandbox ? `` : `allow-forms allow-scripts`} />
	}
}

export default FeedItem