import axios from 'axios';
import { useCookies } from 'react-cookie';
const { createContext, useState } = require('react');

const UserContext = createContext({
  role: 'guest',
  id: null,
  login: (user) => {},
  logout: async () => {},
});

export default UserContext;

export const UserContextProvider = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const [user, setUser] = useState({ role: 'guest', userId: null });

  const login = (user) => {
    setUser({ role: user.role, userId: user.userId });
  };

  const logout = async () => {
    await axios.get('http://localhost:4000/auth/logout');
    removeCookie('jwt', { path: '/' });
    setUser({ role: 'guest', id: null });
  };

  return (
    <UserContext.Provider
      value={{
        role: user.role,
        userId: user.userId,
        login: login,
        logout: logout,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
