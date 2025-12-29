// import React, { useEffect, useState } from "react"
// import { BiInfoCircle } from "react-icons/bi"
// import { HiOutlineGlobeAlt } from "react-icons/hi"
// import { useDispatch, useSelector } from "react-redux"
// import { useNavigate, useParams } from "react-router-dom"
// import ConfirmationModal from "../Component/Common/ConfirmationModal"
// import Footer from "../Component/Common/Footer"
// import RatingStars from "../Component/Common/RatingStars"
// import CourseAccordionBar from "../Component/Core/Course/CourseAccordionBar"
// import CourseDetailsCard from "../Component/Core/Course/CourseDetailsCard"
// import { formatDate } from "../Service/formatDate"
// import { fetchCourseDetails } from "../Service/Operation/courseDetailsAPI"
// import { BuyCourse } from "../Service/Operation/studentFeaturesAPI"
// import GetAvgRating from "../Util/avgRating"
// import Error from "./Error"

// function CourseDetails() {
//   const { user } = useSelector((state) => state.profile)
//   const { token } = useSelector((state) => state.auth)
//   const { loading } = useSelector((state) => state.profile)
//   const { paymentLoading } = useSelector((state) => state.course)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()


//   const { courseId } = useParams()



//   const [response, setResponse] = useState(null)
//   const [confirmationModal, setConfirmationModal] = useState(null)
//   useEffect(() => {

//     ; (async () => {
//       try {
//         const res = await fetchCourseDetails(courseId)

//         setResponse(res)
//       } catch (error) {
//         console.log("Could not fetch Course Details")
//       }
//     })()
//   }, [courseId])




//   const [avgReviewCount, setAvgReviewCount] = useState(0)
//   useEffect(() => {
//     const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
//     setAvgReviewCount(count)
//   }, [response])




//   const [isActive, setIsActive] = useState(Array(0))
//   const handleActive = (id) => {

//     setIsActive(
//       !isActive.includes(id)
//         ? isActive.concat([id])
//         : isActive.filter((e) => e != id)
//     )
//   }


//   const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
//   useEffect(() => {
//     let lectures = 0
//     response?.data?.courseDetails?.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })
//     setTotalNoOfLectures(lectures)
//   }, [response])

//   if (loading || !response) {
//     return (
//       <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
//         <div className="spinner"></div>
//       </div>
//     )
//   }
//   if (!response.success) {
//     return <Error />
//   }

//   const {
//     _id: course_id,
//     courseName,
//     courseDescription,
//     thumbnail,
//     price,
//     whatYouWillLearn,
//     courseContent,
//     ratingAndReviews,
//     instructor,
//     studentsEnroled,
//     createdAt,
//   } = response.data?.courseDetails

//   const handleBuyCourse = () => {
//     if (token) {
//       BuyCourse(token, [courseId], user, navigate, dispatch)
//       return
//     }
//     setConfirmationModal({
//       text1: "You are not logged in!",
//       text2: "Please login to Purchase Course.",
//       btn1Text: "Login",
//       btn2Text: "Cancel",
//       btn1Handler: () => navigate("/login"),
//       btn2Handler: () => setConfirmationModal(null),
//     })
//   }

//   if (paymentLoading) {

