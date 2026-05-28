import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, message, Modal, Popconfirm, Space } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { deleteTag, getTagList, saveTag } from './service';
import type { TagEntity } from '../data';

const TagList: FC = () => {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagEntity | null>(null);
  const [form] = Form.useForm();

  const { isLoading, data } = useQuery({
    queryKey: ['admin-tag-list'],
    queryFn: () => getTagList({ page: 1, size: 10 }).then((res) => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, name }: { id?: number; name: string }) => saveTag(id, name),
    onSuccess: () => {
      message.success('保存成功');
      setModalVisible(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['admin-tag-list'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries({ queryKey: ['admin-tag-list'] });
    },
  });

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: TagEntity) => {
    setEditingTag(record);
    form.setFieldsValue({ name: record.name });
    setModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      saveMutation.mutate({ id: editingTag?.id, name: values.name });
    });
  };

  const columns: ProColumns<TagEntity>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
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
      title="标签管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建标签
        </Button>
      }
    >
      <ProTable<TagEntity>
        columns={columns}
        dataSource={data?.records || []}
        loading={isLoading}
        rowKey="id"
        search={false}
        pagination={{
          total: data?.total || 0,
          pageSize: data?.size || 10,
          current: data?.current || 1,
        }}
        request={async (params) => {
          const res = await getTagList({
            page: params.current,
            size: params.pageSize,
          });
          return {
            data: res.data?.records || [],
            total: res.data?.total || 0,
          };
        }}
      />

      <Modal
        title={editingTag ? '编辑标签' : '新建标签'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={saveMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标签名称"
            name="name"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TagList;
