import type { Config } from "payload";

type Translations = NonNullable<NonNullable<Config["i18n"]>["translations"]>;

export const adminTranslations: Translations = {
  fr: {
    general: {
      locale: "Langue du contenu",
      locales: "Langues du contenu",
      allLocales: "Toutes les langues",
      createNew: "Ajouter",
      createNewLabel: "Ajouter : {{label}}",
      creatingNewLabel: "Ajout : {{label}}",
      noResults:
        "Rien à afficher pour « {{label}} » : la liste est vide, ou aucun élément ne correspond à votre recherche.",
      true: "Oui",
      false: "Non",
      fallbackToDefaultLocale:
        "Afficher le texte français quand la traduction manque",
      dashboard: "Résumé",
      backToDashboard: "Retour au résumé",
      edit: "Modifier",
      save: "Enregistrer",
      saving: "Enregistrement en cours",
      created: "Créé le",
      createdAt: "Créé le",
      updatedAt: "Modifié le",
      lastModified: "Dernière modification",
      noLabel: "{{label}} : non renseigné",
      columns: "Colonnes affichées",
      filters: "Filtrer la liste",
      duplicate: "Faire une copie",
      leaveWithoutSaving: "Quitter sans enregistrer",
      stayOnThisPage: "Rester sur cette page",
      leaveAnyway: "Quitter quand même",
      unsavedChanges:
        "Vos modifications ne sont pas enregistrées. Enregistrez avant de quitter la page.",
      updatedSuccessfully: "C'est enregistré.",
      successfullyCreated: "C'est ajouté : {{label}}.",
      deletedSuccessfully: "C'est supprimé.",
    },
    authentication: {
      logOut: "Se déconnecter",
      logoutSuccessful: "Vous êtes déconnecté.",
      account: "Mon compte",
      forgotPassword: "Mot de passe oublié",
      forgotPasswordQuestion: "Mot de passe oublié ?",
    },
    upload: {
      editImage: "Recadrer la photo",
      dragAndDrop: "Glissez une photo ici",
      selectFile: "Choisir une photo",
    },
    fields: {
      saveChanges: "Enregistrer",
      removeUpload: "Retirer la photo",
      addNew: "Ajouter",
      addNewLabel: "Ajouter : {{label}}",
      chooseFromExisting: "Choisir une photo déjà envoyée",
    },
    localization: {
      cannotCopySameLocale:
        "Choisissez une langue d'arrivée différente de la langue de départ.",
      copyFrom: "Copier depuis",
      copyFromTo: "Copier le contenu, de {{from}} vers {{to}}",
      copyTo: "Copier vers",
      copyToLocale: "Copier vers une autre langue",
      localeToPublish: "Langue à publier",
      selectedLocales: "Langues choisies",
      selectLocaleToCopy: "Choisissez la langue à copier",
      selectLocaleToDuplicate: "Choisissez les langues à dupliquer",
    },
    version: {
      saveDraft: "Enregistrer",
      publish: "Publier",
      publishChanges: "Publier",
      draft: "Brouillon, pas encore sur le site",
      published: "En ligne",
      changed: "Modifications pas encore publiées",
      draftSavedSuccessfully:
        "Brouillon enregistré. Touchez « Publier » pour le mettre en ligne.",
      publishAllLocales: "Publier en français et en anglais",
      revertToPublished: "Revenir à la version en ligne",
      unpublish: "Retirer du site",
      lastSavedAgo: "Enregistré il y a {{distance}}",
      selectLocales: "Choisissez les langues à afficher",
      showLocales: "Afficher les langues :",
    },
    error: {
      localesNotSaved_one: "Cette langue n'a pas pu être enregistrée :",
      localesNotSaved_other: "Ces langues n'ont pas pu être enregistrées :",
    },
    validation: {
      required: "Ce champ est obligatoire : remplissez-le pour enregistrer.",
      shorterThanMax:
        "Ce texte est trop long : {{maxLength}} caractères au plus.",
      longerThanMin:
        "Ce texte est trop court : {{minLength}} caractères au moins.",
      emailAddress:
        "Cette adresse e-mail est incomplète. Exemple : prenom@exemple.fr.",
      enterNumber: "Écrivez un nombre, en chiffres.",
      greaterThanMax:
        "{{value}} dépasse le maximum accepté pour « {{label}} » : {{max}}.",
      lessThanMin:
        "{{value}} est en dessous du minimum accepté pour « {{label}} » : {{min}}.",
      invalidInput:
        "Cette valeur n'est pas acceptée. Vérifiez ce que vous avez saisi.",
      requiresAtLeast: "Ajoutez au moins {{count}} {{label}}.",
      requiresNoMoreThan: "Gardez au plus {{count}} {{label}}.",
    },
  },
  en: {
    general: {
      locale: "Content language",
      locales: "Content languages",
    },
  },
};
