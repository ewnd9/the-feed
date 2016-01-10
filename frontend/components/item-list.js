import fetch from 'isomorphic-fetch';

import React from 'react';
import { connect } from 'react-redux';

import * as api from './../api';
import { fetchPosts, markPostAsSeen, markPostAsClicked } from './../actions';
import Item from './item';

const InfiniteScroll = require('react-infinite-scroll')(React);

function mapStateToProps(state) {
  const { posts } = state;

  return {
    posts
  };
}

export default connect(mapStateToProps)(React.createClass({
  componentWillReceiveProps: function(nextProps) {
    const categoryId = this.props.params.categoryId || 'unseen';
    const { dispatch } = this.props;

    if (this.props.params.categoryId !== nextProps.params.categoryId) {
      dispatch(fetchPosts(nextProps.params.categoryId, 1));
    }
  },
  loadMore: function() {
    const categoryId = this.props.params.categoryId || 'unseen';
    const { dispatch } = this.props;

    return dispatch(fetchPosts(categoryId, this.props.posts.page + 1));
  },
  handleHover: function(index) {
    const item = this.props.posts.items[index];
    const { dispatch } = this.props;

    if (!item.meta.seen) {
      dispatch(markPostAsSeen(index, item));
    }
  },
  handleLinkClick: function(index, link) {
    const item = this.props.posts.items[index];
    const { dispatch } = this.props;

    if (!item.meta.clicked) {
      dispatch(markPostAsClicked(index, item));
    }
  },
  render: function() {
    return (
			<div className="content">
        <InfiniteScroll
            loadMore={this.loadMore}
            hasMore={!this.props.posts.isFetching && this.props.posts.hasMore}
            loader={<div className="loader">Loading ...</div>}>
          {
            this.props.posts.items.map((result, index) => {
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
}));
