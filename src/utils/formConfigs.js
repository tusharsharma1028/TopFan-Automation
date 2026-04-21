export const QUICK_START_FORM_CONFIG = {
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      validation: {
        required: true,
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
      validation: {
        required: true,
        email: true,
      },
    },
    {
      name: 'dob',
      type: 'date',
      label: 'Date of Birth',
      placeholder: 'Select your date of birth',
      required: true,
      validation: {
        required: true,
        maxDate: new Date().toISOString().split('T')[0],
      },
    },
  ],
  submitLabel: 'Submit',
};
