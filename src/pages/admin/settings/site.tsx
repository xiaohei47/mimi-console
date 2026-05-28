import { PageContainer } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, message, Switch, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { getSiteSettings, saveSiteSettings } from './service';

const SiteSettings: FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const { data: siteData } = useQuery({
    queryKey: ['admin-site-settings'],
    queryFn: () => getSiteSettings().then((res) => res.data),
  });

  useEffect(() => {
    if (siteData) {
      form.setFieldsValue({
        footerContent: siteData.footerContent,
        siteEnabled: siteData.siteEnabled,
      });
    }
  }, [siteData, form]);

  const saveMutation = useMutation({
    mutationFn: (data: { file?: File; footerContent?: string; siteEnabled?: boolean }) =>
      saveSiteSettings(data),
    onSuccess: () => {
      message.success('保存成功');
      setFileList([]);
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] });
    },
  });

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      saveMutation.mutate({
        file: fileList.length > 0 ? fileList[0].originFileObj : undefined,
        footerContent: values.footerContent,
        siteEnabled: values.siteEnabled,
      });
    });
  };

  return (
    <Card title="网站设置">
      <Form form={form} layout="vertical">
        <Form.Item label="网站Logo">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>选择Logo图片</Button>
          </Upload>
          {siteData?.logoUrl && (
            <div style={{ marginTop: 8 }}>
              当前Logo: <a href={siteData.logoUrl} target="_blank" rel="noopener noreferrer">查看</a>
            </div>
          )}
        </Form.Item>

        <Form.Item label="页脚内容" name="footerContent">
          <Input.TextArea rows={4} placeholder="请输入页脚内容" />
        </Form.Item>

        <Form.Item label="前台开关" name="siteEnabled" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={saveMutation.isPending}
          >
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SiteSettings;
