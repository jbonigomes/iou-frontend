import React from 'react'

import gql from 'graphql-tag'

import { withRouter } from 'react-router'

import { Query } from 'react-apollo'
import { ApolloConsumer } from 'react-apollo'

import { Button } from 'react-md'
import { FontIcon } from 'react-md'
import { CircularProgress } from 'react-md'

import { init, login, logout } from '../facebook/auth'

import Lists from './Lists'

init()

const AUTHENTICATE_FACEBOOK_USER = gql`
  mutation AuthenticateUserMutation($facebookToken: String!) {
    authenticateUser(facebookToken: $facebookToken) {
      token
    }
  }
`

const LOGGED_IN_USER = gql`
  query LoggedInUser {
    loggedInUser {
      id
    }
  }
`

const fbLogin = (client) => {
  return () => {
    login(async facebookResponse => {
      if (facebookResponse.status === 'connected') {
        const { data } = await client.mutate({
          mutation: AUTHENTICATE_FACEBOOK_USER,
          variables: { facebookToken: facebookResponse.authResponse.accessToken }
        })

        localStorage.setItem('graphcoolToken', data.authenticateUser.token)
        window.location.reload()
      } else {
        console.warn('User did not authorize the Facebook application.')
      }
    })
  }
}

const App = () => {
  return (
    <Query query={LOGGED_IN_USER}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <CircularProgress id="loading-app" />
          )
        }

        if (error) {
          return (
            <div>Error loading app: {error.message}</div>
          )
        }

        if (data.loggedInUser && data.loggedInUser.id !== '') {
          return (
            <div>
              <div>Logged in as ${data.loggedInUser.id}</div>
              <div onClick={logout}>Logout</div>
              <Lists />
            </div>
          )
        }

        return (
          <ApolloConsumer>
            {client => (
              <div>
                <Button
                  flat
                  onClick={fbLogin(client)}
                  iconEl={<FontIcon>face</FontIcon>}
                >
                  Log in with Facebook
                </Button>
                <Lists />
              </div>
            )}
          </ApolloConsumer>
        )
      }}
    </Query>
  )
}

export default withRouter(App)
