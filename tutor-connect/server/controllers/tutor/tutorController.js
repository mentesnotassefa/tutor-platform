export const completeProfile = async (req, res) => {
  try {
    const tutorId = req.user.tutorId;
    const profileData = req.body;

    const updatedTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      {
        ...profileData,
        profileCompleted: true,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId');

    if (!updatedTutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Notify admin for verification
    await sendVerificationNotification(updatedTutor);

    res.json(updatedTutor);
  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendVerificationNotification = async (tutor) => {
  // Implement your notification logic here
  // This could be an email to admin or a database notification
};