export const COUNTRIES = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "IN", name: "India" },
    { code: "BR", name: "Brazil" },
    { code: "AR", name: "Argentina" },
    { code: "MX", name: "Mexico" },
    { code: "ZA", name: "South Africa" },
    { code: "NG", name: "Nigeria" },
    { code: "KE", name: "Kenya" },
    { code: "EG", name: "Egypt" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
    { code: "NL", name: "Netherlands" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "SG", name: "Singapore" },
    { code: "NZ", name: "New Zealand" },
    { code: "IE", name: "Ireland" },
    { code: "KR", name: "South Korea" },
    { code: "CN", name: "China" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "WORLD", name: "World" }, // For "Everywhere, World"
].sort((a, b) => {
    // Keep World at the top, US/CA/GB near top if desired, or just alphabetical
    if (a.code === "WORLD") return -1;
    if (b.code === "WORLD") return 1;
    return a.name.localeCompare(b.name);
});
