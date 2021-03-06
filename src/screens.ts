export default {
  initialRouteName: 'Root',
  Auth: {
    screens: {
      Login: '/auth/connexion',
      Create: '/auth/creation',
      CreateSuccess: '/auth/fin',
    },
  },
  Landing: {
    screens: {
      SelectLocation: '/localisation',
      Welcome: '/accueil',
      Download: '/telecharger',
    },
  },
  Linking: {
    screens: {
      AccountDelete: '/linking/accountDelete',
      EmailVerify: '/linking/emailVerify',
      EmailChange: '/linking/emailChange',
      ResetPassword: '/linking/passwordReset',
    },
  },
  Search: {
    screens: {
      Search: '/recherche',
    },
  },
  Root: {
    initialRouteName: 'Main',
    screens: {
      Main: {
        initialRouteName: 'Home1',
        screens: {
          Add: {
            screens: {
              Article: {
                screens: {
                  Add: '/ajout/article',
                  AddContent: '/ajout/article/contenu',
                },
              },
              Event: {
                screens: {
                  Add: '/ajout/evenement',
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
              Settings: {
                screens: {
                  List: '/parametres',
                  Privacy: '/parametres/confidentialite',
                  Theme: '/parametres/theme',
                  Content: '/parametres/contenu',
                  Dev: '/parametres/dev',
                  SelectLocation: '/profil/localisation',
                },
              },
              Moderation: {
                screens: {
                  List: '/moderation',
                },
              },
              About: {
                screens: {
                  List: '/a_propos',
                  Legal: '/legal',
                  Licenses: '/legal/licenses',
                },
              },
              Notifications: {
                screens: {
                  Notifications: '/notifications',
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
              Event: {
                screens: {
                  Configure: '/evenements/configurer',
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
              Event: {
                screens: {
                  Params: '/evenement/localisation',
                },
              },
            },
          },
          History: {
            screens: {
              Article: '/articles/historique',
              Event: '/evenements/historique',
              Main: '/parametres/historique',
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
              Event: {
                screens: {
                  Display: '/evenements/:id',
                },
              },
              Group: {
                screens: {
                  Display: '/groupes/:id',
                },
              },
              Image: {
                screens: {
                  Display: '/images/',
                },
              },
            },
          },
          Home1: {
            initialRouteName: 'Home2',
            screens: {
              Home2: {
                initialRouteName: 'Article',
                screens: {
                  Article: '/articles',
                  Event: '/evenements',
                  Explore: '/carte',
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
