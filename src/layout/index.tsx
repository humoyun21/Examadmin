import React, { useEffect, useState } from "react";
import './style.css';
import {
  DiffOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { Button, Layout, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import http from "../config";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  async function checkToken() {
    const response = await http.get('/admin/profile');
    if (response?.status !== 200) {
      navigate('/');
    }
  }

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <Layout className="app-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sidebar"
      >
        <div className="logo-container">
          <h1 className="logo-text">Admin</h1>
        </div>
        <div className="sidebar-menu">
          <div
            className="menu-item"
            onClick={() => navigate('/dashboard')}
          >
            <ProductOutlined className="menu-icon" />
            <span className={`menu-text ${collapsed ? 'collapsed' : ''}`}>Products</span>
          </div>
          <div
            className="menu-item"
            onClick={() => navigate('categories')}
          >
            <DiffOutlined className="menu-icon" />
            <span className={`menu-text ${collapsed ? 'collapsed' : ''}`}>Categories</span>
          </div>
        </div>
      </Sider>
      <Layout>
        <Header className="header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-button"
          />
        </Header>
        <Content
          className="content"
          style={{
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
