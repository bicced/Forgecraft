import React, {useState, useEffect, useRef} from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { Logo, Navigation, StyledButton } from '../utils/styles';
import { Button, Divider, Modal, Row, Select, Tour, TourProps } from 'antd';

export default () => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { chain } = useNetwork()
  const { chains, switchNetwork } = useSwitchNetwork()
  const { disconnect } = useDisconnect();
  const [_isConnected, _setIsConnected] = useState(false);
  const [_connectors, _setConnectors] = useState<any>([]);
  const chainSelectRef = useRef(null);

  
  const steps: TourProps['steps'] = [
    {
      title: 'Select Network',
      description: 'Please select Polygon network',
      target: () => chainSelectRef.current,
      placement: "bottomLeft",
      nextButtonProps: { 
        onClick: () => {}, 
        disabled: chain?.name !== "Polygon" ? true : undefined
      } as React.ButtonHTMLAttributes<HTMLButtonElement> & { onClick: () => void },
    },
  ];


  useEffect(() => {
    
  }, [chain]);

  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    _setConnectors(connectors);
  }, [connectors]);

  function desktopMenu() {
    return (
      <div></div>
    )
  };

  function mobileMenu() {
    return (
      <div></div>
    )
  }

  function connectButton() {
    function selectConnector(id: string) {
      const connector = _connectors.find((connector: any) => connector.id === id);
      connect({ connector });
    }
  
    if (_isConnected) {
      return (
        <StyledButton danger style={{maxWidth: 100}} onClick={() => disconnect()}>Disconnect</StyledButton>
      );
    }
  
    return (
        <Select className="clickable" placeholder="Connect Wallet" onSelect={(key) => selectConnector(key)} suffixIcon={null}>
          {_connectors.map((connector: any) => (
            <Select.Option className="clickable" disabled={!connector.ready} key={connector.id}>
              {connector.name}
            </Select.Option>
          ))}
        </Select>
    );
  }

  function connectChain() {
    function selectChain(id: string) {
      const idNum = Number(id);
      switchNetwork?.(idNum);
    }

    if (_isConnected) {
      return (
        <div ref={chainSelectRef}>
          <Select value={chain?.name} className="clickable" placeholder="Select Chain" onSelect={(key) => selectChain(key)} suffixIcon={null}>
            {chains.map((chain) => (
              <Select.Option className="clickable" disabled={null} key={chain.id}>
                {chain.name}
              </Select.Option>
            ))}
          </Select>          
          <Tour closeIcon={false} open={_isConnected && chain?.name !== "Polygon"} steps={steps} />
        </div>
      );
    }
  }
  
  function renderConnection() {
    return (
      <Row>
        {connectChain()}
        <Divider type="vertical" />
        {connectButton()}
      </Row>
    )
  }

  return (
    <Navigation>
      <Logo />
      {renderConnection()}
    </Navigation>
  );
}
