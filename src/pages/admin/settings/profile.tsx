import { PageContainer } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, message, Space } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';
import { getProfile, updatePassword, updateProfile } from './service';

const ProfileSettings: FC = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: profileData } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => getProfile().then((res) => res.data),
  });

  useEffect(() => {
    if (profileData) {
      profileForm.setFieldsValue({
        username: profileData.username,
        email: profileData.email,
        phone: profileData.phone,
      });
    }
  }, [profileData, profileForm]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: { username: string; email?: string; phone?: string }) =>
      updateProfile(data),
    onSuccess: () => {
      message.success('个人资料更新成功');
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: { newPassword: string; confirmPassword: string }) =>
      updatePassword(data.newPassword, data.confirmPassword),
    onSuccess: () => {
      message.success('密码修改成功');
      passwordForm.resetFields();
    },
  });

  const handleProfileSubmit = () => {
    profileForm.validateFields().then((values) => {
      updateProfileMutation.mutate(values);
    });
  };

  const handlePasswordSubmit = () => {
    passwordForm.validateFields().then((values) => {
      updatePasswordMutation.mutate({
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
    });
  };

  return (
    <>
      <Card title="个人资料" style={{ marginBottom: 24 }}>
        <Form form={profileForm} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleProfileSubmit}
              loading={updateProfileMutation.isPending}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="修改密码">
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认密码" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handlePasswordSubmit}
              loading={updatePasswordMutation.isPending}
            >
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default ProfileSettings;
