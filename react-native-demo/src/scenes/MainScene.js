// @flow

import { type EdgeContext } from 'edge-core-js/types'
import { LoginScreen } from 'edge-login-ui-rn'
import React, { Component } from 'react'
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { Button } from '../components/Button.js'

type Props = {
  context: EdgeContext
}

type State = {
  showLogin: boolean
}

export class MainScene extends Component<Props, State> {
  state = { showLogin: false }

  handleShowLogin = () => {
    this.setState({ showLogin: true })
  }

  handleLogin = (error: Error | void, account: EdgeAccount) => {
    if (error) {
      Alert.alert('Failed to login ', String(error))
      return
    }
    Alert.alert('Yay ')
  }

  renderContext() {
    const { context } = this.props
    const { localUsers } = context

    return (
      <SafeAreaView style={styles.scene}>
        <View style={{ padding: 8 }}>
          <Button onPress={this.handleShowLogin}>
            <Text>Login</Text>
          </Button>
        </View>
        <View style={{ padding: 8 }}>
          <Text>Active Users:</Text>
          {localUsers.map(user => (
            <Text key={user.username}>{user.username}</Text>
          ))}
        </View>
      </SafeAreaView>
    )
  }

  renderLogin() {
    const { context } = this.props
    return (
      <SafeAreaView style={styles.scene}>
        <LoginScreen
          context={context}
          accountOptions={{}}
          onLogin={this.handleLogin}
        />
      </SafeAreaView>
    )
  }

  render() {
    const { showLogin } = this.state
    return showLogin ? this.renderLogin() : this.renderContext()
  }
}

const styles = StyleSheet.create({
  scene: {
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
    bottom: 0,
    justifyContent: 'flex-start',
    left: 0,
    padding: 16,
    position: 'absolute',
    right: 0,
    top: 0
  }
})
