
import { useState, useMemo } from "react";
import {
  Search, X, ChevronDown, ChevronRight, Check, Star, Plus,
  Users, HelpCircle, Settings, Bell, User, Edit2, RefreshCw,
  Home, BarChart2, Building2, UserCircle, CalendarDays,
  FileText, ClipboardList, BookOpen, Briefcase, Filter,
  ArrowUpDown, ChevronUp, ChevronsRight, Pencil, LayoutGrid,
  UserCog
} from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────
const T = {
  pepRed: "#C8102E",
  navy: "#032D60",
  blue: "#0070D2",
  bgGray: "#F3F2F2",
  white: "#FFFFFF",
  border: "#DDDBDA",
  borderLight: "#E5E5E5",
  textDark: "#181818",
  textMed: "#444444",
  textLight: "#706E6B",
  sectionBg: "#F8F8F8",
  recordIconBg: "#FFD6D6",
  badgeSoumise: { bg: "#F4F6FE", text: "#0070D2" },
  badgeAffectee: { bg: "#EAF5EA", text: "#2E7D32" },
  badgeEnAttente: { bg: "#FFF3E0", text: "#E65100" },
  badgeComplete: { bg: "#E3F2FD", text: "#1565C0" },
  badgePreteCom: { bg: "#F3E5F5", text: "#6A1B9A" },
  badgePreteSession: { bg: "#E8F5E9", text: "#1B5E20" },
  badgeFerme: { bg: "#FAFAFA", text: "#616161" },
};

// ─── STATUTS ─────────────────────────────────────────────────
const STATUTS_ORDER = [
  "Soumise", "Affectée", "En attente de pièces",
  "Complète", "Prête pour la commission", "Prête pour la session", "Fermée"
];

const STATUS_STYLES = {
  "Soumise":                  { bg: "#E8F4FD", color: "#0070D2" },
  "Affectée":                 { bg: "#EAF5EA", color: "#2E7D32" },
  "En attente de pièces":     { bg: "#FFF3E0", color: "#E65100" },
  "Complète":                 { bg: "#E3F2FD", color: "#1565C0" },
  "Prête pour la commission": { bg: "#F3E5F5", color: "#6A1B9A" },
  "Prête pour la session":    { bg: "#E8F5E9", color: "#1B5E20" },
  "Fermée":                   { bg: "#F5F5F5", color: "#616161" },
  "Fermé":                    { bg: "#F5F5F5", color: "#616161" },
};

// ─── NAVIGATION ITEMS ────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Accueil",           icon: Home,         color: "#032D60", sub: "Tableau de bord principal" },
  { label: "CRO",               icon: BarChart2,     color: "#2E7D32", sub: "Gestion des CRO" },
  { label: "Comptes",           icon: Building2,     color: "#6A1B9A", sub: "Gestion des comptes" },
  { label: "Contacts",          icon: UserCircle,   color: "#6A1B9A", sub: "Gestion des contacts" },
  { label: "Groupes de stages", icon: CalendarDays,  color: "#7B3F00", sub: "Gestion des groupes" },
  { label: "Demandes",          icon: Briefcase,     color: "#C8102E", sub: "Traitement des demandes" },
  { label: "Fiches stagiaires", icon: UserCog,     color: "#C8102E", sub: "Fiches des stagiaires" },
  { label: "Obligations",       icon: ClipboardList, color: "#0070D2", sub: "Suivi des obligations" },
];

