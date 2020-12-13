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
    screens: {
      Main: {
        screens: {
          Add: {
            screens: {
              Article: {
                screens: {
                  Add: '/ajout/article',
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
                  Theme: '/parametres/theme',
                  Privacy: '/parametres/confidentialite',
                  Content: '/parametres/contenu',
                  Dev: '/parametres/beta',
                },
              },
              About: {
                screens: {
                  List: '/a_propos',
                  Legal: '/legal',
                  Licenses: '/legal/licenses',
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
              Article: {
                screens: {
                  History: '/articles/historique',
                },
              },
              Event: {
                screens: {
                  History: '/evenements/historique',
                },
              },
              Main: {
                screens: {
                  History: '/parametres/historique',
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
            },
          },
          Home1: {
            screens: {
              Home2: {
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
