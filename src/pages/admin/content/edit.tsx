import { PageContainer } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, message, Select, Space, Tag } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getContentDetail, saveContent } from './service';
import { getAllTags } from '../tag/service';
import type { ContentParam, TagEntity } from '../data';

const ContentEdit: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const isEdit = !!id;

  const { data: contentData } = useQuery({
    queryKey: ['admin-content-detail', id],
    queryFn: () => getContentDetail(Number(id)).then((res) => res.data),
    enabled: isEdit,
  });

  const { data: tagsData } = useQuery({
    queryKey: ['admin-tags-all'],
    queryFn: () => getAllTags().then((res) => res.data),
  });

  useEffect(() => {
    if (contentData) {
      form.setFieldsValue({
        title: contentData.title,
        summary: contentData.summary,
      });
      setContent(contentData.content || '');
      if (contentData.tags) {
        setSelectedTagIds(contentData.tags.map((t) => t.id));
      }
    }
  }, [contentData, form]);

  const saveMutation = useMutation({
    mutationFn: (data: ContentParam) => saveContent(data),
    onSuccess: (res) => {
      message.success('保存成功');
      queryClient.invalidateQueries({ queryKey: ['admin-content-list'] });
      navigate('/admin/content');
    },
    onError: () => {
      message.error('保存失败');
    },
  });

  const handleSave = () => {
    form.validateFields().then((values) => {
      saveMutation.mutate({
        id: isEdit ? Number(id) : undefined,
        title: values.title,
        content: content,
        summary: values.summary,
        status: contentData?.status || 0,
        tagIds: selectedTagIds,
      });
    });
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <PageContainer
      title={isEdit ? '编辑内容' : '创建内容'}
      onBack={() => navigate('/admin/content')}
    >
      <Card>
        <Form form={form} layout="vertical">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>

          <Form.Item label="摘要" name="summary">
            <Input.TextArea rows={2} placeholder="请输入文章摘要（可选）" />
          </Form.Item>

          <Form.Item label="内容">
            <Input.TextArea
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入文章内容（Markdown格式）"
            />
          </Form.Item>

          <Form.Item label="标签">
            <Space wrap>
              {tagsData?.map((tag) => (
                <Tag
                  key={tag.id}
                  color={selectedTagIds.includes(tag.id) ? 'blue' : 'default'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </Tag>
              ))}
            </Space>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSave} loading={saveMutation.isPending}>
                保存
              </Button>
              <Button onClick={() => navigate('/admin/content')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default ContentEdit;
