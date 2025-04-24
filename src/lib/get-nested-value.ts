/* eslint-disable @typescript-eslint/no-explicit-any */
export const getNestedValue = (
    obj: any,
    path: string,
    defaultValue: any = "N/A"
  ) => {
    try {
      const value = path
        .split(".")
        .reduce(
          (o, key) => (o && o[key] !== undefined ? o[key] : undefined),
          obj
        );
      return value !== undefined && value !== null ? value : defaultValue;
    } catch (error) {
      console.error(`Error accessing path ${path}:`, error);
      return defaultValue;
    }
  };