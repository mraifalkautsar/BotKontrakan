import { render } from 'preact'
import './index.css'
import './app.css'
import './tailwind-shim.css'
import { App } from './app.jsx'

render(<App />, document.getElementById('app'))
