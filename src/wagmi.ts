import { http, createConfig } from 'wagmi'
import { bscTestnet, opBNBTestnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [bscTestnet, sepolia, opBNBTestnet],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [sepolia.id]: http(),
    [opBNBTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
