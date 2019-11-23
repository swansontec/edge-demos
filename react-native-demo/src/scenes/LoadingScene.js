// @flow

import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

export function LoadingScene(props: {}) {
  return (
    <View style={styles.scene}>
      <ActivityIndicator size="large" />
      <Text>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  scene: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  }
})
