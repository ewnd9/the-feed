import React from 'react';
import styles from './style.css';

import t from 'tcomb';
import { propTypes } from 'tcomb-react';

import moment from 'moment';
import classNames from 'classnames';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';

import createPreview from 'html-preview';
import { Post } from '../../../../schema/';

export default React.createClass({
  propTypes: propTypes({
    post: Post,
    index: t.Number,

    handleHover: t.Function,
    handleLinkClick: t.Function
  }),
  getInitialState: () => ({ expanded: false }),
  onExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  },
  render() {
    const { expanded } = this.state;
    const { post: result, index } = this.props;

    const fromNow = moment(result.createdAt).fromNow();

    let title;

    if (typeof result.title === 'string') {
      title = [[result.url, result.title]];
    } else {
      title = result.title;
    }

    const itemClass = classNames({
      [styles.item]: true,
      [styles.itemSeen]: result.meta.seen,
      [styles.itemUnseen]: !result.meta.seen
    });

    const dataArray = _
      .map(result.data, (val, key) => ({ val, key }))
      .filter(({ val }) => val !== null && val !== '');

    const labels = dataArray.filter(({ key }) => {
      return _.endsWith(key, '_label');
    });

    const links = dataArray.filter(({ key }) => {
      return _.endsWith(key, '_link');
    });

    const blobs = dataArray.filter(({ key }) => {
      return _.endsWith(key, '_blob');
    });

    const createMarkup = (_val, forceExpanded = false) => {
      if (expanded || forceExpanded) {
        return { __html: _val };
      } else {
        const limit = 200;
        const preview = createPreview(_val, limit);
        const result = preview.length === _val.length ? preview : `${preview} ...`;

        return { __html: result };
      }
    };

    return (
      <div className={`${itemClass} clearfix`}
           onMouseEnter={() => this.props.handleHover(index)}
           onFocus={() => this.props.handleHover(index)}
           tabIndex={index + 1}>
        <div className="item-top">
          {
            result.images && (
              <div className={styles.itemImage}>
                <img src={result.images[result.images.length - 1].url} />
              </div>
            )
          }
          <span>
            <span className={`${styles.data} ${styles.task}`}>
              { result.meta.jobName }:
            </span>
            {' '}
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

        <div className={styles.itemBody}>
          <div className={styles.itemColumn}>
            {
              labels.map(({ val, key }, index) => {
                return (
                  <span className={`${styles.data} ${styles.flair}`} key={index}>
                    {key.replace('_label', '')}
                    {': '}
                    <span dangerouslySetInnerHTML={createMarkup(val)} onClick={this.onExpandClick} />
                    {' '}
                  </span>
                );
              })
            }
            {
              links.map(({ val, key }, index) => {
                return (
                  <a href={val} target="_blank" className={`${styles.data} ${styles.link}`} key={index}>
                    {(typeof result.data[key + '_count'] !== 'undefined') ? result.data[key + '_count'] + ' ' : ''}
                    {key.replace('_link', '')}
                  </a>
                );
              })
            }
            {
              blobs.map(({ val, key }) => {
                return (
                  <span className={`${styles.data} ${styles.blob}`} key={result._id + key}>
                    <span data-tip data-for={result._id + key}>
                      {key.replace('_blob', '')}
                    </span>
                    <ReactTooltip id={result._id + key} class="tooltip" effect="solid">
                      <span dangerouslySetInnerHTML={createMarkup(val, true)} />
                    </ReactTooltip>
                  </span>
                );
              })
            }
          </div>
          <div className={styles.itemColumn}>
            <span className={styles.date}>{ fromNow }</span>
          </div>
        </div>
      </div>
    );
  }
});
