import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteResource, getResourceList } from './service';
import type { ResourceEntity } from '../data';

const ResourceList: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ['admin-resource-list'],
    queryFn: () => getResourceList({ page: 1, size: 10 }).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteResource(id),
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries({ queryKey: ['admin-resource-list'] });
    },
  });

  const resourceTypeMap: Record<number, { text: string; color: string }> = {
    1: { text: '图片', color: 'blue' },
    2: { text: '视频', color: 'purple' },
    3: { text: '文档', color: 'green' },
    4: { text: '其他', color: 'default' },
  };

  const columns: ProColumns<ResourceEntity>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: number) => {
        const t = resourceTypeMap[type] || { text: '未知', color: 'default' };
        return <Tag color={t.color}>{t.text}</Tag>;
      },
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      key: 'fileType',
      width: 120,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => {
        if (!size) return '-';
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
      },
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/admin/resources/detail/${record.id}`)}>
            详情
          </Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="资源管理"
      extra={
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => navigate('/admin/resources/upload')}
        >
          上传资源
        </Button>
      }
    >
      <ProTable<ResourceEntity>
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
        }}
        request={async (params) => {
          const res = await getResourceList({
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

export default ResourceList;
