// src/services/reportService.js
import { db } from '../firebase'; // Adjust the path based on your actual file structure
import { collection, addDoc } from "firebase/firestore";

export const addReport = async (reportData) => {
  try {
    const docRef = await addDoc(collection(db, "reports"), reportData);
    console.log("Document written with ID: ", docRef.id);
    // Return document reference or ID as needed
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error; // Propagate error to be handled where the function is called
  }
};
