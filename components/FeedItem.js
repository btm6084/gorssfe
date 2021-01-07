import React, { Component } from 'react';
import styles from './FeedItem.module.scss'

class FeedItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMe: false,
		}

		this.feedItemBody = React.createRef();
	}

	toggle() {
		this.setState({ showMe: !this.state.showMe });
	}

	aboveTheFold(ref, offset = 0) {
		if (!ref) return false;
		const bottom = ref.current.getBoundingClientRect().bottom;
		return bottom < 0;
	}

	markSeen = (id) => {
		fetch(`http://localhost:4080/feed/seen/${id}`, { method: 'PUT' });
	}

	handleScroll = () => {
		if (this.aboveTheFold(this.feedItemBody)) {
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

	isReddit = (url) => {
		let re = /^https:\/\/(old|www).reddit.com/;
		return re.test(url);
	}

	cachedReddit = (url) => {
		let re = /^https:\/\/(old|www).reddit.com/;
		return url.replace(re, 'https://www.removeddit.com');
	}

	render() {
		const { showMe } = this.state;
		const { item } = this.props;

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
						{this.isReddit(item.canonicalURL) ? <span><a href={this.cachedReddit(item.canonicalURL)} target="_blank">Removeddit</a></span> : ``}
					</div>

					<div onClick={() => this.toggle()} className={styles.showContent}>
						{!showMe ? `Show Content` : `Hide Content`}
					</div>

					<div className={styles.content} align="center">
						{showMe ? <iframe className={styles.contentFrame} src={"http://localhost:4080/proxy/" + item.id} sandbox=""></iframe> : ``}
					</div>
				</div>
			</div>
		)
	}
}

export default FeedItem