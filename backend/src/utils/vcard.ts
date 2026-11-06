import { BusinessProfile } from "../types/index.js";

export function generateVCard(profile: BusinessProfile): string {
  const dirNames = profile.directors.map((d) => d.name).join(" & ");
  const tel1 = profile.directors[0]?.phone || "";
  const tel2 = profile.directors[1]?.phone || "";

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.companyName} (${dirNames})`,
    `N:${profile.companyName};;;;`,
    `ORG:${profile.companyName}`,
    `TITLE:${profile.tagline}`,
    tel1 ? `TEL;TYPE=WORK,VOICE:${tel1}` : "",
    tel2 ? `TEL;TYPE=CELL,VOICE:${tel2}` : "",
    `EMAIL;TYPE=PREF,INTERNET:${profile.primaryEmail}`,
    profile.salesEmail ? `EMAIL;TYPE=WORK,INTERNET:${profile.salesEmail}` : "",
    `URL:${profile.websiteUrl}`,
    `ADR;TYPE=WORK:;;${profile.address.building}, ${profile.address.street};${profile.address.city};${profile.address.state};${profile.address.pincode};${profile.address.country}`,
    `NOTE:${profile.aboutText.substring(0, 150)}...`,
    "CATEGORIES:Diamond Merchant, Gems & Jewelry, B2B Wholesaler",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");
}

