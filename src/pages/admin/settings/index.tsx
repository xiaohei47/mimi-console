import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Menu, Row } from 'antd';
import type { FC } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const SettingsLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/admin/settings/profile', label: '个人资料' },
    { key: '/admin/settings/site', label: '网站设置' },
    { key: '/admin/settings/backup', label: '备份管理' },
  ];

  const selectedKey = menuItems.find((item) =>
    location.pathname.startsWith(item.key)
  )?.key || '/admin/settings/profile';

  return (
    <PageContainer title="设置">
      <Row gutter={24}>
        <Col span={6}>
          <Card>
            <Menu
              selectedKeys={[selectedKey]}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
            />
          </Card>
        </Col>
        <Col span={18}>
          <Outlet />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default SettingsLayout;
