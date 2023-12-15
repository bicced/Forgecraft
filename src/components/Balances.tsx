import { useContext } from "react";
import { Col, Row, Statistic } from "antd";
import { store } from '../utils/store';
import { StyledCard, Subtitle } from "../utils/styles";
import { CoinType } from "../utils";

export default () => {
  const { state } = useContext(store);
  return (
    <StyledCard>
      <Row>
        <Col xs={24} sm={24} md={24} lg={3} xl={3} xxl={3} key={'title'}>
          <Subtitle>Resources</Subtitle>
        </Col>
        {
          Object.values(CoinType).filter((v) => !isNaN(Number(v))).map((id: any) => {
            return (
              <Col xs={6} sm={3} md={3} lg={3} xl={3} xxl={3} key={id}>
                <Statistic title={state.metadata[id]?.name} prefix={<img style={{height: 50}} src={state.metadata[id]?.image} />} value={state.balances[id]} />
              </Col>
            )
          })
        }
      </Row>
    </StyledCard>
  )
}
