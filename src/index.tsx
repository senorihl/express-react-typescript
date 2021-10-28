import React from "react";
import { Helmet } from "react-helmet";
import { Switch, Route, Redirect } from "react-router-dom";
import { RouteChildrenProps } from "react-router";
import Header from "./components/Header";

import "./styling/app.scss";

const Example: React.FC<RouteChildrenProps> = ({ location }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: 500 }}>
        <p style={{ textAlign: "center", marginBottom: 50 }}>
          Example content for <code>{location.pathname}</code>.
        </p>
        <p style={{ textAlign: "center" }}>
          Start hacking by modifying <code>{__BASEPATH__}/src/index.tsx</code>
        </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div id="container">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>DevTest</title>
      </Helmet>
      <Header />
      <Switch>
        <Route path={"/"} exact>
          {(props) => <Example {...props} />}
        </Route>
        <Route
          path={"/home"}
          exact
          render={({ staticContext }) => {
            /* istanbul ignore next */
            if (staticContext) {
              staticContext.statusCode = 301;
            }

            return <Redirect to={"/"} />;
          }}
        />
        <Route path={"/about"} exact>
          {(props) => <Example {...props} />}
        </Route>
        <Route path={"/legal"} exact>
          {(props) => <Example {...props} />}
        </Route>
        <Route
          render={({ staticContext, ...props }) => {
            /* istanbul ignore next */
            if (staticContext) {
              staticContext.statusCode = 404;
            }

            return <Example {...props} />;
          }}
        />
      </Switch>
    </div>
  );
};

export default App;
