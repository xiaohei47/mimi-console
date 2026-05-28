import { PageContainer } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Button, Card, Form, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResource } from './service';

const ResourceUpload: FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const uploadMutation = useMutation({
    mutationFn: ({ file, remark }: { file: File; remark?: string }) =>
      uploadResource(file, remark),
    onSuccess: () => {
      message.success('上传成功');
      navigate('/admin/resources');
    },
    onError: () => {
      message.error('上传失败');
    },
  });

  const handleUpload = () => {
    form.validateFields().then((values) => {
      if (fileList.length === 0) {
        message.error('请选择文件');
        return;
      }
      uploadMutation.mutate({
        file: fileList[0].originFileObj,
        remark: values.remark,
      });
    });
  };

  return (
    <PageContainer
      title="上传资源"
      onBack={() => navigate('/admin/resources')}
    >
      <Card>
        <Form form={form} layout="vertical">
          <Form.Item label="文件">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} placeholder="请输入备注（可选）" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleUpload}
              loading={uploadMutation.isPending}
            >
              上传
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default ResourceUpload;
