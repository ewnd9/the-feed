// http://redux.js.org/docs/recipes/ReducingBoilerplate.html
// @WARNING explicit types replaced with generation

export default function callAPIMiddleware(extraArgument, onError = () => {}) {
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

    if (!shouldCallAPI(getState())) {
      return;
    }

    dispatch({ payload, type, status: 'request' });

    return callAPI(extraArgument)
      .then(
        response => dispatch({ payload, response, type, status: 'success' }),
        error => {
          onError(error);
          return dispatch({ payload, error, type, status: 'failure' });
        }
      );
  };
}
