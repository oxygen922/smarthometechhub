import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // 纯静态站点，不需要 ISR 缓存
});
