import React, { Component } from "react";
import get from "lodash/get";
import { Admin, Resource } from "react-admin";

import customDataProvider from "./dataProviders/dataProvider";
import authProvider from "./dataProviders/authProvider";

import corePlugins from "./config/corePlugins";
import nonCorePlugins from "../version/config/nonCorePlugins";

import customSagas from "./sagas";
import customReducers from "./reducers";
import customRoutes from "./routes";

import Charts from "./pages/Charts";
import Layout from "./common/CustomLayout";
import InitializePage from "./pages/InitializePage";
import { themeCommonElements } from "../version/config/theme.config";
import translations from "./translations";

const plugins = corePlugins.concat(nonCorePlugins);
const Homepage = get(themeCommonElements, 'homePage', Charts);
const i18nProvider = locale => translations[locale];

const App = () => {
    return (
        <Admin
            authProvider={authProvider}
            customSagas={[customSagas]}
            customReducers={{custom: customReducers}}
            customRoutes={customRoutes}
            dataProvider={customDataProvider}
            dashboard={Homepage}
            appLayout={Layout}
            loginPage={InitializePage}
            locale="en"
            i18nProvider={i18nProvider}
        >
            {
                plugins.map(item => {

                    const resourceProps = {};

                    if (item.create) {
                        resourceProps.create = item.create;
                    }

                    if (item.edit) {
                        resourceProps.edit = item.edit;
                    }

                    return (
                        <Resource
                            name={item.name}
                            options={{ label: item.label }}
                            list={item.list}
                            { ...resourceProps }
                        />
                    );
                })
            }
        </Admin>
    );
}

export default App;
