import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
  render: function() {
    const category = this.props.category;
    const path = `/r/${category.toLowerCase()}`;

    return (
      <Link className="category"
            activeClassName="active"
            key={category}
            to={path}>
        {category}
      </Link>
    );
  }
});
