
// Third-party imports
import { generate } from 'otp-generator'

// import logger from '../logger/Logging'

const otpGenerate = () => {
      // logger.info(`🚀 OTP generated`)
      return generate(6, { 
            digits: true,
            lowerCaseAlphabets: false,
            specialChars: false,
            upperCaseAlphabets: false
       })
}

export default otpGenerate