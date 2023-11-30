import styled from 'styled-components';
import { Button, Menu, Select, Checkbox } from 'antd';
import logourl from './assets/logo.svg';

const LEAVES_BACKGROUND_URL = "https://ipfs.io/ipfs/QmbD9np6QsXSJFqYmQz6o4op3TJdouxkmmyTic1bHLTZaD";

export const Body = styled.div`
  display: flex;
  justify-content: center;
  background: url(${LEAVES_BACKGROUND_URL});
`;

export const Logo = styled(({...props}) => <img alt="logo" src={logourl} {...props}/>)`
  max-height: 40px;
  width: auto;
`;

export const Container = styled.div`
  padding: 40px;
  max-width: 1000px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const Subtitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const Label = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Navigation = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  background-color: #003366;
`;

export const StyledMenu = styled(Menu)`
  background-color: #00000000;
  display: block;
  font-weight: bold;
  font-size: 14px;
  border-radius: 50px;
  border: 0;
  .ant-menu-item {
    color: white !important;
    border-radius: 50px !important;
    margin-right: 10px !important;
  }
  .ant-menu-item-selected, .ant-menu-item:hover {
    color: #1e91e8 !important;
    background-color: white !important;
  };
  .ant-menu-item::after {
    border: 0 !important;
  }
`;

export const StyledCard = styled.div`
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  background-color: white;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.5);
`;

export const StyledButton = styled(({...props}) => <Button {...props}/>).attrs({
  className: 'clickable'
})`
  background-color: ${({type}) => (type === 'default' ? 'white' : '#003366')};
  color: ${({type}) => (type === 'default' ? '#' : 'white')};
  width: 100%;
  border-radius: 10px;
`;

export const StyledSelect = styled(Select)`

`;

export const StyledSelectOption = styled(Select.Option)`
  height: 80px;
`;

export const StyledCheckbox = styled(Checkbox).attrs({
  
})`
  
`;

