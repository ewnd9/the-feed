import React from 'react';

export default React.createClass({
  handleClick: function(category) {
    this.props.setCategoryId(category);
  },
  render: function() {
		return (
			<header>
				<div className="logo">
					<a href="/">the-feed</a>
				</div>
				<div className="menu">
					<a>Clicked</a>
					<a className={this.props.categoryId === 'seen' && 'active'}
						 onClick={this.handleClick.bind(this, 'seen')}>
						Seen
					</a>
				</div>
			</header>
		);
	}
});
