import { Col, Row } from "antd";
import BasicResource from "./BasicResource";
import { CoinType } from "../utils";

export default ({openNotification}: any) => {
  return (
    <Row gutter={[{ xs: 50, sm: 20, md: 40, lg: 40, xl: 40, xxl: 80 }, { xs: 50, sm: 20, md: 40, lg: 40, xl: 40, xxl: 80 }]}>
      <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
        <BasicResource id={CoinType.WOOD} openNotification={openNotification} />
      </Col>
      <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
        <BasicResource id={CoinType.STONE} openNotification={openNotification} />
      </Col>
      <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
        <BasicResource id={CoinType.CLOTH} openNotification={openNotification} />
      </Col>
    </Row>
  )
}
