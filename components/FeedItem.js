import React, { useState } from 'react';
import styles from './FeedItem.module.scss'

function FeedItem({item}) {
	const [showMe, setShowMe] = useState(false);

	function toggle(){
		setShowMe(!showMe);
	}

	return (
		<div key={item.id} className={styles.feedItem}>
			<div className={styles.body}>
				<div className={styles.flexContainer}>
					<div class={styles.titleImage}>
						<img src={item.imageURL}></img>
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
				</div>

				<div onClick={toggle} className={styles.showContent}>
					{ !showMe ? `Show Content` : `Hide Content` }
				</div>

				<div className={styles.content} align="center">
					{ showMe ? <iframe className={styles.contentFrame} src={"http://localhost:4080/proxy/" + item.id} sandbox=""></iframe> : ``}
				</div>
			</div>
		</div>
	)
}

export default FeedItem