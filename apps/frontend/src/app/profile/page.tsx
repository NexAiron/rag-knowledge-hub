"use client";

import { useEffect } from "react";
import Link from "next/link";
import { App, Button, Card, Form, Input, Typography } from "antd";
import { ArrowLeft, Mail, Save, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout/layout";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useUserStore } from "@/stores/user-store";

interface ProfileValues {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const { t } = useI18n();
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const { message } = App.useApp();
  const [form] = Form.useForm<ProfileValues>();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    form.setFieldsValue({
      name: user.name,
      email: user.email,
    });
  }, [form, user]);

  const handleSubmit = async (values: ProfileValues) => {
    await updateProfile({
      name: values.name.trim(),
      email: values.email.trim(),
    });
    message.success(t("profile.success"));
    router.push("/kb");
  };

  return (
    <Layout
      title={t("profile.title")}
      description={t("profile.description")}
      action={
        <Link href="/kb">
          <Button
            className="dashboard-secondary-button !rounded-2xl"
            icon={<ArrowLeft className="h-4 w-4" strokeWidth={2} />}
          >
            {t("common.back")}
          </Button>
        </Link>
      }
    >
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card
          variant="borderless"
          className="dashboard-form-panel !rounded-[32px] !shadow-none"
        >
          <div className="flex items-start gap-3">
            <div className="dashboard-mini-orb">
              <UserCircle2 className="h-5 w-5 text-brand" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <Typography.Title
                level={4}
                className="!mb-0 !text-lg !font-semibold !text-ink"
              >
                {t("profile.cardTitle")}
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !mt-2 !text-[13px] !leading-6 !text-ink/64">
                {t("profile.description")}
              </Typography.Paragraph>
            </div>
          </div>

          {user ? (
            <Form<ProfileValues>
              form={form}
              layout="vertical"
              className="!mt-7"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Form.Item
                  label={t("profile.nameLabel")}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: t("profile.nameRequired"),
                    },
                  ]}
                >
                  <Input placeholder={t("profile.namePlaceholder")} />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: t("profile.emailRequired"),
                    },
                    {
                      type: "email",
                      message: t("profile.emailInvalid"),
                    },
                  ]}
                >
                  <Input placeholder="you@company.com" />
                </Form.Item>
              </div>

              <Form.Item className="!mb-0 !mt-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    htmlType="submit"
                    type="primary"
                    loading={isLoading}
                    icon={<Save className="h-4 w-4" strokeWidth={2} />}
                    className="dashboard-primary-button !rounded-2xl !px-5 !text-xs !font-semibold shadow-none"
                  >
                    {t("profile.submit")}
                  </Button>
                  <Link href="/kb">
                    <Button className="dashboard-secondary-button !rounded-2xl">
                      {t("common.cancel")}
                    </Button>
                  </Link>
                </div>
              </Form.Item>
            </Form>
          ) : (
            <Typography.Paragraph className="!mb-0 !mt-6 !text-[14px] !leading-7 !text-ink/66">
              {t("profile.empty")}
            </Typography.Paragraph>
          )}
        </Card>

        <aside className="space-y-4">
          <Card
            variant="borderless"
            className="dashboard-side-panel !rounded-[30px] !shadow-none"
          >
            <Typography.Text className="!text-[11px] !font-semibold !uppercase !tracking-[0.18em] !text-ink/48">
              {t("common.updated")}
            </Typography.Text>
            <Typography.Paragraph className="!mb-0 !mt-3 !text-[14px] !leading-7 !text-ink/68">
              {t("profile.description")}
            </Typography.Paragraph>
          </Card>

          <Card
            variant="borderless"
            className="dashboard-side-panel !rounded-[30px] !shadow-none"
          >
            <div className="flex items-center gap-3">
              <div className="dashboard-process-icon">
                <Mail className="h-4 w-4 text-brand" strokeWidth={2} />
              </div>
              <div>
                <Typography.Text className="!block !text-sm !font-semibold !text-ink">
                  Email
                </Typography.Text>
                <Typography.Text className="!block !text-[12px] !text-ink/56">
                  {user?.email ?? "--"}
                </Typography.Text>
              </div>
            </div>
          </Card>
        </aside>
      </section>
    </Layout>
  );
}
