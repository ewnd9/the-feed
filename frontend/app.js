require('./style.css');

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
      <div className="container">
        <aside>menu</aside>
        <div className="content">
          <div>
            {this.state.items.map((result) => {
              const fromNow = moment(result.updatedAt).fromNow();

              let title;

              if (typeof result.title === 'string') {
                title = [[result.url, result.title]];
              } else {
                title = result.title;
              }

              return (
                <div key={ result._id }>
                  <div>
                    <span>{ result.meta.task }:</span>{' '}
                    {
                      title.map((title, i) => {
                        if (typeof title === 'string') {
                          return (<span key={i}>{ title }{' '}</span>);
                        } else {
                          return (<span key={i}><a href={ title[0] } target="_blank">{ title[1] }</a>{' '}</span>);
                        }
                      })
                    }
                  </div>
                  <div>{ fromNow }</div>
                </div>
              );
            })}
          </div>
          <div className="load-more-holder">
            <a onClick={this.handleClick.bind(this, this.state.page + 1)}>Load More</a>
          </div>
        </div>        
      </div>
    );
	}
});

ReactDOM.render(<ItemList />, document.getElementById('root'));
