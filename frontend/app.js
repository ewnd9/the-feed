require('./style.css');

import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header';
import ItemList from './components/item-list';
import SideMenu from './components/side-menu';

const App = React.createClass({
  getInitialState: () => ({ categoryId: 'unseen' }),
  setCategoryId: function(categoryId) {
    this.setState({ categoryId });
  },
  render: function() {
    return (
      <div className="container">
        <Header setCategoryId={this.setCategoryId} categoryId={this.state.categoryId} />
        <div className="delimeter"></div>
        <div className="main">
          <aside>
            <SideMenu setCategoryId={this.setCategoryId} categoryId={this.state.categoryId} />
          </aside>

          <ItemList categoryId={this.state.categoryId} />
        </div>
      </div>
    );
	}
});

ReactDOM.render(<App />, document.getElementById('root'));
