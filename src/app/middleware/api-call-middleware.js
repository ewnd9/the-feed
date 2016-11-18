// http://redux.js.org/docs/recipes/ReducingBoilerplate.html
// @WARNING explicit types replaced with generation

export default function callAPIMiddleware(extraArgument, onError = () => {}) {
  const refs = {};

  return ({ dispatch, getState }) => next => action => {
    const {
      type,
      callAPI,
      shouldCallAPI = () => true,
      payload = {}
    } = action;

    if (!callAPI) {
      // Normal action: pass it on
      return next(action);
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.');
    }

    if (refs[type]) {
      return refs[type];
    }

    if (!shouldCallAPI(getState())) {
      return Promise.resolve();
    }

    dispatch({ payload, type, status: 'request' });

    const promise = callAPI(extraArgument)
      .then(
        response => dispatch({ payload, response, type, status: 'success' }),
        error => {
          onError(error);
          return dispatch({ payload, error, type, status: 'failure' });
        }
      )
      .then(res => {
        refs[type] = null;
        return res;
      });

    refs[type] = promise;
    return promise;
  };
}
