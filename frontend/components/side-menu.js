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
					this.state.items.map((result, index) => {
						return (
							<div key={index} className="side-menu-item">
								<a onClick={this.handleClick.bind(this, result)}>
									{result}
								</a>
							</div>
						);
					})
				}
			</div>
    );
	}
});
