import moment from 'moment';

const offset = 100;

function buildEvent(column, left, width, dayStart) {
  const startTime = moment(column.start);
  const endTime = column.end ? moment(column.end) : startTime.clone().add(1, 'hour');
  const dayStartTime = startTime.clone().hour(dayStart).minute(0);
  const diffHours = startTime.diff(dayStartTime, 'hours', true);
  return {
    ...column,
    top: diffHours * offset,
    height: endTime.diff(startTime, 'hours', true) * offset,
    width,
    left,
  };
}

const collision = (a, b) => a.end > b.start && a.start < b.end;

function expand(ev, column, columns) {
  let colSpan = 1;

  for (let i = column + 1; i < columns.length; i += 1) {
    const col = columns[i];
    for (let j = 0; j < col.length; j += 1) {
      const ev1 = col[j];
      if (collision(ev, ev1)) {
        return colSpan;
      }
    }
    colSpan += 1;
  }

  return colSpan;
}

function pack(columns, width, calculatedEvents, dayStart) {
  const colLength = columns.length;

  for (let i = 0; i < colLength; i += 1) {
    const col = columns[i];
    for (let j = 0; j < col.length; j += 1) {
      const colSpan = expand(col[j], i, columns);
      const L = (i / colLength) * width;
      const W = (width * colSpan) / colLength - 10;

      calculatedEvents.push(buildEvent(col[j], L, W, dayStart));
    }
  }
}

function populateEvents(events, screenWidth, dayStart) {
  let lastEnd;
  let columns;
  const calculatedEvents = [];

  const newEvents = events
    .map((ev, index) => ({ ...ev, index }))
    .sort((a, b) => {
      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;
      if (a.end < b.end) return -1;
      if (a.end > b.end) return 1;
      return 0;
    });

  columns = [];
  lastEnd = null;

  newEvents.forEach((ev) => {
    if (lastEnd !== null && ev.start >= lastEnd) {
      pack(columns, screenWidth, calculatedEvents, dayStart);
      columns = [];
      lastEnd = null;
    }

    let placed = false;
    for (let i = 0; i < columns.length; i += 1) {
      const col = columns[i];
      if (!collision(col[col.length - 1], ev)) {
        col.push(ev);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([ev]);
    }

    if (lastEnd === null || ev.end > lastEnd) {
      lastEnd = ev.end;
    }
  });

  if (columns.length > 0) {
    pack(columns, screenWidth, calculatedEvents, dayStart);
  }
  return calculatedEvents;
}

export default populateEvents;
