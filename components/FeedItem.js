import React, { useState } from 'react';
import styles from './FeedItem.module.scss'
import Link from 'next/link'

function FeedItem({item}) {
	const [showMe, setShowMe] = useState(false);

	function toggle(){
		setShowMe(!showMe);
	}

	return (
		<div key={item.id} className={styles.feedItem}>
			<Link href={item.canonicalURL}>
				<h1 className={styles.title}>
					{item.title}
				</h1>
			</Link>
			<div className={styles.header}>
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
	)
}

export default FeedItem