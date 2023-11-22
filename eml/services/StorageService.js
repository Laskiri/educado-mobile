import * as api from '../api/api.js';
import * as userApi from '../api/userApi.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COURSE_LIST = '@courseList';
const SUB_COURSE_LIST = '@subCourseList';
const USER_ID = '@userId';
const USER_INFO = '@userInfo';
const STUDENT_INFO = '@studentInfo';
const LOGIN_TOKEN = '@loginToken';
let isOnline = true;

/** STUDENT **/

export const setStudentInfo = async (userId) => {
  const fetchedStudentInfo = await userApi.getStudentInfo(userId);
  await AsyncStorage.setItem(STUDENT_INFO, JSON.stringify(fetchedStudentInfo));
};

export const getStudentInfo = async () => {
  const fetchedStudentInfo = JSON.parse(await AsyncStorage.getItem(STUDENT_INFO));
  return fetchedStudentInfo;
};

export const getLoginToken = async () => {
  const fetchedToken = await AsyncStorage.getItem(LOGIN_TOKEN);
  return fetchedToken;
};

export const getUserInfo = async () => {
  const fetchedUserInfo = JSON.parse(await AsyncStorage.getItem(USER_INFO));
  if (fetchedUserInfo === null) {
    throw new Error('Cannot fetch user info from async storage');
  }
  return fetchedUserInfo;
};

// Set user info in storage
export const setUserInfo = async (userInfo) => {
  const obj = {
    id: userInfo.id,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
  };
  await AsyncStorage.setItem(USER_INFO, JSON.stringify(obj));
  await AsyncStorage.setItem(USER_ID, userInfo.id); // needs to be seperate
  await setStudentInfo(userInfo.id);
};

// Get JWT from storage
export const getJWT = async () => {
  return await AsyncStorage.getItem(LOGIN_TOKEN);
};

// Set JWT in storage
export const setJWT = async (jwt) => {
  return await AsyncStorage.setItem(LOGIN_TOKEN, jwt);
};

/** COURSE AND COURSE LIST **/

// get specific course  (This function is obsolete and is only used in test)
/*
export const getCourseId = async (id) => {
  try {
    return await refreshCourse(id);
  } catch (e) {
    // Check if the course already exists in AsyncStorage
    let course = JSON.parse(await AsyncStorage.getItem(COURSE));
    if (course !== null) {
      return course;
    }
    if (error?.response?.data != null) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

// (This function is obsolete and is only used in test)
export const refreshCourse = async (id) => {
  return await api
    .getCourse(id)
    .then(async (course) => {
      return course;
    })
    .catch((e) => {
      if (e?.response?.data != null) {
        throw e.response.data;
      } else {
        throw e;
      }
    });
};
*/
// get all courses
export const getCourseList = async () => {
  let courseList = [];
  try {
    courseList = await api.getCourses();
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  } finally {
    return await refreshCourseList(courseList);
  }
};

