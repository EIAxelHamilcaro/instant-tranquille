import { PondScene } from "@/components/shared/Tableaux";

export default function BeforeLogin() {
  return (
    <>
      <div className="lit-tableau lit-connexion-tableau">
        <PondScene heron />
      </div>
      <p className="lit-accueil-connexion">
        L&apos;espace où vous modifiez les textes, les photos et les tarifs du
        site. Connectez-vous avec votre adresse e-mail.
      </p>
    </>
  );
}
