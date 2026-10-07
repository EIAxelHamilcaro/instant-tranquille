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
    },
    fields: {
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
