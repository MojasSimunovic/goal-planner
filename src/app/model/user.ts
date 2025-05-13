export interface UserLogin {
  "emailId": string,
  "password": string

}

export interface UserRegister {
  "userId": number,
  "emailId": string,
  "password": string,
  "fullName": string,
  "mobileNo": string  
}

export interface LoggedUserData {
  createdDate: string, 
  emailId: string,
  extraId: string,
  fullName: string,
  mobileNo: string,
  password: string, 
  projectName: string, 
  userId: number
}