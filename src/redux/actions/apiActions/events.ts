import Store from '@redux/store';
import { request } from '@utils/index';
import { UPDATE_EVENTS_STATE } from '@ts/redux';
import { State } from '@ts/types';
import { reportCreator, approveCreator } from './ActionCreator';

type EventAddProps = {
  title: string;
  summary: string;
  description: string;
  phone: string;
  email: string;
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
  place: string[];
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
  description,
  phone,
  email,
  organizers,
  start,
  end,
  date,
  location,
  group,
  place,
  parser,
  preferences,
  tags,
  program,
}: EventAddProps) {
  return (dispatch: (action: any) => void, getState: () => State) => {
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
            summary,
            description,
            contact : {
              phone,
              email,
              organizers,
            },
            start,
            end,
            date,
            location,
            group,
            place,
            parser,
            preferences,
            tags,
            program,
            author: getState().account.accountInfo.accountId,
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

async function eventAdd(data: EventAddProps) {
  return await Store.dispatch(eventAddCreator(data));
}

async function eventVerificationApprove(id: string) {
  return await Store.dispatch(
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
