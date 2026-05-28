import { PageContainer } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Col, message, Row, Space, Statistic, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import { useState } from 'react';
import { exportBackup, getBackupStats, importBackup } from './service';

const BackupSettings: FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const { data: statsData } = useQuery({
    queryKey: ['admin-backup-stats'],
    queryFn: () => getBackupStats().then((res) => res.data),
  });

  const exportMutation = useMutation({
    mutationFn: () => exportBackup(),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-${new Date().toISOString().slice(0, 10)}.zip`;
      link.click();
      window.URL.revokeObjectURL(url);
      message.success('导出成功');
    },
    onError: () => {
      message.error('导出失败');
    },
  });

  const importMutation = useMutation({
    mutationFn: (file: File) => importBackup(file),
    onSuccess: () => {
      message.success('导入成功');
      setFileList([]);
      queryClient.invalidateQueries({ queryKey: ['admin-backup-stats'] });
    },
    onError: () => {
      message.error('导入失败');
    },
  });

  const handleImport = () => {
    if (fileList.length === 0) {
      message.error('请选择备份文件');
      return;
    }
    importMutation.mutate(fileList[0].originFileObj);
  };

  return (
    <>
      <Card title="数据统计" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Statistic title="文章数" value={statsData?.contentCount || 0} />
          </Col>
          <Col span={6}>
            <Statistic title="评论数" value={statsData?.commentCount || 0} />
          </Col>
          <Col span={6}>
            <Statistic title="标签数" value={statsData?.tagCount || 0} />
          </Col>
          <Col span={6}>
            <Statistic title="资源数" value={statsData?.resourceCount || 0} />
          </Col>
        </Row>
      </Card>

      <Card title="备份操作">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <h4>导出备份</h4>
            <p>导出所有数据为ZIP文件</p>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => exportMutation.mutate()}
              loading={exportMutation.isPending}
            >
              导出备份
            </Button>
          </div>

          <div>
            <h4>导入备份</h4>
            <p>从ZIP文件导入数据（注意：这将覆盖现有数据）</p>
            <Space>
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                accept=".zip"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>选择备份文件</Button>
              </Upload>
              <Button
                type="primary"
                onClick={handleImport}
                loading={importMutation.isPending}
                disabled={fileList.length === 0}
              >
                导入备份
              </Button>
            </Space>
          </div>
        </Space>
      </Card>
    </>
  );
};

export default BackupSettings;
