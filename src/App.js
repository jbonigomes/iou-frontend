/* global FB */
import React from 'react'
import gql from 'graphql-tag';

import { graphql } from 'react-apollo'
import { compose } from 'react-apollo'
import { withRouter } from 'react-router'

const FACEBOOK_API_VERSION = 'v2.10'
const FACEBOOK_APP_ID = '379065752294307'

class App extends React.Component {
  componentDidMount() {
    this._initializeFacebookSDK()
  }

  _initializeFacebookSDK() {
    window.fbAsyncInit = () => {
      FB.init({
        cookie: true,
        appId: FACEBOOK_APP_ID,
        version: FACEBOOK_API_VERSION
      })
    }

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      js = d.createElement(s); js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
  }

  login = () => {
    FB.login(response => {
      this._facebookCallback(response)
    }, { scope: 'public_profile,email' })
  }

  _facebookCallback = async facebookResponse => {
    if (facebookResponse.status === 'connected') {
      const facebookToken = facebookResponse.authResponse.accessToken
      const graphcoolResponse = await this.props.authenticateUserMutation({
        variables: { facebookToken }
      })
      const graphcoolToken = graphcoolResponse.data.authenticateUser.token
      localStorage.setItem('graphcoolToken', graphcoolToken)
      window.location.reload()
    } else {
      console.warn('User did not authorize the Facebook application.')
    }
  }

  isLoggedIn = () => {
    return this.props.data.loggedInUser && this.props.data.loggedInUser.id !== ''
  }

  logout = () => {
    localStorage.removeItem('graphcoolToken')
    window.location.reload()
  }

  render () {
    if (this.props.data.loading) {
      return (
        <div>Loading</div>
      )
    }

    if (this.isLoggedIn()) {
      return (
        <div>
          <div>Logged in as ${this.props.data.loggedInUser.id}</div>
          <div onClick={this.logout}>Logout</div>
        </div>
      )
    }

    return (
      <div>
        <div onClick={this.login}>Log in with Facebook</div>
        <div>Log in to create new posts</div>
        <ul>
          {this.props.data.allLists.map((list, i) => (
            <li key={i}>{list.id} - {list.name}</li>
          ))}
        </ul>
      </div>
    )
  }
}

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

const ALL_LISTS_QUERY = gql`
  query {
    allLists {
      id
      name
      image
    }
  }
`

const options = { fetchPolicy: 'network-only'};

export default compose(
  graphql(LOGGED_IN_USER, { options }),
  graphql(ALL_LISTS_QUERY, { options }),
  graphql(AUTHENTICATE_FACEBOOK_USER, { name: 'authenticateUserMutation' })
)(withRouter(App))
