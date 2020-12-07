import Store from '@redux/store';
import { AppThunk, EventCreationData, UPDATE_EVENTS_STATE } from '@ts/redux';
import { Content } from '@ts/types';
import { request } from '@utils/index';

import { reportCreator, approveCreator, deleteCreator } from './ActionCreator';

function eventAddCreator({
  title,
  summary,
  data,
  phone,
  email,
  contact,
  members,
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
}: EventCreationData): AppThunk<Promise<{ _id: string }>> {
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
            place,
            summary,
            description: {
              parser,
              data,
            },
            contact: {
              phone,
              email,
              other: contact,
            },
            members,
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
          resolve(result.data as { _id: string });
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

type eventMessagesAddProps = {
  content: Content;
  group: string;
  type?: 'high' | 'medium' | 'low';
  event: string;
};

function eventMessagesAddCreator({
  content,
  group,
  type = 'medium',
  event,
}: eventMessagesAddProps): AppThunk<Promise<{ _id: string }>> {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_EVENTS_STATE,
        data: {
          messages_add: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'events/messages/add',
        'post',
        {
          content,
          type,
          group,
          eventId: event,
        },
        true,
      )
        .then((result) => {
          dispatch({
            type: UPDATE_EVENTS_STATE,
            data: {
              messages_add: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve(result.data as { _id: string });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_EVENTS_STATE,
            data: {
              messages_add: {
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

async function eventAdd(data: EventCreationData) {
  return Store.dispatch(eventAddCreator(data));
}

async function eventMessagesAdd(
  event: string,
  group: string,
  content: Content,
  type: 'high' | 'medium' | 'low',
) {
  return Store.dispatch(eventMessagesAddCreator({ event, group, content, type }));
}

async function eventVerificationApprove(id: string) {
  await Store.dispatch(
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

async function eventDelete(id: string) {
  await Store.dispatch(
    deleteCreator({
      id,
      paramName: 'eventId',
      url: 'events/delete',
      stateUpdate: UPDATE_EVENTS_STATE,
    }),
  );
}

export { eventAdd, eventReport, eventVerificationApprove, eventDelete, eventMessagesAdd };
