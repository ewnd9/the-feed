import fetch from 'isomorphic-fetch';

import React from 'react';

import * as api from './../api';
import Item from './item';

const InfiniteScroll = require('react-infinite-scroll')(React);

export default React.createClass({
  getInitialState: () => ({ items: [], page: 0, hasMore: true }),
  getItems: function(id, page, clear = false) {
    return api
      .findByCategory(id, page)
      .then((_items) => {
        if (_items.length === 0) {
          this.setState({ hasMore: false })
        } else {
          this.setState({
            items: clear ? _items : [...this.state.items, ..._items],
            page
          });
        }
      });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ items: [], page: 0, hasMore: true });
    this.forceUpdate();
  },
  handleClick: function() {
    this.getItems(this.props.categoryId, this.state.page + 1);
  },
  handleHover: function(index) {
    const item = this.state.items[index];

    if (item.meta.seen) {
      return;
    }

    this.setState({
      ...this.state,
      items: [
        ...this.state.items.slice(0, index),
        {
          ...item,
          meta: {
            ...item.meta,
            seen: true
          }
        },
        ...this.state.items.slice(index + 1)
      ]
    });

    api.putSeen(item);
  },
  handleLinkClick: function(index, link) {
    const item = this.state.items[index];

    if (item.meta.clicked) {
      return;
    }

    this.setState({
      ...this.state,
      items: [
        ...this.state.items.slice(0, index),
        {
          ...item,
          meta: {
            ...item.meta,
            clicked: true
          }
        },
        ...this.state.items.slice(index + 1)
      ]
    });

    api.putClicked(item);
  },
  render: function() {
    return (
			<div className="content">
        <InfiniteScroll
            pageStart={0}
            loadMore={this.handleClick}
            hasMore={this.state.hasMore}
            loader={<div className="loader">Loading ...</div>}>
          {
            this.state.items.map((result, index) => {
  						return (<Item item={result}
                    index={index}
                    key={result._id}
                    handleLinkClick={this.handleLinkClick}
                    handleHover={this.handleHover} />);
  				  })
          }
        </InfiniteScroll>
			</div>
    );
	}
});
