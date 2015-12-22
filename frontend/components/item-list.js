import fetch from 'isomorphic-fetch';

import React from 'react';

import moment from 'moment';
import classNames from 'classnames';

export default React.createClass({
  getInitialState: () => ({ items: [], page: 1 }),
  getItems: function(page) {
    fetch(baseUrl + '/api/v1/items?page=' + page)
      .then((response) => {
        return response.json();
      })
      .then((_items) => {
        this.setState({
          items: [...this.state.items, ..._items],
          page
        });
      });
  },
  componentDidMount: function() {
    this.getItems(this.state.page);
  },
  handleClick: function(page) {
    this.getItems(page);
  },
  handleHover: function(index) {
    const item = this.state.items[index];

    if (item.seen) {
      return;
    }

    this.setState({
      ...this.state,
      items: [
        ...this.state.items.slice(0, index),
        {
          ...item,
          seen: true
        },
        ...this.state.items.slice(index + 1)
      ]
    });

    fetch(baseUrl + '/api/v1/items/' + item._id, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        seen: true
      })
    });
  },
  render: function() {
    return (
			<div className="content">
				<div>
					{this.state.items.map((result, index) => {
						const fromNow = moment(result.createdAt).fromNow();
						let title;

						if (typeof result.title === 'string') {
							title = [[result.url, result.title]];
						} else {
							title = result.title;
						}

						const itemClass = classNames({
							'item': true,
							'item-seen': result.seen,
							'item-unseen': !result.seen
						});

						return (
							<div className={itemClass}
									 key={ result._id }
									 onMouseEnter={this.handleHover.bind(this, index)}
									 onFocus={this.handleHover.bind(this, index)}
									 tabIndex={index + 1}>
								<div>
									<span>{ result.meta.task }:</span>{' '}
									{
										title.map((title, i) => {
											if (typeof title === 'string') {
												return (<span key={i}>{ title }{' '}</span>);
											} else {
												return (<span key={i}><a href={ title[0] } target="_blank">{ title[1] }</a>{' '}</span>);
											}
										})
									}
								</div>
								<div>{ fromNow }</div>
							</div>
						);
					})}
				</div>
				<div className="load-more-holder">
					<a onClick={this.handleClick.bind(this, this.state.page + 1)}>Load More</a>
				</div>
			</div>
    );
	}
});
