/* global FB */
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

export const login = (next) => {
  const scope = 'public_profile,email'
  FB.login(response => next(response), { scope })
}

export const logout = () => {
  localStorage.removeItem('graphcoolToken')
  window.location.reload()
}
