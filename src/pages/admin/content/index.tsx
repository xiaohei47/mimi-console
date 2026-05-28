import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContentList, updateContentStatus } from './service';
import type { ContentEntity } from '../data';

const ContentList: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ['admin-content-list'],
    queryFn: () => getContentList({ page: 1, size: 10 }).then((res) => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      updateContentStatus(id, status),
    onSuccess: () => {
      message.success('状态更新成功');
      queryClient.invalidateQueries({ queryKey: ['admin-content-list'] });
    },
  });

  const columns: ProColumns<ContentEntity>[] = [
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
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/admin/content/edit/${record.id}`)}>
            编辑
          </Button>
          {record.status === 0 && (
            <Popconfirm
              title="确定发布吗？"
              onConfirm={() => updateStatusMutation.mutate({ id: record.id, status: 1 })}
            >
              <Button type="link">发布</Button>
            </Popconfirm>
          )}
          {record.status === 1 && (
            <Popconfirm
              title="确定下架吗？"
              onConfirm={() => updateStatusMutation.mutate({ id: record.id, status: 0 })}
            >
              <Button type="link">下架</Button>
            </Popconfirm>
          )}
          {record.status !== -1 && (
            <Popconfirm
              title="确定移到回收站吗？"
              onConfirm={() => updateStatusMutation.mutate({ id: record.id, status: -1 })}
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="内容管理"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/content/create')}
        >
          新建内容
        </Button>
      }
    >
      <ProTable<ContentEntity>
        columns={columns}
        dataSource={data?.records || []}
        loading={isLoading}
        rowKey="id"
        search={false}
        pagination={{
          total: data?.total || 0,
          pageSize: data?.size || 10,
          current: data?.current || 1,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        request={async (params) => {
          const res = await getContentList({
            page: params.current,
            size: params.pageSize,
          });
          return {
            data: res.data?.records || [],
            total: res.data?.total || 0,
          };
        }}
      />
    </PageContainer>
  );
};

export default ContentList;
