import React from 'react';
import CategoryLink from './category-link';

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
                <CategoryLink category={category} />
							</div>
						);
					})
				}
			</div>
    );
	}
});
