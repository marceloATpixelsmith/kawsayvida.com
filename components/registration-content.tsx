'use client'

import type { ReactNode } from 'react'
import { PageHeader } from '@/components/page-header'
import { siteConfig } from '@/lib/site'
import { useLanguage } from '@/lib/i18n/context'

const fieldClasses =
  'w-full border border-input bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary'

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-primary">
        {label}
        {required ? <span className="text-muted-foreground"> *</span> : null}
      </label>
      {children}
    </div>
  )
}

function TextInput(props: { name: string; required?: boolean; type?: string }) {
  return <input type={props.type ?? 'text'} name={props.name} required={props.required} className={fieldClasses} />
}

function TextArea({ name, rows = 3 }: { name: string; rows?: number }) {
  return <textarea name={name} rows={rows} className={`${fieldClasses} resize-none`} />
}

function RadioRow({ name, options }: { name: string; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-6">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-sm text-foreground/85">
          <input type="radio" name={name} value={opt} className="h-4 w-4 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  )
}

function CheckboxGrid({ name, options }: { name: string; options: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-sm text-foreground/85">
          <input type="checkbox" name={`${name}[]`} value={opt} className="h-4 w-4 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-serif text-3xl font-light leading-tight text-balance sm:text-4xl">
      {children}
    </h2>
  )
}

export function RegistrationContent() {
  const { t } = useLanguage()
  const r = t.registration

  return (
    <>
      <PageHeader
        eyebrow={t.pageHeaders.registration.eyebrow}
        title={t.pageHeaders.registration.title}
        image="/images/registration-header.jpg"
        alt={t.about.headerAlt}
      />

      {/* Instructions */}
      <section className="bg-background pb-16 pt-10 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="mb-4 text-xs uppercase tracking-luxe text-primary">{r.instructionsTitle}</p>
          <SectionTitle>{r.contraindicationsTitle}</SectionTitle>
          <ul className="mt-6 space-y-4">
            {r.contraindications.map((line, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs uppercase tracking-[0.18em] text-primary">{r.noteTitle}</p>
          <ul className="mt-4 space-y-4">
            {r.notes.map((line, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Form */}
      <section className="border-t border-border/50 bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <SectionTitle>{r.formTitle}</SectionTitle>

          <form onSubmit={(e) => e.preventDefault()} className="mt-10 space-y-14" noValidate>
            {/* Date of retreat */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">
                {r.dateOfRetreat} <span className="text-muted-foreground">*</span>
              </p>
              <div className="space-y-3 border border-border/60 bg-background/40 p-6">
                {r.retreatOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-3 text-sm text-foreground/85">
                    <input type="radio" name="retreatDate" value={opt} className="h-4 w-4 accent-primary" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* Personal info */}
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">{r.personalInfoTitle}</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={r.fields.paternalLastName} required>
                  <TextInput name="paternalLastName" required />
                </Field>
                <Field label={r.fields.maternalLastName}>
                  <TextInput name="maternalLastName" />
                </Field>
                <Field label={r.fields.names} required>
                  <TextInput name="names" required />
                </Field>
                <Field label={r.fields.dob} required>
                  <TextInput name="dob" type="date" required />
                </Field>
                <Field label={r.fields.placeOfBirth} required>
                  <TextInput name="placeOfBirth" required />
                </Field>
                <Field label={r.fields.phone} required>
                  <TextInput name="phone" type="tel" required />
                </Field>
                <Field label={r.fields.email}>
                  <TextInput name="email" type="email" />
                </Field>
                <Field label={r.fields.passport}>
                  <TextInput name="passport" />
                </Field>
                <Field label={r.fields.occupation} required>
                  <TextInput name="occupation" required />
                </Field>
              </div>
              <Field label={r.fields.address} required>
                <TextInput name="address" required />
              </Field>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-primary">
                  {r.fields.maritalStatus} <span className="text-muted-foreground">*</span>
                </label>
                <RadioRow
                  name="maritalStatus"
                  options={[r.fields.married, r.fields.single, r.fields.divorced]}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={r.fields.emergencyName} required>
                  <TextInput name="emergencyName" required />
                </Field>
                <Field label={r.fields.emergencyPhone} required>
                  <TextInput name="emergencyPhone" type="tel" required />
                </Field>
              </div>
            </div>

            {/* Health */}
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">{r.healthTitle}</p>
              <Field label={r.healthFields.currentIllness}>
                <TextArea name="currentIllness" />
              </Field>
              <Field label={r.healthFields.accidents}>
                <TextArea name="accidents" />
              </Field>
              <Field label={r.healthFields.recentSurgeries}>
                <TextArea name="recentSurgeries" />
              </Field>

              <CheckboxGrid name="conditions" options={r.conditions} />

              <Field label={r.healthQuestions.psychiatricDisorders}>
                <TextInput name="psychiatricDisorders" />
              </Field>
              <Field label={r.healthQuestions.allergies}>
                <TextInput name="allergies" />
              </Field>
              <Field label={r.healthQuestions.otherDiseases}>
                <TextInput name="otherDiseases" />
              </Field>
              <Field label={r.healthQuestions.currentTreatment}>
                <TextInput name="currentTreatment" />
              </Field>
              <Field label={r.healthQuestions.medications}>
                <TextInput name="medications" />
              </Field>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">
                  {r.healthQuestions.substanceUse} <span className="text-muted-foreground">*</span>
                </p>
                <RadioRow name="substanceUse" options={[r.healthQuestions.yes, r.healthQuestions.no]} />
              </div>
              <Field label={r.healthQuestions.substanceFrequency}>
                <TextInput name="substanceFrequency" />
              </Field>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">
                  {r.healthQuestions.difficultyStopping} <span className="text-muted-foreground">*</span>
                </p>
                <RadioRow
                  name="difficultyStopping"
                  options={[r.healthQuestions.yes, r.healthQuestions.no]}
                />
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.18em] text-primary">{r.experiencesTitle}</p>
                <CheckboxGrid name="experiences" options={r.experiences.slice(0, -1)} />
                <Field label={r.experiences[r.experiences.length - 1]}>
                  <TextInput name="experienceFrequency" />
                </Field>
              </div>
            </div>

            {/* Experiences & intentions */}
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">{r.intentionsTitle}</p>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-primary">{r.ritualQuestion}</p>
                <CheckboxGrid name="ritual" options={r.ritualOptions} />
              </div>
              <Field label={r.ritualOtherLabel}>
                <TextInput name="ritualOther" />
              </Field>
              <Field label={r.experienceQuestions.howWasIt}>
                <TextArea name="ritualExperience" />
              </Field>
              <Field label={r.experienceQuestions.spiritualExperience}>
                <TextArea name="spiritualExperience" />
              </Field>
              <Field label={r.experienceQuestions.intentions}>
                <TextArea name="intentions" />
              </Field>
            </div>

            {/* Declaration */}
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">{r.declarationTitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.declarationIntro}</p>
              <ol className="space-y-4">
                {r.declarationItems.map((item, i) => (
                  <li key={i} className="flex gap-4 text-sm text-muted-foreground leading-relaxed">
                    <span className="shrink-0 font-serif text-primary">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">
                  {r.readDeclaration} <span className="text-muted-foreground">*</span>
                </p>
                <RadioRow
                  name="readDeclaration"
                  options={[r.healthQuestions.yes, r.healthQuestions.no]}
                />
              </div>

              <Field label={r.fullName} required>
                <TextInput name="signatureName" required />
              </Field>
              <p className="text-sm text-muted-foreground">{r.signatureNote}</p>
            </div>

            <div className="border-t border-border/50 pt-8">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {r.submit}
              </button>
              <p className="mt-4 max-w-xl text-sm text-muted-foreground leading-relaxed">
                {r.draftNotice.replace('{email}', siteConfig.email)}
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
