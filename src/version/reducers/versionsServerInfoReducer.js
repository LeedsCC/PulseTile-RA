import get from 'lodash/get';
import moment from "moment";

import { VERSIONS_SERVER_ACTION } from "../actions/ReSPECT/versionsServerAction";

const initialState = {
    data: false,
    loading: false,
    error: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case VERSIONS_SERVER_ACTION.REQUEST:
        case VERSIONS_SERVER_ACTION.REQUEST_ONE:
        case VERSIONS_SERVER_ACTION.REQUEST_LATEST:
            return {
                ...state,
                loading: true,
            };
        case VERSIONS_SERVER_ACTION.CREATE:
            return {
                ...state,
                loading: true,
            };
        case VERSIONS_SERVER_ACTION.SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.data,
            };
        case VERSIONS_SERVER_ACTION.SUCCESS_ONE:
            return {
                ...state,
                loading: false,
                version: get(action, "data.respect_form", null),
            };
        case VERSIONS_SERVER_ACTION.SUCCESS_LATEST:
            return {
                ...state,
                loading: false,
                latest: get(action, "data.respect_form", null),
            };
        case VERSIONS_SERVER_ACTION.SUCCESS_CREATE:
            return {
                ...state,
                loading: false,
                newVersion: get(action, "data", null),
            };
        case VERSIONS_SERVER_ACTION.SUCCESS_PUT:

            const newVersion = get(action, "data", null);
            const versionsArray = get(state, "data", []);

            const compositionIdString = get(newVersion, 'compositionUid', null);
            const compositionIdArray = compositionIdString.split('::');

            const sourceId = get(compositionIdArray, [0], null);
            const versionId = get(compositionIdArray, [2], null);

            versionsArray.unshift({
                author: localStorage.getItem('username'),
                dateCreated: Math.round(new Date().getTime()/1000),
                source: newVersion.host,
                sourceId: newVersion.host + '-' + sourceId,
                status: "Completed",
                version: versionId,
            });

            return {
                ...state,
                loading: false,
                data: versionsArray,
            };
        case VERSIONS_SERVER_ACTION.ERROR:
            return {
                ...state,
                loading: false,
                error: get(action, "error", null),
            };
        default:
            return state;
    }
}