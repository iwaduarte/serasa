// Define the User model attributes
export interface UserAttributes {
  username: string;
  email: string;
  password?: string;
}

// Define the User creation attributes (optional password field for creation)
export interface UserCreationAttributes extends UserAttributes {}
