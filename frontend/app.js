import fetch from 'isomorphic-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';

const baseUrl = NODE_ENV === 'production' ? '' : 'http://localhost:3000';

const ItemList = React.createClass({
  getInitialState: () => ({ items: [], page: 1 }),
  getItems: function(page) {
    fetch(baseUrl + '/api/v1/data?page=' + page)
      .then((response) => {
        return response.json();
      })
      .then((_items) => {
        this.setState({
          items: [...this.state.items, ..._items],
          page
        });
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
          {this.state.items.map((result) => {
            const fromNow = moment(result.updatedAt).fromNow();

            return (
              <div key={ result._id }>
                <div><a href={ result.url } target="_blank">{ result.title }</a></div>
                <div>{ fromNow }</div>
              </div>
            );
          })}
        </div>
        <div className="load-more-holder">
          <a onClick={this.handleClick.bind(this, this.state.page + 1)}>Load More</a>
        </div>
      </div>
    );
	}
});

ReactDOM.render(<ItemList />, document.getElementById('root'));
