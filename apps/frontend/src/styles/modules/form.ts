/**
 * @file form.ts
 * @module Frontend
 * @description Estilos centralizados del sistema de formularios QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-01, RF-02
 * rnf: RNF-03, RNF-05
 *
 * @business
 * inputs: estados de campo, disposicion de controles y variantes del factory de formularios
 * outputs: clases reutilizables y variantes seguras para campos, radios y mensajes
 * rules: mantener estilos estaticos detectables por Tailwind y evitar duplicacion inline
 *
 * @technical
 * dependencies: class-variance-authority
 * flow: define wrappers base del formulario; expone variantes por estado; centraliza los estilos usados por BoundField y NativeInput.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-FORM-UI-01
 *
 * @notes
 * decisions: se priorizan clases estaticas y variantes declarativas para sostener compatibilidad total con Tailwind JIT
 */
import { cva } from 'class-variance-authority';

export const formFieldWrapperStyles = cva(
  'flex items-center gap-2 border-2 border-qart-border bg-qart-surface px-3 transition-all duration-200 focus-within:border-qart-accent focus-within:shadow-[0_0_0_2px_var(--qart-accent-muted)]',
  {
    variants: {
      intent: {
        default: '',
        error:
          'border-qart-error focus-within:border-qart-error focus-within:shadow-[0_0_0_2px_var(--qart-error-bg)]',
        success:
          'border-qart-success focus-within:border-qart-success focus-within:shadow-[0_0_0_2px_var(--qart-success-bg)]',
      },
      naked: {
        true: '!border-none !bg-transparent !px-0 !shadow-none',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'default',
      naked: false,
    },
  },
);

export const formRadioGroupStyles = cva('grid gap-3', {
  variants: {
    layout: {
      stacked: 'grid-cols-1 sm:grid-cols-2',
      inline: 'grid-cols-1 sm:grid-cols-3',
    },
  },
  defaultVariants: {
    layout: 'stacked',
  },
});

export const formRadioCardStyles = cva(
  'flex min-h-[6rem] cursor-pointer flex-col items-center justify-center gap-3 border-2 border-qart-border bg-qart-surface px-4 py-5 text-center transition-all duration-200',
  {
    variants: {
      selected: {
        true: 'border-qart-accent bg-qart-accent text-qart-text-on-accent shadow-[4px_4px_0_var(--qart-border)]',
        false: 'text-qart-primary hover:border-qart-accent hover:bg-qart-accent-soft',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

export const formStyles = {
  field: 'flex w-full flex-col gap-1.5',
  labelRow: 'flex items-center justify-between gap-3',
  label: 'text-sm font-bold text-qart-primary',
  required: 'ml-1 text-qart-error',
  helpToggle:
    'text-[10px] font-black uppercase tracking-[0.18em] text-qart-text-muted transition-colors hover:text-qart-accent',
  slot: 'inline-flex items-center',
  slotIcon: 'inline-flex size-6 items-center justify-center text-qart-text-muted',
  icon: 'inline-flex size-4 items-center justify-center',
  input:
    'min-w-0 flex-1 border-none bg-transparent px-0.5 py-3 text-base text-qart-text outline-none placeholder:text-qart-text-subtle',
  textarea: 'min-h-[110px] resize-y',
  select: 'appearance-none',
  phone:
    'flex min-w-0 flex-1 items-center gap-2 [&_.PhoneInputCountry]:pr-2 [&_.PhoneInputCountrySelect]:border-none [&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:text-qart-text [&_.PhoneInputCountrySelect]:outline-none [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:px-0.5 [&_.PhoneInputInput]:py-3 [&_.PhoneInputInput]:text-base [&_.PhoneInputInput]:text-qart-text [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput::placeholder]:text-qart-text-subtle',
  checkbox: 'size-4 accent-qart-accent',
  radioOption: 'block',
  radioInputHidden: 'sr-only',
  radioLabel: 'text-sm font-black uppercase tracking-wide',
  radioIcon: 'inline-flex size-6 items-center justify-center',
  rulesList: 'mt-2 border-2 border-qart-border bg-qart-bg-warm p-3',
  rulesListItems: 'space-y-1.5',
  rulesListItem: 'flex items-start gap-2 text-[11px] font-medium leading-relaxed text-qart-text',
  rulesListDot: 'mt-1.5 size-1.5 shrink-0 bg-qart-accent',
  rulesText: 'flex-1 opacity-80',
  errorList: 'mt-1 flex flex-col gap-0.5',
  errorText: 'text-[10px] font-black uppercase tracking-wider text-qart-error',
  hint: 'text-xs text-qart-text-muted',
  strength: 'mt-2 flex flex-col gap-1',
  strengthTrack: 'h-1.5 w-full overflow-hidden bg-qart-border-soft',
  strengthFill: 'h-full transition-all duration-300',
  strengthLabel: 'text-[10px] font-black text-qart-text-muted',
  strengthLabelValue: 'font-bold text-qart-primary',
  formShell: 'flex w-full items-center justify-center px-4 md:px-6',
  formCard: 'w-full max-w-md',
  formStack: 'flex flex-col gap-8',
  formContent: 'flex flex-col gap-6',
  formActions: 'flex flex-col gap-3',
  feedbackError: 'text-center text-sm font-bold uppercase tracking-wider text-qart-error',
  feedbackSuccess: 'text-center text-sm font-bold uppercase tracking-wider text-qart-success',
  slotButtonIcon: 'flex size-4 items-center justify-center',
  section: 'flex flex-col gap-6',
  sectionTitle: 'border-b border-qart-border-subtle pb-3 text-qart-primary',
} as const;

export const formStrengthFillStyles = {
  1: 'w-1/5 bg-red-500',
  2: 'w-2/5 bg-orange-400',
  3: 'w-3/5 bg-yellow-400',
  4: 'w-4/5 bg-blue-400',
  5: 'w-full bg-[hsl(220_90%_56%)]',
} as const;
