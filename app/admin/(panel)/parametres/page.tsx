import { HeroSettings } from "@/app/admin/(panel)/parametres/HeroSettings";
import { SettingsForm } from "@/app/admin/(panel)/parametres/SettingsForm";
import { photoSrc } from "@/lib/photo";
import { getSetting, getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Paramètres" };

export default function SettingsPage() {
  const s = getSettings();
  const legacy = getSetting("legacy_hero_image");
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Paramètres</h1>
      <SettingsForm initial={{ whatsapp: s.whatsapp, phone: s.phone, email: s.email, instagram: s.instagram }} />
      <HeroSettings current={s.heroImage ? photoSrc(s.heroImage, 960) : null} legacy={legacy ? photoSrc(legacy, 960) : null} />
    </div>
  );
}
