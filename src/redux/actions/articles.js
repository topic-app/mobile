import Store from '../store';
import request from '../../util/request'

function updateArticlesCreator() {
  console.log("Update articles creator")
  return (dispatch) => {
    request('articles/list', 'get').then(result => {
      console.log(`Result, ${JSON.stringify(result)}`)
      if (result.success) {
        return dispatch({
          type: 'UPDATE_ARTICLES',
          data: result.data.articles
        });
      }
      console.log(`Error, ${result}`);
      return null;
    })
  };
}

function clearArticlesCreator() {
  return {
    type: 'CLEAR_DATABASE'
  }
}

function updateArticles() {
  console.log("Update articles")
  return Store.dispatch(updateArticlesCreator());
}

function clearArticles() {
  return Store.dispatch(clearArticlesCreator());
}

export { updateArticles, clearArticles };
