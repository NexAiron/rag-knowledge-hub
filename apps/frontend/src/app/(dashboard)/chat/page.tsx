import Link from "next/link";

export default function ChatLandingPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">问答会话</h2>
      <Link
        href="/chat/demo-session"
        className="inline-flex rounded-xl bg-ink px-4 py-2 text-sm font-medium text-white"
      >
        进入示例会话
      </Link>
    </section>
  );
}

