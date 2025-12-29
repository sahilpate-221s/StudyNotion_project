import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false,
  courseDetails: {}, // cache by courseId
}

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setCourse: (state, action) => {
      state.course = action.payload
    },
    setEditCourse: (state, action) => {
      state.editCourse = action.payload
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
    resetCourseState: (state) => {
      state.step = 1
      state.course = null
      state.editCourse = false
    },
    // ✅ NEW
    setCourseDetails: (state, action) => {
      const { courseId, data } = action.payload
      state.courseDetails[courseId] = data
    },
  },
})

export const {
  setStep,
  setCourse,
  setEditCourse,
  setPaymentLoading,
  resetCourseState,
   setCourseDetails,
} = courseSlice.actions

export default courseSlice.reducer
