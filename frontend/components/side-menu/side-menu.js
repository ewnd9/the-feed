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
  onClick(index) {
    const category = this.state.items[index];

    if (category.unseen === true) {
      api.putCategorySeen(category)
        .then(() => {
          this.setState({ items: [
            ...this.state.items.slice(0, index),
            {
              ...category,
              unseen: false
            },
            ...this.state.items.slice(index + 1)
          ]});
        });
    }
  },
  render: function() {
    return (
      <ul className={styles.sideMenu}>
        {
          this.state.items.map((category, index) => {
            const { name, unseen } = category;

            return (
              <li key={index} className={styles.sideMenuItem}>
                <CategoryLink category={name} onClick={this.onClick.bind(this, index)} />

                { unseen && (
                  <span className={styles.unseenBadge}>●</span>
                )}
              </li>
            );
          })
        }
      </ul>
    );
  }
});
