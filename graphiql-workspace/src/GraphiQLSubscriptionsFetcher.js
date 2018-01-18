import { parse } from 'graphql';

const hasSubscriptionOperation = (graphQlParams) => {
  const queryDoc = parse(graphQlParams.query);

  for (let definition of queryDoc.definitions) {
    if (definition.kind === 'OperationDefinition') {
      const operation = definition.operation;
      if (operation === 'subscription') {
        return true;
      }
    }
  }

  return false;
};

export const graphQLFetcher = (subscriptionsClient, fallbackFetcher) => {
  // let activeSubscriptionId = null;
  let client = null;

  return (graphQLParams) => {
    // if (subscriptionsClient && activeSubscriptionId !== null) {
      // subscriptionsClient.unsubscribe(activeSubscriptionId);
    // }
    if (client) {
      client.unsubscribe()
    }

    if (subscriptionsClient && hasSubscriptionOperation(graphQLParams)) {
      return {
        subscribe(observer) {
          observer.next('Your subscription data will appear here after server publication!');

          // activeSubscriptionId = subscriptionsClient.request({
          client = subscriptionsClient.request({
            query: graphQLParams.query,
            variables: graphQLParams.variables,
          }).subscribe(
            function (result) {
              console.log('published', result)
              observer.next(result)
            },
            function(error){
              console.error(error)
              // observer.error(error);
              observer.error(JSON.stringify({errors:error}, null, 2)); //bugfix by takion
            }
          );
        }
      };
    } else {
      return fallbackFetcher(graphQLParams);
    }
  };
};
