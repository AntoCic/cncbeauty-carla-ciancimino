import { FITZPATRICK_QUESTIONS } from '../../models/laserSheetQuestions';

export type StepDefinition = {
  id: string;
  title: string;
  subtitle?: string;
  fields: string[];
  fitzQuestionId?: string;
};

export function buildSteps(form: Record<string, string>): StepDefinition[] {
  const gender = String(form.clientGender ?? '').toUpperCase();
  const hasEpilationDetails = String(form.epilationAlreadyDone ?? '').toLowerCase() === 'si';
  const includeWomanStep = gender !== 'M';
  const includeManStep = gender !== 'F';

  const list: StepDefinition[] = [
    { id: 'intro', title: 'Iniziamo ✨', fields: [] },
    {
      id: 'profile',
      title: 'Dati base',
      subtitle: 'Compila i dati principali per la scheda 👇',
      fields: ['clientResidenceCity', 'clientStreet', 'clientAge', 'clientGender'],
    },
    {
      id: 'epilation-base',
      title: 'Questionario epilazione',
      subtitle: 'Hai gia effettuato trattamenti di epilazione progressiva permanente?',
      fields: ['epilationAlreadyDone'],
    },
  ];

  if (hasEpilationDetails) {
    list.push({
      id: 'epilation-details',
      title: 'Dettagli epilazione',
      subtitle: 'Completa le informazioni sui trattamenti gia fatti.',
      fields: ['epilationAreasDone', 'epilationResults'],
    });
  }

  list.push({
    id: 'epilation-methods',
    title: 'Metodi depilazione',
    subtitle: 'Quali metodi usa abitualmente per depilarsi?',
    fields: ['epilationCurrentMethods'],
  });

  if (includeWomanStep) {
    list.push({
      id: 'meds-woman',
      title: 'Farmaci e condizioni - Donna',
      fields: [
        'medsWomanAnticoncezionali',
        'medsWomanAnabolizzanti',
        'medsWomanCortisonici',
        'medsWomanAltri',
        'gravidanzaAllattamento',
        'cicloRegolare',
      ],
    });
  }

  if (includeManStep) {
    list.push({
      id: 'meds-man',
      title: 'Farmaci e condizioni - Uomo',
      fields: ['medsManRicrescitaCapelli', 'medsManAnabolizzanti', 'medsManCortisonici', 'medsManAltri'],
    });
  }

  list.push(
    { id: 'conditions-general', title: 'Condizioni generali', fields: ['pacemaker', 'epilessia', 'consensoFoto'] },
    {
      id: 'zone',
      title: 'Zona da trattare 🎯',
      subtitle: 'Indica la zona principale di interesse.',
      fields: ['zonaInteresse'],
    },
  );

  for (const question of FITZPATRICK_QUESTIONS) {
    list.push({
      id: `fitz-${question.id}`,
      title: 'Questionario Fitzpatrick',
      subtitle: question.label,
      fields: [question.id],
      fitzQuestionId: question.id,
    });
  }

  list.push({
    id: 'done',
    title: 'Compilazione completata 🎉',
    subtitle: 'Hai finito: grazie per la collaborazione.',
    fields: [],
  });

  return list;
}

export const EMPTY_FORM: Record<string, string> = {
  clientResidenceCity: '',
  clientStreet: '',
  clientAge: '',
  clientGender: '',
  epilationAlreadyDone: 'no',
  epilationAreasDone: '',
  epilationResults: '',
  epilationCurrentMethods: '',
  medsWomanAnticoncezionali: 'no',
  medsWomanAnabolizzanti: 'no',
  medsWomanCortisonici: 'no',
  medsWomanAltri: '',
  medsManRicrescitaCapelli: 'no',
  medsManAnabolizzanti: 'no',
  medsManCortisonici: 'no',
  medsManAltri: '',
  gravidanzaAllattamento: 'no',
  pacemaker: 'no',
  epilessia: 'no',
  cicloRegolare: 'si',
  zonaInteresse: '',
  consensoFoto: 'si',
  fitzpatrick_q1: '',
  fitzpatrick_q2: '',
  fitzpatrick_q3: '',
  fitzpatrick_q4: '',
  fitzpatrick_q5: '',
  fitzpatrick_q6: '',
  fitzpatrick_q7: '',
  fitzpatrick_q8: '',
  fitzpatrick_q9: '',
  fitzpatrick_q10: '',
};
