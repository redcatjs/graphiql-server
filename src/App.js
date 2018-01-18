import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

//import { GraphiQLWorkspace, AppConfig } from 'graphiql-workspace';
// import { GraphiQLWorkspace, AppConfig } from './graphiql-workspace/graphiql-workspace';
import { GraphiQLWorkspace, AppConfig } from './graphiql-workspace/dist/index';

// import 'graphiql-workspace/graphiql-workspace.css';
import './graphiql-workspace/graphiql-workspace.css';
import 'graphiql/graphiql.css';

const bootstrapOptions = {
  defaultUrl: process.env.REACT_APP_GRAPHIQL_DEFAULT_URL,
  defaultWebsocketUrl: process.env.REACT_APP_GRAPHIQL_DEFAULT_WEBSOCKET_URL,
  defaultQuery: `${process.env.REACT_APP_GRAPHIQL_DEFAULT_QUERY}`.replace(/\\n/g, '\n'),
  defaultVariables: `${process.env.REACT_APP_GRAPHIQL_DEFAULT_VARIABLES}`.replace(/\\n/g, '\n'),
};
const config = new AppConfig('graphiql', bootstrapOptions);

class App extends Component {
  render() {
    return (
      <GraphiQLWorkspace config={config} />
    );
  }
}

export default App;