// ─── COMPLETE DEMANDES DATA ───────────────────────────────────
const DEMANDES_DATA = [
  { id:"000001", type:"Inscription au stage",              stagiaire:"DUPONT Marie",      statut:"Prête pour la commission", typeStage:"Stage classique",                         cycle:"Année 1", mois:"12/36", cabinet:"Cabinet Mazars",      maitre:"BERNARD Jacques",   controleur:"LEROY Sophie",   dateEffet:"01/04/2026", dateSession:"15/03/2026" },
  { id:"000002", type:"Déclarer/Modifier un Maître de stage", stagiaire:"MARTIN Lucas",  statut:"Affectée",                  typeStage:"Stage avec réduction",                    cycle:"Année 2", mois:"8/24",  cabinet:"KPMG France",         maitre:"ROUX Philippe",     controleur:"MOREAU Alice",   dateEffet:"15/02/2026", dateSession:"20/04/2026" },
  { id:"000003", type:"Déclarer un changement administratif", stagiaire:"PETIT Camille", statut:"Complète",                  typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"10/12", cabinet:"Deloitte & Associés", maitre:"FOURNIER Marc",     controleur:"GIRARD Isabelle",dateEffet:"10/03/2026", dateSession:"05/05/2026" },
  { id:"000004", type:"Inscription au stage",              stagiaire:"LEFEVRE Thomas",    statut:"En attente de pièces",     typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"8/12",  cabinet:"EY France",           maitre:"DURAND Alain",      controleur:"LAMBERT Claire", dateEffet:"01/03/2026", dateSession:"10/04/2026" },
  { id:"000005", type:"Arrêter un stage (suspension/abandon)", stagiaire:"GARCIA Elena", statut:"Soumise",                   typeStage:"Stage classique",                         cycle:"Année 2", mois:"6/36",  cabinet:"PwC France",          maitre:"SIMON Pierre",      controleur:"MERCIER Nicolas",dateEffet:"20/02/2026", dateSession:"15/05/2026" },
  { id:"000006", type:"Demander une prorogation AFS",      stagiaire:"ROBERT Julien",     statut:"Fermée",                   typeStage:"Stage avec réduction",                    cycle:"Année 3", mois:"20/24", cabinet:"Grant Thornton",      maitre:"DUBOIS Gérard",     controleur:"FONTAINE Élodie",dateEffet:"01/01/2026", dateSession:"01/03/2026" },
  { id:"000007", type:"Inscription au stage",              stagiaire:"MOREL Claire",       statut:"Prête pour la session",   typeStage:"Stage classique",                         cycle:"Année 1", mois:"3/36",  cabinet:"BDO France",          maitre:"LAURENT Michel",    controleur:"CHEVALIER Paul", dateEffet:"01/05/2026", dateSession:"20/06/2026" },
  { id:"000008", type:"Déclarer/Modifier un Maître de stage", stagiaire:"LAMBERT Hugo",   statut:"Affectée",                 typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"9/12",  cabinet:"RSM France",          maitre:"BONNET Yves",       controleur:"ROBIN Élodie",   dateEffet:"15/03/2026", dateSession:"01/05/2026" },
  { id:"000009", type:"Inscription au stage",              stagiaire:"BONNET Léa",         statut:"En attente de pièces",    typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"10/12", cabinet:"Fiducial Expertise",  maitre:"LEMAIRE Bruno",     controleur:"GARNIER Sophie", dateEffet:"01/04/2026", dateSession:"15/05/2026" },
  { id:"000010", type:"Déclarer un changement administratif", stagiaire:"MERCIER Antoine",statut:"Complète",                 typeStage:"Stage avec réduction",                    cycle:"Année 1", mois:"16/24", cabinet:"Crowe Horwath",       maitre:"PERRIN Jean-Luc",   controleur:"BLANC Valérie",  dateEffet:"20/03/2026", dateSession:"10/04/2026" },
  { id:"000011", type:"Arrêter un stage (suspension/abandon)", stagiaire:"CHEVALIER Sarah",statut:"Soumise",                 typeStage:"Stage classique",                         cycle:"Année 2", mois:"9/36",  cabinet:"Mazars SA",           maitre:"HENRY François",    controleur:"ROUSSEAU Martin",dateEffet:"10/02/2026", dateSession:"20/05/2026" },
  { id:"000012", type:"Inscription au stage",              stagiaire:"DURAND Émilie",      statut:"Prête pour la commission",typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"11/12", cabinet:"In Extenso",          maitre:"MASSON Thierry",    controleur:"ANDRE Paul",     dateEffet:"01/04/2026", dateSession:"15/03/2026" },
  { id:"000013", type:"Demander une prorogation AFS",      stagiaire:"FONTAINE Romain",    statut:"Fermée",                  typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"5/12",  cabinet:"Nexia France",        maitre:"GIRAUD Dominique",  controleur:"FAURE Hélène",   dateEffet:"01/01/2026", dateSession:"01/02/2026" },
  { id:"000014", type:"Inscription au stage",              stagiaire:"ROBIN Maxime",       statut:"Soumise",                 typeStage:"Stage classique",                         cycle:"Année 2", mois:"22/36", cabinet:"Baker Tilly France",  maitre:"MULLER Patrick",    controleur:"LECOMTE Édouard",dateEffet:"01/05/2026", dateSession:"15/06/2026" },
  { id:"000015", type:"Déclarer/Modifier un Maître de stage", stagiaire:"SIMON Chloé",     statut:"Affectée",                typeStage:"Stage avec réduction",                    cycle:"Année 3", mois:"12/24", cabinet:"Groupe Y Nexia",      maitre:"RENAUD Olivier",    controleur:"DAVID Martin",   dateEffet:"20/03/2026", dateSession:"05/05/2026" },
  { id:"000016", type:"Déclarer un changement administratif", stagiaire:"GIRARD Nathan",   statut:"Prête pour la session",   typeStage:"Stage classique",                         cycle:"Année 1", mois:"33/36", cabinet:"Exco France",         maitre:"LEFEBVRE Daniel",   controleur:"THOMAS Céline",  dateEffet:"01/03/2026", dateSession:"10/04/2026" },
  { id:"000017", type:"Inscription au stage",              stagiaire:"ANDRE Manon",        statut:"Complète",                typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"8/12",  cabinet:"Aca Nexia",           maitre:"MOREAU Stéphane",   controleur:"PETIT Laurence", dateEffet:"10/04/2026", dateSession:"20/05/2026" },
  { id:"000018", type:"Arrêter un stage (suspension/abandon)", stagiaire:"BLANC Théo",     statut:"En attente de pièces",    typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"9/12",  cabinet:"TGS France",          maitre:"GAUTHIER René",     controleur:"DENIS François", dateEffet:"15/03/2026", dateSession:"01/05/2026" },
  { id:"000019", type:"Demander une prorogation AFS",      stagiaire:"FAURE Inès",         statut:"Soumise",                 typeStage:"Stage avec réduction",                    cycle:"Année 1", mois:"4/24",  cabinet:"Aplitec",             maitre:"RICHARD Claude",    controleur:"NICOLAS Sylvie", dateEffet:"01/05/2026", dateSession:"10/06/2026" },
  { id:"000020", type:"Inscription au stage",              stagiaire:"HENRY Alexandre",    statut:"Affectée",                typeStage:"Stage classique",                         cycle:"Année 2", mois:"14/36", cabinet:"Audit France",        maitre:"MARTINEZ Luis",     controleur:"PICARD Monique", dateEffet:"01/04/2026", dateSession:"15/05/2026" },
  { id:"000021", type:"Déclarer/Modifier un Maître de stage", stagiaire:"ROUSSEAU Océane", statut:"Prête pour la commission",typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"11/12", cabinet:"Cerfrance",           maitre:"VINCENT Georges",   controleur:"HUBERT Corinne", dateEffet:"01/04/2026", dateSession:"15/03/2026" },
  { id:"000022", type:"Inscription au stage",              stagiaire:"THOMAS Raphaël",     statut:"Fermée",                  typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"7/12",  cabinet:"Exponens",            maitre:"CLEMENT Bernard",   controleur:"MARCHAND Jean",  dateEffet:"01/10/2025", dateSession:"15/01/2026" },
  { id:"000023", type:"Déclarer un changement administratif", stagiaire:"DAVID Lucie",     statut:"Soumise",                 typeStage:"Stage classique",                         cycle:"Année 2", mois:"26/36", cabinet:"Fiteco",              maitre:"BERTRAND Paul",     controleur:"LEGRAND Guy",    dateEffet:"01/05/2026", dateSession:"10/06/2026" },
  { id:"000024", type:"Inscription au stage",              stagiaire:"NICOLAS Kevin",      statut:"Prête pour la session",   typeStage:"Stage avec réduction",                    cycle:"Année 3", mois:"18/24", cabinet:"Soregor",             maitre:"RENAULT Henri",     controleur:"GUERIN David",   dateEffet:"01/04/2026", dateSession:"15/05/2026" },
  { id:"000025", type:"Arrêter un stage (suspension/abandon)", stagiaire:"GUERIN Pauline", statut:"Soumise",                 typeStage:"Stage classique",                         cycle:"Année 1", mois:"2/36",  cabinet:"Groupe Cogesten",     maitre:"POIRIER Jean-Marc", controleur:"AUBERT Michel",  dateEffet:"01/05/2026", dateSession:"20/06/2026" },
  { id:"000026", type:"Demander une prorogation AFS",      stagiaire:"PICARD Bastien",     statut:"Complète",                typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"10/12", cabinet:"Visiativ",            maitre:"BARBIER Christian", controleur:"MEYER Joanne",   dateEffet:"10/03/2026", dateSession:"05/04/2026" },
  { id:"000027", type:"Inscription au stage",              stagiaire:"LEMAIRE Amandine",   statut:"En attente de pièces",    typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"11/12", cabinet:"Audit Conseil",       maitre:"COLLET Éric",       controleur:"PERROT Justin",  dateEffet:"01/04/2026", dateSession:"15/05/2026" },
  { id:"000028", type:"Déclarer/Modifier un Maître de stage", stagiaire:"GAUTHIER Élodie", statut:"Soumise",                 typeStage:"Stage avec réduction",                    cycle:"Année 1", mois:"6/24",  cabinet:"Strego",              maitre:"JACQUET Robert",    controleur:"MORIN Geneviève",dateEffet:"01/05/2026", dateSession:"20/06/2026" },
  { id:"000029", type:"Inscription au stage",              stagiaire:"PERRIN Valentin",    statut:"Affectée",                typeStage:"Stage classique",                         cycle:"Année 2", mois:"11/36", cabinet:"Sofideec Baker Tilly",maitre:"CARPENTIER André",  controleur:"CHARLES Victor", dateEffet:"15/04/2026", dateSession:"30/05/2026" },
  { id:"000030", type:"Déclarer un changement administratif", stagiaire:"DENIS Charlotte", statut:"Prête pour la commission",typeStage:"Stage d'un an / Renouvellement AFS",      cycle:"Année 1", mois:"9/12",  cabinet:"Fiducial Audit",      maitre:"SCHMITT Gilbert",   controleur:"FABRE Christine",dateEffet:"01/04/2026", dateSession:"15/03/2026" },
  { id:"000031", type:"Invalidation partielle",            stagiaire:"DUPONT Marie",        statut:"Soumise",                 typeStage:"Stage classique",                         cycle:"Année 2", mois:"12/36", cabinet:"Cabinet Mazars",      maitre:"BERNARD Jacques",   controleur:"LEROY Sophie",   dateEffet:"01/04/2026", dateSession:"15/04/2026" },
  { id:"000032", type:"Délai supplémentaire du stage",     stagiaire:"DUPONT Marie",        statut:"Affectée",                typeStage:"Stage classique",                         cycle:"Année 2", mois:"12/36", cabinet:"Cabinet Mazars",      maitre:"BERNARD Jacques",   controleur:"LEROY Sophie",   dateEffet:"01/05/2026", dateSession:"15/05/2026" },
  { id:"000033", type:"Réintégration",                     stagiaire:"DUPONT Marie",        statut:"Complète",                typeStage:"Stage classique",                         cycle:"Année 2", mois:"12/36", cabinet:"Cabinet Mazars",      maitre:"BERNARD Jacques",   controleur:"JACQUET Robert", dateEffet:"01/06/2026", dateSession:"15/06/2026" },
];

