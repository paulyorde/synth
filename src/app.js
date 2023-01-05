import './app.css'
import App from './App.svelte'


// @ts-ignore
const app = new App({
    //  target = html to load this js app into
  target: document.getElementById('app'),
})

export default app