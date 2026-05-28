import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, message, Modal, Popconfirm, Space, Tag } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { deleteComment, getCommentList, replyComment, updateCommentStatus } from './service';
import type { CommentEntity } from '../data';

const CommentList: FC = () => {
  const queryClient = useQueryClient();
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyingComment, setReplyingComment] = useState<CommentEntity | null>(null);
  const [replyForm] = Form.useForm();

  const { isLoading, data } = useQuery({
    queryKey: ['admin-comment-list'],
    queryFn: () => getCommentList({ page: 1, size: 10 }).then((res) => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      updateCommentStatus(id, status),
    onSuccess: () => {
      message.success('状态更新成功');
      queryClient.invalidateQueries({ queryKey: ['admin-comment-list'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteComment(id),
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries({ queryKey: ['admin-comment-list'] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ parentId, text }: { parentId: number; text: string }) =>
      replyComment(parentId, text),
    onSuccess: () => {
      message.success('回复成功');
      setReplyModalVisible(false);
      replyForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ['admin-comment-list'] });
    },
  });

  const handleReply = (record: CommentEntity) => {
    setReplyingComment(record);
    replyForm.resetFields();
    setReplyModalVisible(true);
  };

  const handleReplySubmit = () => {
    replyForm.validateFields().then((values) => {
      if (replyingComment) {
        replyMutation.mutate({ parentId: replyingComment.id, text: values.text });
      }
    });
  };

  const columns: ProColumns<CommentEntity>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '作者', dataIndex: 'author', key: 'author', width: 120 },
    { title: '内容', dataIndex: 'text', key: 'text', ellipsis: true },
    { title: 'IP地址', dataIndex: 'ipAddress', key: 'ipAddress', width: 140 },
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
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space>
          {record.status === 0 && (
            <Popconfirm
              title="确定通过吗？"
              onConfirm={() => updateStatusMutation.mutate({ id: record.id, status: 1 })}
            >
              <Button type="link">通过</Button>
            </Popconfirm>
          )}
          {record.status !== 2 && (
            <Popconfirm
              title="确定标记为垃圾吗？"
              onConfirm={() => updateStatusMutation.mutate({ id: record.id, status: 2 })}
            >
              <Button type="link" danger>
                垃圾
              </Button>
            </Popconfirm>
          )}
          <Button type="link" onClick={() => handleReply(record)}>
            回复
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
    <PageContainer title="评论管理">
      <ProTable<CommentEntity>
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
          const res = await getCommentList({
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
        title="回复评论"
        open={replyModalVisible}
        onOk={handleReplySubmit}
        onCancel={() => setReplyModalVisible(false)}
        confirmLoading={replyMutation.isPending}
      >
        <Form form={replyForm} layout="vertical">
          <Form.Item label="原评论">
            <Input.TextArea value={replyingComment?.text} readOnly rows={3} />
          </Form.Item>
          <Form.Item
            label="回复内容"
            name="text"
            rules={[{ required: true, message: '请输入回复内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入回复内容" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default CommentList;
