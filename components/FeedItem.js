import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
import { TwitterTweetEmbed } from 'react-twitter-embed';
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
		if (this.props.onMarkSeen) {
			this.props.onMarkSeen();
		}

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
							<LazyLoad height={250} once >
								<img className={styles.titleImg} src={getThumbnail(item)}></img>
							</LazyLoad>
						</div>
						<h1 className={styles.title}>
							<a href={item.canonicalURL} className={styles.titleLink} target="_blank">
								{item.title}
							</a>
							<div className={`${styles.metaData} ${styles.titleMeta}`}>
								<span>{item.source}</span>
								<span>[{item.sourceCount}]</span>
								<span>{new URL(item.target).hostname.replace('www.', '')}</span>
								{item.subReddit ? <span>/r/{item.subReddit}</span> : ``}
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
						{showMe ? getContent(item, this.props.serverHost) : ``}
					</div>
				</div>
			</div>
		)
	}
}

const imageRE = /\.jpg|\.png/
const youtubeRE = /youtu.be\/(.+)/
const youtubeRE2 = /youtube.com\/watch\?v=([^&]+)/
const redditVideoRE = /v.redd.it/
const imgurImageUrl = /^https:\/\/imgur.com\/[^/]+$/
const twitterRE = new RegExp('https://twitter.com/[^/]+/status/([^/?]+)')

function cachedReddit(url) {
	let re = /^https:\/\/(old|www).reddit.com/;
	return url.replace(re, 'https://www.removeddit.com');
}

function isReddit(url) {
	return /(old|www|i|v).reddit.com|v.redd.it/.test(new URL(url).hostname)
}

function isAPNews(url) {
	return /^apnews.com$/.test(new URL(url).hostname)
}

function isCNBC(url) {
	return /^(www.)?cnbc.com$/.test(new URL(url).hostname)
}

function isArstechnica(url) {
	return /arstechnica.com/.test(new URL(url).hostname)
}

function parseReddit(item) {
	let linkRE = /<a href="([^"]+)">\[link\]/;

	if (linkRE.test(item.content)) {
		const matches = item.content.match(linkRE);
		item.target = matches[1];
	}

	if (item.target[0] === '/') {
		item.target = 'https://old.reddit.com' + item.target;
	}

	switch (true) {
		case imageRE.test(item.target):
			item.type = "Picture"
			item.imageURL = item.target;
			break;
	}

	const subRedditRE = new RegExp('/r/([^/]+)')
	if (subRedditRE.test(item.canonicalURL)) {
		const matches = item.canonicalURL.match(subRedditRE);
		item.subReddit = matches[1];
	}

	return item
}

function getContent(item, serverHost) {
	let match;
	switch (true) {
		case imgurImageUrl.test(item.target):
			item.target = item.target.replace('imgur.com', 'i.imgur.com') + '.jpg'
			return <img src={item.target} />
		case imageRE.test(item.target):
			return <img src={item.target} />
		case twitterRE.test(item.target):
			match = item.target.match(twitterRE)
			return <div className={styles.tweetEmbed}><TwitterTweetEmbed tweetId={match[1]} /></div>
		case youtubeRE.test(item.target):
			match = item.target.match(youtubeRE)
			return <iframe src={`https://www.youtube.com/embed/${match[1]}?feature=oembed`} className={styles.contentFrame} frameborder='0' allowfullscreen=""></iframe>
		case youtubeRE2.test(item.target):
			match = item.target.match(youtubeRE2)
			return <iframe src={`https://www.youtube.com/embed/${match[1]}?feature=oembed`} className={styles.contentFrame} frameborder='0' allowfullscreen=""></iframe>
		case redditVideoRE.test(item.target):
			return <iframe className={styles.videoFrame} src={`${serverHost}/dashplayer/url/?url=${encodeURIComponent(item.target)}`} />
		default:
			let sandbox = false
			if (isReddit(item.target) || isAPNews(item.target) || isCNBC(item.target)) {
				sandbox = true
			}

			return <iframe className={styles.contentFrame} src={`${serverHost}/proxy/url/?url=${encodeURIComponent(item.target)}`} sandbox={sandbox ? `` : `allow-forms allow-scripts`} />
	}
}

function getThumbnail(item) {
	if (item.imageURL) {
		return item.imageURL;
	}

	if (isReddit(item.target)) {
		return `/redditDefault.svg`;
	}

	if (isArstechnica(item.target)) {
		return `/arstechnicaDefault.png`;
	}

	return `/defaultImage.png`;
}

export default FeedItem
