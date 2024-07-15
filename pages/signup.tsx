import { useState, useEffect } from "react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import debounce from "lodash.debounce";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { saveOtp, verifyOtp } from "../lib/otp"; // Ensure this utility is properly implemented
import loginimage from "/images/loginimage.png";
import Image from "next/image"; // Import the Image component

type UserDetails = {
  whatsappNumber: string; // WhatsApp number, presumably unique and required
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
  // label: string;
  placeholder: string;
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
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [defaultCountry, setDefaultCountry] = useState("us"); // Default country code
  const [timer, setTimer] = useState(0);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  //New User After Signup
  const [userDetails, setUserDetails] = useState<UserDetails>({
    whatsappNumber: "", // WhatsApp number, presumably unique and required
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

  //Signup Error

  const [otpError, setOtpError] = useState<string | null>(null);


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
        newDetails.profile = newDetails.age < 18 ? "kid" : "adult";
      }

      setUserDetails(newDetails);

      if (session?.user) {
        try {
          await axios.post("/api/updateProfile", {
            whatsappNumber: session.user.whatsappNumber,
            [field]: value,
            ...(field === "dateOfBirth" && {
              age: newDetails.age,
              profile: newDetails.profile,
            }),
          });
        } catch (error) {
          console.error("Error updating profile:", error);
          setApiError("Error updating profile.");
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
    if (field === "email") {
      // Perform asynchronous check
      checkEmailExists(value);
    }
  };

  // Asynchronous function to check if email exists
  const checkEmailExists = debounce(async (email: string) => {
    try {
      const response = await axios.post("/api/checkEmail", { email });
      if (response.status === 200) {
        setEmailSuccess("Email Not Used Before.");
      }
    } catch (error) {
      // Handle error scenario - email already exists
      console.error("Error checking email:");
      // Set the error message state
      setEmailError("Email already exists.");
    }
  }, 500);

  // Calculate Age
  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
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
    if (
      !userDetails.whatsappNumber ||
      !userDetails.firstName ||
      !userDetails.email ||
      !userDetails.lastName ||
      !userDetails.gender ||
      !userDetails.profile ||
      !userDetails.dateOfBirth
    ) {
      setSubmitError("Please fill in all required fields.");
      return;
    }
    router.push("/registration");
  };

  //**************************************************************************************************************** */
  // After Signup
  // Country Code
  useEffect(() => {
    const fetchUserCountryCode = async () => {
      try {
        const response = await fetch("https://ipinfo.io?token=9686541c292001");
        const data = await response.json();
        setDefaultCountry(data.country.toLowerCase());
      } catch (error) {
        console.error("Error fetching user country code:", error);
      }
    };

    fetchUserCountryCode();
  }, []);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowResendOtp(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const sendOtp = async () => {
    const generatedOtp = Math.floor(10000 + Math.random() * 90000).toString(); // Generate a 5-digit random number

    // Save OTP to a secure, temporary store
    await saveOtp(whatsappNumber, generatedOtp);

    // WhatsApp API URL and headers
    const options = {
      method: "POST",
      url: `https://live-mt-server.wati.io/303212/api/v1/sendTemplateMessage?whatsappNumber=${whatsappNumber}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_WHATSAPP_API_TOKEN}`,
      },
      data: JSON.stringify({
        broadcast_name: "otp_test_v1",
        parameters: [{ name: "otp", value: generatedOtp }],
        template_name: "otp_login_v1",
      }),
    };

    // Call WhatsApp API to send OTP
    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        setOtpSent(true);
        setTimer(60); // Start timer for 1 minute
        setShowResendOtp(false); // Hide resend button
        console.log("OTP sent successfully:", generatedOtp);
      } else {
        alert("Failed to send OTP");
      }
    } catch (error) {
      alert("Failed to send OTP");
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOtpHandler = async () => {
    const otpVerified = await verifyOtp(whatsappNumber, otp);

    if (otpVerified) {
      const checkUserResponse = await axios.get("/api/newUser", {
        params: { whatsappNumber },
      });

      if (checkUserResponse.data === "User exists") {
        // User exists, sign in and redirect to profile page
        const result = await signIn("credentials", {
          redirect: false,
          whatsappNumber,
          otp,
        });

        if (result?.ok) {
          router.push("/profile");
        } else {
          alert("Failed to verify OTP");
        }
      } else {
        // User doesn't exist, create a new user
        const createUserResponse = await axios.post("/api/createUser", {
          whatsappNumber,
        });

        if (
          createUserResponse.status === 200 ||
          createUserResponse.status === 201
        ) {
          const result = await signIn("credentials", {
            redirect: false,
            whatsappNumber,
            otp,
          });

          if (result?.ok) {
            router.push("/signup");
          } else {
            alert("Failed to verify OTP");
          }
        } else {
          alert("Error creating user");
        }
      }
    } else {
      setOtpError("Wrong OTP");
      // alert("OTP mismatch");
    }
  };

  // After Signup
  if (status === "authenticated") {
    return (
      <>
        <div className="signup">
          {/* First Half Image */}
          <div className="box-1">
            <Image
            width={150}
            height={50}
              className="login-image"
              src={loginimage}
              alt="Description of your image"
            />
          </div>

         {/* Second Half Fields */}
          <div className="box-2">
            <h1>Please fill the form to register</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div>
               
               <div className="after-signup-data ">
                <InputField
                  placeholder="First Name"
                  value={userDetails.firstName as string}
                  field="firstName"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <InputField
                  placeholder="Last Name"
                  value={userDetails.lastName as string}
                  field="lastName"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                </div>


                <div className="after-signup-data-two">
                {/* Date of Birth Field */}
                <div>
                  <DatePicker
                    selected={userDetails.dateOfBirth}
                    onChange={(date: Date | null) =>
                      handleFieldChange("dateOfBirth", date)
                    }
                    dateFormat="yyyy/MM/dd"
                    className="signup-date-of-birth"
                  />
                </div>
                
                {/* Gender Field */}
                <div>
                  <label htmlFor="gender"></label>
                  <div className="gender-signup">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={userDetails.gender === "male"}
                        onChange={(e) =>
                          handleFieldChange("gender", e.target.value)
                        }
                        onBlur={() =>
                          handleBlur("gender", userDetails.gender as string)
                        }
                        className="radio-input"
                      />
                     <span> &nbsp;M</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={userDetails.gender === "female"}
                        onChange={(e) =>
                          handleFieldChange("gender", e.target.value)
                        }
                        onBlur={() =>
                          handleBlur("gender", userDetails.gender as string)
                        }
                        className="radio-input"
                      />
                      <span> &nbsp;F</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="others"
                        checked={userDetails.gender === "others"}
                        onChange={(e) =>
                          handleFieldChange("gender", e.target.value)
                        }
                        onBlur={() =>
                          handleBlur("gender", userDetails.gender as string)
                        }
                        className="radio-input"
                      />
                        <span> &nbsp;O</span>
                    </label>
                  </div>
                </div>
                </div>

              {/* Email Field */}
              <InputField
                  placeholder="Email"
                  value={userDetails.email as string}
                  field="email"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  type="email"
                />
                {emailSuccess && (
                  <p
                    className="error-message"
                    onClick={() => location.reload()}
                  >
                    {emailSuccess}
                  </p>
                )}
                {emailError && (
                  <p
                    className="error-message"
                    onClick={() => location.reload()}
                  >
                    {emailError}
                  </p>
                )}
                {apiError && (
                  <p
                    className="error-message"
                    onClick={() => location.reload()}
                  >
                    {apiError}
                  </p>
                )}
                
                {/* Age Field */}
                {/* <div>
                  <label className="register-label">
                    Age: {userDetails.age || ""}
                  </label>
                </div> */}
                {/* Profile Field */}
                {/* <div>
                  <label className="register-label">
                    Profile: {userDetails.profile || ""}
                  </label>
                </div> */}
                 {/* Submit Button */}
                 <div>
                  <button
                    type="submit"
                    className="submit-signup-button"
                  >
                    Submit
                  </button>
                  {submitError && (
                    <p
                      className="error-message"
                      onClick={() => location.reload()}
                    >
                      {submitError}
                    </p>
                  )}
                </div>
              </div>
              {/* End Div Above */}
            </form>
          </div>
        </div>
      </>
    );
  }

  // Before Signup
  return (
    <>
      <div className="signup">
        <div className="box-1">
          <Image
            width={150}
            className="login-image"
            src={loginimage}
            alt="Description of your image"
          />
        </div>

        <div className="box-2">
          <h1>Login / Signup</h1>
          <div className="form">
            <h2>Please enter your Whatsapp no.</h2>
            <PhoneInput
              country={defaultCountry} // Default country code
              value={whatsappNumber}
              onChange={setWhatsappNumber}
              inputStyle={{
                width: "100%",
                height: "45px",
                borderRadius: "13px",
                border: "1px solid #D4D7E3",
                background:"#F7FBFF",
                fontSize: "18px",
                color: "#232323",
                lineHeight: "18px",
                fontWeight: "400",
              }}
              preferredCountries={["in"]}
              containerStyle={{
                paddingLeft: "32px",
                paddingRight: "32px",
              }}
              enableSearch
              disableSearchIcon
            />
            {otpSent ? (
              <>
                <input
                  type="text"
                  className="submit-otp-field"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
               
              {timer > 0 ? (
                  <>
                   <button onClick={verifyOtpHandler}>Verify OTP</button>
                     {/* OTP Error Message */}
                   {otpError && ( <p className="otp-error-message" onClick={() => location.reload()}
                  >
                    {otpError}
                  </p>
                )}
                   <p>Resend OTP in {timer} seconds</p>
                  </>
                  
                ) : (
                  showResendOtp && <button onClick={sendOtp}>Resend OTP</button>
                )}
              </>
            ) : (
              <button className="enter-otp" onClick={sendOtp}>Send OTP</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// InputField component
const InputField: React.FC<InputFieldProps> = ({
  // label,
  placeholder,
  value,
  field,
  handleChange,
  handleBlur,
  type = "text",
}) => (
  <div className="mb-4">
    {/* <label className="register-label" htmlFor={field}>
      {label}
    </label> */}
    <input
      className="register-after-input"
      id={field}
      placeholder={placeholder}
      value={value}
      onChange={(e) => handleChange(field, e)}
      onBlur={() => handleBlur(field, value)}
    />
  </div>
);
export default Signup;
