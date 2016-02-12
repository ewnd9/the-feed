import React from 'react';

import moment from 'moment';
import classNames from 'classnames';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';

export default React.createClass({
  render: function() {
    const result = this.props.item;
    const index = this.props.index;

    const fromNow = moment(result.createdAt).fromNow();

    let title;

    if (typeof result.title === 'string') {
      title = [[result.url, result.title]];
    } else {
      title = result.title;
    }

    const itemClass = classNames({
      'item': true,
      'item-seen': result.meta.seen,
      'item-unseen': !result.meta.seen
    });

    const dataArray = _
      .map(result.data, (val, key) => ({ val, key }))
      .filter(({ val }) => val !== null && val !== '');

    const labels = dataArray.filter(({ val, key }) => {
      return _.endsWith(key, '_label');
    });

    const links = dataArray.filter(({ val, key }) => {
      return _.endsWith(key, '_link');
    });

    const blobs = dataArray.filter(({ val, key }) => {
      return _.endsWith(key, '_blob');
    });

    const createMarkup = val => ({__html: val });

    return (
      <div className={itemClass}
           onMouseEnter={() => this.props.handleHover(index)}
           onFocus={() => this.props.handleHover(index)}
           tabIndex={index + 1}>
        <div className="item-top">
          {
            result.images && (
              <div className="item-image">
                <img src={result.images[result.images.length - 1].url} />
              </div>
            )
          }
          <span>
            <span className="data task">{ result.meta.task }:</span>{' '}
            {
              title.map((title, i) => {
                if (typeof title === 'string') {
                  return (<span key={i}>{ title }{' '}</span>);
                } else {
                  return (
                    <span key={i}>
                      <a href={title[0]}
                         target="_blank"
                         onClick={() => this.props.handleLinkClick(index, title[0])}>
                        { title[1] }
                      </a>
                      {' '}
                    </span>
                  );
                }
              })
            }
          </span>
        </div>

        <div className="item-body">
          <div className="item-column">
            {
              labels.map(({ val, key }, index) => {
                return (
                  <span className="data flair" key={index}>
                    {key.replace('_label', '')}
                    {': '}
                    <span dangerouslySetInnerHTML={createMarkup(val)} />
                    {' '}
                  </span>
                );
              })
            }
            {
              links.map(({ val, key }, index) => {
                return (
                  <a href={val} target="_blank" className="data link" key={index}>
                    {(typeof result.data[key + '_count'] !== 'undefined') ? result.data[key + '_count'] + ' ' : ''}
                    {key.replace('_link', '')}
                  </a>
                );
              })
            }
            {
              blobs.map(({ val, key }, index) => {
                return (
                  <span className="data blob" key={result._id + key}>
                    <span data-tip data-for={result._id + key}>
                      {key.replace('_blob', '')}
                    </span>
                    <ReactTooltip id={result._id + key} class="tooltip" effect="solid">
                      <span dangerouslySetInnerHTML={createMarkup(val)} />
                    </ReactTooltip>
                  </span>
                );
              })
            }
          </div>
          <div className="item-column">
            <span>{ fromNow }</span>
          </div>
        </div>
      </div>
    );
  }
});
