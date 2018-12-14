import { combineReducers } from 'redux';
import dealAction from './dealAction';
import signAction from './signAction';
import marketAction from './marketAction';
import coinAction from './coinAction';
import klineAction from './klineAction';

let reducers = combineReducers({
    dealAction,
    signAction,
    marketAction,
    coinAction,
    klineAction
})

export default reducers;