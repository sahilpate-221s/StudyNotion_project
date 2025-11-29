// Toast Configuration Update Script
// This script helps update remaining toast usages to use ToastManager

const fs = require('fs');
const path = require('path');

// Files that still need toast updates
const filesToUpdate = [
  'Client/src/Service/Operation/studentFeaturesAPI.js',
  'Client/src/Service/Operation/pageAndComponntDatas.js', 
  'Client/src/Service/Operation/courseDetailsAPI.js',
  'Client/src/Service/Operation/SettingsAPI.js',
  'Client/src/Component/Core/Dashboard/AddCourse/CourseInformation/CourseInformationForm.jsx',
  'Client/src/Component/Core/Dashboard/AddCourse/CourseBuilder/SubSectionModal.jsx',
  'Client/src/Component/Core/Dashboard/AddCourse/CourseBuilder/CourseBuilderForm.jsx',
  'Client/src/Component/Core/Course/CourseDetailsCard.jsx',
  'Client/src/Component/Core/Auth/SignupForm.jsx'
];

console.log('Files that need toast updates:');
filesToUpdate.forEach(file => console.log(`- ${file}`));

console.log('\nTo fix multiple toast notifications:');
console.log('1. Replace "import { toast } from \'react-hot-toast\'" with "import ToastManager from \'../../Util/toastManager\'"');
console.log('2. Replace "toast.success()" with "ToastManager.showSuccess()"');
console.log('3. Replace "toast.error()" with "ToastManager.showError()"');
console.log('4. Replace "toast.loading()" with "ToastManager.showLoading()"');
console.log('5. Replace "toast.dismiss()" with "ToastManager.dismissLoading()"');

console.log('\nThe ToastManager prevents duplicate toasts and provides better UX.');
