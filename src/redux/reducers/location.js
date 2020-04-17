/**
 * @docs reducers
 * Reducer pour les preferences
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['SET_PREF', 'CLEAR_PREF', 'CLEAR_ALL_PREFS'] Stocker des parametres, en supprimer un, supprimer tout
 * @param {object} action.data.prefs Les parametres à stocker
 * @param {string} action.data.pref La clé du paramètre à supprimer
 * @returns Nouveau state
 */

 const initialState = {
   selected: true,
   type: 'school',
   schools: ['5e9208118851c52a8e6c6f8d'],
   schoolData: [{
     "_id":"5e9208118851c52a8e6c6f8d",
     "name":"Centre International de Valbonne",
     "shortName":"CIV",
     "type":"lycee",
     "address":{
       "shortName": "Sophia-Antipolis, Alpes Maritimes",
       "coordinates":{
         "lat":43.6215017,
         "lon":7.0416363
       },
       "department": null
     },
     "adminGroups":[],
     "image": {
       "image":null,
       "thumbnail":{
         "small":false,
         "medium":false,
         "large":false
       }
     },
     "description": {
       "parser":"markdown",
       "data":"Hello there **bold**"
     },
     "department":null
   }],
   departments: [''],
   departmentData: [{}],
   global: false,
 }

function locationReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_LOCATION_DATA':
      return {
        selected: true,
        type: action.data.type,
        schools: action.data.schools || [],
        departments: action.data.departments || [],
      }
    case 'CLEAR_CREATION_DATA':
      return initialState;
    case 'REFRESH':
      return state; // TODO: Refresh school and department data
    default:
      return state;
  }
}

export default locationReducer;
