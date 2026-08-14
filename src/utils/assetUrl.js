export const assetUrl = (value = '') => {
  if (!value || /^(?:https?:|data:|blob:)/i.test(value)) return value;
  const base = import.meta.env.BASE_URL || '/';
  if (value.startsWith(base)) return value;
  return `${base}${String(value).replace(/^\/+/, '')}`;
};
