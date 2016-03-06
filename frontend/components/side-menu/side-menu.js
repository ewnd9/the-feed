import React from 'react';
import styles from './style.css';

import CategoryLink from './../category-link/category-link';

import * as api from './../../api';

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
      <div className={styles.sideMenu}>
        {
          this.state.items.map((category, index) => {
            return (
              <div key={index} className={styles.sideMenuItem}>
                <CategoryLink category={category} />
              </div>
            );
          })
        }
      </div>
    );
  }
});
