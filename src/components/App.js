import React from 'react'
import gql from 'graphql-tag';

import { Query } from 'react-apollo'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'

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

const fbLogin = () => {
  login(async facebookResponse => {
    if (facebookResponse.status === 'connected') {
      const graphcoolResponse = await graphql(AUTHENTICATE_FACEBOOK_USER)({
        variables: { facebookToken: facebookResponse.authResponse.accessToken }
      })
      localStorage.setItem('graphcoolToken', graphcoolResponse.data.authenticateUser.token)
      window.location.reload()
    } else {
      console.warn('User did not authorize the Facebook application.')
    }
  })
}

const App = () => {
  return (
    <Query query={LOGGED_IN_USER}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <div>Loading app...</div>
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
          <div>
            <div onClick={fbLogin}>
              Log in with Facebook
            </div>
            <Lists />
          </div>
        )
      }}
    </Query>
  )
}

export default withRouter(App)
