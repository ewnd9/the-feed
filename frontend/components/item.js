import React from 'react';

import moment from 'moment';
import classNames from 'classnames';

export default React.createClass({
  render: function() {
		const result = this.props.item;
		const index = this.props.index;

		const fromNow = moment(result.createdAt).fromNow();

		let title;

		if (typeof result.title === 'string') {
			title = [[result.url, result.title]];
		} else {
			title = result.title;
		}

		const itemClass = classNames({
			'item': true,
			'item-seen': result.meta.seen,
			'item-unseen': !result.meta.seen
		});

		return (
			<div className={itemClass}
					 onMouseEnter={() => this.props.handleHover(index)}
					 onFocus={() => this.props.handleHover(index)}
					 tabIndex={index + 1}>
				<div>
					<span>{ result.meta.task }:</span>{' '}
					{
						title.map((title, i) => {
							if (typeof title === 'string') {
								return (<span key={i}>{ title }{' '}</span>);
							} else {
								return (
									<span key={i}>
										<a href={title[0]}
											 target="_blank"
											 onClick={() => this.props.handleLinkClick(index, title[0])}>
											{ title[1] }
										</a>
										{' '}
									</span>
								);
							}
						})
					}
				</div>
				<div>{ fromNow }</div>
			</div>
		);
	}
});
