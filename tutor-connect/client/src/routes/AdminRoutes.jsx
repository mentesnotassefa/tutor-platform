import express from 'express';
import Tutor from '../models/Tutor.js';
import { adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get pending tutor verifications
router.get('/pending-tutors', adminProtect, async (req, res) => {
  try {
    const tutors = await Tutor.find({
      profileCompleted: true,
      isVerified: false
    }).populate('userId');
    
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject tutor
router.post('/verify-tutor', adminProtect, async (req, res) => {
  try {
    const { tutorId, action } = req.body;
    
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    
    if (action === 'approve') {
      tutor.isVerified = true;
      await tutor.save();
      
      // Send approval notification to tutor
      await sendApprovalNotification(tutor);
      
      return res.json({ message: 'Tutor approved' });
    } else if (action === 'reject') {
      // Send rejection notification to tutor
      await sendRejectionNotification(tutor);
      
      // Optionally delete or flag the profile
      return res.json({ message: 'Tutor rejected' });
    }
    
    res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;