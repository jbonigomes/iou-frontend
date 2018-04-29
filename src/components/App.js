import React from 'react'

import { gql } from 'apollo-boost'

import { withRouter } from 'react-router'

import { Query } from 'react-apollo'
import { ApolloConsumer } from 'react-apollo'

import { Drawer } from 'react-md'
import { Button } from 'react-md'
import { Toolbar } from 'react-md'
import { FontIcon } from 'react-md'
import { CircularProgress } from 'react-md'

import { init, login, logout } from '../facebook/auth'

import Lists from './Lists'

init()

const LOGGED_IN_USER = gql`
  query LoggedInUser {
    loggedInUser {
      id
    }
  }
`

const GET_USER_ID = gql`
  query getUserId($id: ID) {
    User(id: $id) {
      facebookUserId
    }
  }
`

const GET_APP_STATE = gql`
  query getAppState {
    appState @client {
      showDrawer
    }
  }
`

const doLogin = (client) => {
  return () => {
    return login(client, (err, success) => {
      if (err) {
        alert(`login error: ${err}`)
      }
      else {
        alert(`login success: ${success}`)
      }
    })
  }
}

const doLogout = () => {
  return logout(() => {
    alert('logged out')
  })
}

const getFbImageUrl = id => `https://graph.facebook.com/${id}/picture`

const App = () => {
  const toggleDrawer = () => {
  //   drawerVisible = !drawerVisible
  //   console.log('toggling:', drawerVisible)
  }

  const handleVisibility = (visibility) => {
  //   drawerVisible = visibility
  //   console.log('hadling:', drawerVisible)
  }

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
            <Query query={GET_USER_ID} variables={{ id: data.loggedInUser.id }}>
              {({ loading, error, data }) => {
                if (loading) {
                  return (
                    <CircularProgress id="loading-user" />
                  )
                }

                if (error) {
                  return (
                    <div>Error loading user: {error.message}</div>
                  )
                }

                return (
                  <Query query={GET_APP_STATE}>
                    {({ loading, error, data }) => {
                      if (loading) {
                        return (
                          <CircularProgress id="loading-state" />
                        )
                      }

                      if (error) {
                        return (
                          <div>Error loading app state: {error.message}</div>
                        )
                      }

                      console.log('ha', data)

                      // src={getFbImageUrl(data.User.facebookUserId)}

                      return (
                        <div>
                          <Toolbar
                            colored
                            nav={(
                              <Button
                                icon
                                onClick={toggleDrawer}>
                                menu
                              </Button>
                            )}
                            title="Lists"
                            actions={(
                              <img
                                onClick={doLogout}
                                alt="Facebook avatar"
                                src="test" />
                            )}
                          />
                          <Drawer
                            visible={true}
                            header={<h1>hi</h1>}
                            type={Drawer.DrawerTypes.TEMPORARY}
                            onVisibilityChange={handleVisibility}
                          />
                          <Lists />
                        </div>
                      )
                    }}
                  </Query>
                )
              }}
            </Query>
          )
        }

        return (
          <ApolloConsumer>
            {client => (
              <Button
                flat
                onClick={doLogin(client)}
                iconEl={<FontIcon iconClassName="fa fa-facebook" />}>
                Log in with Facebook
              </Button>
            )}
          </ApolloConsumer>
        )
      }}
    </Query>
  )
}

export default withRouter(App)
