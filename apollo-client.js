import { ApolloClient, InMemoryCache } from "@apollo/client";

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  uri: "https://blue-surf-590019.us-east-1.aws.cloud.dgraph.io/graphql",
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default client;
