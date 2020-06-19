import get from "lodash/get"
import { takeEvery, put } from "redux-saga/effects"

import { token, domainName } from "../../core/token"
import { httpErrorAction } from "../../core/actions/httpErrorAction"

const apiPatientsUser = "api/patient/fhir"
let responseInfo = {}

function compositionSynopsis(composition) {
    const section = composition.section || []

    return {
        synopsis: section.map((s) => ({ id: composition.id, text: s.title })),
    }
}

function createFhirSynopsis(resources) {
    const [resource] = resources

    switch (resource.resourceType) {
        case "Composition": {
            return compositionSynopsis(resource)
        }
        default: {
            throw Error(`Unrecognised resource ${resource.resourceType}`)
        }
    }
}

export default function createFhirSynopsisSaga(actionName, actionType, resourceType, query) {
    return takeEvery(actionName.REQUEST, function* (action) {
        let url = `${domainName}/${apiPatientsUser}/${resourceType}?${query}`
        let options = {
            credentials: "same-origin",
        }
        options.method = "GET"
        if (!options.headers) {
            options.headers = new Headers({ Accept: "application/json" })
        }
        options.headers = {
            Authorization: "Bearer " + token,
            "X-Requested-With": "XMLHttpRequest",
        }

        try {
            const result = yield fetch(url, options)
                .then((res) => {
                    responseInfo.status = get(res, "status", null)
                    return res.json()
                })
                .then((res) => {
                    if (responseInfo.status !== 200) {
                        responseInfo.errorMessage = get(res, "error", null)
                        return false
                    }

                    const status = get(res, "status", null)

                    if (status && status === "sign_terms") {
                        window.location.href = "/#/login"
                        return null
                    }

                    return res
                })

            if (responseInfo.status === 200) {
                const resources =
                    result.entry &&
                    result.entry
                        .map((entry) => entry.resource)
                        .filter((res) => !!res && res.resourceType === resourceType)

                yield put(actionType.success(createFhirSynopsis(resources)))
            } else {
                yield put(
                    httpErrorAction.save({
                        status: responseInfo.status,
                        message: responseInfo.errorMessage,
                    })
                )
            }
        } catch (e) {
            yield put(actionType.error(e))
        }
    })
}

export function createFhirBundleSaga(actionName, actionType) {
    return takeEvery(actionName.REQUEST, function* (action) {
        const { key, resourceType, query } = action

        let url = `${domainName}/${apiPatientsUser}/${resourceType}?${query}`
        let options = {
            credentials: "same-origin",
        }
        options.method = "GET"
        if (!options.headers) {
            options.headers = new Headers({ Accept: "application/json" })
        }
        options.headers = {
            Authorization: "Bearer " + token,
            "X-Requested-With": "XMLHttpRequest",
        }

        try {
            const result = yield fetch(url, options)
                .then((res) => {
                    responseInfo.status = get(res, "status", null)
                    return res.json()
                })
                .then((res) => {
                    if (responseInfo.status !== 200) {
                        responseInfo.errorMessage = get(res, "error", null)
                        return false
                    }

                    const status = get(res, "status", null)

                    if (status && status === "sign_terms") {
                        window.location.href = "/#/login"
                        return null
                    }

                    return res
                })

            if (responseInfo.status === 200) {
                yield put(actionType.success(key, resourceType, result))
            } else {
                yield put(
                    httpErrorAction.save({
                        status: responseInfo.status,
                        message: responseInfo.errorMessage,
                    })
                )
            }
        } catch (e) {
            yield put(actionType.error(key, resourceType, e))
        }
    })
}