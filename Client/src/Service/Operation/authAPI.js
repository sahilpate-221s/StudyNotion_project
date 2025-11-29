import ToastManager from "../../Util/toastManager"

import { setLoading, setToken } from "../../Slice/authSlice"
import { resetCart } from "../../Slice/cartSlice"
import { setUser } from "../../Slice/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = ToastManager.showLoading("Sending OTP...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      ToastManager.showSuccess("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      ToastManager.showError("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    ToastManager.dismissLoading(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = ToastManager.showLoading("Creating Account...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      ToastManager.showSuccess("Sign Up Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      ToastManager.showError("Sign Up Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    ToastManager.dismissLoading(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = ToastManager.showLoading("Logging in...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      ToastManager.showSuccess("Login Successful")
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      localStorage.setItem("token", JSON.stringify(response.data.token))
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      ToastManager.showError("Login Failed")
    }
    dispatch(setLoading(false))
    ToastManager.dismissLoading(toastId)
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = ToastManager.showLoading("Sending Reset Email...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      console.log("RESETPASSTOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      ToastManager.showSuccess("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      console.log("RESETPASSTOKEN ERROR............", error)
      ToastManager.showError("Failed To Send Reset Email")
    }
    ToastManager.dismissLoading(toastId)
    dispatch(setLoading(false))
  }
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = ToastManager.showLoading("Resetting Password...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      ToastManager.showSuccess("Password Reset Successfully")
      navigate("/login")
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error)
      ToastManager.showError("Failed To Reset Password")
    }
    ToastManager.dismissLoading(toastId)
    dispatch(setLoading(false))
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    ToastManager.showSuccess("Logged Out")
    navigate("/")
  }
}
