import ToastManager from "../../Util/toastManager"

import { setLoading, setUser } from "../../Slice/profileSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = ToastManager.showLoading("Loading User Details...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      dispatch(setUser({ ...response.data.data, image: userImage }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      ToastManager.showError("Could Not Get User Details")
    }
    ToastManager.dismissLoading(toastId)
    dispatch(setLoading(false))
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = ToastManager.showLoading("Loading Enrolled Courses...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    // console.log(
    //   "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
    //   response
    // )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    ToastManager.showError("Could Not Get Enrolled Courses")
  }
  ToastManager.dismissLoading(toastId)
  return result
}

export async function getInstructorData(token) {
  const toastId = ToastManager.showLoading("Loading Instructor Data...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    result = response?.data?.courses
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    ToastManager.showError("Could Not Get Instructor Data")
  }
  ToastManager.dismissLoading(toastId)
  return result
}
