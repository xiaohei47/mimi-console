import { UploadOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Popconfirm, Space, Tag, Upload } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { disablePlugin, enablePlugin, getPluginList, uploadPlugin } from './service';
import type { PluginDataDTO } from '../data';

const PluginList: FC = () => {
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<any[]>([]);

  const { isLoading, data } = useQuery({
    queryKey: ['admin-plugin-list'],
    queryFn: () => getPluginList().then((res) => res.data),
  });

  const enableMutation = useMutation({
    mutationFn: (pluginId: string) => enablePlugin(pluginId),
    onSuccess: () => {
      message.success('启用成功');
      queryClient.invalidateQueries({ queryKey: ['admin-plugin-list'] });
    },
  });

  const disableMutation = useMutation({
    mutationFn: (pluginId: string) => disablePlugin(pluginId),
    onSuccess: () => {
      message.success('禁用成功');
      queryClient.invalidateQueries({ queryKey: ['admin-plugin-list'] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadPlugin(file),
    onSuccess: () => {
      message.success('上传成功');
      setFileList([]);
      queryClient.invalidateQueries({ queryKey: ['admin-plugin-list'] });
    },
    onError: () => {
      message.error('上传失败');
    },
  });

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.error('请选择插件文件');
      return;
    }
    uploadMutation.mutate(fileList[0].originFileObj);
  };

  const columns: ProColumns<PluginDataDTO>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 120 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '版本', dataIndex: 'version', key: 'version', width: 100 },
    { title: '作者', dataIndex: 'author', key: 'author', width: 120 },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'default'}>
          {enabled ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          {record.enabled ? (
            <Popconfirm
              title="确定禁用吗？"
              onConfirm={() => disableMutation.mutate(record.id)}
            >
              <Button type="link" danger>
                禁用
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="确定启用吗？"
              onConfirm={() => enableMutation.mutate(record.id)}
            >
              <Button type="link">启用</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="插件管理"
      extra={
        <Space>
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            accept=".jar"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>选择插件</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            loading={uploadMutation.isPending}
            disabled={fileList.length === 0}
          >
            上传插件
          </Button>
        </Space>
      }
    >
      <ProTable<PluginDataDTO>
        columns={columns}
        dataSource={data || []}
        loading={isLoading}
        rowKey="id"
        search={false}
        pagination={false}
      />
    </PageContainer>
  );
};

export default PluginList;
