import { useContext, useState } from "react";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { GAME_CONTRACT } from "../utils/abi";
import { Col, Divider, Modal, Row, Image } from "antd";
import { Label, StyledButton, StyledCard, StyledCheckbox, Subtitle } from "../utils/styles";
import { CoinType } from "../utils";
import { store } from "../utils/store";

export default ({openNotification, id}: any) => {
  const { state } = useContext(store);
  const {isConnected} = useAccount();
  const [showTradeModal, setShowTradeModal] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);

  const { write: mint, data: mintData } = useContractWrite({
    ...GAME_CONTRACT,
    functionName: 'mint',
    onSuccess: data => openNotification('pending', data.hash),
    onError: data => openNotification('error', data.message)
  });

  const { write: trade, data: tradeData } = useContractWrite({
    ...GAME_CONTRACT,
    functionName: 'trade',
    onSuccess: data => openNotification('pending', data.hash),
    onError: data => openNotification('error', data.message)
  });

  useWaitForTransaction({
    hash: mintData?.hash || tradeData?.hash,
    onSuccess: data => openNotification('success', data.transactionHash),
    onError: data => openNotification('error', data.message)
  });

  function onSelectResource(id: number, checked: boolean) {
    if (checked) {
      setSelectedResource(id);
    }
  }

  function onTrade() {
    trade({ args: [selectedResource, id]});
    setShowTradeModal(false);
  }

  function renderTradeModal() {
    return (
      <Modal 
        title="Trade"
        open={showTradeModal} 
        wrapClassName="clickable"
        okButtonProps={{ disabled: selectedResource === null }} 
        okText="Trade" onOk={onTrade} 
        onCancel={() => {
          setSelectedResource(null);
          setShowTradeModal(false);
      }}>
        <Row style={{display: 'flex', justifyContent: 'center'}}>
          {
            Object.values(CoinType).filter((v) => !isNaN(Number(v))).map((value: any) => {
              if (state.balances[value] > 0) {
                return (
                  <div style={{maxWidth: 100, textAlign: 'center'}}>
                    <Label>{state.metadata[value]?.name}</Label>
                    <Image src={state.metadata[value]?.image}></Image>
                    <StyledCheckbox checked={selectedResource === value} value={value} onChange={(e) => onSelectResource(e.target.value, e.target.checked)} />
                  </div>
                )
              }
            })
          }
        </Row>
        <Divider>FOR</Divider>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{maxWidth: 100, textAlign: 'center'}}>
            <Label>{state.metadata[id]?.name}</Label>
            <Image src={state.metadata[id]?.image}></Image>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <StyledCard>
      <Subtitle>{state.metadata[id]?.name}</Subtitle>
      <Image src={state.metadata[id]?.image}></Image>
      <Row style={{marginTop: 20}} gutter={[10, 10]}>
        <Col span={12}>
          <StyledButton disabled={!isConnected} onClick={() => mint({ args: [id] })}>Mint</StyledButton>
        </Col>
        <Col span={12}>
          <StyledButton disabled={!isConnected} type="default" onClick={() => setShowTradeModal(true)}>Trade</StyledButton>
        </Col>
      </Row>
      {renderTradeModal()}
    </StyledCard>
  )
}
