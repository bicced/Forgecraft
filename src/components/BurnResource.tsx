import { useContext, useState } from "react";
import { Row, Image, Modal } from "antd";
import { CoinType } from "../utils";
import { Subtitle, StyledButton, StyledCard, Label, StyledCheckbox } from "../utils/styles";
import { store } from "../utils/store";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { GAME_CONTRACT } from "../utils/abi";

const BURN_IMAGE = "https://ipfs.io/ipfs/QmerERdFAtebwUcmaW11LcRXu7vDZGStLCzDHPPxDtQRZt/Burn.svg";

export default ({openNotification}: any) => {
  const { state } = useContext(store);
  const {isConnected} = useAccount();
  const [showBurnModal, setShowBurnModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);

  const { write: burn, data: forgeData } = useContractWrite({
    ...GAME_CONTRACT,
    functionName: 'burn',
    onSuccess: data => openNotification('pending', data.hash),
    onError: data => openNotification('error', data.message)
  });

  useWaitForTransaction({
    hash: forgeData?.hash,
    onSuccess: data => openNotification('success', data.transactionHash),
    onError: data => openNotification('error', data.message)
  });

  function onBurn() {
    burn({ args: [selectedResource]});
    setSelectedResource(null);
    setShowBurnModal(false);
  }

  function renderBurnModal() {
    return (
      <Modal 
        title="Burn" 
        open={showBurnModal} 
        wrapClassName="clickable"
        okButtonProps={{ disabled: selectedResource === null, danger: true }} 
        okText="Burn" onOk={onBurn} 
        onCancel={() => {
          setSelectedResource(null);
          setShowBurnModal(false);
        }}>
        <Row style={{display: 'flex', justifyContent: 'center'}}>
          {
            [CoinType.AXE, CoinType.SLING, CoinType.BAG, CoinType.HUT].map((value: any) => {
              if (state.balances[value] > 0) {
                return (
                  <div style={{maxWidth: 100, textAlign: 'center'}}>
                    <Label>{state.metadata[value]?.name}</Label>
                    <Image src={state.metadata[value]?.image}></Image>
                    <StyledCheckbox checked={selectedResource === value} value={value} onChange={() => setSelectedResource(value)} />
                  </div>
                )
              }
            })
          }
        </Row>
      </Modal>
    )
  }

  return (
    <StyledCard>
      <Subtitle>Burn</Subtitle>
      <Image src={BURN_IMAGE}></Image>
      <StyledButton disabled={!isConnected} type="primary" danger style={{marginTop: 20}} onClick={() => setShowBurnModal(true)}>Burn</StyledButton>
      {renderBurnModal()}
    </StyledCard>
  )
}
