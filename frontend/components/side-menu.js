import fetch from 'isomorphic-fetch';
import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

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
  render: function() {
    return (
			<div className="side-menu">
				{
					this.state.items.map((category, index) => {
						return (
							<div key={index} className="side-menu-item">
                <Link className={this.props.categoryId === category && 'active'}
                      to={`/r/${category}`}>
                  {category}
                </Link>
							</div>
						);
					})
				}
			</div>
    );
	}
});
