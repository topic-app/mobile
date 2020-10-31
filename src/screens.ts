export default {
  Auth: {
    screens: {
      Login: '/auth/connexion',
      Create: '/auth/creation',
    },
  },
  Landing: {
    screens: {
      SelectLocation: '/localisation',
    },
  },
  Add: {
    screens: {
      Article: {
        screens: {
          Add: '/ajout/article',
        },
      },
    },
  },
  More: {
    screens: {
      Profile: {
        screens: {
          Profile: '/profil',
        },
      },
      MyGroups: {
        screens: {
          List: '/groupes',
        },
      },
      Linking: {
        screens: {
          Linking: '/linking/:type',
        },
      },
    },
  },
  Configure: {
    screens: {
      Article: {
        screens: {
          Configure: '/articles/configurer',
        },
      },
    },
  },
  Params: {
    screens: {
      Article: {
        screens: {
          Params: '/articles/localisation',
        },
      },
    },
  },
  Settings: {
    screens: {
      List: '/parametres',
      Theme: '/parametres/theme',
      Content: '/parametres/contenu',
      Privacy: '/parametres/confidentialite',
    },
  },
  History: {
    screens: {
      Article: {
        screens: {
          History: '/articles/historique',
        },
      },
    },
  },
  Display: {
    screens: {
      User: {
        screens: {
          Display: '/utilisateurs/:id',
        },
      },
      Article: {
        screens: {
          Display: '/articles/:id',
        },
      },
    },
  },
  Root: {
    screens: {
      Main: {
        screens: {
          Home1: {
            screens: {
              Home2: {
                screens: {
                  Article: '/articles',
                },
              },
            },
          },
          NotFound: '*',
        },
      },
    },
  },
};
