import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import Layout from './layout';
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Fragment } from 'react/jsx-runtime';
function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (<Fragment>
        <Provider store={store}>
          <Layout signOut={signOut} user={user} />
        </Provider>
      </Fragment>
      )}
    </Authenticator>
  );
}

export default App;
