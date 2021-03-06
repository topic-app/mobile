import Store from '@redux/store';
import { AppThunk, EventCreationData, UPDATE_EVENTS_STATE } from '@ts/redux';
import { Content } from '@ts/types';
import { request } from '@utils';

import {
  reportCreator,
  approveCreator,
  deleteCreator,
  likeCreator,
  deverifyCreator,
} from './ActionCreator';

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
  places,
  parser,
  preferences,
  tags,
  image,
  program,
}: EventCreationData): AppThunk<Promise<{ _id: string }>> {
  return async (dispatch, getState) => {
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
    let result;
    try {
      result = await request(
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
            image,
            preferences,
            tags,
            program,
            author: getState().account.accountInfo?.accountId,
          },
        },
        true,
      );
    } catch (error) {
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
      throw error;
    }
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
    return result.data as { _id: string };
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
  return async (dispatch, getState) => {
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
    let result;
    try {
      result = await request(
        'events/messages/add',
        'post',
        {
          content,
          type,
          group,
          eventId: event,
        },
        true,
      );
    } catch (error) {
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
      throw error;
    }
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
    return result.data as { _id: string };
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

async function eventDeverify(id: string) {
  await Store.dispatch(
    deverifyCreator({
      contentId: id,
      contentIdName: 'eventId',
      url: 'events/verification/deverify',
      stateUpdate: UPDATE_EVENTS_STATE,
    }),
  );
}

async function eventLike(contentId: string, liking: boolean = true) {
  await Store.dispatch(likeCreator({ contentId, liking, stateUpdate: UPDATE_EVENTS_STATE }));
}

export {
  eventAdd,
  eventReport,
  eventVerificationApprove,
  eventDelete,
  eventMessagesAdd,
  eventLike,
  eventDeverify,
};
