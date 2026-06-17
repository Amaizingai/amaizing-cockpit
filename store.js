// store.js — localStorage CRUD for Amaizing Cockpit
const STORAGE_KEY = 'amaizing_items';
const AUTHOR_KEY  = 'amaizing_author';

export function getAuthor() {
  return localStorage.getItem(AUTHOR_KEY) || 'Søren';
}

export function setAuthor(name) {
  localStorage.setItem(AUTHOR_KEY, name);
}

export function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function save(item) {
  const items = getAll();
  const newItem = {
    id:       crypto.randomUUID(),
    text:     item.text.trim(),
    category: item.category || 'note',
    author:   item.author   || getAuthor(),
    created:  new Date().toISOString(),
    synced:   false,
  };
  items.unshift(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return newItem;
}

export function remove(id) {
  const items = getAll().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getByCategory(category) {
  const items = getAll();
  if (category === 'all') return items;
  return items.filter(i => i.category === category);
}
