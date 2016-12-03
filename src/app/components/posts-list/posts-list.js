import React from 'react';

import Swipeable from 'react-swipeable';

import t from 'tcomb';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import { propTypes } from 'tcomb-react';

import {
  fetchPosts,
  markPostAsSeen,
  markPostAsClicked
} from './../../actions/posts-actions';

import Post from './posts-list-item/posts-list-item';
import { schema } from '../../reducers/posts-reducer';
import { reactRouterPropTypes } from '../../../schema';

const InfiniteScroll = require('react-infinite-scroll')(React);

const hooks = {
  fetch: ({ dispatch, params }) => dispatch(fetchPosts(params.categoryId || 'unseen'))
};

const mapStateToProps = ({ posts }) => ({ posts });
const mapDispatchToProps = { fetchPosts, markPostAsSeen, markPostAsClicked };

const PostsList = React.createClass({
  propTypes: propTypes({
    ...reactRouterPropTypes,
    children: t.Nil,
    posts: schema,

    fetchPosts: t.Function,
    markPostAsSeen: t.Function,
    markPostAsClicked: t.Function
  }),
  loadMore() {
    const { params, posts: { posts }, fetchPosts } = this.props;

    const categoryId = params.categoryId || 'unseen';

    const id = posts.length > 0 ? posts[posts.length - 1]._id : undefined;
    const date = posts.length > 0 ? posts[posts.length - 1].createdAt : undefined;

    console.log('more');

    return fetchPosts(categoryId, id, date);
  },
  handleHover(index) {
    const { posts: { posts }, markPostAsSeen } = this.props;
    const post = posts[index];

    if (!post.meta.seen) {
      markPostAsSeen(index, post);
    }
  },
  handleLinkClick(index) {
    const { posts: { posts }, markPostAsClicked } = this.props;
    const post = posts[index];

    if (!post.meta.clicked) {
      markPostAsClicked(index, post);
    }
  },
  render() {
    const { posts: { isFetching, hasMore, posts } } = this.props;

    return (
      <div>
        <InfiniteScroll
            loadMore={this.loadMore}
            hasMore={!isFetching && hasMore}
            loader={<div className="loader">Loading ...</div>}>
          {
            posts.map((post, index) => (
              <Swipeable key={post._id} onSwipingLeft={this.handleHover.bind(this, index)}>
                <Post
                    post={post}
                    index={index}
                    handleLinkClick={this.handleLinkClick}
                    handleHover={this.handleHover} />
              </Swipeable>
            ))
          }
        </InfiniteScroll>
      </div>
    );
  }
});

export default provideHooks(hooks)(connect(mapStateToProps, mapDispatchToProps)(PostsList));
