require('./style.css');

import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header';
import ItemList from './components/item-list';

const baseUrl = NODE_ENV === 'production' ? '' : 'http://localhost:3000';

const App = () => {
  return (
    <div className="container">
      <Header />
      <div className="delimeter"></div>
      <div className="main">
        <aside>menu</aside>
        <ItemList />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
