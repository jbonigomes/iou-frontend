import './index.css'

// React
import React from 'react'
import { render } from 'react-dom'

// Fonts
import WebFontLoader from 'webfontloader'

// Apollo
import ApolloClient from 'apollo-boost'

// React Apollo
import { ApolloProvider } from 'react-apollo'

// Router
import { Route } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'

// State
import { schema } from './resolvers'
import { defaults } from './resolvers'
import { resolvers } from './resolvers'

// Components
import App from './components/App'

const client = new ApolloClient({
  uri: 'https://api.graph.cool/simple/v1/cjfh6nor13ecz0103xirfsl94',
  clientState: { resolvers, defaults, schema },
  request: operation => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('graphcoolToken')}` || null
      }
    })
  }
})

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons']
  },
  custom: {
    families: ['FontAwesome'],
    urls: ['//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css']
  }
})

render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={App} />
      </Switch>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
)
