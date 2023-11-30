import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { polygon } from 'wagmi/chains'
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon],
  [publicProvider()]
);

//Instantiate a wagmi config and pass the results of configureChains.

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [new InjectedConnector({ chains })],
});

// Create a WagmiConfig, pass config and wrap it around the children.

export default function WagmiConfiguration({children}: {children: React.ReactNode}) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
