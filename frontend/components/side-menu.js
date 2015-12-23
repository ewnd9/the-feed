import fetch from 'isomorphic-fetch';
import React from 'react';
import classNames from 'classnames';

import * as api from './../api';

export default React.createClass({
  getInitialState: () => ({ items: [] }),
  getItems: function(page) {
    api
      .findCategories()
      .then((items) => {
        this.setState({ items });
      });
  },
  componentDidMount: function() {
    this.getItems(this.state.page);
  },
  handleClick: function(category) {
    this.props.setCategoryId(category);
  },
  render: function() {
    return (
			<div className="side-menu">
				{
					this.state.items.map((category, index) => {
						return (
							<div key={index} className="side-menu-item">
								<a className={this.props.categoryId === category && 'active'}
                   onClick={this.handleClick.bind(this, category)}>
									{category}
								</a>
							</div>
						);
					})
				}
			</div>
    );
	}
});
