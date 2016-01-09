import React from 'react';
import { Link } from 'react-router';
import CategoryLink from './category-link';

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
              return (<CategoryLink category={category} key={category} />);
            })
          }
				</div>
			</header>
		);
	}
});
