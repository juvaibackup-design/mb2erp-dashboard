export const clearQueryParams = (name: string) => {
  const url = new URL(globalThis.window.location.href);
  url.searchParams.delete(name);
  globalThis.window.history.replaceState({}, "", url);
};
