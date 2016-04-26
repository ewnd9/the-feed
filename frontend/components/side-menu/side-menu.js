import React from 'react';
import styles from './style.css';

import { connect } from 'react-redux';
import { fetchCategories, markCategoryAsSeen } from '../../actions/categories-actions';

import CategoryLink from './../category-link/category-link';

function mapStateToProps(state) {
  const { categories } = state;

  return {
    categories
  };
}

export default connect(mapStateToProps)(React.createClass({
  getInitialState: () => ({ items: [] }),
  componentDidMount: function() {
    this.props.dispatch(fetchCategories());
  },
  onClick(index) {
    const category = this.props.categories.categories[index];

    if (category.unseen === true) {
      this.props.dispatch(markCategoryAsSeen(index));
    }
  },
  render: function() {
    return (
      <ul className={styles.sideMenu}>
        {
          this.props.categories.categories.map((category, index) => {
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
}));
