export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AddUserInput = {
  name: string;
  email: string;
  role: string;
};