// ─── PERSONAL DETAILS PER STAGIAIRE ──────────────────────────
const PERSON_DETAILS = {
  "DUPONT Marie":      { civ:"Madame",   nom:"DUPONT",    prenom:"Marie",    prenom2:"Claire",    ddn:"15/06/1995", paysNaissance:"France", nationalite:"Française",     lieu:"Paris",      rue:"12 Rue du Faubourg Saint-Honoré", cp:"75008", ville:"Paris",      email:"marie.dupont@gmail.com",      mobile:"+33 6 12 34 56 78", fixe:"+33 1 42 68 53 00" },
  "MARTIN Lucas":      { civ:"Monsieur", nom:"MARTIN",    prenom:"Lucas",    prenom2:"Antoine",   ddn:"22/09/1997", paysNaissance:"France", nationalite:"Française",     lieu:"Lyon",       rue:"45 Rue de la République",        cp:"69002", ville:"Lyon",       email:"lucas.martin@outlook.fr",     mobile:"+33 6 23 45 67 89", fixe:"+33 4 72 56 34 12" },
  "PETIT Camille":     { civ:"Madame",   nom:"PETIT",     prenom:"Camille",  prenom2:"",          ddn:"03/03/1998", paysNaissance:"France", nationalite:"Française",     lieu:"Bordeaux",   rue:"8 Allées de Tourny",             cp:"33000", ville:"Bordeaux",   email:"camille.petit@free.fr",       mobile:"+33 6 34 56 78 90", fixe:"" },
  "LEFEVRE Thomas":    { civ:"Monsieur", nom:"LEFEVRE",   prenom:"Thomas",   prenom2:"",          ddn:"14/11/1996", paysNaissance:"France", nationalite:"Française",     lieu:"Lille",      rue:"22 Rue Nationale",               cp:"59000", ville:"Lille",      email:"thomas.lefevre@gmail.com",    mobile:"+33 6 45 67 89 01", fixe:"+33 3 20 14 22 33" },
  "GARCIA Elena":      { civ:"Madame",   nom:"GARCIA",    prenom:"Elena",    prenom2:"",          ddn:"07/07/1999", paysNaissance:"Espagne", nationalite:"Française",    lieu:"Toulouse",   rue:"3 Place du Capitole",            cp:"31000", ville:"Toulouse",   email:"elena.garcia@laposte.net",    mobile:"+33 6 56 78 90 12", fixe:"" },
  "ROBERT Julien":     { civ:"Monsieur", nom:"ROBERT",    prenom:"Julien",   prenom2:"Marc",      ddn:"29/01/1994", paysNaissance:"France", nationalite:"Française",     lieu:"Nantes",     rue:"15 Rue du Commerce",             cp:"44000", ville:"Nantes",     email:"julien.robert@gmail.com",     mobile:"+33 6 67 89 01 23", fixe:"+33 2 40 89 12 45" },
  "MOREL Claire":      { civ:"Madame",   nom:"MOREL",     prenom:"Claire",   prenom2:"Isabelle",  ddn:"18/04/2000", paysNaissance:"France", nationalite:"Française",     lieu:"Strasbourg", rue:"9 Rue des Grandes Arcades",      cp:"67000", ville:"Strasbourg", email:"claire.morel@sfr.fr",         mobile:"+33 6 78 90 12 34", fixe:"" },
  "LAMBERT Hugo":      { civ:"Monsieur", nom:"LAMBERT",   prenom:"Hugo",     prenom2:"",          ddn:"11/08/1997", paysNaissance:"France", nationalite:"Française",     lieu:"Montpellier",rue:"28 Rue de la Loge",              cp:"34000", ville:"Montpellier",email:"hugo.lambert@orange.fr",      mobile:"+33 6 89 01 23 45", fixe:"" },
  "BONNET Léa":        { civ:"Madame",   nom:"BONNET",    prenom:"Léa",      prenom2:"",          ddn:"25/12/1998", paysNaissance:"France", nationalite:"Française",     lieu:"Nice",       rue:"14 Avenue Jean Médecin",         cp:"06000", ville:"Nice",       email:"lea.bonnet@gmail.com",        mobile:"+33 6 90 12 34 56", fixe:"+33 4 93 88 77 66" },
  "MERCIER Antoine":   { civ:"Monsieur", nom:"MERCIER",   prenom:"Antoine",  prenom2:"Louis",     ddn:"05/05/1995", paysNaissance:"France", nationalite:"Française",     lieu:"Rennes",     rue:"7 Rue Saint-Georges",            cp:"35000", ville:"Rennes",     email:"antoine.mercier@hotmail.fr",  mobile:"+33 6 01 23 45 67", fixe:"" },
  "CHEVALIER Sarah":   { civ:"Madame",   nom:"CHEVALIER", prenom:"Sarah",    prenom2:"",          ddn:"30/09/1999", paysNaissance:"France", nationalite:"Française",     lieu:"Grenoble",   rue:"5 Place Victor Hugo",            cp:"38000", ville:"Grenoble",   email:"sarah.chevalier@gmail.com",   mobile:"+33 6 12 34 56 79", fixe:"" },
  "DURAND Émilie":     { civ:"Madame",   nom:"DURAND",    prenom:"Émilie",   prenom2:"Sophie",    ddn:"16/02/1997", paysNaissance:"France", nationalite:"Française",     lieu:"Paris",      rue:"34 Rue du Bac",                  cp:"75007", ville:"Paris",      email:"emilie.durand@gmail.com",     mobile:"+33 6 23 45 67 80", fixe:"+33 1 45 22 87 56" },
  "FONTAINE Romain":   { civ:"Monsieur", nom:"FONTAINE",  prenom:"Romain",   prenom2:"",          ddn:"08/06/1993", paysNaissance:"France", nationalite:"Française",     lieu:"Marseille",  rue:"20 La Canebière",                cp:"13001", ville:"Marseille",  email:"romain.fontaine@yahoo.fr",    mobile:"+33 6 34 56 78 91", fixe:"+33 4 91 25 36 47" },
};

