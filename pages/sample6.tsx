import { useState, useEffect } from 'react';
import axios from 'axios';
import { signIn ,useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DatePicker from "react-datepicker";
import debounce from "lodash.debounce";
import "react-datepicker/dist/react-datepicker.css";
import { saveOtp, verifyOtp } from '../lib/otp'; // Ensure this utility is properly implemented
import loginimage from '/images/loginimage.png';
import Image from 'next/image'; // Import the Image component


type UserDetails = {
  whatsappNumber: string; // WhatsApp number, presumably unique and required
  statusLevel?:string;
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
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    whatsappNumber: "", // WhatsApp number, presumably unique and required
    statusLevel:"",
    firstName: "",
    lastName: "",
    screenName: "",
    email: "",
    role: "",
    gender: "",
    profile: "",
    dateOfBirth:undefined,
    age:  undefined,
  
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);


  useEffect(() => {
    if (session && session.user) {
      setUserDetails({
        // Basic Details
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

  
  
 //Input field changes
 const handleFieldChange = debounce(
  async (field: keyof UserDetails, value: any) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
    const newDetails = { ...userDetails, [field]: value };
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

    //Handle Blur
    const handleBlur = (field: keyof UserDetails, value: string | number) => {
      handleFieldChange(field, value);
    };
  
  
    //Handle Change
    const handleChange = (
      field: keyof UserDetails,
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const value = event.target.value;
      setUserDetails((prev) => ({ ...prev, [field]: value }));
      if (field === 'email') {
        // Perform asynchronous check
        checkEmailExists(value);
      }
    };

  // Asynchronous function to check if email exists
  const checkEmailExists = debounce(async (email: string) => {
    try {
      const response = await axios.post('/api/checkEmail', { email });
      if (response.status === 200) {
        setEmailSuccess('Email Not Used.');
      }
    } catch (error) {
      // Handle error scenario - email already exists
      console.error('Error checking email:');
      // Set the error message state
      setEmailError('Email already exists.');
    }
  }, 500);
  
  
  // Calculate Age
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

    // // Update Profile Based on Age
    // const updateProfileBasedOnAge = (age: number) => {
    //   if (age < 18) {
    //     return "kid";
    //   } else {
    //     return "adult";
    //   }
    // };
    
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      // Validate required fields
      if (!userDetails.whatsappNumber || !userDetails.firstName || !userDetails.email ||
         !userDetails.lastName || !userDetails.gender ||
          !userDetails.profile || !userDetails.dateOfBirth
        ) {
        setSubmitError("Please fill in all required fields.");
        return;
      }
      router.push("/registration");
    };
  

  //Login new User Form
  if (status === 'authenticated') {
    return <div className='after-signup'>
          <form  className='form'    onSubmit={handleSubmit}>
          <div >
            <InputField
              label="First Name"
              value={userDetails.firstName as string}
              field="firstName"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

             <InputField
              label="Last Name"
              value={userDetails.lastName as string}
              field="lastName"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
        
               {/* Gender Field */}
            <div>
              <label className="register-label" htmlFor="gender">Gender :</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={userDetails.gender === "male"}
                    onChange={(e) => handleFieldChange("gender", e.target.value)}
                    onBlur={() => handleBlur("gender", userDetails.gender as string)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={userDetails.gender === "female"}
                    onChange={(e) => handleFieldChange("gender", e.target.value)}
                    onBlur={() => handleBlur("gender", userDetails.gender as string)}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="others"
                    checked={userDetails.gender === "others"}
                    onChange={(e) => handleFieldChange("gender", e.target.value)}
                    onBlur={() => handleBlur("gender", userDetails.gender as string)}
                  />
                  Others
                </label>
              </div>
            </div>

             {/* Date of Birth Field */}
          <div>
            <label className='first-label'>Date of Birth:</label>
            <DatePicker
              selected={userDetails.dateOfBirth}
              onChange={(date: Date | null) => handleFieldChange("dateOfBirth", date)}
              dateFormat="yyyy/MM/dd"
               className='first-date-of-birth'
            />
          </div>

          {/* Age Field */}
          <div>
            <label className="register-label">Age: {userDetails.age || ''}</label>
          </div>    

           {/* Profile Field */}
           <div>
              <label className="register-label">Profile: {userDetails.profile || ''}</label>
            </div>

            <InputField
              label="Email"
              value={userDetails.email as string}
              field="email"
              handleChange={handleChange}
              handleBlur={handleBlur}
              type="email"
            />
              {emailSuccess && <p className="error-message" onClick={() => location.reload()}>{emailSuccess}</p>}
              {emailError && <p className="error-message" onClick={() => location.reload()}>{emailError}</p>}
              {apiError && <p className="error-message" onClick={() => location.reload()}>{apiError}</p>}

            {/* Submit Button */}
          <div>
            <button type="submit" className="text-white bg-green-500 px-4 py-2 rounded-lg">Submit</button>
            {submitError && <p className="error-message" onClick={() => location.reload()}>{submitError}</p>}
          </div>
        </div>
      </form>    
    </div>
  }

  

  const sendOtp = async () => {
    const generatedOtp = Math.floor(10000 + Math.random() * 90000).toString();  // Generate a 5-digit random number
    //setOtp(generatedOtp); // Optionally store OTP in state if needed for comparison (not recommended for production)

    // Save OTP to a secure, temporary store
    await saveOtp(whatsappNumber, generatedOtp);


    // WhatsApp API URL and headers
    const options = {
      method: 'POST',
      url: 'https://live-mt-server.wati.io/303212/api/v1/sendTemplateMessage?whatsappNumber=' + whatsappNumber,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WHATSAPP_API_TOKEN}`
      },
      data: JSON.stringify({
          broadcast_name: 'otp_test_v1',
          parameters: [{ name: 'otp', value: generatedOtp }],
          template_name: 'otp_login_v1'
      })
  };

    // Call WhatsApp API to send OTP
    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        setOtpSent(true);
        console.log('OTP sent successfully:', generatedOtp);
      } else {
        alert('Failed to send OTP');
      }
    } catch (error) {
      alert('Failed to send OTP');
      console.error('Error sending OTP:', error);
    }
  };

const verifyOtpHandler = async () => {

  if (await verifyOtp(whatsappNumber, otp)) {
    // Check if the user exists in the database
    const checkUserResponse = await axios.get('/api/newUser', { params: { whatsappNumber } });

    if (checkUserResponse.data === 'User exists') {
      // If the user exists, sign in and redirect to the profile page
      const result = await signIn('credentials', {
        redirect: false,
        whatsappNumber,
        otp,
      });

      if (result?.ok) {
        router.push('/profile');
      } else {
        alert('Failed to verify OTP');
      }
    } else {
      // If the user doesn't exist, create a new user and redirect to the home page
      const createUserResponse = await axios.post('/api/createUser', { whatsappNumber });

      if (createUserResponse.status === 200 || createUserResponse.status === 201) {
        const result = await signIn('credentials', {
          redirect: false,
          whatsappNumber,
          statusLevel:'pending',
          role: 'talent',
          otp,
        });

        if (result?.ok) {
          router.push('/signup');
        } else {
          alert('Failed to verify OTP');
        }
      } else {
        alert('Error creating user');
      }
    }
  } else {
    alert('OTP mismatch');
  }
};

  return (
    <div className='signup'>
      <div>
      <Image width={150} height={50} className='login-image' src={loginimage} alt="Description of your image" />
      </div>
      
      <div className='box-2'>
      <h1>Login / Signup</h1>
      <div className='form'>
        
        <h2>Please enter your Whatsapp no.</h2>
        <input
          type="text"
          className='whatsappNumber'
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          placeholder="+91 9566574232 (WhatsApp Number)"
        />
        {otpSent ? (
          <>
            <input
              type="text"
              className='whatsappNumber'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button
            className='verifyotp'
             onClick={verifyOtpHandler}
             >Verify OTP</button>
          </>
        ) : (
          <button
           onClick={sendOtp}
           className='sendotp'
           >Send OTP</button>
        )}
        </div>
      </div>
    </div>
  );
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
    />
  </div>
);
export default Signup;
