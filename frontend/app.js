import fetch from 'isomorphic-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

const baseUrl = NODE_ENV === 'production' ? '' : 'http://localhost:3000';

const ItemList = React.createClass({
  getInitialState: () => ({ items: [], page: 1 }),
  getItems: function(page) {
    fetch(baseUrl + '/api/v1/data?page=' + page)
      .then((response) => {
        return response.json();
      })
      .then((items) => {
        this.setState({ items, page });
      });
  },
  componentDidMount: function() {
    this.getItems(this.state.page);
  },
  handleClick: function(page) {
    this.getItems(page);
  },
  render: function() {
    return (
      <div>
        <div>
          { this.state.page > 1 && (<a onClick={this.handleClick.bind(this, this.state.page - 1)}>Prev</a>) }
          { ' ' }
          <span>Page { this.state.page }</span>
          { ' ' }
          <a onClick={this.handleClick.bind(this, this.state.page + 1)}>Next</a>
        </div>
        <ul>
          {this.state.items.map(function(result) {
            return (
              <li key={ result._id }>
                <a href={ result.url } target="_blank">{ result.title }</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
	}
});

ReactDOM.render(<ItemList />, document.getElementById('root'));