export const refreshCourseList = async (courseList) => {
  try {
    let newCourseList = [];
    if (courseList.length !== 0) {
      for (const course of courseList) {
        // Make new list with required members
        newCourseList.push({
          title: course.title,
          courseId: course._id,
          description: course.description,
          category: course.category,
          estimatedHours: course.estimatedHours,
          dateUpdated: course.dateUpdated,
          difficulty: course.difficulty,
          published: course.published,
          status: course.status,
          rating: course.rating,
        });
      }
    }
    // Save new courseList for this key and return it.
    return newCourseList;
  }catch(e){
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

export const saveCourseTotalPointsLocally = async (courseId, newTotalPoints) => {
  const studentInfo = JSON.parse(await AsyncStorage.getItem(STUDENT_INFO));

  const completedCourses = studentInfo.completedCourses;
  const completedCourseIndex = completedCourses.findIndex(course => course.courseId === courseId.courseId);
  if (completedCourseIndex !== -1) {
    completedCourses[completedCourseIndex].totalPoints = newTotalPoints;
  }

  studentInfo.completedCourses = completedCourses;

  await AsyncStorage.setItem(STUDENT_INFO, JSON.stringify(studentInfo));
};

/** SECTIONS **/

// get all section for specific course
export const getSectionList = async (course_id) => {
  let sectionList = null;
  try {
    sectionList = await api.getAllSections(course_id);
  } catch (unusedErrorMessage) {
  // Use locally stored section if they exist and the DB cannot be reached
    try {
      sectionList = JSON.parse(await AsyncStorage.getItem('S'+course_id));
      throw unusedErrorMessage;
    } catch (e){
      if (e?.response?.data != null) {
        throw e.response.data;
      } else {
        throw e;
      }
    }
  } finally {
    return await refreshSectionList(sectionList);
  }
};

// Fits section data to new object with relevant fields
export const refreshSectionList = async (sectionList) => {
  let newSectionList = [];
  try {
    if (sectionList !== null) {
      for (const section of sectionList) {
        newSectionList.push({
          title: section.title,
          sectionId: section._id,
          parentCourseId: section.parentCourse,
          description: section.description,
          components: section.components,
          total: section.totalPoints,
        });
      }
    } else {
      throw new Error('No data to be read in DB or local storage');
    }
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  } finally {
    //Returns new fitted section list, or empty list if there was no data fetched from DB or Storage,
    return newSectionList;
  }
};

/** LECTURES **/

// get all Lectures for specific section
export const getLectureList = async (sectionID) => {
  let lectureList = null;
  try {
    lectureList = await api.getLecturesInSection(sectionID);
  } catch {
    // Use locally stored lectures if they exist and the DB cannot be reached
    try {
      if ((lectureList = JSON.parse(await AsyncStorage.getItem('L'+sectionID))) === null){
        throw new Error('No data to be read in DB or local storage');
      }
    } catch (e){
      if (e?.response?.data != null) {
        throw e.response.data;
      } else {
        throw e;
      }
    }
  } finally {
    return await lectureFittingModel(lectureList);
  }
};

// Fits lecture data to new object with relevant fields
const lectureFittingModel = async (lectureList) => {
  let newLectureList = [];
  try {
    if (lectureList !== null) {
      for (const lecture of lectureList) {
        newLectureList.push(
          lecture  // Replace with object model if needed (Se sections for reference)
        );
      }
    } else {
      throw new Error('No data to be read in DB or local storage');
    }
  } catch (e){
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  } finally {
    //Returns new fitted lecture list, or empty list if there was no data fetched from DB or Storage,
    return newLectureList;
  }
};

// get images for a Lecture
export const fetchLectureImage = async (imageID, lectureID) => {
  let image = null;
  try {
    image = await api.getBucketImage(imageID);

  } catch (unusedErrorMessage) {
    // Use locally stored lectures if they exist and the DB cannot be reached
    try {
      if((image = JSON.parse(await AsyncStorage.getItem('I'+lectureID))) === null){
        throw unusedErrorMessage;
      }
    } catch (e){
      if (e?.response?.data != null) {
        throw e.response.data;
      } else {
        throw e;
      }
    }
  } finally {
    return image;
  }
};

/** EXERCISES **/

// get all Exercises for specific section
export const getExerciseList = async (sectionID) => {
  let exerciseList = null;
  try {
    exerciseList = await api.getExercisesInSection(sectionID);

  } catch (unusedErrorMessage) {
    // Use locally stored exercises if they exist and the DB cannot be reached
    try {
      if((exerciseList = JSON.parse(await AsyncStorage.getItem('E'+sectionID))) === null){
        throw unusedErrorMessage;
      }
    } catch (e){
      if (e?.response?.data != null) {
        throw e.response.data;
      } else {
        throw e;
      }
    }
  } finally {
    return await exerciseFittingModel(exerciseList);
  }
};

// Fits exercise data to new object with relevant fields
const exerciseFittingModel = async (exerciseList) => {
  let newExerciseList = [];
  try {
    if (exerciseList !== null) {
      for (const exercise of exerciseList) {
        newExerciseList.push(
          exercise  // Replace with object model if needed (Se sections for reference)
        );
      }
    } else {
      throw new Error('No data to be read in DB or local storage');
    }
  } catch (e){
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  } finally {
    //Returns new fitted exercise list, or empty list if there was no data fetched from DB or Storage,
    return newExerciseList;
  }
};


/** SUBSCRIPTIONS **/

// get all subscribed courses from a user
export const getSubCourseList = async () => {

  // get the logged-in user id from async storage
  const userId = await AsyncStorage.getItem(USER_ID);

  if (userId === null) {
    throw new Error('Cannot fetch user id from async storage');
  }

  try {
    return await refreshSubCourseList(userId);

  } catch (e) {
    // Check if the course list already exists in AsyncStorage
    let courseList = JSON.parse(await AsyncStorage.getItem(SUB_COURSE_LIST));
    if (courseList !== null) {
      return courseList;
    }
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};
export const refreshSubCourseList = async (userId) => {
  return await api
    .getSubscriptions(userId)
    .then(async (list) => {
      let newCourseList = [];
      for (const course of list) {

        // Make new list with required members
        newCourseList.push({
          title: course.title,
          courseId: course._id,
          description: course.description,
          category: course.category,
          estimatedHours: course.estimatedHours,
          dateUpdated: course.dateUpdated,
          difficulty: course.difficulty,
          published: course.published,
          status: course.status,
          rating: course.rating,
        });
      }
      // Save new courseList for this key and return it.
      await AsyncStorage.setItem(SUB_COURSE_LIST, JSON.stringify(newCourseList));
      return newCourseList;
    })
    .catch((e) => {
      if (e?.response?.data != null) {
        throw e.response.data;
      } else {
        throw e;
      }
    });
};


// subscribe to a course
export const subscribe = async (courseId) => {

  // get the logged-in user id from async storage
  const userId = await AsyncStorage.getItem(USER_ID);

  if (userId === null) {
    throw new Error('Cannot fetch user id from async storage');
  }

  try {
    return await api.subscribeToCourse(userId, courseId);

  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

// unsubscribe to a course
export const unsubscribe = async (courseId) => {

  // get the logged-in user id from async storage
  const userId = await AsyncStorage.getItem(USER_ID);

  if (userId === null) {
    throw new Error('Cannot fetch user id from async storage');
  }

  try {
    if(await AsyncStorage.getItem(courseId) !== null){
      deleteLocallyStoredCourse(courseId);
    }
    return await api.unSubscribeToCourse(userId, courseId);

  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};


// check if user is subscribed to a course
export const checkSubscriptions = async (courseId) => {

  // get the logged-in user id from async storage
  const userId = await AsyncStorage.getItem(USER_ID);

  if (userId === null) {
    throw new Error('Cannot fetch user id from async storage');
  }

  try {
    return await api.ifSubscribed(userId, courseId);

  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

// A function that calls the backed through the api just to test if it can be reached 
export const checkIfOnline = async () => {
  isOnline = await api.checkBackendOnline();
  return isOnline;
};


/** Downloading course **/

/**
 * Stores a course locally
 * @param {String} courseID - A string with the ID of the course to be stored
 * @returns {boolean} - Returns true if no errors was thrown during the storage and false if there was
 */
export const storeCourseLocally = async (courseID) => {
  let success = true;
  try {
    const course = await api.getCourse(courseID);
    await AsyncStorage.setItem(courseID + await AsyncStorage.getItem(USER_ID), JSON.stringify(course));

    const sectionList = await api.getAllSections(courseID);
    await AsyncStorage.setItem('S' + courseID, JSON.stringify(sectionList));
    for (let section of sectionList) {
      let lectureList = await api.getLecturesInSection(section._id);
      await AsyncStorage.setItem('L' + section._id, JSON.stringify(lectureList));
      for (let lecture of lectureList) {
        if (lecture.image) {
          try {
            let image = await api.getBucketImage(lecture.image);
            await AsyncStorage.setItem('I' + lecture._id, JSON.stringify(image));
          } catch {
            await AsyncStorage.setItem('I' + lecture._id, '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');
          }
          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
          //data:image/png;base64,
        } else if (lecture.video){
          //await api.downloadVideo(lecture.video);
        }
      }
      let exerciseList = await api.getExercisesInSection(courseID, section._id);
      await AsyncStorage.setItem('E' + section._id, JSON.stringify(exerciseList));
    }
  } catch (e) {
    success = false;
    deleteLocallyStoredCourse(courseID);
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  } finally {
    return success;
  }
};

/**
 * Deletes a locally stored course
 * @param {String} courseID - A string with the ID of the course to be removed from lacal storage
 * @returns {boolean} - Returns true if no errors was thrown during the deletion and false if there was
 */
export const deleteLocallyStoredCourse = async (courseID) => {
  let success = true;
  try {
    await AsyncStorage.removeItem(courseID + await AsyncStorage.getItem(USER_ID));

    const sectionList = JSON.parse(await AsyncStorage.getItem('S' + courseID));
    await AsyncStorage.removeItem('S' + courseID);
    for (let section of sectionList) {
      let lectureList = JSON.parse(await AsyncStorage.getItem('L' + section._id));
      await AsyncStorage.removeItem('L' + section._id);
      await AsyncStorage.removeItem('E' + section._id);
            
      for (let lecture of lectureList) {
        await AsyncStorage.removeItem('I' + lecture._id);
        //delete video here
        //await unlink(RNBackgroundDownloader.directories.documents + '/' + lecture.video);
        //console.log('FILE DELETED');
      }
    }
  } catch (e) {
    success = false;
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  } finally {
    return success;
  }

};

/**
 * Update all locally stored courses
 */
export const updateStoredCourses = async () => {
  try {
    const subList = await getSubCourseList();
    for (const subListElement of subList) {
      let course;
      if ((course = JSON.parse(await AsyncStorage.getItem(subListElement.courseId + await AsyncStorage.getItem(USER_ID)))) !== null
                && course.dateUpdated !== subListElement.dateUpdated) {

        storeCourseLocally(subListElement.courseId);
      }
    }
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};


/** Other **/

export const checkCourseStoredLocally = async (courseID) => {
  try{
    if (await AsyncStorage.getItem(courseID + await AsyncStorage.getItem(USER_ID))){
      return true;
    } else {
      return false;
    }
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};




export const clearAsyncStorage = async () => {
  console.log(await AsyncStorage.getAllKeys());
  await AsyncStorage.clear();
  console.log(await AsyncStorage.getAllKeys());
};