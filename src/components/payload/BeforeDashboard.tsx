import React from "react";

export default function BeforeDashboard() {
  return (
    <div
      style={{
        background: "var(--theme-elevation-50)",
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "var(--style-radius-s)",
        padding: "2rem",
        marginBottom: "2rem",
      }}
    >
      <h2
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: "1.5rem",
          fontWeight: 600,
          marginTop: 0,
          marginBottom: "0.75rem",
        }}
      >
        Bienvenue sur votre espace d&apos;administration
      </h2>
      <p style={{ margin: "0 0 1rem", lineHeight: 1.6 }}>
        Depuis ce panneau, vous pouvez g&eacute;rer tout le contenu de votre
        site. Voici les sections principales :
      </p>
      <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.8 }}>
        <li>
          <strong>Pages</strong> &mdash; Modifiez le contenu des pages du site
          (Accueil, Le G&icirc;te, etc.)
        </li>
        <li>
          <strong>T&eacute;moignages</strong> &mdash; G&eacute;rez les avis des
          voyageurs
        </li>
        <li>
          <strong>&Eacute;quipements</strong> &mdash; Listez les
          &eacute;quipements du g&icirc;te
        </li>
        <li>
          <strong>Recommandations</strong> &mdash; Partagez vos bonnes adresses
          locales
        </li>
        <li>
          <strong>Livrets d&apos;accueil</strong> &mdash; Cr&eacute;ez des
          livrets personnalis&eacute;s pour vos voyageurs
        </li>
        <li>
          <strong>Tarifs &amp; R&eacute;servation</strong> &mdash;
          D&eacute;finissez vos saisons, prix et conditions
        </li>
        <li>
          <strong>Param&egrave;tres du site</strong> &mdash; Coordonn&eacute;es,
          logo, SEO et r&eacute;seaux sociaux
        </li>
      </ul>
    </div>
  );
}
