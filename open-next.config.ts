// updated open-next.config.ts to disable incremental cache
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
	// Use the built-in no-op cache override; "dummy" resolves to a disabled incremental cache.
	incrementalCache: "dummy",
});
