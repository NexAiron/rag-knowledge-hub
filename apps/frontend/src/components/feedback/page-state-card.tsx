"use client";

import { Card, Empty, Typography } from "antd";

interface PageStateCardProps {
  message?: string;
  description?: string;
}

export function PageStateCard({
  message,
  description,
}: PageStateCardProps) {
  if (description) {
    return (
      <Card
        variant="borderless"
        className="glass-panel !rounded-[30px] !shadow-none"
      >
        <Empty
          description={message}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Typography.Paragraph className="!mb-0 !mt-3 text-center !text-[13px] !leading-6 !text-ink/58">
          {description}
        </Typography.Paragraph>
      </Card>
    );
  }

  return (
    <Card
      variant="borderless"
      className="glass-panel !rounded-[30px] !shadow-none"
    >
      {message}
    </Card>
  );
}
