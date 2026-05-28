import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, message, Modal, Popconfirm, Space, Switch, Tag } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { deleteMenu, getMenuList, saveMenu, updateMenuStatus } from './service';
import type { MenuEntity } from '../data';

const MenuList: FC = () => {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuEntity | null>(null);
  const [form] = Form.useForm();

  const { isLoading, data } = useQuery({
    queryKey: ['admin-menu-list'],
    queryFn: () => getMenuList().then((res) => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: (data: { id?: number; name: string; path: string; status?: number }) =>
      saveMenu(data),
    onSuccess: () => {
      message.success('保存成功');
      setModalVisible(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['admin-menu-list'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMenu(id),
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries({ queryKey: ['admin-menu-list'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      updateMenuStatus(id, status),
    onSuccess: () => {
      message.success('状态更新成功');
      queryClient.invalidateQueries({ queryKey: ['admin-menu-list'] });
    },
  });

  const handleAdd = () => {
    setEditingMenu(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: MenuEntity) => {
    setEditingMenu(record);
    form.setFieldsValue({
      name: record.name,
      path: record.path,
      status: record.status === 1,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      saveMutation.mutate({
        id: editingMenu?.id,
        name: values.name,
        path: values.path,
        status: values.status ? 1 : 0,
      });
    });
  };

  const columns: ProColumns<MenuEntity>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '路径', dataIndex: 'path', key: 'path' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 200,
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
      title="菜单管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建菜单
        </Button>
      }
    >
      <ProTable<MenuEntity>
        columns={columns}
        dataSource={data || []}
        loading={isLoading}
        rowKey="id"
        search={false}
        pagination={false}
      />

      <Modal
        title={editingMenu ? '编辑菜单' : '新建菜单'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={saveMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="菜单名称"
            name="name"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>
          <Form.Item
            label="菜单路径"
            name="path"
            rules={[{ required: true, message: '请输入菜单路径' }]}
          >
            <Input placeholder="请输入菜单路径" />
          </Form.Item>
          <Form.Item label="启用状态" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default MenuList;