// Générer les détails manquants de façon déterministe
function getPersonDetails(stagiaire) {
  if (PERSON_DETAILS[stagiaire]) return PERSON_DETAILS[stagiaire];
  const parts = stagiaire.split(" ");
  const nom = parts[0];
  const prenom = parts.slice(1).join(" ");
  const isMale = ["Lucas","Thomas","Julien","Hugo","Antoine","Romain","Maxime","Nathan","Alexandre","Raphaël","Bastien","Valentin","Kevin","Théo","Romain"].includes(prenom);
  return {
    civ: isMale ? "Monsieur" : "Madame",
    nom, prenom, prenom2: "",
    ddn: `${String(Math.floor(Math.random()*28)+1).padStart(2,"0")}/${String(Math.floor(Math.random()*12)+1).padStart(2,"0")}/${1993+Math.floor(Math.random()*10)}`,
    paysNaissance: "France",
    nationalite: "Française",
    lieu: "Paris",
    rue: `${Math.floor(Math.random()*50)+1} Rue de Paris`,
    cp: "75001",
    ville: "Paris",
    email: `${prenom.toLowerCase().replace(/[éèê]/g,"e").replace(/[àâ]/g,"a")}.${nom.toLowerCase()}@gmail.com`,
    mobile: `+33 6 ${String(Math.floor(Math.random()*90)+10)} ${String(Math.floor(Math.random()*90)+10)} ${String(Math.floor(Math.random()*90)+10)} ${String(Math.floor(Math.random()*90)+10)}`,
    fixe: "",
  };
}

// ─── HELPERS ─────────────────────────────────────────────────
function StatusBadge({ statut }) {
  const s = STATUS_STYLES[statut] || { bg: "#F5F5F5", color: "#616161" };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "2px 10px", borderRadius: 12,
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
      display: "inline-block",
    }}>{statut}</span>
  );
}

function FieldRow({ label, value, link, editable, onEdit }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:2, paddingBottom:12, borderBottom:`1px solid ${T.border}`, marginBottom:12 }}>
      <span style={{ fontSize:11, color:T.textLight, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:13, fontWeight:600, color: link ? T.pepRed : T.textDark }}>
          {value || <span style={{color:T.textLight,fontStyle:"italic",fontWeight:400}}>—</span>}
        </span>
        {editable && (
          <button onClick={onEdit} style={{ background:"none", border:"none", cursor:"pointer", color:T.textLight, padding:"0 2px", display:"flex", alignItems:"center" }}>
            <Pencil size={11} />
          </button>
        )}
      </div>
    </div>
  );
}

function FieldGrid({ fields }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px", padding:"16px 16px 4px" }}>
      {fields.map(([label, value, link, editable]) => (
        <FieldRow key={label} label={label} value={value} link={link} editable={editable} />
      ))}
    </div>
  );
}

function AccordionSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border:`1px solid ${T.border}`, borderRadius:4, marginBottom:8, overflow:"hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width:"100%", background:T.sectionBg, border:"none", cursor:"pointer",
          padding:"10px 16px", display:"flex", alignItems:"center", gap:8,
          fontWeight:700, fontSize:13, color:T.pepRed, textAlign:"left",
        }}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {title}
      </button>
      {open && <div style={{ background:T.white }}>{children}</div>}
    </div>
  );
}

// ─── STATUS PIPELINE ─────────────────────────────────────────
function StatusPipeline({ statut, onAdvance }) {
  const currentIdx = STATUTS_ORDER.indexOf(statut);
  return (
    <div style={{ padding:"12px 16px 0", background:T.white }}>
      <div style={{ display:"flex", alignItems:"stretch", overflowX:"auto" }}>
        {STATUTS_ORDER.map((s, i) => {
          const isActive = i === currentIdx;
          const isDone = i < currentIdx;
          return (
            <div key={s} style={{ display:"flex", alignItems:"center", flex:1, minWidth:0 }}>
              <div style={{
                flex:1, padding:"8px 12px", textAlign:"center",
                background: isActive ? T.navy : isDone ? "#E8F0FE" : "#F3F2F2",
                color: isActive ? T.white : isDone ? T.blue : T.textMed,
                fontSize:12, fontWeight: isActive ? 700 : 500,
                cursor:"pointer", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                borderTop:`2px solid ${isActive ? T.navy : isDone ? T.blue : T.border}`,
                position:"relative",
              }}
                onClick={() => !isDone && !isActive && onAdvance && onAdvance(s)}
              >
                {isDone && <Check size={10} style={{ display:"inline", marginRight:4, verticalAlign:"middle" }} />}
                {s}
              </div>
              {i < STATUTS_ORDER.length - 1 && (
                <div style={{ width:0, height:0, borderTop:"17px solid transparent", borderBottom:"17px solid transparent",
                  borderLeft:`10px solid ${isActive ? T.navy : isDone ? "#E8F0FE" : "#F3F2F2"}`, flexShrink:0, zIndex:1 }} />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ padding:"10px 0 12px" }}>
        <button
          onClick={onAdvance}
          style={{
            background: currentIdx < STATUTS_ORDER.length - 1 ? T.pepRed : "#ccc",
            color: T.white, border:"none", borderRadius:4, padding:"6px 16px",
            fontSize:13, fontWeight:600, cursor: currentIdx < STATUTS_ORDER.length - 1 ? "pointer" : "default",
            display:"flex", alignItems:"center", gap:6,
          }}>
          <Check size={14} />
          Marquer Statut comme terminé(e)
        </button>
      </div>
    </div>
  );
}

// ─── INLINE EDIT FIELD (for Examen tab) ──────────────────────
function EditableField({ label }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, paddingBottom:12, borderBottom:`1px solid ${T.border}`, marginBottom:12 }}>
      <button onClick={() => setEditing(true)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textLight, padding:0, flexShrink:0 }}>
        <Pencil size={12} />
      </button>
      <div style={{ flex:1 }}>
        <span style={{ fontSize:11, color:T.textLight, textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:2 }}>{label}</span>
        {editing ? (
          <div style={{ display:"flex", gap:6 }}>
            <input
              autoFocus
              value={value}
              onChange={e => setValue(e.target.value)}
              style={{ border:`1px solid ${T.blue}`, borderRadius:4, padding:"3px 8px", fontSize:13, flex:1, outline:"none" }}
            />
            <button onClick={() => setEditing(false)} style={{ background:T.blue, color:"white", border:"none", borderRadius:4, padding:"3px 10px", cursor:"pointer", fontSize:12 }}>✓</button>
            <button onClick={() => { setEditing(false); setValue(""); }} style={{ background:"#f0f0f0", border:"none", borderRadius:4, padding:"3px 8px", cursor:"pointer", fontSize:12 }}>✕</button>
          </div>
        ) : (
          <span style={{ fontSize:13, color: value ? T.textDark : T.textLight, fontStyle: value ? "normal" : "italic" }}>
            {value || "—"}
          </span>
        )}
      </div>
      <button onClick={() => setEditing(true)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textLight, padding:0, flexShrink:0 }}>
        <Pencil size={12} />
      </button>
    </div>
  );
}

