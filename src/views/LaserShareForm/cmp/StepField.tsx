import type { FitzpatrickQuestion } from '../../../models/laserSheetQuestions';
import styles from '../LaserShareForm.module.css';

const YES_NO_OPTIONS: Array<{ value: 'si' | 'no'; label: string }> = [
  { value: 'si', label: 'Si' },
  { value: 'no', label: 'No' },
];

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        type="text"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <textarea className={styles.textarea} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function YesNoField({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.yesNoSwitch}>
      {YES_NO_OPTIONS.map((option) => (
        <label
          key={option.value}
          className={`${styles.yesNoOption} ${value === option.value ? styles.isActive : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className={styles.hiddenInput}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export function GenderField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className={styles.chipRadioGroup}>
      {(['F', 'M'] as const).map((gender) => (
        <label
          key={gender}
          className={`${styles.chipRadio} ${value === gender ? styles.isActive : ''}`}
        >
          <input
            type="radio"
            name="clientGender"
            value={gender}
            checked={value === gender}
            onChange={() => onChange(gender)}
            className={styles.hiddenInput}
          />
          <span>{gender === 'F' ? 'Donna' : 'Uomo'}</span>
        </label>
      ))}
    </div>
  );
}

export function FitzpatrickField({
  question,
  value,
  onChange,
}: {
  question: FitzpatrickQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.fitzOptions}>
      {question.options.map((option) => (
        <label
          key={option.value}
          className={`${styles.fitzOption} ${value === String(option.value) ? styles.isActive : ''}`}
        >
          <input
            type="radio"
            name={question.id}
            value={String(option.value)}
            checked={value === String(option.value)}
            onChange={() => onChange(String(option.value))}
            className={styles.hiddenInput}
          />
          <span>{option.value} : {option.label}</span>
        </label>
      ))}
    </div>
  );
}
