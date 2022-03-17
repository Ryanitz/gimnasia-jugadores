import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://blue-surf-590019.us-east-1.aws.cloud.dgraph.io/graphql",
  cache: new InMemoryCache(),
});

export default client;
