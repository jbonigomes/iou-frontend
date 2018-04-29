import { gql } from 'apollo-boost'

const GET_APP_STATE = gql`
  query getAppState {
    appState @client {
      showDrawer
    }
  }
`

export const defaults = {
  showDrawer: false
}

export const schema = `
  type AppState {
    showDrawer: Boolean!
  }

  type Mutation {
    toggleDrawer(): AppState
    handleVisibility(visibility: Boolean!): AppState
  }

  type Query {
    appState: AppState
  }
`

export const resolvers = {
  Mutation: {
    toggleDrawer: (_, variables, { cache }) => {
      const data = {
        showDrawer: !cache.readQuery({ query: GET_APP_STATE }).AppState.showDrawer
      }

      cache.writeData({ data })

      return data
    },

    setDrawer: (_, variables, { cache }) => {
      const data = {
        showDrawer: variables.visibility
      }

      cache.writeData({ data })

      return data
    }
  }
}
