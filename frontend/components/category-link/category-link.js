import React from 'react';
import classNames from 'classnames';

import { Link } from 'react-router';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  routing: state.routing
});

// @TODO it's not recommended to connect presenation level components to redux
export default connect(mapStateToProps)(React.createClass({
  render: function() {
    const category = this.props.category;
    const path = `/r/${category.toLowerCase()}`;

    const linkClass = classNames({
      category: true,
      active: this.props.routing.path === path
    });

    return (
      <Link className={linkClass}
            key={category}
            to={path}>
        {category}
      </Link>
    );
	}
}));
