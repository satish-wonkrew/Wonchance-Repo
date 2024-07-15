import { useState, useEffect } from 'react';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DatePicker from "react-datepicker";
import debounce from "lodash.debounce";
import "react-datepicker/dist/react-datepicker.css";

type UserDetails = {
  whatsappNumber: string;
  statusLevel?: string;
  firstName?: string;
  lastName?: string;
  screenName?: string;
  email?: string;
  role?: string;
  gender?: string;
  profile?: string;
  dateOfBirth?: Date;
  age?: number;
};

// Define the props for the InputField component
interface InputFieldProps {
  label: string;
  value: string | number;
  field: keyof UserDetails;
  handleChange: (
    field: keyof UserDetails,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleBlur: (field: keyof UserDetails, value: string | number) => void;
  type?: string | number;
}

const Signup = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [UserDetails, setUserDetails] = useState<UserDetails>({
    whatsappNumber: "",
    statusLevel: "",
    firstName: "",
    lastName: "",
    screenName: "",
    email: "",
    role: "",
    gender: "",
    profile: "",
    dateOfBirth: undefined,
    age: undefined,
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (session && session.user) {
      setUserDetails({
        whatsappNumber: session.user.whatsappNumber || "",
        statusLevel: session.user.statusLevel || "",
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        screenName: session.user.screenName || "",
        email: session.user.email || "",
        role: session.user.role || "",
        gender: session.user.gender || "",
        profile: session.user.profile || "",
        dateOfBirth: session.user.dateOfBirth || undefined,
        age: session.user.age || undefined,
      });
    }
  }, [session]);

  const handleFieldChange = debounce(
    async (field: keyof UserDetails, value: any) => {
      const newDetails = { ...UserDetails, [field]: value };
      if (field === "dateOfBirth") {
        newDetails.age = calculateAge(value);
        newDetails.profile = newDetails.age < 18 ? 'kid' : 'adult';
      }

      setUserDetails(newDetails);

      if (session?.user) {
        try {
          await axios.post("/api/updateProfile", {
            whatsappNumber: session.user.whatsappNumber,
            [field]: value,
            ...(field === "dateOfBirth" && { age: newDetails.age, profile: newDetails.profile }),
          });
        } catch (error) {
          console.error('Error updating profile:', error);
          setApiError('Error updating profile.');
        }
      }
    },
    500
  );

  const handleBlur = (field: keyof UserDetails, value: string | number) => {
    handleFieldChange(field, value);
  };

  const handleChange = (
    field: keyof UserDetails,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setUserDetails((prev) => ({ ...prev, [field]: value }));
    if (field === 'email') {
      checkEmailExists(value);
    }
  };

  const checkEmailExists = debounce(async (email: string) => {
    try {
      const response = await axios.post('/api/checkEmail', { email });
      if (response.status === 200) {
        // Email is available
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailError('Email already exists.');
    }
  }, 500);

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!UserDetails.whatsappNumber || !UserDetails.firstName || !UserDetails.email ||
      !UserDetails.lastName || !UserDetails.gender ||
      !UserDetails.profile || !UserDetails.dateOfBirth
    ) {
      setSubmitError('Please fill all the fields');
      return;
    }
    router.push("/registration");
  };

  if (status === 'authenticated') {
    return (
      <div className='after-signup'>
        <form className='form' onSubmit={handleSubmit}>
          <div>
            <InputField
              label="First Name"
              value={UserDetails.firstName as string}
              field="firstName"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

            <InputField
              label="Last Name"
              value={UserDetails.lastName as string}
              field="lastName"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

            <div>
              <label className="register-label" htmlFor="gender">Gender:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={UserDetails.gender === "male"}
                    onChange={(e) => handleFieldChange("gender", e.target.value)}
                    onBlur={() => handleBlur("gender", UserDetails.gender as string)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={UserDetails.gender === "female"}
                    onChange={(e) => handleFieldChange("gender", e.target.value)}
                    onBlur={() => handleBlur("gender", UserDetails.gender as string)}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="others"
                    checked={UserDetails.gender === "others"}
                    onChange={(e) => handleFieldChange("gender", e.target.value)}
                    onBlur={() => handleBlur("gender", UserDetails.gender as string)}
                  />
                  Others
                </label>
              </div>
            </div>

            <div>
              <label className='first-label'>Date of Birth:</label>
              <DatePicker
                selected={UserDetails.dateOfBirth}
                onChange={(date: Date | null) => handleFieldChange("dateOfBirth", date)}
                dateFormat="yyyy/MM/dd"
                className='first-date-of-birth'
              />
            </div>

            <div>
              <label className="register-label">Age: {UserDetails.age || ''}</label>
            </div>

            <div>
              <label className="register-label">Profile: {UserDetails.profile || ''}</label>
            </div>

            <InputField
              label="Email"
              value={UserDetails.email as string}
              field="email"
              handleChange={handleChange}
              handleBlur={handleBlur}
              type="email"
            />
            {emailError && <p className="error-message">{emailError}</p>}
            {apiError && <p className="error-message">{apiError}</p>}

            <div>
              <button type="submit" className="text-white bg-green-500 px-4 py-2 rounded-lg">Submit</button>
              {submitError && <p className="error-message">{submitError}</p>}
            </div>
          </div>
        </form>
      </div>
    );
  }

  return null;
};

// InputField component
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  field,
  handleChange,
  handleBlur,
  type = "text",
}) => (
  <div className="mb-4">
    <label className="register-label" htmlFor={field}>
      {label}:
    </label>
    <input
      className="register-input"
      id={field}
      value={value}
      onChange={(e) => handleChange(field, e)}
      onBlur={() => handleBlur(field, value)}
      // type={type}
    />
  </div>
);

export default Signup;
