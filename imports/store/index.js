import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import showsReducer from '/imports/reducers/shows';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => createStore(
  combineReducers({
    shows: showsReducer,
  }),
  composeEnhancers(applyMiddleware(thunk))
)
