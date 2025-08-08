import express from 'express';
import Tutor from '../models/Tutor.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all tutors
// @route   GET /api/tutors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, minRate, maxRate, teachingMethod, availability } = req.query;
    
    let query = { profileCompleted: true, isVerified: true };
    
    if (subject) {
      query['subjects.name'] = { $regex: subject, $options: 'i' };
    }
    
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }
    
    if (teachingMethod && teachingMethod !== 'all') {
      if (teachingMethod === 'online') {
        query['teachingMethods.online'] = true;
      } else if (teachingMethod === 'inPerson') {
        query['teachingMethods.inPerson'] = true;
      } else if (teachingMethod === 'both') {
        query['teachingMethods.online'] = true;
        query['teachingMethods.inPerson'] = true;
      }
    }
    
    if (availability) {
      const days = availability.split(',');
      query['availability.day'] = { $in: days };
    }
    
    const tutors = await Tutor.find(query)
      .populate('userId', 'firstName lastName profilePicture')
      .populate('reviews.userId', 'firstName lastName');
      
    res.json(tutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;