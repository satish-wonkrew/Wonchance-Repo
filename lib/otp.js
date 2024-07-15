const otpStore = new Map();

export const saveOtp = (whatsappNumber, otp) => {
  otpStore.set(whatsappNumber, otp);
  console.log(`OTP saved for ${whatsappNumber}: ${otp}`); // Log the OTP saved
  setTimeout(() => {
    console.log(`OTP expired for ${whatsappNumber}`); // Log when OTP expires
    otpStore.delete(whatsappNumber);
  }, 300000); // 5 minutes expiration
};

export const verifyOtp = async (whatsappNumber, otp) => {
  const expectedOtp = otpStore.get(whatsappNumber);
  console.log(`Expected OTP for ${whatsappNumber}: ${expectedOtp}`); // Log the expected OTP
  console.log(`Received OTP for ${whatsappNumber}: ${otp}`); // Log the received OTP
  return expectedOtp === otp;
};
