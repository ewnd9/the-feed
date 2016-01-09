import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
  render: function() {
    const categories = [
      'Clicked',
      'Seen'
    ];

		return (
			<header>
				<div className="logo">
					<Link to="/">the-feed</Link>
				</div>
				<div className="menu">
					{
            categories.map(category => {
              return (
                <Link className={this.props.categoryId === category.toLowerCase() && 'active'}
                      key={category}
                      to={`/r/${category.toLowerCase()}`}>
                  {category}
                </Link>
              )
            })
          }
				</div>
			</header>
		);
	}
});
