import React, { useState } from 'react';
import { Settings, KeyRound, Languages, Palette, MessageSquare, ChevronRight, Shield, Moon } from 'lucide-react';
import LanguageToggle from '../component/LanguageToggle';
// import ChangePassword from '../component/passwordChange/ChangePassword';
import PasswordChange from '../component/passwordChange/PasswordChange';
import ForgotPassword from '../component/forgotPassword/ForgotPassword';
import useLang from "../../../../hooks/useLang";
import { settingLabel } from '../../../../localization/settingLabel';
function Setting() {
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const { lang } = useLang();

  const handleSettingClick = (setting: string) => {
    setSelectedSetting(setting);
  };

  const settingsOptions = [
    { 
      id: 'forgotpassword', 
      label: 'Forgot Password', 
      description: 'Forgot your password? Reset it here',
      icon: Shield 
    },
    { 
      id: 'changePassword', 
      label: 'Change Password',
      description: 'Update your password for security', 
     
      icon: Palette 
    },
    { 
      id: 'languageSettings', 
      label: 'Language', 
      description: 'Choose your preferred language',
      icon: Languages 
    },
   
    { 
      id: 'chat', 
      label: 'Chat Preferences', 
      description: 'Configure chat notifications and privacy',
      icon: MessageSquare 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-gray-400">Customize your tournament experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="space-y-2">
                {settingsOptions.map(({ id, label, description, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleSettingClick(id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center gap-4 group hover:bg-gray-700 ${
                      selectedSetting === id ? 'bg-purple-500/10 border border-purple-500/50' : 'border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${selectedSetting === id ? 'text-purple-500' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-gray-400">{description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                      selectedSetting === id ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-gray-800 rounded-xl p-6">
              {!selectedSetting ? (
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h2 className="text-xl font-medium text-gray-400">Select a setting to configure</h2>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedSetting === 'forgotpassword' && (
                    // <div className="space-y-6">
                    //   <h2 className="text-2xl font-bold flex items-center gap-3">
                    //     <KeyRound className="w-6 h-6 text-purple-500" />
                    //     Security Settings
                    //   </h2>
                    //   <div className="space-y-4">
                    //     <div className="bg-gray-700/50 p-6 rounded-lg">
                    //       <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    //       <div className="space-y-4">
                    //         <input
                    //           type="password"
                    //           placeholder="Current Password"
                    //           className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                    //         />
                    //         <input
                    //           type="password"
                    //           placeholder="New Password"
                    //           className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                    //         />
                    //         <input
                    //           type="password"
                    //           placeholder="Confirm New Password"
                    //           className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                    //         />
                    //         <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                    //           Update Password
                    //         </button>
                    //       </div>
                    //     </div>
                    //   </div>
                    // </div>
                    <ForgotPassword />
                  )}

                  {selectedSetting === 'changePassword' && (
                   <PasswordChange />
                  )}

                  {selectedSetting === 'languageSettings' && (
                   <LanguageToggle />
                  )}

                  {selectedSetting === 'chat' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-purple-500" />
                        Chat Settings
                      </h2>
                      <div className="space-y-4">
                        <div className="bg-gray-700/50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">Notifications</h3>
                          <div className="space-y-4">
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="w-5 h-5 rounded bg-gray-900 border-gray-700" />
                              Enable chat notifications
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="w-5 h-5 rounded bg-gray-900 border-gray-700" />
                              Sound alerts
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;