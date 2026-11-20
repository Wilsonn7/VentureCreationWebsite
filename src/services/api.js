import layanan from '../data/layanan.json';
import updates from '../data/updates.json';
import promosi from '../data/promosi.json';
import events from '../data/events.json';

export async function getLayanan() {
  return layanan;
}

export async function getUpdates() {
  return updates;
}

export async function getPromosi() {
  return promosi;
}

export async function getEvents() {
  return events;
}
