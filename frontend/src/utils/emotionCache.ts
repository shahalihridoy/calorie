import createCache from "@emotion/cache";

export const emotionLTRCache = createCache({
  key: "css",
  prepend: true,
});
