import React from 'react';

import Header from './../header/header';
import SideMenu from './../side-menu/side-menu';

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
