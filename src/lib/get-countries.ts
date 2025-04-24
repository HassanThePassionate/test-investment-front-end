import countries from "world-countries";

export const getCountries = () => {
  return countries.map((country) => ({
    name: country.name.common,
    code: country.cca2.toLowerCase(),
    // remove extra +
    dialCode: `${country.idd.root}${country.idd.suffixes?.[0] || ""}`,
  })).filter(c => c.dialCode);
};