// @flow

import { MakeEdgeContext } from 'edge-core-js'
import { type EdgeContext } from 'edge-core-js/types'
import makeAccountbasedIo from 'edge-currency-accountbased/lib/react-native-io.js'
import makeBitcoinIo from 'edge-currency-bitcoin/lib/react-native-io.js'
import makeExchangeIo from 'edge-exchange-plugins/lib/react-native-io.js'
import React, { PureComponent } from 'react'
import { Alert, AppState } from 'react-native'

import { LoadingScene } from './scenes/LoadingScene.js'
import { MainScene } from './scenes/MainScene.js'

type Props = {}

type State = {
  context: EdgeContext | null,
  counter: number
}

const contextOptions = {
  apiKey: '',
  appId: '',
  plugins: {
    bitcoin: true,
    ethereum: {},
    coincap: true
  }
}

const nativeIo = {
  'edge-currency-accountbased': makeAccountbasedIo(),
  'edge-currency-bitcoin': makeBitcoinIo(),
  'edge-exchange-plugins': makeExchangeIo()
}

/**
 * Mounts the edge-core-js WebView, and then mounts the rest of the app
 * once the core context is ready.
 */
export class EdgeCoreManager extends PureComponent<Props, State> {
  splashHidden: boolean = false
  paused: boolean = false

  constructor(props: Props) {
    super(props)
    this.state = { context: null, counter: 0 }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange)
  }

  /**
   * Pause network tasks when the app goes into the background..
   */
  onAppStateChange = (appState: string) => {
    const paused = appState !== 'active'
    if (this.paused !== paused) {
      this.paused = paused

      const { context } = this.state
      if (context != null) {
        context
          .changePaused(paused, { secondsDelay: paused ? 20 : 0 })
          .catch(error => {
            Alert.alert('Edge core failed to restart', String(error))
          })
      }
    }
  }

  /**
   * If you are using react-native-splash-screen or such, dismiss that here.
   */
  hideSplash() {
    if (!this.splashHidden) {
      this.splashHidden = true
    }
  }

  /**
   * The core WebView has intialized, so pass that to the app.
   */
  handleContext = (context: EdgeContext) => {
    context.on('close', () => {
      this.setState({ context: null })
    })
    this.setState(
      state => ({ context, counter: state.counter + 1 }),
      () => this.hideSplash()
    )
  }

  /**
   * The core WebView failed to load, so show the error.
   */
  handleError = (error: Error) => {
    this.hideSplash()
    Alert.alert('Edge core failed to load', String(error))
  }

  render() {
    const { context, counter } = this.state
    const key = `redux${counter}`

    return (
      <>
        {context == null ? (
          <LoadingScene />
        ) : (
          <MainScene key={key} context={context} />
        )}
        <MakeEdgeContext
          options={contextOptions}
          onLoad={this.handleContext}
          onError={this.handleError}
          nativeIo={nativeIo}
        />
      </>
    )
  }
}
