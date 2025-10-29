/**
 * GraphQL Schema
 * Combines all type definitions and resolvers
 */

import { GraphQLSchema } from "graphql";
import RootQuery from "./queries";
import RootMutation from "./mutations";

/**
 * Main GraphQL Schema
 */
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export default schema;
