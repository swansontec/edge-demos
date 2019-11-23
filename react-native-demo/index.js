// @flow

import { AppRegistry } from 'react-native'

import { name as appName } from './app.json'
import { EdgeCoreManager } from './src/EdgeCoreManager.js'

AppRegistry.registerComponent(appName, () => EdgeCoreManager)
