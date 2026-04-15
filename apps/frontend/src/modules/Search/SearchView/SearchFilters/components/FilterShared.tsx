import type { ReactNode } from 'react';
import { formatLandingEnum } from '@/shared/utils/plateNutrition';
import { searchStyles } from '@/styles/modules/search';

export const toggleArray = <T extends string>(list: T[] | undefined, value: T): T[] | undefined => {
  const cur = list ?? [];
  const has = cur.includes(value);
  const next = has ? cur.filter((x) => x !== value) : [...cur, value];
  return next.length ? next : undefined;
};

export const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) => (
  <div className={searchStyles.section} id={id}>
    <h3 className={searchStyles.sectionTitle}>
      <span className={searchStyles.sectionMarker} aria-hidden />
      {title}
    </h3>
    <div className={searchStyles.sectionBody}>{children}</div>
  </div>
);

export const chipLabel = (v: string) => formatLandingEnum(v);
