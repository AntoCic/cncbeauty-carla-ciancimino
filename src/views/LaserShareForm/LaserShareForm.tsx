import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLaserShareSession, saveLaserShareSessionStep, type LaserShareSession } from '../../api/laserShareApi';
import { FITZPATRICK_QUESTIONS } from '../../models/laserSheetQuestions';
import { buildSteps, EMPTY_FORM, type StepDefinition } from './steps';
import { Btn } from '../../components/Btn/Btn';
import { TextField, TextAreaField, YesNoField, GenderField, FitzpatrickField } from './cmp/StepField';
import styles from './LaserShareForm.module.css';

function normalizeString(value: unknown): string {
  return String(value ?? '').trim();
}

function splitLegacyClientAddress(value: unknown): { city: string; street: string } {
  const normalized = normalizeString(value);
  if (!normalized) return { city: '', street: '' };
  const chunks = normalized.split(',').map((item) => normalizeString(item)).filter(Boolean);
  if (chunks.length < 2) return { city: '', street: normalized };
  const city = chunks[chunks.length - 1] ?? '';
  const street = chunks.slice(0, -1).join(', ');
  return { city, street };
}

const ROBOTS_CONTENT = 'noindex,nofollow';

export default function LaserShareForm() {
  const { token = '' } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [session, setSession] = useState<LaserShareSession | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [skippedKeys, setSkippedKeys] = useState<string[]>([]);
  const [form, setForm] = useState<Record<string, string>>(EMPTY_FORM);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = ROBOTS_CONTENT;
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  function hydrateForm(loaded: LaserShareSession) {
    const next = { ...EMPTY_FORM };
    for (const [key, value] of Object.entries(loaded.answers ?? {})) {
      next[key] = String(value ?? '');
    }
    if (!normalizeString(next.clientResidenceCity) || !normalizeString(next.clientStreet)) {
      const legacy = splitLegacyClientAddress((loaded.answers as Record<string, unknown>).clientAddress);
      if (!normalizeString(next.clientResidenceCity)) next.clientResidenceCity = legacy.city;
      if (!normalizeString(next.clientStreet)) next.clientStreet = legacy.street;
    }
    setForm(next);
    setSkippedKeys(Array.isArray(loaded.skippedKeys) ? [...loaded.skippedKeys] : []);
  }

  async function loadSession() {
    if (!token) {
      setLoadError('Token mancante.');
      return;
    }
    setIsLoading(true);
    setLoadError('');
    try {
      const loaded = await fetchLaserShareSession(token);
      setSession(loaded);
      hydrateForm(loaded);
      setStepIndex(0);
      setValidationError('');
    } catch (err) {
      console.error('[LaserShareForm] load failed:', err);
      setLoadError((err as Error)?.message || 'Sessione non disponibile o scaduta.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount/token change, mirrors the async-fetch pattern used across views
    void loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const steps = useMemo(() => buildSteps(form), [form]);
  const currentStep: StepDefinition = steps[stepIndex] ?? steps[0] ?? { id: 'intro', title: '', fields: [] };
  const totalSteps = steps.length || 1;
  const currentStepNumber = Math.min(stepIndex + 1, totalSteps);
  const progressValue = Math.round((currentStepNumber / totalSteps) * 100);
  const operatorFullName = normalizeString(session?.operatorFirstName);
  const operatorFirstName = operatorFullName.split(/\s+/)[0] || 'operatore';
  const canSkipCurrentStep = currentStep.fields.length > 0 && currentStep.id !== 'done';
  const isCurrentStepSkipped = currentStep.fields.some((field) => skippedKeys.includes(field));
  const fitzQuestion = currentStep.fitzQuestionId
    ? FITZPATRICK_QUESTIONS.find((q) => q.id === currentStep.fitzQuestionId)
    : undefined;

  function setField(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'epilationAlreadyDone' && value.toLowerCase() !== 'si') {
        next.epilationAreasDone = '';
        next.epilationResults = '';
      }
      return next;
    });
    if (validationError) setValidationError('');
  }

  function isCompletingStep() {
    return stepIndex === totalSteps - 2;
  }

  function validateCurrentStep(): boolean {
    setValidationError('');
    if (!currentStep.fields.length) return true;
    if (currentStep.id === 'profile') {
      const age = Number(form.clientAge);
      const gender = normalizeString(form.clientGender).toUpperCase();
      if (
        !normalizeString(form.clientResidenceCity) ||
        !normalizeString(form.clientStreet) ||
        !Number.isFinite(age) ||
        age <= 0 ||
        (gender !== 'F' && gender !== 'M')
      ) {
        setValidationError('Compila residente a, via, età e sesso oppure usa "Salta".');
        return false;
      }
      return true;
    }
    if (currentStep.id === 'zone') {
      if (!normalizeString(form.zonaInteresse)) {
        setValidationError('Indica la zona da trattare oppure usa "Salta".');
        return false;
      }
      return true;
    }
    if (currentStep.fitzQuestionId) {
      if (!normalizeString(form[currentStep.fitzQuestionId])) {
        setValidationError('Seleziona una risposta del quiz oppure usa "Salta".');
        return false;
      }
      return true;
    }
    return true;
  }

  function buildStepUpdates(fields: string[]): Record<string, unknown> {
    const updates: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = form[field];
      if (field.startsWith('fitzpatrick_') || field === 'clientAge') {
        const parsed = Number(raw);
        if (Number.isFinite(parsed)) updates[field] = parsed;
        continue;
      }
      updates[field] = raw ?? '';
    }
    if (operatorFullName) updates.operatorName = operatorFullName;
    return updates;
  }

  async function onNext() {
    if (isSaving) return;
    if (currentStep.id === 'done') {
      window.location.href = '/';
      return;
    }
    if (!validateCurrentStep()) return;
    setIsSaving(true);
    try {
      if (currentStep.fields.length) {
        const response = await saveLaserShareSessionStep({
          token,
          updates: buildStepUpdates(currentStep.fields),
          skippedKeys: [],
          completeSession: isCompletingStep(),
        });
        setSkippedKeys(response.skippedKeys);
      }
      if (stepIndex < totalSteps - 1) setStepIndex((i) => i + 1);
    } catch (err) {
      console.error('[LaserShareForm] save step failed:', err);
      setLoadError((err as Error)?.message || 'Errore salvataggio step.');
    } finally {
      setIsSaving(false);
    }
  }

  async function onSkip() {
    if (!canSkipCurrentStep || isSaving) return;
    setIsSaving(true);
    setValidationError('');
    try {
      const response = await saveLaserShareSessionStep({
        token,
        updates: buildStepUpdates([]),
        skippedKeys: currentStep.fields,
        completeSession: isCompletingStep(),
      });
      setSkippedKeys(response.skippedKeys);
      if (stepIndex < totalSteps - 1) setStepIndex((i) => i + 1);
    } catch (err) {
      console.error('[LaserShareForm] skip step failed:', err);
      setLoadError((err as Error)?.message || 'Errore durante il salto step.');
    } finally {
      setIsSaving(false);
    }
  }

  function onPrev() {
    if (isSaving || stepIndex === 0) return;
    setStepIndex((i) => i - 1);
    setValidationError('');
  }

  if (isLoading) {
    return <p className={styles.loading}>Caricamento sessione...</p>;
  }
  if (loadError) {
    return (
      <div className={styles.page}>
        <article className={styles.card}>
          <h1 className={styles.title}>Link non disponibile</h1>
          <p className={styles.hint}>{loadError}</p>
        </article>
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className={styles.page}>
      <article className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{currentStep.title}</h1>
          <span className={styles.badge}>Step {currentStepNumber}/{totalSteps}</span>
        </div>
        {currentStep.subtitle && <p className={styles.subtitle}>{currentStep.subtitle}</p>}
        <div className={styles.progress}>
          <span className={styles.progressFill} style={{ width: `${progressValue}%` }} />
        </div>
        {isCurrentStepSkipped && (
          <p className={styles.skipInfo}>Step segnato come "da completare con {operatorFirstName}".</p>
        )}
        {validationError && <p className={styles.error}>⚠️ {validationError}</p>}

        <div className={styles.stepBody}>
          {currentStep.id === 'intro' && (
            <>
              <p>Ciao {session.clientName} 👋 grazie per la collaborazione.</p>
              <p className={styles.hint}>
                Le informazioni saranno visibili solo all'operatore 🔒. In ogni domanda puoi scegliere
                "Salta e completa con {operatorFirstName}".
              </p>
            </>
          )}

          {currentStep.id === 'profile' && (
            <>
              <TextField label="Residente a" value={form.clientResidenceCity ?? ''} onChange={(v) => setField('clientResidenceCity', v)} placeholder="Citta" />
              <TextField label="Via" value={form.clientStreet ?? ''} onChange={(v) => setField('clientStreet', v)} placeholder="Via e numero civico" />
              <TextField label="Età" value={form.clientAge ?? ''} onChange={(v) => setField('clientAge', v)} />
              <GenderField value={form.clientGender ?? ''} onChange={(v) => setField('clientGender', v)} />
            </>
          )}

          {currentStep.id === 'epilation-base' && (
            <YesNoField name="epilationAlreadyDone" value={form.epilationAlreadyDone ?? 'no'} onChange={(v) => setField('epilationAlreadyDone', v)} />
          )}

          {currentStep.id === 'epilation-details' && (
            <>
              <TextAreaField label="Quali aree ha trattato?" value={form.epilationAreasDone ?? ''} onChange={(v) => setField('epilationAreasDone', v)} />
              <TextAreaField label="Che risultati ha ottenuto?" value={form.epilationResults ?? ''} onChange={(v) => setField('epilationResults', v)} />
            </>
          )}

          {currentStep.id === 'epilation-methods' && (
            <TextAreaField label="Quali metodi usa abitualmente per depilarsi?" value={form.epilationCurrentMethods ?? ''} onChange={(v) => setField('epilationCurrentMethods', v)} />
          )}

          {currentStep.id === 'meds-woman' && (
            <>
              <div className={styles.toggleRow}><span>Anticoncezionali</span><YesNoField name="medsWomanAnticoncezionali" value={form.medsWomanAnticoncezionali ?? 'no'} onChange={(v) => setField('medsWomanAnticoncezionali', v)} /></div>
              <div className={styles.toggleRow}><span>Anabolizzanti</span><YesNoField name="medsWomanAnabolizzanti" value={form.medsWomanAnabolizzanti ?? 'no'} onChange={(v) => setField('medsWomanAnabolizzanti', v)} /></div>
              <div className={styles.toggleRow}><span>Cortisonici</span><YesNoField name="medsWomanCortisonici" value={form.medsWomanCortisonici ?? 'no'} onChange={(v) => setField('medsWomanCortisonici', v)} /></div>
              <TextField label="Altri farmaci" value={form.medsWomanAltri ?? ''} onChange={(v) => setField('medsWomanAltri', v)} />
              <div className={styles.toggleRow}><span>Gravidanza/allattamento</span><YesNoField name="gravidanzaAllattamento" value={form.gravidanzaAllattamento ?? 'no'} onChange={(v) => setField('gravidanzaAllattamento', v)} /></div>
              <div className={styles.toggleRow}><span>Ciclo regolare</span><YesNoField name="cicloRegolare" value={form.cicloRegolare ?? 'si'} onChange={(v) => setField('cicloRegolare', v)} /></div>
            </>
          )}

          {currentStep.id === 'meds-man' && (
            <>
              <div className={styles.toggleRow}><span>Ricrescita capelli</span><YesNoField name="medsManRicrescitaCapelli" value={form.medsManRicrescitaCapelli ?? 'no'} onChange={(v) => setField('medsManRicrescitaCapelli', v)} /></div>
              <div className={styles.toggleRow}><span>Anabolizzanti</span><YesNoField name="medsManAnabolizzanti" value={form.medsManAnabolizzanti ?? 'no'} onChange={(v) => setField('medsManAnabolizzanti', v)} /></div>
              <div className={styles.toggleRow}><span>Cortisonici</span><YesNoField name="medsManCortisonici" value={form.medsManCortisonici ?? 'no'} onChange={(v) => setField('medsManCortisonici', v)} /></div>
              <TextField label="Altri farmaci" value={form.medsManAltri ?? ''} onChange={(v) => setField('medsManAltri', v)} />
            </>
          )}

          {currentStep.id === 'conditions-general' && (
            <>
              <div className={styles.toggleRow}><span>Pacemaker</span><YesNoField name="pacemaker" value={form.pacemaker ?? 'no'} onChange={(v) => setField('pacemaker', v)} /></div>
              <div className={styles.toggleRow}><span>Epilessia</span><YesNoField name="epilessia" value={form.epilessia ?? 'no'} onChange={(v) => setField('epilessia', v)} /></div>
              <div className={styles.toggleRow}><span>Consenso foto</span><YesNoField name="consensoFoto" value={form.consensoFoto ?? 'si'} onChange={(v) => setField('consensoFoto', v)} /></div>
            </>
          )}

          {currentStep.id === 'zone' && (
            <TextField label="Zona da trattare 🎯" value={form.zonaInteresse ?? ''} onChange={(v) => setField('zonaInteresse', v)} placeholder="Es. inguine, gambe, ascelle..." />
          )}

          {fitzQuestion && (
            <FitzpatrickField question={fitzQuestion} value={form[fitzQuestion.id] ?? ''} onChange={(v) => setField(fitzQuestion.id, v)} />
          )}

          {currentStep.id === 'done' && (
            <div className={styles.done}>
              <span className="material-symbols-outlined">check_circle</span>
              <h2>Compilazione completata! 🎉</h2>
              <p>Hai finito tutto correttamente ✅</p>
              <p className={styles.hint}>Le tue risposte sono state salvate e l'operatore le rivedrà con te.</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {stepIndex > 0 && currentStep.id !== 'done' ? (
            <Btn type="button" color="secondary" version="outline" disabled={isSaving} onClick={onPrev}>
              Indietro
            </Btn>
          ) : (
            <span />
          )}
          <div className={styles.footerActions}>
            {canSkipCurrentStep && (
              <Btn type="button" color="secondary" version="outline" disabled={isSaving} onClick={() => void onSkip()}>
                Salta e completa con {operatorFirstName}
              </Btn>
            )}
            <Btn type="button" color="dark" loading={isSaving} onClick={() => void onNext()}>
              {currentStep.id === 'done' ? 'Chiudi e torna alla home 🏠' : 'Avanti'}
            </Btn>
          </div>
        </div>
      </article>
    </div>
  );
}