//     return (
//       <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
//         <div className="spinner"></div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className={`relative w-full bg-richblack-800`}>
//         {/* Hero Section */}
//         <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
//           <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
//             <div className="relative block max-h-[30rem] lg:hidden">
//               <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
//               <img
//                 src={thumbnail}
//                 alt="course thumbnail"
//                 className="aspect-auto w-full"
//               />
//             </div>
//             <div
//               className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
//             >
//               <div>
//                 <p className="text-4xl font-bold text-richblack-5 sm:text-[42px] tracking-wider lg:text-left text-center">
//                   {courseName}
//                 </p>
//               </div>
//               <p className={`text-richblack-200`}>
//                 <ul style={{ listStyle: 'none', padding: 0 }} >
//                   {courseDescription.split('\n').map((line, index) => (
//                     <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
//                       <span style={{ marginRight: '0.5em' }}>{index + 1}.</span>
//                       <span>{line.trim().substring(line.indexOf('.') + 1).trim()}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </p>
//               <div className="text-md flex flex-wrap items-center gap-2 lg:justify-start justify-center">
//                 <span className="text-yellow-25">{avgReviewCount}</span>
//                 <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
//                 <span>{`(${ratingAndReviews.length} reviews)`}</span>
//                 <span>{`${studentsEnroled.length} students enrolled`}</span>
//               </div>
//               <div>
//                 <p className="">
//                   Created By {`${instructor.firstName} ${instructor.lastName}`}
//                 </p>
//               </div>
//               <div className="flex flex-wrap gap-5 text-lg">
//                 <p className="flex items-center gap-2">
//                   {" "}
//                   <BiInfoCircle /> Created at {formatDate(createdAt)}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   {" "}
//                   <HiOutlineGlobeAlt /> English
//                 </p>
//               </div>
//             </div>
//             <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
//               <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
//                 Rs. {price}
//               </p>
//               <button className="yellowButton uppercase tracking-wider" onClick={handleBuyCourse}>
//                 Buy Now
//               </button>
//               <button className="blackButton uppercase tracking-wider">Add to Cart</button>
//             </div>
//           </div>
//           {/* Courses Card */}
//           <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
//             <CourseDetailsCard
//               course={response?.data?.courseDetails}
//               setConfirmationModal={setConfirmationModal}
//               handleBuyCourse={handleBuyCourse}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
//         <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
//           {/* What will you learn section */}
//           <div className="my-8 border border-richblack-600 p-8">
//             <p className="text-3xl font-semibold uppercase tracking-wider">What you'll Learn?</p>
//             <div className="mt-5">
//               <ul style={{ listStyle: 'none', padding: 0 }} className="leading-relaxed">
//                 {whatYouWillLearn.split('\n').map((line, index) => (
//                   <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
//                     <span style={{ marginRight: '0.5em' }}>{index + 1}.</span>
//                     <span>{line.trim().substring(line.indexOf('.') + 1).trim()}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Course Content Section */}
//           <div className="max-w-[830px] ">
//             <div className="flex flex-col gap-3">
//               <p className="text-[28px] font-semibold uppercase tracking-wider">Course Content</p>
//               <div className="flex flex-wrap justify-between gap-2">
//                 <div className="flex gap-2 tracking-wide">
//                   <span>
//                     {courseContent.length} {`section(s)`}
//                   </span>
//                   <span>
//                     {totalNoOfLectures} {`lecture(s)`}
//                   </span>
//                   <span>{response.data?.totalDuration}</span>
//                 </div>
//                 <div>
//                   <button
//                     className="text-yellow-25"
//                     onClick={() => setIsActive([])}
//                   >
//                     Collapse all sections
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Course Details Accordion */}
//             <div className="py-4">
//               {courseContent?.map((course, index) => (
//                 <CourseAccordionBar
//                   course={course}
//                   key={index}
//                   isActive={isActive}
//                   handleActive={handleActive}
//                 />
//               ))}
//             </div>

//             {/* Author Details */}
//             <div className="mb-12 py-4">
//               <p className="text-[28px] font-semibold">Author</p>
//               <div className="flex items-center gap-4 py-4">
//                 <img
//                   src={
//                     instructor.image
//                       ? instructor.image
//                       : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
//                   }
//                   alt="Author"
//                   className="h-14 w-14 rounded-full object-cover"
//                 />
//                 <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
//               </div>
//               <p className="text-richblack-50">
//                 {instructor?.additionalDetails?.about}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//       {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
//     </>
//   )
// }

// export default CourseDetails






