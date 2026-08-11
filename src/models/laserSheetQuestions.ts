export type FitzpatrickOption = { value: number; label: string };
export type FitzpatrickQuestion = { id: string; label: string; options: FitzpatrickOption[] };

export const FITZPATRICK_QUESTIONS: FitzpatrickQuestion[] = [
  {
    id: 'fitzpatrick_q1',
    label: 'Qual e il colore naturale dei capelli?',
    options: [
      { value: 0, label: 'Rosso sabbia' },
      { value: 1, label: 'Biondo' },
      { value: 2, label: 'Castano / biondo scuro' },
      { value: 3, label: 'Castano scuro' },
      { value: 4, label: 'Nero' },
    ],
  },
  {
    id: 'fitzpatrick_q2',
    label: 'Qual e il colore naturale degli occhi?',
    options: [
      { value: 0, label: 'Celeste / grigio / verde' },
      { value: 1, label: 'Blu / grigio / verde' },
      { value: 2, label: 'Blu' },
      { value: 3, label: 'Marrone scuro' },
      { value: 4, label: 'Marrone nerastro' },
    ],
  },
  {
    id: 'fitzpatrick_q3',
    label: 'Qual e il colore della cute esposta al sole?',
    options: [
      { value: 0, label: 'Rossastro' },
      { value: 1, label: 'Molto pallido' },
      { value: 2, label: 'Pallido con tocco di beige' },
      { value: 3, label: 'Marrone chiaro' },
      { value: 4, label: 'Marrone scuro' },
    ],
  },
  {
    id: 'fitzpatrick_q4',
    label: 'Quante lentiggini sono presenti nelle zone esposte?',
    options: [
      { value: 0, label: 'Molte' },
      { value: 1, label: 'Alcune' },
      { value: 2, label: 'Poche' },
      { value: 3, label: 'Pochissime' },
      { value: 4, label: 'Nessuna' },
    ],
  },
  {
    id: 'fitzpatrick_q5',
    label: 'Cosa succede con lunga esposizione al sole senza protezione?',
    options: [
      { value: 0, label: 'Rossore doloroso, vesciche, spellatura' },
      { value: 1, label: 'Vesciche seguite da spellatura' },
      { value: 2, label: 'Scottoni, a volte con spellatura' },
      { value: 3, label: 'Raramente ustioni' },
      { value: 4, label: 'Mai avuto problemi' },
    ],
  },
  {
    id: 'fitzpatrick_q6',
    label: "Qual e la qualita dell'abbronzatura?",
    options: [
      { value: 0, label: 'Nessuna o leggerissima' },
      { value: 1, label: 'Leggermente ambrata' },
      { value: 2, label: 'Abbronzatura ragionevole' },
      { value: 3, label: 'Si abbronza facilmente' },
      { value: 4, label: 'Diventa rapidamente scura' },
    ],
  },
  {
    id: 'fitzpatrick_q7',
    label: 'Diventa scuro dopo un giorno di esposizione?',
    options: [
      { value: 0, label: 'Mai' },
      { value: 1, label: 'Raramente' },
      { value: 2, label: 'A volte' },
      { value: 3, label: 'Spesso' },
      { value: 4, label: 'Sempre' },
    ],
  },
  {
    id: 'fitzpatrick_q8',
    label: 'Come risponde il viso al sole?',
    options: [
      { value: 0, label: 'Molto sensibile' },
      { value: 1, label: 'Sensibile' },
      { value: 2, label: 'Normale' },
      { value: 3, label: 'Molto resistente' },
      { value: 4, label: 'Mai avuto problemi' },
    ],
  },
  {
    id: 'fitzpatrick_q9',
    label: "Quando si e esposto l'ultima volta al sole o lampada?",
    options: [
      { value: 0, label: 'Piu di 3 mesi fa' },
      { value: 1, label: '2-3 mesi fa' },
      { value: 2, label: '1-2 mesi fa' },
      { value: 3, label: 'Meno di 1 mese fa' },
      { value: 4, label: 'Meno di 2 settimane fa' },
    ],
  },
  {
    id: 'fitzpatrick_q10',
    label: "Espone l'area da trattare al sole?",
    options: [
      { value: 0, label: 'Mai' },
      { value: 1, label: 'Quasi mai' },
      { value: 2, label: 'A volte' },
      { value: 3, label: 'Spesso' },
      { value: 4, label: 'Sempre' },
    ],
  },
];
