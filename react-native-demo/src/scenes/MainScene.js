// @flow

import { type EdgeAccount, type EdgeContext } from 'edge-core-js/types'
import { LoginScreen } from 'edge-login-ui-rn'
import React, { Component } from 'react'
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { Button } from '../components/Button.js'

type Props = {
  context: EdgeContext
}

type State = {
  account?: EdgeAccount,
  showLogin: boolean
}

export class MainScene extends Component<Props, State> {
  state = { account: undefined, showLogin: false }

  handleShowLogin = () => {
    this.setState({ showLogin: true })
  }

  handleLogin = (error: Error | void, account: EdgeAccount) => {
    if (error) {
      Alert.alert('Failed to login ', String(error))
      this.setState({ showLogin: false })
      return
    }
    Alert.alert('Yay ')
    this.setState({ account, showLogin: false })
  }

  handleLogout = () => {
    const { account } = this.state
    if (account != null) {
      account.logout()
      this.setState({ account: undefined })
    }
  }

  renderAccount(account: EdgeAccount) {
    const { allKeys } = account

    return (
      <SafeAreaView style={styles.scene}>
        <View style={{ padding: 8 }}>
          <Button onPress={this.handleLogout}>
            <Text>Logout</Text>
          </Button>
        </View>
        <View style={{ padding: 8 }}>
          <Text>Edge Account (with wallets):</Text>
          {allKeys.map(info => (
            <Text key={info.id}>{info.type}</Text>
          ))}
        </View>
      </SafeAreaView>
    )
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
          <Text>Edge Context (with users):</Text>
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
      <LoginScreen
        context={context}
        accountOptions={{}}
        onLogin={this.handleLogin}
      />
    )
  }

  render() {
    const { account, showLogin } = this.state
    if (showLogin) return this.renderLogin()
    if (account != null) return this.renderAccount(account)
    return this.renderContext()
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
