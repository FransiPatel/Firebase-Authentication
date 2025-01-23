const admin = require('../config/firebase-admin');

// function to register new user
async function registerUser(req, res) {
  try {
    const { email, username, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // validate email
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    // ensure all fields are mandatory
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    // create new user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });
    // success message
    return res.status(201).json({ message: 'User created successfully.', user: userRecord });
  } catch (error) {
    // handling error creating new user
    return res.status(500).json({ error: error.message });
  }
}

// function to login an existing user with email/password
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    // validating email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    // ensure to have email and password
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    // get user by email
    const user = await admin.auth().getUserByEmail(email);

    // generate custom token for user
    const customToken = await admin.auth().createCustomToken(user.uid);
    // success message
    return res.status(200).json({ message: 'Login successful', customToken });
  } catch (error) {
    // handling error of not able to login
    return res.status(500).json({ error: error.message });
  }
}

// function to reset user password using email
async function resetPassword(req, res) {
  try {
    const { email } = req.body;
    // validating email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    // ensure email is provided
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    // generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email);
    // link sent successfully
    return res.status(200).json({ message: 'Password reset email sent.', resetLink });
  } catch (error) {
    // handling error
    return res.status(500).json({ error: error.message });
  }
}

// function to register/login user using google account
async function googleLogin(req, res) {
  const { idToken } = req.body;

  // Ensure ID Token is provided
  if (!idToken) {
    return res.status(400).json({ error: 'ID Token is required.' });
  }

  try {
    // Verify the ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Ensure required claims exist
    const email = decodedToken.email || 'no-email-provided';
    const displayName = decodedToken.name || 'Anonymous';

    let user;

    // Check if user already exists
    const existingUser = await admin.auth().getUser(decodedToken.uid).catch((error) => {
      if (error.code !== 'auth/user-not-found') {
        throw error; // Re-throw unexpected errors
      }
      return null;
    });

    if (existingUser) {
      user = existingUser;
    } else {
      // Create a new user if not found
      user = await admin.auth().createUser({
        uid: decodedToken.uid,
        email,
        displayName,
      });
    }

    // Generate a Firebase custom token
    const customToken = await admin.auth().createCustomToken(decodedToken.uid);

    // Send success response
    return res.status(200).json({ message: 'Google login successful', customToken, user });
  } catch (error) {
    // Log and return error response
    console.error('Error in Google Login:', error);
    return res.status(500).json({ error: error.message });
  }
}


// function to login/register user using facebook account
async function facebookLogin(req, res) {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required.' });
  }

  try {
        // Fetch user details from Facebook Graph API
      const response = await fetch(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,email,name`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    let user;

    // Check if the user already exists in Firebase
    try {
      user = await admin.auth().getUserByEmail(data.email);
    } catch {
      // Create a new user if they don't exist
      user = await admin.auth().createUser({
        uid: data.id,
        email: data.email,
        displayName: data.name,
      });
    }

     // Generate a custom token for the user
    const customToken = await admin.auth().createCustomToken(user.uid);
    return res.status(200).json({ message: 'Facebook login successful', customToken, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  googleLogin,
  facebookLogin,
};
