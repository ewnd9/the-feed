import React from 'react';

export default React.createClass({
  handleClick: function(category) {
    this.props.setCategoryId(category);
  },
  render: function() {
    const categories = [
      'Clicked',
      'Seen'
    ];

		return (
			<header>
				<div className="logo">
					<a href="/">the-feed</a>
				</div>
				<div className="menu">
					{
            categories.map(category => {
              return (
                <a className={this.props.categoryId === category.toLowerCase() && 'active'}
      						 onClick={this.handleClick.bind(this, category.toLowerCase())}
                   key={category}>
                  {category}
                </a>
              )
            })
          }
				</div>
			</header>
		);
	}
});
