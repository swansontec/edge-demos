// @flow

import { type EdgeContext } from 'edge-core-js/types'
import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

type Props = {
  context: EdgeContext
}

type State = {}

export class MainScene extends Component<Props, State> {
  render() {
    const { context } = this.props
    const { localUsers } = context

    return (
      <SafeAreaView style={styles.scene}>
        <View style={{ padding: 8 }}>
          <Text>Active Users:</Text>
          {localUsers.map(user => (
            <Text key={user.username}>{user.username}</Text>
          ))}
        </View>
      </SafeAreaView>
    )
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
