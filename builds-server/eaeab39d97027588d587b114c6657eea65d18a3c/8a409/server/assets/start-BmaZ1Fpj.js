import { k as isPromise, t as createMiddleware } from "../server.js";
//#region .stacks/tanstack-start-v1/node_modules/@tanstack/start-client-core/dist/esm/createStart.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
function dedupeOptions(options) {
	if (options.serializationAdapters) {
		const deduped = /* @__PURE__ */ new Set();
		dedupeSerializationAdapters(deduped, options.serializationAdapters);
		options.serializationAdapters = Array.from(deduped);
	}
	return options;
}
var createStart = (getOptions) => {
	return {
		getOptions: () => {
			const options = getOptions();
			return isPromise(options) ? Promise.resolve(options).then(dedupeOptions) : dedupeOptions(options);
		},
		createMiddleware
	};
};
//#endregion
//#region src/platform/build-id.ts
var BUILD_ID = "eaeab39d97027588d587b114c6657eea65d18a3c/8a409";
var buildIdFetch = async (input, init) => {
	const headers = new Headers(init?.headers);
	headers.set("x-build-id", BUILD_ID);
	const response = await fetch(input, {
		...init,
		headers
	});
	if (response.status === 409 && response.headers.get("x-reload")) {
		window.location.reload();
		return new Promise(() => {});
	}
	return response;
};
//#endregion
//#region src/start.ts
var startInstance = createStart(() => ({ serverFns: { fetch: buildIdFetch } }));
//#endregion
export { startInstance };
