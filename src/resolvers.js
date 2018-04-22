import gql from 'graphql-tag'

export const defaults = {
  showDrawer: false
}

const typeDefs = `
  type AppState {
    drawerVisibility: Boolean!
  }

  type Mutation {
    toggleDrawer(): AppState
    handleVisibility(visibility: Boolean!): AppState
  }

  type Query {
    drawerVisibility: Boolean
  }
`

export const resolvers = {
  Mutation: {
    toggleDrawer: (_, variables, { cache }) => {
      const fragment = gql`
        fragment completeTodo on TodoItem {
          completed
        }
      `

      const todo = cache.readFragment({ fragment, id });
      const data = { ...todo, completed: !todo.completed };
      cache.writeData({ id, data });
      return null;
    },
  },
}
