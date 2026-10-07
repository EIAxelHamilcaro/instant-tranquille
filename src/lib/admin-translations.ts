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
      submit: "Valider",
      untitled: "Nouvelle fiche",
      perPage: "Par page : {{limit}}",
      payloadSettings: "Affichage de cet espace",
      language: "Langue des menus",
      resetPreferences: "Remettre l'affichage d'origine",
      selectValue: "Choisissez dans la liste",
      noOptions: "Rien à choisir dans cette liste",
      none: "Aucun",
      addBelow: "Ajouter en dessous",
      row: "Ligne",
    },
    authentication: {
      logOut: "Se déconnecter",
      logoutSuccessful: "Vous êtes déconnecté.",
      account: "Mon compte",
      forgotPassword: "Mot de passe oublié",
      forgotPasswordQuestion: "Mot de passe oublié ?",
      forgotPasswordEmailInstructions:
        "Écrivez l'adresse e-mail de votre compte. Vous recevrez un lien pour choisir un nouveau mot de passe.",
      checkYourEmailForPasswordReset:
        "Si cette adresse correspond à un compte, un e-mail vient de partir avec un lien pour choisir un nouveau mot de passe. Regardez aussi dans les courriers indésirables.",
      emailSent: "E-mail envoyé",
      backToLogin: "Revenir à la connexion",
      forceUnlock: "Débloquer ce compte",
      loggedOutSuccessfully: "Vous êtes déconnecté.",
      loggedOutInactivity:
        "Vous avez été déconnecté après une longue pause. Reconnectez-vous pour continuer.",
      logBackIn: "Se reconnecter",
    },
    upload: {
      editImage: "Recadrer la photo",
      dragAndDrop: "Glissez une photo ici",
      selectFile: "Choisir une photo",
      bulkUpload: "Envoyer plusieurs photos",
      previewSizes: "Voir les tailles",
    },
    fields: {
      saveChanges: "Enregistrer",
      removeUpload: "Retirer la photo",
      addNew: "Ajouter",
      addNewLabel: "Ajouter : {{label}}",
      addLabel: "Ajouter : {{label}}",
      collapseAll: "Tout replier",
      showAll: "Tout déplier",
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
      versions: "Historique",
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
      followingFieldsInvalid_one: "Ce n'est pas enregistré. À corriger :",
      followingFieldsInvalid_other: "Ce n'est pas enregistré. À corriger :",
      correctInvalidFields:
        "Ce n'est pas enregistré : corrigez les champs signalés en rouge.",
      emailOrPasswordIncorrect:
        "L'adresse e-mail ou le mot de passe ne correspond pas. Vérifiez les deux, ou touchez « Mot de passe oublié ».",
      userLocked:
        "Trop d'essais : ce compte est bloqué 10 minutes. Réessayez ensuite, ou demandez à l'autre hôte de le débloquer.",
      unknown:
        "Quelque chose n'a pas fonctionné. Vérifiez votre connexion, puis réessayez.",
      problemUploadingFile:
        "La photo n'a pas pu être envoyée. Vérifiez qu'elle pèse moins de 4,5 Mo, puis réessayez.",
      noFilesUploaded: "Choisissez d'abord une photo à envoyer.",
      invalidFileType: "Ce fichier n'est pas une photo.",
      valueMustBeUnique: "Cette valeur est déjà utilisée ailleurs.",
      notAllowedToPerformAction:
        "Votre compte n'a pas le droit de faire cette action.",
      unauthorized: "Votre session est terminée. Reconnectez-vous.",
      tokenInvalidOrExpired:
        "Ce lien n'est plus valable. Demandez-en un nouveau avec « Mot de passe oublié ».",
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
