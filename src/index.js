import './index.css'

// React
import React from 'react'
import { render } from 'react-dom'

// Fonts
import WebFontLoader from 'webfontloader';

// Apollo
import { concat } from 'apollo-link'
import { ApolloLink } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// Router
import { Route } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'

// Components
import App from './components/App'

const httpLink = createHttpLink({
  uri: 'https://api.graph.cool/simple/v1/cjfh6nor13ecz0103xirfsl94'
})

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('graphcoolToken')}` || null
    }
  })

  return forward(operation)
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
})

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons', '']
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
        <Route exact path='/' render={() => <App drawerVisible={false} />} />
      </Switch>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
)
