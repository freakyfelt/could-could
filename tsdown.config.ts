import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["index.ts"],
	platform: "node",
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	sourcemap: true,
	publint: {
		level: "error",
	},
	attw: {
		level: "error",
	},
});
