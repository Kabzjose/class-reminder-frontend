import { classAPI } from '../api/api';

// Get all classes from API
export const getClasses = async () => {
  try {
    const response = await classAPI.getAll();
    const classes = response.classes || [];
    // Map _id to id for frontend compatibility
    return classes.map(c => ({
      ...c,
      id: c._id || c.id
    }));
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
};

// Save a new class
export const saveClass = async (classData) => {
  try {
    await classAPI.create(classData);
    return true;
  } catch (error) {
    console.error('Error saving class:', error);
    throw error;
  }
};

// Update a class
export const updateClass = async (classData) => {
  try {
    await classAPI.update(classData.id, classData);
    return true;
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

// Delete a class
export const deleteClass = async (id) => {
  try {
    await classAPI.delete(id);
    return true;
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
};