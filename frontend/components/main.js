import React from 'react';

import Header from './header';
import ItemList from './item-list';
import SideMenu from './/side-menu';

export default React.createClass({
  render: function() {
    return (
      <div className="container">
        <Header />
        <div className="delimeter"></div>
        <div className="main">
          <aside>
            <SideMenu />
          </aside>

          {this.props.children}
        </div>
      </div>
    );
	}
});
