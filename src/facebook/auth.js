/* global FB */
import gql from 'graphql-tag'

const AUTHENTICATE_FACEBOOK_USER = gql`
  mutation AuthenticateUserMutation($facebookToken: String!) {
    authenticateUser(facebookToken: $facebookToken) {
      id
      token
    }
  }
`

/**
 * This has to be called before you can call login
 * It inserts the Facebook sdk into the app and initialise it with the app id
 */
export const init = () => {
  window.fbAsyncInit = () => {
    FB.init({
      cookie: true,
      version: 'v2.10',
      appId: '379065752294307'
    })
  }

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0]

    if (d.getElementById(id)) return

    js = d.createElement(s);
    js.id = id
    js.src = '//connect.facebook.net/en_US/sdk.js'
    fjs.parentNode.insertBefore(js, fjs)
  }(document, 'script', 'facebook-jssdk'))
}

/**
 * This does a Facebook login then sends the token to Graph.cool
 * which in turn gives us back the graph.cool user 'id' auth 'token'
 */
export const login = (client, next) => {
  FB.login(async facebookResponse => {
    if (facebookResponse.status === 'connected') {
      const { data } = await client.mutate({
        mutation: AUTHENTICATE_FACEBOOK_USER,
        variables: { facebookToken: facebookResponse.authResponse.accessToken }
      })

      localStorage.setItem('graphcoolUserId', data.authenticateUser.id)
      localStorage.setItem('graphcoolToken', data.authenticateUser.token)

      next(null, 'Successfully logged in')
    } else {
      next('Facebook login error')
    }
  }, { scope: 'public_profile,email' })
}

/**
 * Used to clear users' data
 */
export const logout = (next) => {
  localStorage.removeItem('graphcoolToken')
  localStorage.removeItem('graphcoolUserId')
  next()
}
