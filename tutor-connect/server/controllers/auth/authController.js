export const signUp = async (req, res) => {
  try {
    const { token, email, firstName, lastName, phone, role } = req.body;
    
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Check if user already exists
    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      firebaseUid,
      email,
      firstName,
      lastName,
      phone,
      role
    });

    await newUser.save();

    // If user is a tutor, create a tutor profile
    if (role === 'tutor') {
      const newTutor = new Tutor({
        userId: newUser._id,
        profileCompleted: false, // Initially false until they complete profile
        isVerified: false // Admin needs to verify credentials
      });
      await newTutor.save();
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};