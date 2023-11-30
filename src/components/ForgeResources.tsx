import { useContext, useState } from "react";
import { Col, Row, Image, Modal, Divider } from "antd";
import { CoinType } from "../utils";
import { Label, StyledButton, StyledCard, StyledCheckbox, Subtitle } from "../utils/styles";
import { store } from "../utils/store";
import { FORGE_CONTRACT } from "../utils/abi";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import _ from "lodash";

export default ({openNotification}: any) => {
  const { state } = useContext(store);
  const [selectedResources, setSelectedResources] = useState<any>([]);
  const [showForgeModal, setShowForgeModal] = useState(false);

  const { write: forge, data: forgeData } = useContractWrite({
    ...FORGE_CONTRACT,
    functionName: 'forge',
    onSuccess: data => openNotification('pending', data.hash),
    onError: data => openNotification('error', data.message)
  });

  useWaitForTransaction({
    hash: forgeData?.hash,
    onSuccess: data => openNotification('success', data.transactionHash),
    onError: data => openNotification('error', data.message)
  });
  
  function onSelectResource(id: number, checked: boolean) {
    if (checked) {
      setSelectedResources([...selectedResources, id]);
    } else {
      setSelectedResources(selectedResources.filter((resource: any) => resource !== id));
    }
  }

  function onForge() {
    const item = forgeMap();
    forge({ args: [item]});
    setSelectedResources([]);
    setShowForgeModal(false);
  }

  function forgeMap() {
    const hut = _.isEmpty(_.xor(selectedResources, [CoinType.WOOD, CoinType.STONE, CoinType.CLOTH]));
    const axe = _.isEmpty(_.xor(selectedResources, [CoinType.WOOD, CoinType.STONE]));
    const bag = _.isEmpty(_.xor(selectedResources, [CoinType.WOOD, CoinType.CLOTH]));
    const sling = _.isEmpty(_.xor(selectedResources, [CoinType.STONE, CoinType.CLOTH]));
    const item = hut ? CoinType.HUT : axe ? CoinType.AXE : bag ? CoinType.BAG : sling ? CoinType.SLING : null;
    return item;
  }

  function renderForgedItem() {
    const item = forgeMap();
    if (item) {
      return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{maxWidth: 100, textAlign: 'center'}}>
            <Label>{state.metadata[item]?.name}</Label>
            <Image src={state.metadata[item]?.image}></Image>
          </div>
        </div>
      )
    }
  }

  function renderForgeModal() {
    return (
      <Modal 
        title="Forge" 
        open={showForgeModal}
        wrapClassName="clickable"
        okText="Forge" onOk={onForge} 
        onCancel={() => {
          setSelectedResources([]);
          setShowForgeModal(false);
        }}>
          <Row style={{display: 'flex', justifyContent: 'center'}}>
            {
              selectedResources.map((value: any) => {
                return (
                  <div style={{maxWidth: 100, textAlign: 'center'}}>
                    <Label>{state.metadata[value]?.name}</Label>
                    <Image src={state.metadata[value]?.image}></Image>
                  </div>
                )
              })
            }
          </Row>
          <Divider>TO</Divider>
          {renderForgedItem()}
      </Modal>
    )
  }

  return (
    <StyledCard>
      <Subtitle>Forge</Subtitle>
      <p>Forge two resources to create a new item</p>
      <Row style={{marginBottom: 20}} gutter={[{ xs: 50, sm: 20, md: 40, lg: 40, xl: 40, xxl: 80 }, { xs: 50, sm: 20, md: 40, lg: 40, xl: 40, xxl: 80 }]}>
        <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
          <Label>{state.metadata[CoinType.WOOD]?.name}</Label>
          <Image className="clickable" src={state.metadata[CoinType.WOOD]?.image}></Image>
          <StyledCheckbox className="clickable" disabled={state.balances[CoinType.WOOD] === 0} checked={selectedResources.includes(CoinType.WOOD)} value={CoinType.WOOD} onChange={(e) => onSelectResource(e.target.value, e.target.checked)} />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
          <Label>{state.metadata[CoinType.STONE]?.name}</Label>
          <Image src={state.metadata[CoinType.STONE]?.image}></Image>
          <StyledCheckbox className="clickable" disabled={state.balances[CoinType.STONE] === 0} checked={selectedResources.includes(CoinType.STONE)} value={CoinType.STONE} onChange={(e) => onSelectResource(e.target.value, e.target.checked)} />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
          <Label>{state.metadata[CoinType.CLOTH]?.name}</Label>
          <Image src={state.metadata[CoinType.CLOTH]?.image}></Image>
          <StyledCheckbox className="clickable" disabled={state.balances[CoinType.CLOTH] === 0} checked={selectedResources.includes(CoinType.CLOTH)} value={CoinType.CLOTH} onChange={(e) => onSelectResource(e.target.value, e.target.checked)} />
        </Col>
      </Row>
      <StyledButton type="primary" disabled={selectedResources.length < 2} onClick={() => setShowForgeModal(true)}>Forge</StyledButton>
      {renderForgeModal()}
    </StyledCard>
  )
}
