import React, { useContext, useEffect, useState } from "react";
import { Body, Container, Label, Subtitle, Title } from "./utils/styles";
import { Col, Divider, FloatButton, Modal, Row, notification } from "antd";
import Balances from "./components/Balances";
import BasicResources from "./components/BasicResources";
import { useAccount, useBalance, useContractRead } from "wagmi";
import { GAME_CONTRACT } from "./utils/abi";
import { store } from "./utils/store";
import { CoinType } from "./utils";
import ForgeResources from "./components/ForgeResources";
import BurnResource from "./components/BurnResource";
import Pointer from "./utils/Pointer";
import { GithubOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {OpenseaOutlined, PolygonOutlined} from "./utils/assets/svg";

const Context = React.createContext({ name: 'Default' });

export default function Home() {
  const { dispatch } = useContext(store);
  const account = useAccount();
  const { data } = useBalance({address: account.address});
  const [balance, setBalance] = useState<any>(null);
  const [api, contextHolder] = notification.useNotification();
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    if (data) {
      setBalance(data);
    }
  }, [data]);

  useContractRead({
    ...GAME_CONTRACT,
    functionName: 'balanceOfBatch',
    args: [Array(7).fill(account.address), [CoinType.WOOD, CoinType.STONE, CoinType.CLOTH, CoinType.AXE, CoinType.SLING, CoinType.BAG, CoinType.HUT]],
    watch: true,
    onSuccess: (data) => {
      dispatch({type: 'SET_BALANCES', payload: data});
    }
  });

  useContractRead({
    ...GAME_CONTRACT,
    functionName: 'uri',
    args: [99999],
    watch: true,
    onSuccess: async (url: string) => {
      const metadata: any = {};
      for await (const id of Object.values(CoinType).filter((v) => !isNaN(Number(v)))) {
        const formattedUrl = url.replace("{id}", id.toString());
        try {
          const response = await fetch(formattedUrl);
          const data = await response.json();
          metadata[id] = data;
        }
        catch (err) {
          console.log(err);
        }
      }
      dispatch({type: 'SET_METADATA', payload: metadata});
    }
  });

  const openNotification = (type: string, msg: any) => {
    switch (type) {
      case 'pending':
        return api.info({
          message: `Trasaction Submitted`,
          description: `${msg}`,
          placement: 'bottomRight',
        });
      case 'success':
        return api.success({
          message: `Trasaction Successful`,
          description: `${msg}`,
          placement: 'bottomRight',
        });
      case 'error':
        return api.error({
          message: `Trasaction Error`,
          description: `${msg}`,
          placement: 'bottomRight',
        });
      default:
        return;
    }
  };

  function renderHelpModal() {
    return (
      <Modal wrapClassName="clickable" style={{textAlign: 'center'}} open={showAboutModal} onOk={() => setShowAboutModal(false)} onCancel={() => setShowAboutModal(false)}>
        <Subtitle>About</Subtitle>
        <p>This is a forging game built using the ERC1155 token standard</p>
        <Divider>Mint</Divider>
        <p>You can mint base resources - Wood, Stone and Cloth for free</p>
        <p>All base resources have a global cooldown of 1 minute between mints</p>
        <Divider>Trade</Divider>
        <p>You can trade any resource for a base resource</p>
        <Divider>Forge</Divider>
        <p>You can combine base resources to forge advanced resources - Axe, Sling, Bag, Tent </p>
        <Divider>Burn</Divider>
        <p>You can burn any advanced resources</p>
      </Modal>
    )
  }

  function renderAddressBalance() {
    if (balance) {
      return (
        <Label style={{position: "absolute", right: 10, margin: 10}}>{balance?.formatted.slice(0, 9)} - {balance?.symbol}</Label>
      )
    }
  }

  return (
    <Body>
      {renderAddressBalance()}
      <Container>
        {!account.isConnected && <Title style={{textAlign: 'center'}}>Please Connect Your Wallet</Title>}
        <Row gutter={[{ xs: 50, sm: 20, md: 40, lg: 40, xl: 40, xxl: 80 }, { xs: 50, sm: 20, md: 40, lg: 40, xl: 40, xxl: 80 }]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Balances />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <BasicResources openNotification={openNotification} />
          </Col>
          <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
            <ForgeResources openNotification={openNotification} />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
            <BurnResource openNotification={openNotification} />
          </Col>
        </Row>
        <Context.Provider value={{ name: "" }}>{contextHolder}</Context.Provider>
      </Container>
      <FloatButton.Group shape="square" style={{ left: 20 }}>
        <FloatButton className="clickable" tooltip="Need Help?" onClick={() => setShowAboutModal(true)} icon={<QuestionCircleOutlined />} />
        <FloatButton className="clickable" tooltip="View on Polygonscan" icon={PolygonOutlined} onClick={() => window.open("https://polygonscan.com/address/0xa1cf67b0913fe247cc1fe56f3a805b3218959d59")} />
        <FloatButton className="clickable" tooltip="View on Opensea"  icon={OpenseaOutlined} onClick={() => window.open("https://opensea.io/collection/unidentified-contract-11895")} />
        <FloatButton className="clickable" tooltip="View on Github" icon={<GithubOutlined />} onClick={() => window.open("https://github.com/bicced/Forgecraft")} />
      </FloatButton.Group>
      {renderHelpModal()}
      <Pointer />
    </Body>
  )
}
