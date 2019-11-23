// @flow

import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

type Props = {
  onPress: () => mixed,
  children: React$Node
}

export function Button(props: Props) {
  const { onPress, children } = props
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>{children}</View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center'
  }
})
