import fetch from 'isomorphic-fetch';

export default createAPI;

function createAPI(baseUrl) {
  return {
    findByJob(jobId, id, date) {
      console.log(jobId, encodeURIComponent(jobId));
      const params = (id && date) ? `id=${id}&date=${date}` : '';

      return request(baseUrl + `/api/v1/posts/job/${encodeURIComponent(jobId)}?${params}`)
        .then(({ posts }) => posts);
    },
    fetchJobs() {
      return request(baseUrl + '/api/v1/jobs')
        .then(({ jobs }) => jobs);
    },
    createJob(job) {
      return put(baseUrl + '/api/v1/jobs', { job });
    },
    updateJob(job) {
      return post(baseUrl + '/api/v1/jobs', { job });
    },
    putSeen(item) {
      return put(baseUrl + `/api/v1/posts/${item._id}/seen`, { seen: true });
    },
    putClicked(item) {
      return put(baseUrl + `/api/v1/posts/${item._id}/clicked`, { clicked: true });
    },
    putJobAsSeen(job) {
      return post(baseUrl + `/api/v1/jobs/unseen/${job._id}`, {});
    }
  };

  function request(url, opts = {}) {
    return fetch(url, opts)
      .then(_ => _.json());
  }

  function requestJson(url, opts = {}) {
    return request(url, {
      ...opts,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(opts.body),
    });
  }

  function post(url, body) {
    return requestJson(url, {
      method: 'post',
      body
    });
  }

  function put(url, body) {
    return requestJson(url, {
      method: 'put',
      body
    });
  }
}
