import UserModel, { UserInput } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export class AuthService {
  static async register(userData: UserInput): Promise<{ user: any; token: string }> {
    // Normalize email to lowercase
    const normalizedEmail = userData.email.toLowerCase().trim();
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const password_hash = await hashPassword(userData.password);

    // Check if this is the first user - make them admin
    const userCount = await UserModel.countDocuments();
    const defaultRole = userCount === 0 ? 'admin' : (userData.role || 'user');

    // Create user
    const user = await UserModel.create({
      email: normalizedEmail,
      password_hash,
      role: defaultRole,
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Remove password_hash from response
    const userObj = user.toObject();
    delete userObj.password_hash;

    return {
      user: userObj,
      token,
    };
  }

  static async login(email: string, password: string): Promise<{ user: any; token: string }> {
    // Find user
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Remove password_hash from response
    const userObj = user.toObject();
    delete userObj.password_hash;

    return {
      user: userObj,
      token,
    };
  }
}

