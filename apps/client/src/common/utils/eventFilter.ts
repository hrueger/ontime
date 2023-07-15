import { OntimeEvent } from 'ontime-types';

export function filterEvents(events: OntimeEvent[], department: string, includeGeneral: boolean) {
  return events.filter(
    (e) =>
      (!department && !e.department) ||
      e.department === department ||
      (includeGeneral && !e.department && !events.find((e2) => e2.department === department && e2.cue === e.cue)),
  );
}