// ─── SCREEN: LOGIN ────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("eloui@experts-comptables.org");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'Salesforce Sans', system-ui, sans-serif" }}>
      {/* Panneau gauche */}
      <div style={{ flex:"0 0 50%", background:"#F3F2F2", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40 }}>
        {/* Logo PEP */}
        <div style={{ marginBottom:40 }}>
          <svg width="140" height="50" viewBox="0 0 140 50">
            <text x="0" y="42" fontFamily="system-ui" fontWeight="900" fontSize="48" fill={T.pepRed}>p</text>
            <text x="36" y="42" fontFamily="system-ui" fontWeight="900" fontSize="48" fill={T.navy}>ep</text>
            <text x="6" y="18" fontFamily="system-ui" fontWeight="400" fontSize="9" fill={T.textMed} letterSpacing="0.5">plateforme</text>
            <text x="6" y="28" fontFamily="system-ui" fontWeight="400" fontSize="9" fill={T.textMed} letterSpacing="0.5">d'exercice</text>
            <text x="6" y="38" fontFamily="system-ui" fontWeight="400" fontSize="9" fill={T.textMed} letterSpacing="0.5">professionnel</text>
          </svg>
        </div>

        <div style={{ background:T.white, borderRadius:8, padding:"32px 36px", width:"100%", maxWidth:400, boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:13, fontWeight:500, color:T.textMed, marginBottom:6 }}>Nom d'utilisateur</label>
            <input
              value={user}
              onChange={e => setUser(e.target.value)}
              style={{ width:"100%", border:`1px solid ${T.border}`, borderRadius:4, padding:"10px 12px", fontSize:14, boxSizing:"border-box", outline:"none" }}
            />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:13, fontWeight:500, color:T.textMed, marginBottom:6 }}>Mot de passe</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onLogin()}
              style={{ width:"100%", border:`1px solid ${T.border}`, borderRadius:4, padding:"10px 12px", fontSize:14, boxSizing:"border-box", outline:"none" }}
            />
          </div>
          <button
            onClick={onLogin}
            style={{ width:"100%", background:T.blue, color:T.white, border:"none", borderRadius:4, padding:"11px 0", fontSize:15, fontWeight:700, cursor:"pointer", marginBottom:12 }}>
            Se connecter
          </button>
          <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:T.textMed, cursor:"pointer" }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Se souvenir de moi
          </label>
          <div style={{ marginTop:12, textAlign:"center" }}>
            <a href="#" style={{ color:T.blue, fontSize:13, textDecoration:"none" }}>Mot de passe oublié ?</a>
          </div>
        </div>
        <div style={{ marginTop:"auto", paddingTop:32, color:T.textLight, fontSize:12 }}>© 2026 Salesforce, Inc. Tous droits réservés.</div>
      </div>

      {/* Panneau droit – Salesforce banner */}
      <div style={{ flex:1, background:"#032D60", display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px 56px", color:T.white }}>
        <p style={{ fontSize:13, opacity:0.8, marginBottom:12 }}>5–7 mai 2026 | San Diego, CA</p>
        <h1 style={{ fontSize:38, fontWeight:800, lineHeight:1.2, marginBottom:20, maxWidth:500 }}>
          Inscrivez-vous dès maintenant à l'événement data et analytics de l'année.
        </h1>
        <p style={{ fontSize:15, opacity:0.8, lineHeight:1.6, maxWidth:520, marginBottom:32 }}>
          La conférence Tableau est de retour, meilleure que jamais. Rejoignez-nous pour plus de trois jours, 300+ sessions, 150+ formations pratiques, du networking et bien plus.
        </p>
        <button style={{ background:T.white, color:T.navy, border:"none", borderRadius:4, padding:"12px 28px", fontSize:15, fontWeight:700, cursor:"pointer", width:"fit-content", display:"flex", alignItems:"center", gap:8 }}>
          S'inscrire ↗
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN: DEMANDES LIST ────────────────────────────────────
function DemandesListScreen({ onOpenRecord }) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const filtered = useMemo(() => {
    let list = DEMANDES_DATA.filter(d =>
      !search ||
      Object.values(d).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
    );
    list = [...list].sort((a, b) => {
      const va = String(a[sortCol] || "");
      const vb = String(b[sortCol] || "");
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [search, sortCol, sortDir]);

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  function toggleAll() {
    if (allSelected) { setSelected([]); setAllSelected(false); }
    else { setSelected(filtered.map(d => d.id)); setAllSelected(true); }
  }

  const cols = [
    { key:"id",      label:"N° demande",         w:90  },
    { key:"type",    label:"Type d'enregistrement", w:200 },
    { key:"stagiaire",label:"Nom du stagiaire",   w:150 },
    { key:"statut",  label:"Statut demande",       w:170 },
    { key:"typeStage",label:"Type de stage",       w:180 },
    { key:"cycle",   label:"Cycle de stage",       w:100 },
    { key:"mois",    label:"Nb mois de stage",     w:120 },
    { key:"cabinet", label:"Nom du cabinet",       w:160 },
    { key:"maitre",  label:"Maître de stage",      w:150 },
    { key:"controleur",label:"Contrôleur",         w:140 },
  ];

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ArrowUpDown size={12} style={{ opacity:0.3 }} />;
    return sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div style={{ flex:1, overflowY:"auto", background:T.bgGray }}>
      {/* Page header */}
      <div style={{ background:T.white, padding:"16px 20px 0", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"#FDDDE0", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Briefcase size={18} color={T.pepRed} />
            </div>
            <div>
              <div style={{ fontSize:11, color:T.textLight, fontWeight:500 }}>Demandes</div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:700, color:T.textDark, display:"flex", alignItems:"center", gap:8 }}>
                Toutes les demandes stage
                <ChevronDown size={16} color={T.textLight} />
              </h1>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button style={{ border:`1px solid ${T.border}`, background:T.white, borderRadius:4, padding:"6px 14px", fontSize:13, fontWeight:600, cursor:"pointer", color:T.textDark }}>Nouveau</button>
            <button style={{ border:`1px solid ${T.border}`, background:T.white, borderRadius:4, padding:"6px 14px", fontSize:13, fontWeight:600, cursor:"pointer", color:T.textDark }}>Modifier le propriétaire</button>
            <button style={{ border:`1px solid ${T.border}`, background:T.white, borderRadius:4, padding:"6px 14px", fontSize:13, fontWeight:600, cursor:"pointer", color:T.textDark }}>Changer le statut</button>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:10 }}>
          <span style={{ fontSize:12, color:T.textLight }}>
            {filtered.length} élément{filtered.length > 1 ? "s" : ""} • Trié(s) par N° demande • Filtré par Toutes les demandes stage • Mis à jour il y a quelques secondes
          </span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
              <Search size={13} style={{ position:"absolute", left:10, color:T.textLight }} />
              <input
                placeholder="Recherchez dans cette liste..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border:`1px solid ${T.border}`, borderRadius:4, padding:"5px 10px 5px 30px", fontSize:13, width:240, outline:"none" }}
              />
              {search && <button onClick={() => setSearch("")} style={{ position:"absolute", right:8, background:"none", border:"none", cursor:"pointer", color:T.textLight }}><X size={12}/></button>}
            </div>
            <button style={{ border:`1px solid ${T.border}`, background:T.white, borderRadius:4, padding:"5px 8px", cursor:"pointer", display:"flex", alignItems:"center" }}><Settings size={14} color={T.textLight}/></button>
            <button style={{ border:`1px solid ${T.border}`, background:T.white, borderRadius:4, padding:"5px 8px", cursor:"pointer", display:"flex", alignItems:"center" }}><RefreshCw size={14} color={T.textLight}/></button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", background:T.white, fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`2px solid ${T.border}`, background:"#FAFAF9" }}>
              <th style={{ width:40, padding:"8px 12px", textAlign:"center" }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              {cols.map(c => (
                <th key={c.key}
                  style={{ padding:"8px 12px", textAlign:"left", fontWeight:700, color:T.textMed, cursor:"pointer", whiteSpace:"nowrap", width:c.w, userSelect:"none" }}
                  onClick={() => handleSort(c.key)}>
                  <span style={{ display:"flex", alignItems:"center", gap:4 }}>{c.label} <SortIcon col={c.key} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.id}
                style={{ borderBottom:`1px solid ${T.borderLight}`, background: selected.includes(d.id) ? "#F0F8FF" : i % 2 === 0 ? T.white : "#FAFAFA", cursor:"pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#F3F8FF"}
                onMouseLeave={e => e.currentTarget.style.background = selected.includes(d.id) ? "#F0F8FF" : i % 2 === 0 ? T.white : "#FAFAFA"}
              >
                <td style={{ padding:"8px 12px", textAlign:"center" }} onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.includes(d.id)} onChange={() => setSelected(s => s.includes(d.id) ? s.filter(x => x !== d.id) : [...s, d.id])} />
                </td>
                <td style={{ padding:"10px 12px" }}>
                  <button onClick={() => onOpenRecord(d)} style={{ background:"none", border:"none", cursor:"pointer", color:T.pepRed, fontWeight:700, padding:0, fontSize:13 }}>
                    {d.id}
                  </button>
                </td>
                <td style={{ padding:"10px 12px", color:T.textDark }}>{d.type}</td>
                <td style={{ padding:"10px 12px" }}>
                  <button onClick={() => onOpenRecord(d)} style={{ background:"none", border:"none", cursor:"pointer", color:T.pepRed, fontWeight:600, padding:0, fontSize:13 }}>
                    {d.stagiaire}
                  </button>
                </td>
                <td style={{ padding:"10px 12px" }}><StatusBadge statut={d.statut} /></td>
                <td style={{ padding:"10px 12px", color:T.textDark }}>{d.typeStage}</td>
                <td style={{ padding:"10px 12px", color:T.textDark }}>{d.cycle}</td>
                <td style={{ padding:"10px 12px", color:T.textDark }}>{d.mois}</td>
                <td style={{ padding:"10px 12px" }}>
                  <span style={{ color:T.pepRed, fontWeight:600 }}>{d.cabinet}</span>
                </td>
                <td style={{ padding:"10px 12px" }}>
                  <span style={{ color:T.pepRed, fontWeight:600 }}>{d.maitre}</span>
                </td>
                <td style={{ padding:"10px 12px" }}>
                  <span style={{ color:T.pepRed, fontWeight:600 }}>{d.controleur}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:48, color:T.textLight, background:T.white }}>
            Aucun résultat pour « {search} »
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: DEMANDE DETAIL ───────────────────────────────────
function DemandeDetailScreen({ record, onClose }) {
  const [activeTab, setActiveTab] = useState("Détails");
  const [statut, setStatut] = useState(record.statut);
  const [toastMsg, setToastMsg] = useState("");

  const person = getPersonDetails(record.stagiaire);

  function advanceStatut() {
    const idx = STATUTS_ORDER.indexOf(statut);
    if (idx < STATUTS_ORDER.length - 1) {
      const next = STATUTS_ORDER[idx + 1];
      setStatut(next);
      setToastMsg(`Statut mis à jour : ${next}`);
      setTimeout(() => setToastMsg(""), 3000);
    }
  }

  const tabs = ["Détails", "PJ", "Examen"];

  return (
    <div style={{ flex:1, overflowY:"auto", background:T.bgGray, position:"relative" }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position:"fixed", top:16, right:16, background:T.navy, color:T.white,
          padding:"10px 20px", borderRadius:6, fontSize:13, fontWeight:600,
          boxShadow:"0 4px 12px rgba(0,0,0,0.2)", zIndex:9999, display:"flex", alignItems:"center", gap:8
        }}>
          <Check size={14} /> {toastMsg}
        </div>
      )}

      {/* Record Header Card */}
      <div style={{ background:T.white, margin:"16px 16px 0", borderRadius:6, border:`1px solid ${T.border}`, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px 12px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ width:48, height:48, borderRadius:"50%", background:"#FDDDE0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Briefcase size={22} color={T.pepRed} />
            </div>
            <div>
              <div style={{ fontSize:11, color:T.textLight, fontWeight:500, marginBottom:2 }}>Demande</div>
              <div style={{ fontSize:26, fontWeight:800, color:T.navy, letterSpacing:"-0.5px" }}>{record.id}</div>
            </div>
          </div>
          <button style={{ border:`1px solid ${T.pepRed}`, background:T.white, color:T.pepRed, borderRadius:20, padding:"6px 18px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            Modifier
          </button>
        </div>

        {/* Summary fields row */}
        <div style={{ display:"flex", gap:0, borderTop:`1px solid ${T.borderLight}`, overflow:"hidden" }}>
          {[
            ["Type d'enregistrement", record.type],
            ["Date d'effet", record.dateEffet],
            ["Type de stage", record.typeStage],
            ["Nom du stagiaire", record.stagiaire],
            ["Objet", "Traitement demande stage"],
            ["Statut demande", statut],
            ["Date de session", record.dateSession],
          ].map(([label, value], i) => (
            <div key={label} style={{ flex:1, padding:"10px 14px", borderRight:`1px solid ${T.borderLight}`, minWidth:0 }}>
              <div style={{ fontSize:10, color:T.textLight, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:500, marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:13, fontWeight:700, color:T.textDark, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {label === "Statut demande" ? <StatusBadge statut={value} /> : value}
              </div>
            </div>
          ))}
        </div>

        {/* Status Pipeline */}
        <StatusPipeline statut={statut} onAdvance={advanceStatut} />

        {/* Tabs */}
        <div style={{ borderTop:`1px solid ${T.border}`, display:"flex" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding:"12px 28px", background:"none", border:"none", cursor:"pointer",
              fontSize:14, fontWeight:600,
              color: activeTab === tab ? T.pepRed : T.textMed,
              borderBottom: activeTab === tab ? `2px solid ${T.pepRed}` : "2px solid transparent",
              marginBottom:-1,
            }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ margin:"12px 16px 24px" }}>

        {/* ── DÉTAILS TAB ── */}
        {activeTab === "Détails" && (
          <>
            <AccordionSection title="Informations générales" defaultOpen={false}>
              <FieldGrid fields={[
                ["N° demande", record.id, false, false],
                ["Type d'enregistrement", record.type, false, false],
                ["Date d'effet", record.dateEffet, false, true],
                ["Type de stage", record.typeStage, false, false],
                ["Cycle de stage", record.cycle, false, false],
                ["Nb mois de stage", record.mois, false, false],
                ["Statut demande", statut, false, false],
                ["Date de session", record.dateSession, false, true],
              ]} />
            </AccordionSection>

            <AccordionSection title="Renseignements personnels" defaultOpen={true}>
              <FieldGrid fields={[
                ["Civilité", person.civ],
                ["Nom de famille", person.nom, true],
                ["Nom d'usage", ""],
                ["Prénom", person.prenom, true],
                ["Prénom 2", person.prenom2],
                ["Prénom 3", ""],
                ["Prénom 4", ""],
                ["Date de naissance", person.ddn],
                ["Pays de naissance", person.paysNaissance, true],
                ["Nationalité", person.nationalite],
                ["Lieu de naissance", person.lieu],
                ["Adresse", `${person.rue}, ${person.cp} ${person.ville}, France`],
                ["Rue", person.rue],
                ["Complément d'adresse", ""],
                ["Code postal", person.cp],
                ["Ville", person.ville, true],
                ["Pays", person.paysNaissance],
                ["Adresse email personnelle", person.email, true],
                ["Téléphone mobile", person.mobile],
                ["Téléphone fixe", person.fixe],
              ]} />
            </AccordionSection>

            <AccordionSection title="Diplômes" defaultOpen={false}>
              <FieldGrid fields={[
                ["Diplôme principal", "Master CCA – Comptabilité Contrôle Audit"],
                ["Établissement", "Université Paris Dauphine"],
                ["Année d'obtention", "2022"],
                ["Mention", "Bien"],
              ]} />
            </AccordionSection>

            <AccordionSection title="Renseignements sur le stage" defaultOpen={false}>
              <FieldGrid fields={[
                ["Cabinet d'accueil", record.cabinet, true],
                ["Type de stage", record.typeStage],
                ["Date de début", record.dateEffet],
                ["Durée totale", record.mois + " mois"],
                ["Spécialité", "Audit et commissariat aux comptes"],
              ]} />
            </AccordionSection>

            <AccordionSection title="Renseignements sur le(s) Maître(s) de stage" defaultOpen={false}>
              <FieldGrid fields={[
                ["Maître de stage principal", record.maitre, true],
                ["Titre", "Expert-comptable"],
                ["Cabinet", record.cabinet, true],
                ["Contrôleur de stage", record.controleur, true],
              ]} />
            </AccordionSection>

            <AccordionSection title="Pièces justificatives" defaultOpen={false}>
              <div style={{ padding:16, color:T.textLight, fontSize:13 }}>
                Aucune pièce justificative associée à la section Détails.
              </div>
            </AccordionSection>

            <AccordionSection title="Confirmation et soumission" defaultOpen={false}>
              <FieldGrid fields={[
                ["Date de soumission", "28/03/2026"],
                ["Soumis par", record.stagiaire],
                ["Confirmé par", record.controleur],
                ["Commentaire", "Dossier complet — en attente de validation commission."],
              ]} />
            </AccordionSection>
          </>
        )}

        {/* ── PJ TAB ── */}
        {activeTab === "PJ" && (
          <div style={{ background:T.white, borderRadius:6, border:`1px solid ${T.border}`, padding:48, textAlign:"center", color:T.textLight }}>
            <FileText size={40} style={{ marginBottom:12, opacity:0.3 }} />
            <p style={{ margin:0, fontSize:14 }}>Aucune pièce justificative disponible</p>
          </div>
        )}

        {/* ── EXAMEN TAB ── */}
        {activeTab === "Examen" && (
          <>
            <div style={{ background:T.white, borderRadius:6, border:`1px solid ${T.border}`, marginBottom:12, overflow:"hidden" }}>
              <div style={{ padding:"10px 16px", background:T.sectionBg, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8 }}>
                <ChevronDown size={14} color={T.pepRed} />
                <span style={{ fontSize:13, fontWeight:700, color:T.pepRed }}>Commission</span>
              </div>
              <div style={{ padding:"12px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                <EditableField label="Type de commission/comité" />
                <EditableField label="Avis référent" />
                <EditableField label="Date de commission/comité" />
                <EditableField label="Commentaire référent" />
                <EditableField label="Avis permanent" />
                <EditableField label="Avis commission/comité" />
                <EditableField label="Commentaire permanent" />
                <EditableField label="Commentaire commission/comité" />
              </div>
            </div>

            <div style={{ background:T.white, borderRadius:6, border:`1px solid ${T.border}`, overflow:"hidden" }}>
              <div style={{ padding:"10px 16px", background:T.sectionBg, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8 }}>
                <ChevronDown size={14} color={T.pepRed} />
                <span style={{ fontSize:13, fontWeight:700, color:T.pepRed }}>Session</span>
              </div>
              <div style={{ padding:"12px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                <EditableField label="Date de session" />
                <EditableField label="Avis session" />
                <EditableField label="Commentaire session" />
                <div />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PLACEHOLDER SCREEN ───────────────────────────────────────
function PlaceholderScreen({ navItem }) {
  const Icon = navItem.icon;
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:T.bgGray }}>
      <div style={{ width:80, height:80, borderRadius:16, background:navItem.color, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, boxShadow:"0 4px 16px rgba(0,0,0,0.15)" }}>
        <Icon size={38} color={T.white} />
      </div>
      <h2 style={{ margin:"0 0 6px", color:T.navy, fontWeight:800 }}>{navItem.label}</h2>
      <p style={{ margin:0, color:T.textLight, fontSize:14 }}>{navItem.sub}</p>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeNav, setActiveNav] = useState("Demandes");
  const [navOpen, setNavOpen] = useState(false);
  const [openTabs, setOpenTabs] = useState([]);   // [{id, record}]
  const [activeTabId, setActiveTabId] = useState(null);

  const currentNavItem = NAV_ITEMS.find(n => n.label === activeNav) || NAV_ITEMS[5];

  function openRecord(record) {
    const exists = openTabs.find(t => t.id === record.id);
    if (!exists) setOpenTabs(tabs => [...tabs, { id: record.id, record }]);
    setActiveTabId(record.id);
    setActiveNav("Demandes");
  }

  function closeTab(id, e) {
    e.stopPropagation();
    setOpenTabs(tabs => tabs.filter(t => t.id !== id));
    if (activeTabId === id) setActiveTabId(null);
  }

  const activeTab = openTabs.find(t => t.id === activeTabId);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", fontFamily:"'Salesforce Sans', system-ui, -apple-system, sans-serif", fontSize:14 }}>

      {/* ── TOPBAR ── */}
      <div style={{ background:T.white, borderBottom:`1px solid ${T.border}`, flexShrink:0 }}>
        {/* Logo + Search + Icons */}
        <div style={{ display:"flex", alignItems:"center", padding:"8px 16px", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", flexShrink:0 }}>
            <svg width="56" height="22" viewBox="0 0 56 22">
              <text x="0" y="20" fontFamily="system-ui" fontWeight="900" fontSize="22" fill={T.pepRed}>p</text>
              <text x="15" y="20" fontFamily="system-ui" fontWeight="900" fontSize="22" fill={T.navy}>ep</text>
            </svg>
          </div>
          <div style={{ flex:1, maxWidth:600, position:"relative" }}>
            <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:T.textLight }} />
            <input
              placeholder="Recherchez..."
              style={{ width:"100%", border:`1px solid ${T.border}`, borderRadius:20, padding:"7px 16px 7px 36px", fontSize:13, outline:"none", boxSizing:"border-box", background:"#FAFAF9" }}
            />
          </div>
          <div style={{ display:"flex", gap:4, alignItems:"center", marginLeft:"auto" }}>
            {[
              { icon:<Star size={16} />, label:"Favoris" },
              { icon:<Plus size={16} />, label:"Nouveau" },
              { icon:<Users size={16} />, label:"Équipe" },
              { icon:<HelpCircle size={16} />, label:"Aide" },
              { icon:<Settings size={16} />, label:"Paramètres" },
              { icon:<Bell size={16} />, label:"Notifications" },
            ].map(({ icon, label }) => (
              <button key={label} title={label} style={{ background:"none", border:"none", cursor:"pointer", padding:"6px 7px", borderRadius:4, color:T.textMed, display:"flex", alignItems:"center" }}>
                {icon}
              </button>
            ))}
            <div style={{ width:30, height:30, borderRadius:"50%", background:T.navy, display:"flex", alignItems:"center", justifyContent:"center", marginLeft:4, cursor:"pointer" }}>
              <User size={15} color={T.white} />
            </div>
          </div>
        </div>

        {/* Nav tabs bar */}
        <div style={{ display:"flex", alignItems:"center", padding:"0 12px", borderTop:`1px solid ${T.borderLight}`, overflowX:"auto" }}>
          {/* PEP pill */}
          <button style={{ background:"none", border:"none", cursor:"pointer", padding:"8px 12px", fontSize:13, fontWeight:700, color:T.textDark, flexShrink:0 }}>
            PEP
          </button>

          {/* Active nav item with dropdown */}
          <div style={{ position:"relative" }}>
            <button
              onClick={() => setNavOpen(v => !v)}
              style={{
                background:"none", border:"none", cursor:"pointer",
                padding:"8px 12px", fontSize:13, fontWeight:700,
                color:T.pepRed, display:"flex", alignItems:"center", gap:4, flexShrink:0,
                borderBottom:`2px solid ${T.pepRed}`,
              }}>
              {activeNav} <ChevronDown size={12} />
            </button>
            {navOpen && (
              <div style={{
                position:"absolute", top:"100%", left:0,
                background:T.white, border:`1px solid ${T.border}`,
                borderRadius:6, boxShadow:"0 8px 24px rgba(0,0,0,0.12)",
                minWidth:220, zIndex:1000,
              }}>
                {NAV_ITEMS.map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.label}
                      onClick={() => { setActiveNav(item.label); setNavOpen(false); setActiveTabId(null); }}
                      style={{
                        display:"flex", alignItems:"center", gap:12, width:"100%",
                        padding:"10px 16px", background: activeNav === item.label ? "#F3F8FF" : "none",
                        border:"none", cursor:"pointer", fontSize:13, fontWeight:600,
                        color: activeNav === item.label ? T.blue : T.textDark, textAlign:"left",
                      }}>
                      <div style={{ width:28, height:28, borderRadius:6, background:item.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon size={14} color={T.white} />
                      </div>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Separator */}
          {openTabs.length > 0 && <div style={{ width:1, height:20, background:T.border, margin:"0 4px", flexShrink:0 }} />}

          {/* Open record tabs */}
          {openTabs.map(tab => (
            <div key={tab.id}
              onClick={() => { setActiveTabId(tab.id); setNavOpen(false); }}
              style={{
                display:"flex", alignItems:"center", gap:6, padding:"8px 12px",
                cursor:"pointer", flexShrink:0,
                borderBottom: activeTabId === tab.id ? `2px solid ${T.pepRed}` : "2px solid transparent",
                color: activeTabId === tab.id ? T.pepRed : T.textMed,
                fontWeight: activeTabId === tab.id ? 700 : 500, fontSize:13,
              }}>
              <Briefcase size={12} />
              {tab.id} | {tab.record.stagiaire.split(" ")[0]}...
              <button onClick={e => closeTab(tab.id, e)} style={{ background:"none", border:"none", cursor:"pointer", padding:"0 2px", color:"inherit", display:"flex", alignItems:"center" }}>
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Dismiss nav dropdown */}
          {navOpen && <div style={{ position:"fixed", inset:0, zIndex:999 }} onClick={() => setNavOpen(false)} />}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {activeTabId && activeTab ? (
          <DemandeDetailScreen key={activeTabId} record={activeTab.record} onClose={() => setActiveTabId(null)} />
        ) : activeNav === "Demandes" ? (
          <DemandesListScreen onOpenRecord={openRecord} />
        ) : (
          <PlaceholderScreen navItem={currentNavItem} />
        )}
      </div>
    </div>
  );
}
