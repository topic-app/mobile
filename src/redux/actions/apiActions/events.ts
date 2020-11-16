import Store from '@redux/store';
import { request } from '@utils/index';
import { AppThunk, UPDATE_EVENTS_STATE } from '@ts/redux';
import { reportCreator, approveCreator } from './ActionCreator';

type EventAddParams = {
  title: string;
  summary: string;
  data: string;
  phone: string;
  email: string;
  contact?: {
    key: string;
    value: string;
    link: string;
  }[];
  organizers: string[];
  start: Date;
  end: Date;
  date: Date;
  location: {
    schools: string[];
    departments: string[];
    global: boolean;
  };
  group: string;
  places: string[];
  parser: 'markdown' | 'plaintext';
  preferences?: {
    comments?: boolean;
  };
  tags: string[];
  program: string[];
};

function eventAddCreator({
  title,
  summary,
  data,
  phone,
  email,
  contact,
  organizers,
  start,
  end,
  date,
  location,
  group,
  places,
  parser,
  preferences,
  tags,
  program,
}: EventAddParams): AppThunk {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_EVENTS_STATE,
        data: {
          add: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'events/add',
        'post',
        {
          event: {
            title,
            places,
            summary,
            description: {
              parser,
              data,
            },
            contact: {
              phone,
              email,
              organizers,
              contact,
            },
            duration: {
              start,
              end,
            },
            date,
            location,
            group,
            preferences,
            tags,
            program,
            author: getState().account.accountInfo?.accountId,
          },
        },
        true,
      )
        .then((result) => {
          dispatch({
            type: UPDATE_EVENTS_STATE,
            data: {
              add: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve(result.data);
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_EVENTS_STATE,
            data: {
              add: {
                loading: false,
                success: false,
                error,
              },
            },
          });
          reject();
        });
    });
  };
}

function eventAdd(data: EventAddParams) {
  return Store.dispatch(eventAddCreator(data));
}

function eventVerificationApprove(id: string) {
  return Store.dispatch(
    approveCreator({
      url: 'events/verification/approve',
      stateUpdate: UPDATE_EVENTS_STATE,
      paramName: 'eventId',
      id,
    }),
  );
}

async function eventReport(eventId: string, reason: string) {
  await Store.dispatch(
    reportCreator({
      contentId: eventId,
      contentIdName: 'eventId',
      url: 'events/report',
      stateUpdate: UPDATE_EVENTS_STATE,
      reason,
    }),
  );
}

export { eventAdd, eventReport, eventVerificationApprove };
