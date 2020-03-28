import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './editor'
import './style.scss'

const App: React.FC<{}> = () => (
  <>
    <Editor />
  </>
);

ReactDOM.render(<App/>, document.querySelector('#app'))