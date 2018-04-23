import gql from 'graphql-tag'

const GET_APP_STATE = gql`
  query getAppState {
    AppState @client {
      showDrawer
    }
  }
`

export const defaults = {
  showDrawer: false
}

export const typeDefs = `
  type AppState {
    showDrawer: Boolean!
  }

  type Mutation {
    toggleDrawer(): AppState
    handleVisibility(visibility: Boolean!): AppState
  }

  type Query {
    showDrawer: Boolean
  }
`

export const resolvers = {
  Mutation: {
    toggleDrawer: (_, variables, { cache }) => {
      const data = {
        showDrawer: !cache.readQuery({ query: GET_APP_STATE }).AppState.showDrawer
      }

      cache.writeData({ data });

      return data;
    },

    setDrawer: (_, variables, { cache }) => {
      const data = {
        showDrawer: variables.visibility
      }

      cache.writeData({ data });

      return data;
    }
  }
}
