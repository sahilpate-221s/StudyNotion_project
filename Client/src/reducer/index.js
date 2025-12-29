import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "../Slice/authSlice"
import cartReducer from "../Slice/cartSlice"
import courseReducer from "../Slice/courseSlice"
import profileReducer from "../Slice/profileSlice"
import viewCourseReducer from "../Slice/viewCourseSlice"
import reviewReducer from "../Slice/reviewSlice"
import categoryReducer from "../Slice/categorySlice"

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  course: courseReducer,
  cart: cartReducer,
  viewCourse: viewCourseReducer,
  review: reviewReducer,
  category: categoryReducer,

})

export default rootReducer
