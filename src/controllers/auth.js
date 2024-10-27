import { registerUser, loginUser } from '../services/auth.js';

export async function registerController(req, res) {
  const registeredUser = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: registeredUser,
  });
}

export async function loginController(req, res) {
  const { email, password } = req.body;
  await loginUser(email, password);
  res.end();
}