import React, { useEffect, useState, useMemo } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import ConfirmationModal from "../Component/Common/ConfirmationModal"
import Footer from "../Component/Common/Footer"
import RatingStars from "../Component/Common/RatingStars"
import CourseAccordionBar from "../Component/Core/Course/CourseAccordionBar"
import CourseDetailsCard from "../Component/Core/Course/CourseDetailsCard"
import { formatDate } from "../Service/formatDate"
import { fetchCourseDetails } from "../Service/Operation/courseDetailsAPI"
import { BuyCourse } from "../Service/Operation/studentFeaturesAPI"
import GetAvgRating from "../Util/avgRating"
import Error from "./Error"
import { setCourseDetails } from "../Slice/courseSlice"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { paymentLoading } = useSelector((state) => state.course)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()

  const [confirmationModal, setConfirmationModal] = useState(null)
  const [isActive, setIsActive] = useState([])

  // ✅ FETCH FROM REDUX CACHE
  const courseDetailsFromStore = useSelector(
    (state) => state.course.courseDetails?.[courseId]
  )

  // ✅ API CALL ONLY IF NOT PRESENT IN REDUX
  useEffect(() => {
    if (!courseDetailsFromStore) {
      // console.log("📡 Fetching course from API:", courseId)

      ;(async () => {
        try {
          const res = await fetchCourseDetails(courseId)

          dispatch(setCourseDetails({ courseId, data: res }))
        } catch (error) {
          console.log("❌ Could not fetch Course Details", error)
        }
      })()
    } else {
      // console.log("✅ Using cached course from Redux:", courseId)
    }
  }, [courseId, courseDetailsFromStore, dispatch])

  // ✅ unified response source
  const response = courseDetailsFromStore

  // ✅ DERIVED SAFE VARIABLES (IMPORTANT FIX)
  const courseData = response?.data?.courseDetails
  const totalDuration = response?.data?.totalDuration

  // ✅ Avg rating memoized (moved before early returns to fix hook rules)
  const avgReviewCount = useMemo(
    () => courseData ? GetAvgRating(courseData.ratingAndReviews) : 0,
    [courseData]
  )

  // LOADING STATE
  if (!courseData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!response?.success) {
    return <Error />
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnroled,
    createdAt,
  } = courseData

  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? [...isActive, id]
        : isActive.filter((e) => e !== id)
    )
  }

 

  const totalNoOfLectures = courseContent?.reduce(
    (acc, sec) => acc + (sec.subSection?.length || 0),
    0
  )

  const handleBuyCourse = () => {
    if (token) {
      BuyCourse(token, [courseId], user, navigate, dispatch)
      return
    }

    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">

            {/* Mobile Thumbnail */}
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>

            <div className="z-30 my-5 flex flex-col gap-4 py-5 text-lg text-richblack-5">
              <p className="text-4xl font-bold tracking-wider text-center lg:text-left">
                {courseName}
              </p>

              <ul className="text-richblack-200 list-none">
                {courseDescription?.split("\n")?.map((line, index) => (
                  <li key={index} className="flex gap-2">
                    <span>{index + 1}.</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>({ratingAndReviews?.length || 0} reviews)</span>
                <span>{studentsEnroled?.length || 0} students enrolled</span>
              </div>

              <p>
                Created By {`${instructor.firstName} ${instructor.lastName}`}
              </p>

              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>

            {/* Mobile Price Card */}
            <div className="flex w-full flex-col gap-4 border-y border-richblack-500 py-4 lg:hidden">
              <p className="text-3xl font-semibold">Rs. {price}</p>
              <button className="yellowButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
              <button className="blackButton">Add to Cart</button>
            </div>
          </div>

          {/* Desktop Course Card */}
          <div className="right-4 top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] lg:absolute lg:block">
            <CourseDetailsCard
              course={courseData}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="mx-auto box-content px-4 text-richblack-5 lg:w-[1260px]">
        <div className="max-w-[810px]">
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold uppercase">What you'll Learn?</p>
            <ul className="mt-5 list-none">
              {whatYouWillLearn?.split("\n")?.map((line, index) => (
                <li key={index} className="flex gap-2">
                  <span>{index + 1}.</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-2xl font-semibold uppercase">Course Content</p>

          <div className="flex justify-between py-2">
            <div className="flex gap-4">
              <span>{courseContent?.length || 0} sections</span>
              <span>{totalNoOfLectures} lectures</span>
              <span>{totalDuration}</span>
            </div>
            <button className="text-yellow-25" onClick={() => setIsActive([])}>
              Collapse all sections
            </button>
          </div>

          <div className="py-4">
            {courseContent?.map((section, index) => (
              <CourseAccordionBar
                key={index}
                course={section}
                isActive={isActive}
                handleActive={handleActive}
              />
            ))}
          </div>

          {/* Author */}
          <div className="py-8">
            <p className="text-2xl font-semibold">Author</p>
            <div className="flex items-center gap-4 py-4">
              <img
                src={
                  instructor.image ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                }
                alt="author"
                className="h-14 w-14 rounded-full"
              />
              <p>{`${instructor.firstName} ${instructor.lastName}`}</p>
            </div>
            <p className="text-richblack-50">
              {instructor?.additionalDetails?.about}
            </p>
          </div>
        </div>
      </div>

      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails
