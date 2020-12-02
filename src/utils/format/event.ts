import moment from 'moment';

import { Duration } from '@ts/types';

/**
 * Obtient un string permettant, en une phrase de décrire
 * le status de l'évènement
 *
 * ## Exemple
 * ```js
 * const date = {
 *   start: '2020-01-01T08:00:00Z',
 *   end: '2020-01-01T08:00:00Z',
 * };
 *
 * const eventDate = Format.getShortEventDate(date);
 *
 * console.log(eventDate); // 'Terminé il y a 9 mois'
 * ```
 */
export function shortEventDate(duration: Duration): string {
  // Vérifie que la date existe :)
  if (!duration.start || !duration.end) {
    return 'Date Inconnue';
  }

  const now = moment();
  const start = moment(duration.start);
  const end = moment(duration.end);

  if (now.isAfter(end)) {
    return `Terminé ${end.fromNow()}`;
  }
  if (now.isBetween(start, end)) {
    return `Fin ${end.fromNow()}`;
  }
  // A partir d'ici, l'évènenement est dans le passé
  if (start.isBefore(now.add(7, 'days'))) {
    return `Prévu le ${start.calendar()}`;
  }
  return `Prévu le ${start.calendar()} (${start.fromNow()})`;
}
