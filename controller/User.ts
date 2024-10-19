
import { UserModel } from '../models/User';
import { APIContextType, User } from '../types';
import { tokenVerify } from '../helpers/tokenVerify';
import path from 'path';
import fs from 'fs';
import { expr } from '@mikro-orm/core';

export const getUsers = async ({ request, response, em }: APIContextType) => {
      try {
            const users = await em.find(UserModel, {});
            return response.status(200).send(users);
      } catch (error) {
            console.error('Error getting users:', error);

            const context = {
                  message: 'Error getting users',
                  error: error,
                  status: 500
            };
            return response.status(500).send(context);
      }
};

export const getUser = async ({ request, response, em }: APIContextType) => {
      try {
            const { id } = request.params;
            const user = await em.findOne(UserModel, { id: id });

            const image_url = `${request.protocol}://${request.get('host')}/uploads/${user?.image}`;

            user!.image = image_url;

            return response.status(200).send(user);
      } catch (error) {
            console.error('Error getting user:', error);
            const context = {
                  message: 'Error getting user',
                  error: error,
                  status: 500
            };
            return response.status(500).send(context);
      }
};

export const createUser = async ({ request, response, em }: APIContextType) => {
      try {
            const { firstName, lastName, email, dob } = request.body as User;

            const userExists = await em.fork().findOne(UserModel, {
                  $or: [
                        { email: email }
                  ],
            });

            if (userExists && userExists.isVerified) {
                  //        logger.info(`User Already Exists - ${userExists}`)
                  const context = {
                        success: false,
                        message: 'User Already Exists',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            const email_username = email.split('@')[0];

            const temp_password = firstName.at(0)! + lastName.at(0)! + Math.random().toString(36).substring(2, 10);

            let new_user = {} as UserModel;

            if (!userExists) {
                  new_user = await new UserModel({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        dob: dob,
                        image: '',
                        username: email_username,
                        password: temp_password
                  });
            } else {
                  new_user = userExists
            };

            const token = await new_user.getToken();
            // await new_user.setOTP();
            await new_user.saveUser(em);
            await new_user.sendMail('OTP');

            //  logger.info(`User Created - ${new_user.id}`);

            const context = {
                  success: true,
                  message: 'User Created Successfully',
                  extras: new_user,
                  token: token,
                  errorType: null,
                  password: `Your password is ${temp_password}`
            };

            return response.status(200).send(context);
      }
      catch (error) {
            console.error('Error creating user:', error);

            const context = {
                  message: 'Error creating user',
                  error: error,
                  status: 500
            };

            return response.status(500).send(context);
      };
};


export const verifyUser = async ({ request, response, em }: APIContextType) => {
      try {
            const { OTP } = request.body;

            const _token = request.headers.authorization?.split(" ")[1] || "";
            const user_id = await tokenVerify(_token);

            if (!user_id) {
                  //   logger.info(`User Not Found - ${user_id}`);
                  const context = {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            const user = await em.fork().findOne(UserModel, { id: user_id });

            if (!user) {
                  //    logger.info(`User Not Found - ${user_id}`);
                  const context = {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            if (user.otp !== OTP) {
                  // logger.info(`OTP Not Match - ${OTP}`)
                  const context = {
                        success: false,
                        message: 'OTP Not Match',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            if (user.isVerified) {
                  // logger.info(`User Already Verified - ${user.user_id}`)
                  const context = {
                        success: true,
                        message: 'User Already Verified',
                        extras: user,
                        token: _token,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            await user.verifyUser();
            user.otp = '';
            await user.saveUser(em);

            //  await user.sendMail("WELCOME");
            // logger.info(`User Verified - ${user.user_id}`);

            const context = {
                  success: true,
                  message: 'User Verified Successfully',
                  token: _token,
                  extras: user,
                  errorType: null,
            };

            return response.status(200).send(context);
      }
      catch (error) {
            // logger.error(`User Verification Failed - ${error}`)
            const context = {
                  success: false,
                  message: 'User Verification Failed',
                  extras: null,
                  errorType: error as string
            };

            return response.status(200).send(context);
      };
};

export const updateUsernameAndPassword = async ({ request, response, em }: APIContextType) => {
      try {
            const { username, password } = request.body;
            const _token = request.headers.authorization?.split(" ")[1] || "";

            const user_id = await tokenVerify(_token);
            const user = await em.fork().findOne(UserModel, { id: user_id });

            if (!user) {
                  return {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };
            };

            await user.setPassword(password);
            await user.setUsername(username);
            await user.saveUser(em);

            const context = {
                  success: true,
                  message: 'User Updated Successfully',
                  extras: user,
                  errorType: null
            };

            return response.status(200).send(context);
      } catch (error) {
            const context = {
                  success: false,
                  message: 'User Update Failed',
                  extras: null,
                  errorType: error as string
            };

            return response.status(200).send(context);
      };
};

export const loginUser = async ({ request, response, em }: APIContextType) => {
      try {
            const { username, password } = request.body;

            const user = await em.fork().findOne(UserModel, {
                  username: username
            });

            if (!user) {
                  const context = {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            const token = await user.getToken();

            const passwordMatch = await user.verifyPassword(password);

            if (!passwordMatch) {
                  const context = {
                        success: false,
                        message: 'Password Not Match',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            if (!(await user.isUserVerified())) {
                  // logger.info(`User Not Verified - ${user.username}`)
                  const context = {
                        success: false,
                        message: 'User Not Verified, Please Verify Your Email',
                        extras: user,
                        errorType: null,
                        token: token
                  };

                  return response.status(200).send(context);
            };

            if (await user.isUserLoggedin()) {
                  //  logger.info(`User Already Logged In - ${user.username}`)
                  const context = {
                        success: true,
                        message: 'User Already Logged In',
                        extras: user,
                        token: token,
                        errorType: null,
                  };

                  return response.status(200).send(context);
            };


            await user.loginUser();
            await user.saveUser(em);

            //logger.info(`User Logged In - ${user.username}`);

            const context = {
                  success: true,
                  message: 'User Logged In Successfully',
                  extras: user,
                  token: token,
                  errorType: null
            };

            return response.status(200).send(context);
      } catch (error) {
            const context = {
                  success: false,
                  message: 'User Login Failed',
                  extras: null,
                  errorType: error as string
            };

            return response.status(200).send(context);
      };
};

export const logoutUser = async ({ request, response, em }: APIContextType) => {
      try {
            const _token = request.headers.authorization?.split(" ")[1] || "";
            const user_id = await tokenVerify(_token);

            const user = await em.fork().findOne(UserModel, {
                  id: user_id
            });

            if (!user) {
                  const context = {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            await user.logoutUser();
            await user.saveUser(em);

            const context = {
                  success: true,
                  message: 'User Logged Out Successfully',
                  extras: user,
                  errorType: null
            };

            return response.status(200).send(context);
      } catch (error) {
            const context = {
                  success: false,
                  message: 'User Logout Failed',
                  extras: null,
                  errorType: error as string
            };

            return response.status(200).send(context);
      };
};

export const resendOTP = async ({ request, response, em }: APIContextType) => {
      try {
            const _token = request.headers.authorization?.split(" ")[1] || "";
            const user_id = await tokenVerify(_token);

            const user = await em.fork().findOne(UserModel, {
                  id: user_id
            });

            if (!user) {
                  const context = {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            if (await user.isUserVerified()) {
                  const context = {
                        success: false,
                        message: 'User Already Verified',
                        extras: user,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            if (await user.isUserLoggedin()) {
                  const context = {
                        success: false,
                        message: 'User Already Logged In',
                        extras: user,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            await user.resendOTP();
            await user.sendMail("OTP");
            await user.saveUser(em);

            const context = {
                  success: true,
                  message: 'OTP Sent Successfully',
                  extras: user,
                  errorType: null
            };

            return response.status(200).send(context);
      } catch (error) {
            const context = {
                  success: false,
                  message: 'OTP Resend Failed',
                  extras: null,
                  errorType: error as string
            };

            return response.status(200).send(context);
      };
};


export const forgotPassword = async ({ request, response, em }: APIContextType) => {
      try {
            const { email } = request.body;
            const user = await em.fork().findOne(UserModel, {
                  email: email
            });

            if (!user) {
                  const context = {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            await user.resendOTP();
            await user.sendMail("PASSWORDCHANGED");
            await user.saveUser(em);

            const context = {
                  success: true,
                  message: 'Password Reset Email Sent Successfully',
                  extras: user,
                  errorType: null
            };

            return response.status(200).send(context);
      } catch (error) {
            const context = {
                  success: false,
                  message: 'Password Reset Failed',
                  extras: null,
                  errorType: error as string
            };

            return response.status(200).send(context);
      };
};

export const resetPassword = async ({ request, response, em }: APIContextType) => {
      try {
            const { password } = request.body;
            const _token = request.headers.authorization?.split(" ")[1] || "";
            const user_id = await tokenVerify(_token);

            const user = await em.fork().findOne(UserModel, {
                  id: user_id
            });

            if (!user) {
                  const context = {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            if (!(await user.isUserVerified())) {
                  const context = {
                        success: false,
                        message: 'User Not Verified',
                        extras: user,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            await user.setPassword(password);
            await user.saveUser(em);

            const context = {
                  success: true,
                  message: 'Password Reset Successfully',
                  extras: user,
                  errorType: null
            };

            return response.status(200).send(context);
      } catch (error) {
            const context = {
                  success: false,
                  message: 'Password Reset Failed',
                  extras: null,
                  errorType: error as string
            };

            return response.status(200).send(context);
      };
};


export const updateProfileImage = async ({ request, response, em }: APIContextType) => {
      try {
            const _token = request.headers.authorization?.split(" ")[1] || "";
            const user_id = await tokenVerify(_token);

            const file_extension = request.body.file_extension;

            const image_base64 = request.body.image;

            // Decode base64 string
            const imageBuffer = await Buffer.from(image_base64, 'base64');

            const uploadsDir = path.join(__dirname, '..', 'uploads');

            if (!fs.existsSync(uploadsDir)) {
                  fs.mkdirSync(uploadsDir);
            };

            // Generate a unique filename
            const filename = `${user_id}_${Date.now()}.` + `${file_extension}`;
            const filepath = path.join(__dirname, '..', 'uploads', filename);

            // Write the image to the filesystem
            await fs.writeFileSync(filepath, imageBuffer);

            const user = await em.fork().findOne(UserModel, {
                  id: user_id
            });

            if (!user) {
                  const context = {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };

            const imageUrl = `${request.protocol}://${request.get('host')}/uploads/${filename}`;

            user.image = filename;
            await user.saveUser(em);

            const context = {
                  success: true,
                  message: 'Profile Image Updated Successfully',
                  extras: imageUrl,
                  errorType: null
            };

            return response.status(200).send(context);

      } catch (error) {
            const context = {
                  success: false,
                  message: 'User Not Found',
                  extras: null,
                  errorType: error as string
            };

            return response.status(200).send(context);
      };
}; 

export const getUserFromToken = async ({ request, response, em }: APIContextType) => {
      try {
            const _token = request.headers.authorization?.split(" ")[1] || "";
            const user_id = await tokenVerify(_token);

            const user = await em.fork().findOne(UserModel, {
                  id: user_id
            });

            const imageUrl = `${request.protocol}://${request.get('host')}/uploads/${user?.image}`;
            user!.image = imageUrl;

            if (!user) {
                  const context = {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };

                  return response.status(200).send(context);
            };    

            const context = {
                  success: true,
                  message: 'User Found',
                  extras: user,
                  errorType: null
            };

            return response.status(200).send(context);
      } catch (error) {
            const context = {
                  success: false,
                  message: 'User Not Found',
                  extras: null,
                  errorType: error as string
            };

            return response.status(200).send(context);
      };
};
