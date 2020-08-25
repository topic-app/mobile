import Store from '@redux/store';
import { request } from '@utils/index';
import { reportCreator, approveCreator } from './ActionCreator';
import { UPDATE_EVENTS_STATE } from '@ts/redux';
import { State } from '@ts/types';

type EventAddProps = {
  title: string;
  date: Date;
  location: {
    schools: string[];
    departments: string[];
    global: boolean;
  };
  group: string;
  image: {
    image: string;
    thumbnails: {
      small?: boolean;
      medium?: boolean;
      large?: boolean;
    };
  };
  summary: string;
  parser: 'markdown' | 'plaintext';
  data: string;
  preferences?: {
    comments?: boolean;
  };
  tags: string[];
};

function eventAddCreator({
  title,
  date,
  location,
  group,
  image,
  summary,
  parser,
  data,
  preferences,
  tags,
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
            date,
            location,
            author: getState().account.accountInfo.accountId,
            group,
            image,
            summary,
            tags,
            content: {
              parser,
              data,
            },
            preferences,
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
