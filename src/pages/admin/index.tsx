import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import type { FC } from 'react';
import { getDashboardData } from './service';
import type { DashboardData } from './data';

const AdminDashboard: FC = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => getDashboardData().then((res) => res.data),
  });

  const dashboardData = data as DashboardData | undefined;

  const recentContentsColumns: ProColumns[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => {
        const statusMap: Record<number, { text: string; color: string }> = {
          0: { text: '草稿', color: 'default' },
          1: { text: '已发布', color: 'success' },
          '-1': { text: '回收站', color: 'error' },
        };
        const s = statusMap[status] || { text: '未知', color: 'default' };
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  ];

  const recentCommentsColumns: ProColumns[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '作者', dataIndex: 'author', key: 'author', width: 120 },
    { title: '内容', dataIndex: 'text', key: 'text', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => {
        const statusMap: Record<number, { text: string; color: string }> = {
          0: { text: '待审核', color: 'warning' },
          1: { text: '已发布', color: 'success' },
          2: { text: '垃圾评论', color: 'error' },
        };
        const s = statusMap[status] || { text: '未知', color: 'default' };
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  ];

  return (
    <PageContainer title="仪表盘">
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card loading={isLoading}>
            <Statistic title="文章数" value={dashboardData?.contentCount || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={isLoading}>
            <Statistic title="评论数" value={dashboardData?.commentCount || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={isLoading}>
            <Statistic title="标签数" value={dashboardData?.tagCount || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={isLoading}>
            <Statistic title="资源数" value={dashboardData?.resourceCount || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Card title="最新文章" loading={isLoading}>
            <Table
              columns={recentContentsColumns}
              dataSource={dashboardData?.recentContents || []}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最新评论" loading={isLoading}>
            <Table
              columns={recentCommentsColumns}
              dataSource={dashboardData?.recentComments || []}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminDashboard;
