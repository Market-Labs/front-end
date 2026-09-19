import { computed, inject, unref } from 'vue';

const normalize = (value) => String(value ?? '').toLowerCase().trim();

const flattenValue = (value) => {
  if (Array.isArray(value)) return value.map(flattenValue).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(flattenValue).join(' ');
  return String(value ?? '');
};

export const useSearchFilter = (source, fields = null) => {
  const searchQuery = inject('marketgoSearchQuery', { value: '' });

  return computed(() => {
    const query = normalize(searchQuery.value);
    const items = (typeof source === 'function' ? source() : unref(source)) || [];
    if (!query) return items;

    return items.filter((item) => {
      const values = fields?.length
        ? fields.map((field) => (typeof field === 'function' ? field(item) : item[field]))
        : Object.values(item);

      return normalize(values.map(flattenValue).join(' ')).includes(query);
    });
  });
};
