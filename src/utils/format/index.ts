import * as Account from './account';
import * as Event from './event';
import * as Group from './group';
import * as Place from './place';
import * as School from './school';

export default { ...Event, ...Place, ...School, ...Account, ...Group };
