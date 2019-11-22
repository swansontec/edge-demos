// @flow

import {
  addEdgeCorePlugins,
  lockEdgeCorePlugins,
  makeEdgeContext
} from 'edge-core-js'
import type {
  EdgeAccount,
  EdgeContext,
  EdgeCurrencyWallet,
  EdgeSpendInfo
} from 'edge-core-js/types'
import bitcoinPlugins from 'edge-currency-bitcoin'

addEdgeCorePlugins(bitcoinPlugins)
lockEdgeCorePlugins()

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  // Start the core, with Bitcoin enabled:
  const context: EdgeContext = await makeEdgeContext({
    apiKey: '4248c1bf41e53b840a5fdb2c872dd3ade525e66d',
    appId: '',
    plugins: {
      bitcoin: true
    }
  })

  // Log in to some user:
  const account: EdgeAccount = await context.loginWithPassword(
    'some username',
    'some password'
  )

  // Wait for the first Bitcoin wallet to load:
  const walletInfo = account.getFirstWalletInfo('wallet:bitcoin')
  if (walletInfo == null) throw new Error('No BTC wallet in this account')
  const wallet: EdgeCurrencyWallet = await account.waitForCurrencyWallet(
    walletInfo.id
  )

  // Print off the balance after we have a bit of time to sync:
  await sleep(5000)
  console.log(wallet.balances)

  // Now we can send money?
  const spendInfo: EdgeSpendInfo = {
    spendTargets: [
      {
        publicAddress: '', // Some bitcoin address
        nativeAmount: '100000' // Some amount of Satoshis, as a string
      }
    ]
  }
  let tx = await wallet.makeSpend(spendInfo)
  tx = await wallet.signTx(tx)
  await wallet.broadcastTx(tx)
  await wallet.saveTx(tx)

  // Log out:
  await account.logout()
  process.exit(0)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
