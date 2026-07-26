export const parseEnvOrigins = (
  ...values: (string | undefined)[]
): string[] => {
  const origins = values
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(','))
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return Array.from(new Set(origins));
};
