import { PageContainer } from '@ant-design/pro-components';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Descriptions, Image, List, Row, Tag } from 'antd';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { getResourceDetail } from './service';

const ResourceDetail: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { isLoading, data } = useQuery({
    queryKey: ['admin-resource-detail', id],
    queryFn: () => getResourceDetail(Number(id)).then((res) => res.data),
  });

  const resource = data?.resource;
  const usedContents = data?.usedContents || [];

  const resourceTypeMap: Record<number, { text: string; color: string }> = {
    1: { text: '图片', color: 'blue' },
    2: { text: '视频', color: 'purple' },
    3: { text: '文档', color: 'green' },
    4: { text: '其他', color: 'default' },
  };

  const formatSize = (size?: number) => {
    if (!size) return '-';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <PageContainer title="资源详情" loading={isLoading}>
      <Row gutter={24}>
        <Col span={16}>
          <Card title="基本信息">
            <Descriptions column={2}>
              <Descriptions.Item label="ID">{resource?.id}</Descriptions.Item>
              <Descriptions.Item label="名称">{resource?.name}</Descriptions.Item>
              <Descriptions.Item label="类型">
                <Tag color={resourceTypeMap[resource?.type || 4]?.color}>
                  {resourceTypeMap[resource?.type || 4]?.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="文件类型">{resource?.fileType}</Descriptions.Item>
              <Descriptions.Item label="大小">{formatSize(resource?.size)}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{resource?.createTime}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {resource?.remark || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {resource?.type === 1 && resource?.url && (
            <Card title="预览" style={{ marginTop: 24 }}>
              <Image src={resource.url} alt={resource.name} style={{ maxWidth: '100%' }} />
            </Card>
          )}
        </Col>

        <Col span={8}>
          <Card title="使用此资源的内容">
            <List
              dataSource={usedContents}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={item.createTime}
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无内容使用此资源' }}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ResourceDetail;
