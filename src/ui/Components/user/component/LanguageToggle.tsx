import useLang from "../../../../hooks/useLang";
import { LanguageEnum } from "../../../types/global.types";
import { Languages } from "lucide-react";
import { settingLabel } from "../../../../localization/settingLabel";

const FlagIcon = ({ lang }: { lang: LanguageEnum }) => {
  const src =
    lang === LanguageEnum.en
      ? "https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg"
      : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Flag_of_Nepal.svg/1280px-Flag_of_Nepal.svg.png";

  const alt = lang === LanguageEnum.en ? "English" : "Nepali";

  return <img src={src} alt={alt} className="h-6 w-6" />;
};

const LanguageToggle = () => {
  const { lang, setLang } = useLang();

  const switchLanguage = () => {
    setLang(lang === LanguageEnum.en ? LanguageEnum.ne : LanguageEnum.en);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Languages className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold">{settingLabel.languageSettings[lang]}</h2>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={switchLanguage}
          aria-label="Toggle Language"
          className="bg-blue-500 p-3 rounded-full shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <FlagIcon lang={lang} />
        </button>
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{settingLabel.Language[lang]}</span>
          <span className="text-sm text-gray-500">
            {settingLabel.clickTheFlagToSwitchTo[lang]} {lang === LanguageEnum.en ? "Nepali" : "English"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LanguageToggle;
